'use strict';

angular.module('util.application', [])
.factory('applicationFactory', [function() {
    var self = {
        classStatus: {
            'death-knight': {
                name: 'Death Knight',
                demand: 'closed'
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
                demand: 'closed'
            },
            'monk': {
                name: 'Monk',
                demand: 'low'
            },
            'warlock': {
                name: 'Warlock',
                demand: 'low'
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
