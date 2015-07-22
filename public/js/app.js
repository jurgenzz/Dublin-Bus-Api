angular.module('busApp', ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'home.ejs'

            })
            .state('bus', {
                url: '/stopNr/:busNr/',
                templateUrl: 'bus.ejs',
                controller: 'timeCtrl'
            });
        $urlRouterProvider.otherwise('home');
    })
    .controller('busCtrl', function($scope, $http, $stateParams) {
      //bus ctrl
    })
    .controller('timeCtrl', function($scope, $http, $stateParams) {
        $scope.busNrs = $stateParams.busNr;
        var url = 'http://localhost:8081/bus/' + $scope.busNrs;
        console.log($stateParams.busNr);

        $http.get(url)
            .success(function(data) {
                console.log(data);
                $scope.bus = data;
            })
    });