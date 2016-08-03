'use strict';

angular.module('personalSiteApp.roster', ['ngRoute'])
.controller('RosterController', ['$scope', '$http', '_', function($scope, $http, _) {

    $scope.guildRankList = [
        'Guild Master',
        'Co-GM',
        'Officers',
        'Senior Raider',
        'Senior RBGer',
        'Raider',
        'RBGer',
        'Brutal Savage',
        'Brutal Baby'
    ];

    $http.get('https://us.api.battle.net/wow/guild/Tichondrius/Seriously%20Brutal?fields=members&locale=en_US&apikey=u2d8h5gkuwtvkegr3wxzcqct85uq48z9').success(function(response) {
        $scope.members = response.members;
    });

    $http.get('https://us.api.battle.net/wow/data/character/classes?locale=en_US&apikey=u2d8h5gkuwtvkegr3wxzcqct85uq48z9').success(function(response) {
        var classObj = {};


        _.each(response.classes, function(currentClass) {
            classObj[currentClass.id] = currentClass;
        });

        $scope.classObj = classObj;
    });

    $http.get('https://us.api.battle.net/wow/data/character/races?locale=en_US&apikey=u2d8h5gkuwtvkegr3wxzcqct85uq48z9').success(function(response)             {
        var raceObj = {};


        _.each(response.races, function(currentRace) {
            raceObj[currentRace.id] = currentRace;
        });

        $scope.raceObj = raceObj;
    });
}]);
