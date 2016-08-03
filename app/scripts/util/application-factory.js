'use strict';

angular.module('util.application', [])
.factory('applicationFactory', [function() {
    var self = {
        type: 'raider'
    };

    return self;
}]);
