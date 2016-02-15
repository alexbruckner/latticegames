'use strict';

describe('Controller Tests', function() {

    describe('Lattice Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockLattice, MockNode;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockLattice = jasmine.createSpy('MockLattice');
            MockNode = jasmine.createSpy('MockNode');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'Lattice': MockLattice,
                'Node': MockNode
            };
            createController = function() {
                $injector.get('$controller')("LatticeDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'latticegamesApp:latticeUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
