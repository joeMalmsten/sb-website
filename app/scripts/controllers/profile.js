'use strict';

angular.module('personalSiteApp.profile', ['ngRoute'])
.controller('ProfileController', ["$scope", "$http", function($scope, $http) {
    $http.get('https://us.api.battle.net/wow/guild/Tichondrius/Seriously%20Brutal?fields=news&locale=en_US&apikey=u2d8h5gkuwtvkegr3wxzcqct85uq48z9').success(function(response){
       // console.log('response: ', response)
        //$scope.profileData = response;
        $scope.bubbles = response.achievementPoints;
        $scope.news = response.news;
        //console.log($scope.news)
    });
}]);