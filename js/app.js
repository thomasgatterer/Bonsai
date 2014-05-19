'use strict';

var bonsaiApp = angular.module(
        'Bonsai',
        [
            'ngAnimate',
            'ngRoute'
        ]
    )
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.
            when('/', {templateUrl: '/partials/main.html', controller: 'bonsaiCpuCtrl'}).
            otherwise({templateUrl: '/partials/main.html', controller: 'bonsaiCpuCtrl'});
    }])
    .factory('$exceptionHandler', function ($injector) {
        return function (exception, cause) {
            console.log(''+exception);
            $injector.get('$rootScope').$broadcast('error', '' + exception);
        };
    });