'use strict';

describe('Controller Tests', function() {

    describe('Node Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockNode, MockLattice;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockNode = jasmine.createSpy('MockNode');
            MockLattice = jasmine.createSpy('MockLattice');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'Node': MockNode,
                'Lattice': MockLattice
            };
            createController = function() {
                $injector.get('$controller')("NodeDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'latticegamesApp:nodeUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
