'use strict';

angular.module('personalSiteApp.resume', ['ngRoute'])
.controller('ResumeController', [ '$scope', '$http',  '_', '$timeout', function($scope, $http, _, $timeout) {
    $http.get('data/resumeData.json').success(function(response){
        var load_screen = $("#load_screen");
        $scope.resumeData =  response;
        $scope.skillList = {};

        function sortSkills(a, b) {
            if (a.lvl < b.lvl) {
                return 1;
            } else if (a.lvl > b.lvl) {
                return -1;
            }

            // a must be equal to b
            return 0;
        }

        function buildSkillList(skillList) {
            _.each(skillList, function(skill){
                
                if (!$scope.skillList[skill.skillType]) {
                    $scope.skillList[skill.skillType] = {};
                }
                if (!$scope.skillList[skill.skillType][skill.skillName]) {
                    $scope.skillList[skill.skillType][skill.skillName] = {
                        name: skill.skillName,
                         lvl: skill.lvl
                    };
                } else {
                    $scope.skillList[skill.skillType][skill.skillName].lvl += skill.lvl;
                }
            });
        }

        // Build the string used in our view 
        _.each($scope.resumeData.workExperience, function(job) {
            var skillCount = 0,
                maxSkills = 10;
            job.jobSkills.sort(sortSkills);
            job.skillString = job.jobSkills.filter(function(){
                ++skillCount;
                if(skillCount <= maxSkills) {
                    return true;
                }
                return false;
            }).map(function(skillIter){

                return skillIter.skillName;
            }).join(', ');
            buildSkillList(job.jobSkills);
        });

        buildSkillList($scope.resumeData.education.skills);
        $.each($scope.skillList, function(key, value) {
            $scope.skillList[key].skillCount = 0;
            $scope.skillList[key].skillArray = [];

            // Convert the skillList object into an array, since you can't sort object keys
            $.each(value, function(skillKey, skillValue) {
                if (skillKey !== "skillString" && skillKey !== "skillArray" && skillKey !== "skillCount") {
                    ++($scope.skillList[key].skillCount);
                   $scope.skillList[key].skillArray.push(skillValue);
                }
            });

            // Take the array of skill objects and sort them for our skill string
            $scope.skillList[key].skillArray.sort(sortSkills);
            $scope.skillList[key].skillString = $scope.skillList[key].skillArray.map(function(skill) {
                return skill.name;
            }).join(', ');
        });

        load_screen.addClass("loaded");
        $timeout(function() {
            load_screen.remove();
        }, 3000);
    });
}]);