'use strict';

bonsaiApp.directive('bus', function () {
    return {
        restrict: 'E',
        scope: {
            bus: '=',
            busName: '@',
            base: '=',
            color: '=',
            top: '=',
            left: '='
        },
        link: function ($scope, element, attrs) {
            $scope.localBus = $scope.bus || {};

            attrs.$observe('busName', function() {
                if ($scope.busName) {
                    $scope.localBus.setName($scope.busName);
                }
            });

            if (parseInt($scope.base) in {2:true, 8:true, 10:true, 16:true}) {
                $scope.displayBase = $scope.base;
            } else {
                $scope.displayBase = 10;
            }
            $scope.topCSS = $scope.top + 'em';
            $scope.leftCSS = $scope.left + 'em';

            $scope.busRouter = new BusRouter($scope.localBus.getConnections(), $scope.localBus);

            $scope.value = undefined;

            $scope.localBus.setUpdateViewCallback(function (newValue) {
                $scope.value = newValue;
            });

            $scope.$watch('value', function(newValue, oldValue) {
                $scope.localBus.value = newValue;
            });

            $scope.updateVisibleParts = function() {
                $scope.busRouter.setConnections($scope.localBus.getConnections());
                $scope.visibleParts = $scope.busRouter.updateVisibleParts();
            };

            $scope.localBus.enrollToDirective = function (enrollee, getPositions) {
                var connection = $scope.localBus.enroll(enrollee);
                connection.getPositions = getPositions;
                $scope.updateVisibleParts();
            };

            $scope.localBus.registerMovement = function () {
                $scope.updateVisibleParts();
            };
        },
        templateUrl: 'partials/component_Bus.html'
    }
});