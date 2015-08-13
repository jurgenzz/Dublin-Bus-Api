angular.module('luasApp', ['ui.router', 'ngAnimate'])
    .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'home.ejs',
                controller:'luasCtrl'

            })
            .state('red', {
                url: '/red',
                templateUrl: 'red.ejs',
                controller:'redCtrl'
            })
            .state('green', {
                url: '/green',
                templateUrl: 'green.ejs',
                controller: 'greenCtrl'
            })
            .state('rtpi', {
                url: '/rtpi/:stopName/:direction',
                templateUrl: 'rtpi.ejs',
                controller: 'rtpiCtrl'
            });
        $urlRouterProvider.otherwise('home');
    })
    .controller('luasCtrl', function($scope, $http) {
        angular.element(document.querySelector('#top_btns').style.display = 'none');
    })
    .controller('redCtrl', function($scope, $http) {
        angular.element(document.querySelector('#top_btns').style.display = 'block');

        $http.get('/files/red.json')
            .success(function(data) {
                $scope.red = data;
            })
    })
    .controller('greenCtrl', function($scope, $http) {
        angular.element(document.querySelector('#top_btns').style.display = 'block');


        $http.get('/files/green.json')
            .success(function(data) {
                $scope.green = data;
            })
            .error(function(error, headers) {
                console.log('error: ' + error);
            })
    })
    .controller('rtpiCtrl', function($scope, $http, $stateParams) {
        var IO = $stateParams.direction;
        var stopName = $stateParams.stopName;
        $http.get('http://localhost:8081/luas/' + stopName + '/' + IO)
            .success(function(data) {
                $scope.times = data;
            })
    });