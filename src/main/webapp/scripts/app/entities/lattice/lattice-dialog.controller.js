'use strict';

angular.module('latticegamesApp').controller('LatticeDialogController',
    ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'Lattice', 'Node',
        function($scope, $stateParams, $uibModalInstance, entity, Lattice, Node) {

        $scope.lattice = entity;
        $scope.nodes = Node.query();
        $scope.load = function(id) {
            Lattice.get({id : id}, function(result) {
                $scope.lattice = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('latticegamesApp:latticeUpdate', result);
            $uibModalInstance.close(result);
            $scope.isSaving = false;
        };

        var onSaveError = function (result) {
            $scope.isSaving = false;
        };

        $scope.save = function () {
            $scope.isSaving = true;
            if ($scope.lattice.id != null) {
                Lattice.update($scope.lattice, onSaveSuccess, onSaveError);
            } else {
                Lattice.save($scope.lattice, onSaveSuccess, onSaveError);
            }
        };

        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
}]);
