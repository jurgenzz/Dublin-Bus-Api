angular.module('busApp', ['ui.router', 'ngAnimate'])
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
    .controller('routesCtrl', function($scope, $http, $stateParams, $window) {
        $scope.busRoute = $stateParams.route;
        $scope.direction = $stateParams.routeDir;

        var url = 'http://localhost:8081/route/' + $scope.busRoute + '/' + $scope.direction;

        $http.get(url)
            .success(function(data) {
                //console.log(data);
                $scope.stops = data;
            });
        $scope.submit = function () {
            $window.location.href = '#/stopNr/'+$scope.text+'/';

        };
    })
    .controller('busCtrl', function($scope,$window, $http) {
        $scope.showHistory = false;

        $scope.changeHistory = function() {
            if($scope.showHistory === false) {
                $scope.showHistory = true;
            }
            else {
                $scope.showHistory = false;
            }
            //console.log('test');
        };



        $scope.buses = {
            bus: []

        };
        $scope.buses = JSON.parse(window.localStorage['name'] || '{}');
        $scope.submit = function () {
            $window.location.href = '#/stopNr/'+$scope.text+'/';
            $scope.buses.bus.push([$scope.text]);
            window.localStorage['name'] = JSON.stringify($scope.buses);


        };

        console.log($scope.buses);
        $scope.clearHistory = function () {
            $scope.buses = {
                bus: []
            };
            $scope.showHistory = false;
            window.localStorage['name'] = JSON.stringify($scope.buses);
        }

    })
    .controller('timeCtrl', function($scope, $http, $stateParams, $window, $timeout) {
        $scope.loading = true;
        $scope.busNrs = $stateParams.busNr;
        var url = 'http://localhost:8081/bus/' + $scope.busNrs;
        //first load
        $http.get(url)
            .success(function (data) {
                //console.log(data);
                $scope.busesRTPI = data;
                $scope.loading = false;
            });


        //reloads ..
        $scope.scheduleReload = function() {
            $timeout(function() {
                $http.get(url)
                    .success(function (data) {
                        console.log(data);
                        $scope.busesRTPI = data;
                        $scope.loading = false;
                        console.log('reload');

                    });
                $scope.scheduleReload();
            }, 12000);
        };
        $scope.scheduleReload();
        $scope.changeBus = false;
        $scope.changeBusBtn = function() {
            if($scope.changeBus === false) {
                $scope.changeBus = true;
            }
            else {
                $scope.changeBus = false;
            }
            //console.log('test');
        };
        $scope.text = $scope.busNrs;
        if ($scope.text === 'undefined') {
            $scope.text = 'Enter valid stop nr.'
        }
        //$scope.stopNr = $scope.
        $scope.submit = function () {
            $window.location.href = '#/stopNr/'+$scope.text+'/';
            $scope.changeBus = false;

        };
    })
    .controller('stopsCtrl', function($scope, $http){
        $scope.loading = true;
        var url = '/files/buses.json';
        $http.get(url)
            .success(function(data) {
                //console.log(data);
                $scope.stops = data;
                $scope.loading = false;

            })
    });