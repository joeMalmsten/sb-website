'use strict';

angular.module('personalSiteApp.news', ['ngRoute'])
.controller('NewsController', ['$scope', '$http', function($scope, $http) {
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

    $scope.recruitmentStatus = {
        'death-knight': 'high',
        'warrior': 'high',
        'paladin': 'high',
        'shaman': 'high',
        'hunter': 'high',
        'rogue': 'high',
        'druid': 'high',
        'demon-hunter': 'high',
        'monk': 'high',
        'warlock': 'high',
        'priest': 'high',
        'mage': 'high'
    };
}]);
