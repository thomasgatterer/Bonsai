'use strict';

function BitRegister(updateViewCallback, name, initialValue, wideBusStateChangeCallback) {
    this.updateViewCallback = updateViewCallback;
    this.name = name;
    this.value = initialValue;
    this.wires = [];
    this.wideBusConnection = undefined;
    this.bitWiresConnection = {
        wires: [],
        state: 0
    };
    this.wideBusStateChangeCallback = wideBusStateChangeCallback;
}

BitRegister.prototype.setName = function (name) {
    this.name = name;
};

BitRegister.prototype.getName = function () {
    return this.name;
};

BitRegister.prototype.setWideBusConnection = function (bus, writeWire, readWire) {
    /* state 1 means the BitRegister writes to the wideBus
     * state 0 means the connection to the wideBus is inactive
     * state -1 means the register reads from the wideBus */
    this.wideBusConnection = {
        bus: bus,
        writeWire: writeWire,
        readWire: readWire,
        state: 0
    };
};

BitRegister.prototype.getWideBusConnection = function () {
    return this.wideBusConnection;
};

BitRegister.prototype.addWireConnection = function (wire, connector) {
    this.bitWiresConnection.wires.push({
        wire: wire,
        connector: connector
    });
};

BitRegister.prototype.removeWireConnection = function (wire) {
    var i = 0;
    while (i < this.bitWiresConnection.wires.length) {
        if (this.bitWiresConnection.wires[i].wire === wire) {
            this.bitWiresConnection.wires.splice(i, 1);
        } else {
            i++;
        }
    }
};

BitRegister.prototype.setBitConnectionControlWires = function (readWire, writeWire) {
    this.bitWiresConnection.readWire = readWire;
    this.bitWiresConnection.writeWire = writeWire;
};

BitRegister.prototype.getWires = function () {
    return this.bitWiresConnection.wires;
};

BitRegister.prototype.setValue = function (value) {
    if (isNaN(parseInt(value))) {
        value = 0;
    }
    this.value = value;
    if (this.state === 1) {
        this.wideBusConnection.bus.write(this, value);
    }
    this.updateViewCallback(this.value);
};

BitRegister.prototype.getValue = function () {
    return this.value;
};

BitRegister.prototype.setBit = function (index, bit) {
    if (!((bit === 0) || (bit === 1))) {
        throw WrongValueForSingleBit(
            this.getName() + ": " + bit + " is not a valid value for a single bit. Only 0 or 1 are allowed.",
            this.getName(),
            bit
        );
    }
    if (bit !== this.getBit(index)) {
        if (bit) {
            this.setValue(this.value + Math.pow(2, index));
        } else {
            this.setValue(this.value - Math.pow(2, index));
        }
    }
    if (this.bitWiresConnection.state == 1) {
        this.bitWiresConnection.wires[index].write(this, bit);
    }
};

BitRegister.prototype.getBit = function (index) {
    var number = this.value;
    var digit;
    var binary_list = [];
    while (number > 0) {
        digit = number % 2;
        number = Math.floor(number / 2);
        binary_list.push(digit); // The binary number is reversed in this array.
    }
    if (index < binary_list.length) {
        return binary_list[index];
    } else {
        return 0;
    }
};

BitRegister.prototype.setWideBusState = function (desiredState) {
    var readState = this.wideBusConnection.bus.isReader(this);
    var writeState = this.wideBusConnection.bus.isWriter(this);
    if (desiredState == 1) {
        this.wideBusConnection.bus.unregisterReader(this);
        try {
            this.wideBusConnection.bus.write(this, this.getValue());
            this.wideBusConnection.state = desiredState;
        } catch (exception) {
            if (readState) {
                this.wideBusConnection.bus.registerReaderAndRead(this);
            }
            throw exception;
        }
    } else if (desiredState == -1) {
        if (this.bitWiresConnection.state == -1) {
            throw RegisterIsAlreadyReadingException(
                "BitRegister " + this.name + " is already reading.",
                this.name
            )
        } else {
            this.wideBusConnection.bus.stopWriting(this);
            try {
                this.setValue(this.wideBusConnection.bus.registerReaderAndRead(this));
                this.wideBusConnection.state = desiredState;
            } catch (exception) {
                if (writeState) {
                    this.wideBusConnection.bus.write(this, this.value);
                }
                throw exception;
            }
        }
    } else {
        this.wideBusConnection.bus.stopWriting(this);
        this.wideBusConnection.bus.unregisterReader(this);
        this.wideBusConnection.state = desiredState;
    }
    if (this.wideBusStateChangeCallback) {
        this.wideBusStateChangeCallback(this.wideBusConnection.state);
    }
};

