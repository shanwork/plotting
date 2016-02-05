(function () {
    var readings_app = angular.module('readings_app', ['ngRoute', 'ngSanitize', 'ngStorage']);
    readings_app.config(function ($routeProvider) {
        $routeProvider.when('/nasdaq',
            {
                controller: 'NasdaqController',
                templateUrl: 'views/Nasdaq.html'
            }) .otherwise({ redirectTo: '/nasdaq' })
    });
}());