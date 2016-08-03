'use strict';

describe('Controller: MainController', function () {

    // load the controller's module
    beforeEach(module('personalSiteApp'));

    var MainCtrl,
    scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        MainCtrl = $controller('MainController', {
            $scope: scope
    // place here mocked dependencies
    });
    }));

    it('should attach an object containing page template to the scope', function () {
        expect(scope.template.top).toBeDefined();
        expect(scope.template.guildNews).toBeDefined();
        expect(scope.template.guildApplication).toBeDefined();
        expect(scope.template.roster).toBeDefined();
    });
});
