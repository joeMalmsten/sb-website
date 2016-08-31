'use strict';

angular.module('personalSiteApp.roster', ['ngRoute', 'app.table'])
.controller('RosterController', ['$scope', '$http', '_', function($scope, $http, _) {

    var guildRankList = [
            'Guild Master',
            'CO-GM',
            'CAPT',
            '1st LT',
            'CPL',
            'PFC',
            'Senior',
            'Salty',
            'Boot',
            'Guest'
        ],
        raceObj,
        classObj;

    $scope.rosterTable = {
        title: 'Roster',
        columns: ['Name', 'Class', 'Level', 'Rank'],
        availableOptions: {},
        ignoredData: ['metaData'],
        tableData: null
    };

    function init() {
        initRaces();
    }
    function initRaces() {
        $http.get('https://us.api.battle.net/wow/data/character/races?locale=en_US&apikey=u2d8h5gkuwtvkegr3wxzcqct85uq48z9').then(
        function(response) {
            raceObj = {};


            _.each(response.data.races, function(currentRace) {
                raceObj[currentRace.id] = currentRace;
            });

            initClasses();
        },
        function(error) {
            console.log('Race request failed, ', error);
        });
    }

    function initClasses() {
        $http.get('https://us.api.battle.net/wow/data/character/classes?locale=en_US&apikey=u2d8h5gkuwtvkegr3wxzcqct85uq48z9').then(
        function(response) {
            classObj = {};


            _.each(response.data.classes, function(currentClass) {
                classObj[currentClass.id] = currentClass;
            });

            initMembers();
        },
        function(error) {
            console.log('Class request failed, ', error);
        });
    }

    function initMembers() {
        $http.get('https://us.api.battle.net/wow/guild/Tichondrius/Seriously%20Brutal?fields=members&locale=en_US&apikey=u2d8h5gkuwtvkegr3wxzcqct85uq48z9').then(
        function(response) {
            var rosterTableRows = [];

            _.each(response.data.members, function(member) {
                if (guildRankList[member.rank] !== 'Guest') {
                    rosterTableRows.push({
                        Name: member.character.name,
                        Race: raceObj[member.character.race].name,
                        Class: classObj[member.character.class].name,
                        Level: member.character.level,
                        Rank: guildRankList[member.rank]
                    });
                }
            });

            $scope.rosterTable.tableData = rosterTableRows;
        },
        function(error) {
            console.log('Member request failed, ', error);
        });
    }

    init();
}]);