BitRegister.prototype.setBitConnectionState = function (desiredState) {
    var i;
    var readStates = [];
    var writeStates = [];
    if (desiredState == 1) {
        for (i = 0; i < this.bitWiresConnection.wires.length; i++) {
            readStates.push(this.bitWiresConnection.wires[i].isReader(this));
            this.bitWiresConnection.wires[i].unregisterReader(this);
        }
        try {
            for (i = 0; i < this.bitWiresConnection.wires.length; i++) {
                this.bitWiresConnection.wires[i].write(this, this.getBit(i));
            }
            this.bitWiresConnection.state = desiredState;
        } catch (exception) {
            for (i = 0; i < this.bitWiresConnection.wires.length; i++) {
                if (readStates[i]) {
                    this.bitWiresConnection.wires[i].registerReaderAndRead(this);
                }
            }
            throw exception;
        }
    } else if (desiredState == -1) {
        if (this.wideBusConnection.state == -1) {
            throw RegisterIsAlreadyReadingException(
                "BitRegister " + this.name + " is already reading.",
                this.name
            )
        } else {
            for (i = 0; i < this.bitWiresConnection.wires.length; i++) {
                writeStates.push(this.bitWiresConnection.wires[i].isWriter(this));
                this.bitWiresConnection.wires[i].stopWriting(this);
            }
            try {
                for (i = 0; i < this.bitWiresConnection.wires.length; i++) {
                    this.setBit(this.bitWiresConnection.wires[i].registerReaderAndRead(this));
                }
                this.bitWiresConnection.state = desiredState;
            } catch (exception) {
                for (i = 0; i < this.bitWiresConnection.wires.length; i++) {
                    if (writeStates[i]) {
                        this.bitWiresConnection.wires[i].write(this, this.getBit(i));
                    }
                }
                throw exception;
            }
        }
    } else {
        for (i = 0; i < this.bitWiresConnection.wires.length; i++) {
            this.bitWiresConnection.wires[i].stopWriting(this);
            this.bitWiresConnection.wires[i].unregisterReader(this);
        }
        this.bitWiresConnection.state = desiredState;
    }
};

BitRegister.prototype.setToRead = function (wire) {
    if (wire) {
        if (this.wideBusConnection.readWire === wire) {
            this.setWideBusState(-1);
        } else if (this.bitWiresConnection.readWire === wire) {
            this.setBitConnectionState(-1);
        }
    }
};

BitRegister.prototype.setToWrite = function (wire) {
    if (wire) {
        if (this.wideBusConnection.writeWire === wire) {
            this.setWideBusState(1);
        } else if (this.bitWiresConnection.readWire === wire) {
            this.setBitConnectionState(1);
        }
    }
};

BitRegister.prototype.setToDisconnected = function (wire) {
    if (this.wideBusConnection.writeWire === wire) {
        if ((this.wideBusConnection.readWire) &&
            (this.wideBusConnection.readWire.isActive()) &&
            (this.wideBusConnection.readWire.isNotZero())) {
            this.setWideBusState(-1)
        } else {
            this.setWideBusState(0);
        }
    }
    if (this.wideBusConnection.readWire === wire) {
        if ((this.wideBusConnection.writeWire) &&
            (this.wideBusConnection.writeWire.isActive()) &&
            (this.wideBusConnection.writeWire.isNotZero())) {
            this.setWideBusState(1);
        } else {
            this.setWideBusState(0);
        }
    }
    if (this.bitWiresConnection.writeWire === wire) {
        if ((this.bitWiresConnection.readWire) &&
            (this.bitWiresConnection.readWire.isActive()) &&
            (this.bitWiresConnection.readWire.isNotZero())) {
            this.setBitConnectionState(-1)
        } else {
            this.setBitConnectionState(0);
        }
    }
    if (this.bitWiresConnection.readWire === wire) {
        if ((this.bitWiresConnection.writeWire) &&
            (this.bitWiresConnection.writeWire.isActive()) &&
            (this.bitWiresConnection.writeWire.isNotZero())) {
            this.setBitConnectionState(1);
        } else {
            this.setBitConnectionState(0);
        }
    }
};

BitRegister.prototype.isReader = function () {
    return ((this.wideBusConnection.state === -1) || (this.bitWiresConnection.state === -1));
};