'use strict';

angular.module('personalSiteApp.companiesPage', ['ngRoute'])
.controller('HistoryController', ['$scope', '$http', "$timeout", function($scope, $http, $timeout) {
    $http.get('data/employerData.json').success(function(response){
        $scope.employerData = response;

        // $timeout here forces the owlCarousel to wait until after the angular code has updated the DOM
        $timeout(function() {
            $("#owl-employers").owlCarousel({
                slideSpeed : 300,
                paginationSpeed : 400,
                autoPlay: 5000
            });
        }, 0);
    });
}]);