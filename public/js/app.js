angular.module('busApp', ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'home.ejs',
                controller:'busCtrl'

            })
            .state('bus', {
                url: '/stopNr/:busNr/',
                templateUrl: 'bus.ejs',
                controller: 'timeCtrl'
            })
            .state('stops', {
                url: '/stops',
                templateUrl: 'stops.ejs',
                controller: 'stopsCtrl'
            })
            .state('routes', {
                url: '/routes/:route/:routeDir',
                templateUrl: 'routes.ejs',
                controller: 'routesCtrl'
            });
        $urlRouterProvider.otherwise('home');
    })
    .controller('routesCtrl', function($scope, $http, $stateParams) {
        $scope.busRoute = $stateParams.route;
        $scope.direction = $stateParams.routeDir;

        var url = 'http://localhost:8081/route/' + $scope.busRoute + '/' + $scope.direction;

        $http.get(url)
            .success(function(data) {
                console.log(data);
                $scope.stops = data;
            })
    })
    .controller('busCtrl', function($scope,$window, $http) {
        console.log('homeCtrl');
        $scope.submit = function () {
            $window.location.href = '#/stopNr/'+$scope.text+'/';

        };
    })
    .controller('timeCtrl', function($scope, $http, $stateParams) {
        $scope.loading = true;
        $scope.busNrs = $stateParams.busNr;
        var url = 'http://localhost:8081/bus/' + $scope.busNrs;
        console.log($stateParams.busNr);

        $http.get(url)
            .success(function(data) {
                console.log(data);
                $scope.bus = data;
                $scope.loading = false;

            })
    })
    .controller('stopsCtrl', function($scope, $http){
        $scope.loading = true;
        var url = 'http://localhost:8081/stops';
        $http.get(url)
            .success(function(data) {
                console.log(data);
                $scope.stops = data;
                $scope.loading = false;

            })
    });