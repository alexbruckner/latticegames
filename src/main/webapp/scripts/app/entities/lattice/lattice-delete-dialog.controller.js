'use strict';

angular.module('latticegamesApp')
	.controller('LatticeDeleteController', function($scope, $uibModalInstance, entity, Lattice) {

        $scope.lattice = entity;
        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.confirmDelete = function (id) {
            Lattice.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };

    });
