'use strict';

bonsaiApp.controller('bonsaiCpuCtrl',
    function ($scope, $location) {
        $scope.base = 10;

        var exampleGenerator = new ExampleGenerator();
        if ($location.search()['example'] == 'singleregister') {
            $scope.cpu = exampleGenerator.generateSingleRegister();
        } else if ($location.search()['example'] == 'registertransfer') {
            $scope.cpu = exampleGenerator.generateRegisterTransfer();
        } else if ($location.search()['example'] == 'manual') {
            $scope.cpu = exampleGenerator.generateManualBonsai();
        } else if ($location.search()['example'] == 'gates') {
            $scope.cpu = exampleGenerator.generateGates();
        } else if ($location.search()['example'] == 'filter') {
            $scope.cpu = exampleGenerator.generateFilter();
<<<<<<< HEAD
=======
        } else if ($location.search()['example'] == 'memory') {
            $scope.cpu = exampleGenerator.generateMemory();
        } else {
            $scope.cpu = exampleGenerator.generateBonsai();
        }

        $scope.getMousePosition = function($event) {
            var getOffset = function( el ) {
                var _x = 0;
                var _y = 0;
                while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
                    _x += el.offsetLeft - el.scrollLeft;
                    _y += el.offsetTop - el.scrollTop;
                    el = el.offsetParent;
                }
                return { top: _y, left: _x };
            };
            if ($scope.editMode) {
                var offset = getOffset(document.getElementById('CpuCanvas'));
                $scope.MouseX = $event.clientX - offset.left - 1;
                $scope.MouseY = $event.clientY - offset.top - 3;
            }
        };

        var matcher = new BusMatcher($scope.cpu);
        matcher.createBuses();
        matcher.matchAllComponents();

        $scope.selectedEditor = undefined;
        $scope.selectEditor = function (index) {
            $scope.selectedEditor = index;
        };

        $scope.splitLines = function (string) {
            return string.replace(/\r\n|\n\r|\n|\r/g,"\n").split("\n")
        };
        $scope.readFile = function (memoryNumber) {
            var input = document.getElementById('filename-' + $scope.cpu.memories[memoryNumber].name);
            var file = input.files[0];
            var reader = new FileReader();
            reader.addEventListener("loadend", function() {
                $scope.$apply(function () {
                    $scope.cpu.memories[memoryNumber].content = reader.result;
                    $scope.cpu.memories[memoryNumber].fileName = file.name;
                });
            });
            reader.readAsText(file);
        };
        $scope.saveFile = function (memoryNumber) {
            var fs = new FileSaver(
                $scope.cpu.memories[memoryNumber].content,
                $scope.cpu.memories[memoryNumber].name + ".bonsai",
                $scope.cpu.memories[memoryNumber].fileName
            );
            fs.save();
        };

        $scope.toggleEditMode = function () {
            $scope.editMode = !$scope.editMode;
        };

        $scope.clearCpu = function () {
            $scope.cpu = {};
        };

        $scope.loadCpu = function () {
            $scope.clearCpu();
            var input = document.getElementById('cpu-filename');
            var file = input.files[0];
            var reader = new FileReader();
            reader.addEventListener("loadend", function() {
                $scope.$apply(function () {
                    $scope.cpu = angular.fromJson(reader.result);
                    try {
                        var matcher = new BusMatcher($scope.cpu);
                        matcher.createBuses();
                        matcher.matchAllComponents();
                        $scope.cpu = matcher.getCpu();
                    } catch (exception) {
                        $scope.clearCpu();
                        throw exception;
                    }
                    $scope.selectedEditor = undefined;
                    $scope.cpuFileName = file.name;
                });
            });
            reader.readAsText(file);
        };
        $scope.saveCpu = function () {
            var fs = new FileSaver($scope.cpu, "bonsai.cpu", $scope.cpuFileName);
            fs.cpuToJson();
            fs.save();
        };

        $scope.errors = [];
        $scope.$on('error', function (event, message) {
            $scope.errors.push(message)
        });
    }
);'use strict';

