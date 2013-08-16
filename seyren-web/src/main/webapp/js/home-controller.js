/*global seyrenApp,console,$ */
(function () {
    'use strict';

    seyrenApp.controller('HomeController', function HomeController($scope, $rootScope, $location, Checks, Alerts) {
        $scope.pollAlertsInSeconds = 5;

        $scope.loadUnhealthyChecks = function () {
            Checks.query({state: ['ERROR', 'WARN', 'EXCEPTION', 'UNKNOWN'], enabled: true}, function(data) {
                $scope.unhealthyChecks = data;
            }, function (err) {
                console.log('Loading unhealthy checks failed');
            });
        };

        $scope.loadAlertStream = function () {
            Alerts.query({items: 10}, function (data) {
                $scope.alertStream = data;
            }, function (err) {
                console.log('Loading alert stream failed');
            });
        };

        $scope.selectCheck = function (id) {
            $location.path('/checks/' + id);
        };

        $scope.countdownToRefresh = function () {
            $scope.loadUnhealthyChecks();
            $scope.loadAlertStream();
        };
        $scope.countdownToRefresh();

        // karma hangs with $timeout
        $scope.timerId = setInterval(function () {
            $scope.countdownToRefresh();
            $scope.$apply();
        }, $scope.pollAlertsInSeconds * 1000);

        $scope.$on("$locationChangeStart", function () {
            clearInterval($scope.timerId);
        });

    });
}());
