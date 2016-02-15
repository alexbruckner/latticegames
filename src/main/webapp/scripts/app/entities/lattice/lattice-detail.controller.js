'use strict';

angular.module('latticegamesApp')
    .controller('LatticeDetailController', function ($scope, $rootScope, $stateParams, entity, Lattice, Node) {
        $scope.lattice = entity;
        $scope.load = function (id) {
            Lattice.get({id: id}, function(result) {
                $scope.lattice = result;
            });
        };
        var unsubscribe = $rootScope.$on('latticegamesApp:latticeUpdate', function(event, result) {
            $scope.lattice = result;
        });
        $scope.$on('$destroy', unsubscribe);

    });
