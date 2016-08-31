'use strict';

angular.module('util.application', [])
.factory('applicationFactory', [function() {
    var self = {
        classStatus: {
            'death-knight': {
                name: 'Death Knight',
                demand: 'low'
            },
            'warrior': {
                name: 'Warrior',
                demand: 'high'
            },
            'paladin': {
                name: 'Paladin',
                demand: 'high'
            },
            'shaman': {
                name: 'Shaman',
                demand: 'high'
            },
            'hunter': {
                name: 'Hunter',
                demand: 'high'
            },
            'rogue': {
                name: 'Rogue',
                demand: 'high'
            },
            'druid': {
                name: 'Druid',
                demand: 'high'
            },
            'demon-hunter': {
                name: 'Demon Hunter',
                demand: 'low'
            },
            'monk': {
                name: 'Monk',
                demand: 'high'
            },
            'warlock': {
                name: 'Warlock',
                demand: 'high'
            },
            'priest': {
                name: 'Priest',
                demand: 'high'
            },
            'mage': {
                name: 'Mage',
                demand: 'high'
            }
        }
    };

    return self;
}]);
