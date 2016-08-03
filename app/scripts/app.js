'use strict';

/**
* @ngdoc overview
* @name personalSiteApp
* @description
* # personalSiteApp
*
* Main module of the application.
*/
angular.module('underscore', []).factory('_', ['$window', function($window) {
return $window._; // assumes underscore has already been loaded on the page
}]);
angular
.module('personalSiteApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'underscore',
    'util.application',
    'personalSiteApp.top',
    'personalSiteApp.roster',
    'personalSiteApp.news',
    'personalSiteApp.application'
])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        controller: 'MainController',
        templateUrl: '../views/main.html'
    });

    $routeProvider.otherwise('/');
}])
.filter('toArray', function() { return function(obj) {
    if (!(obj instanceof Object)) {
        return obj;
    }

    return _.map(obj, function(val, key) {
        var propertyObj = {};
        propertyObj[Object.getPrototypeOf(obj)] = null;
        propertyObj.value = key;
        return Object.defineProperty(val, '$key', propertyObj);
    });
};});