bonsaiApp.controller('bonsaiCpuCtrl',
    function ($scope, $location) {
        $scope.base = 10;

        var exampleGenerator = new ExampleGenerator();
        if ($location.search()['example'] == 'singleregister') {
            $scope.cpu = exampleGenerator.generateSingleRegister();
        } else if ($location.search()['example'] == 'registertransfer') {
            $scope.cpu = exampleGenerator.generateRegisterTransfer();
        } else if ($location.search()['example'] == 'manual') {
            $scope.cpu = exampleGenerator.generateManualBonsai();
        } else if ($location.search()['example'] == 'gates') {
            $scope.cpu = exampleGenerator.generateGates();
>>>>>>> develop
        } else if ($location.search()['example'] == 'memory') {
            $scope.cpu = exampleGenerator.generateMemory();
        } else {
            $scope.cpu = exampleGenerator.generateBonsai();
        }

        $scope.getMousePosition = function($event) {
            var getOffset = function( el ) {
                var _x = 0;
                var _y = 0;
                while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
                    _x += el.offsetLeft - el.scrollLeft;
                    _y += el.offsetTop - el.scrollTop;
                    el = el.offsetParent;
                }
                return { top: _y, left: _x };
            };
            if ($scope.editMode) {
                var offset = getOffset(document.getElementById('CpuCanvas'));
                $scope.MouseX = $event.clientX - offset.left - 1;
                $scope.MouseY = $event.clientY - offset.top - 3;
            }
        };

        var matcher = new BusMatcher($scope.cpu);
        matcher.createBuses();
        matcher.matchAllComponents();

        $scope.selectedEditor = undefined;
        $scope.selectEditor = function (index) {
            $scope.selectedEditor = index;
        };

        $scope.splitLines = function (string) {
            return string.replace(/\r\n|\n\r|\n|\r/g,"\n").split("\n")
        };
        $scope.readFile = function (memoryNumber) {
            var input = document.getElementById('filename-' + $scope.cpu.memories[memoryNumber].name);
            var file = input.files[0];
            var reader = new FileReader();
            reader.addEventListener("loadend", function() {
                $scope.$apply(function () {
                    $scope.cpu.memories[memoryNumber].content = reader.result;
                    $scope.cpu.memories[memoryNumber].fileName = file.name;
                });
            });
            reader.readAsText(file);
        };
        $scope.saveFile = function (memoryNumber) {
            var fs = new FileSaver(
                $scope.cpu.memories[memoryNumber].content,
                $scope.cpu.memories[memoryNumber].name + ".bonsai",
                $scope.cpu.memories[memoryNumber].fileName
            );
            fs.save();
        };

        $scope.toggleEditMode = function () {
            $scope.editMode = !$scope.editMode;
        };

        $scope.clearCpu = function () {
            $scope.cpu = {};
        };

        $scope.loadCpu = function () {
            $scope.clearCpu();
            var input = document.getElementById('cpu-filename');
            var file = input.files[0];
            var reader = new FileReader();
            reader.addEventListener("loadend", function() {
                $scope.$apply(function () {
                    $scope.cpu = angular.fromJson(reader.result);
                    try {
                        var matcher = new BusMatcher($scope.cpu);
                        matcher.createBuses();
                        matcher.matchAllComponents();
                        $scope.cpu = matcher.getCpu();
                    } catch (exception) {
                        $scope.clearCpu();
                        throw exception;
                    }
                    $scope.selectedEditor = undefined;
                    $scope.cpuFileName = file.name;
                });
            });
            reader.readAsText(file);
        };
        $scope.saveCpu = function () {
            var fs = new FileSaver($scope.cpu, "bonsai.cpu", $scope.cpuFileName);
            fs.cpuToJson();
            fs.save();
        };

        $scope.errors = [];
        $scope.$on('error', function (event, message) {
            $scope.errors.push(message)
        });
    }
);