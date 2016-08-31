/*globals emailjs*/
'use strict';

angular.module('personalSiteApp.application', ['ngRoute'])
.controller('ApplicationController', ['$scope', '$route', 'applicationFactory',
function($scope, $route, applicationFactory) {

    $scope.guildClasses = applicationFactory.classStatus;

    $scope.guildApp = {
        name: '',
        battletag: '',
        age: '',
        class: '',
        roles: {},
        interests: {},
        raiding: {}

    };

    $scope.setClass = function(classVal) {
        $scope.guildApp.class = classVal;
    };

    $scope.submitApplication = function() {
        emailjs.send('seriouslybrutalgmail', 'guildapplication', $scope.guildApp).then(function() {
            $route.reload();
        });
    };
}]);
