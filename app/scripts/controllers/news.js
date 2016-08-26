'use strict';

angular.module('personalSiteApp.news', ['ngRoute'])
.controller('NewsController', ['$scope', '$http', 'applicationFactory',
function($scope, $http, applicationFactory) {

    function getItem(itemId) {
        return $http.get('https://us.api.battle.net/wow/item/' + itemId + '?locale=en_US&apikey=dwxja88hs8cahytsqvuvk4wrqhf4b5ds');
    }

    $http.get('https://us.api.battle.net/wow/guild/Tichondrius/Seriously%20Brutal?fields=news&locale=en_US&apikey=u2d8h5gkuwtvkegr3wxzcqct85uq48z9').success(function(response) {
        $scope.acheivementPoints = response.achievementPoints;

        $scope.news = [];
        _.each(response.news, function(newsItem) {

            if (newsItem.type === 'guildAchievement') {
                $scope.news.push(newsItem);
            } else if (newsItem.type === 'itemLoot') {
                if (newsItem.context.indexOf('raid-') !== -1 && newsItem.context.indexOf('finder') === -1) {
                    getItem(newsItem.itemId).then(function(response) {
                        newsItem.itemData = response.data;
                        $scope.news.push(newsItem);
                    });
                    newsItem.isItem = true;
                    $scope.news.push(newsItem);
                }
            }
        });
    });

    $scope.guildNews = [
        {
            title: 'The guild mount has been chosen!',
            author: 'Goodkat',
            date: '8/23/16',
            imgSrc: 'images/galakras.jpg',
            text: 'The Reins of Galakras have been chosen as the guild mount. This is the preferred mount to ride in guild RBG and world PvP events. In order to get this mount you must complete the "Glory of the Orgrimmar Raider" achievement from Mists of Pandaria. Keep an eye out on the calendary for guild SOO runs so you can secure your own guild mount.'

        }
    ];

    $scope.recruitmentStatus = applicationFactory.classStatus;
}]);
