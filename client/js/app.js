var app = angular.module('lognlink', ['ui.router', 'ngRoute']);

app.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', '$httpProvider', function ($locationProvider, $stateProvider, $urlRouterProvider, $httpProvider) {
    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise('/');
    $stateProvider.state('ddTestLive',{
            url: '/dd/liveLogs',
            templateUrl: '/views/partials/liveLogs.html'
        }
    );
}]);
