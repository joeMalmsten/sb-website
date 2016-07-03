'use strict';

angular.module('personalSiteApp.profile', ['ngRoute'])
.controller('ProfileController', ["$scope", "$http", function($scope, $http) {
    $http.get('data/profileData.json').success(function(response){
        $scope.profileData = response;
    });
}]);