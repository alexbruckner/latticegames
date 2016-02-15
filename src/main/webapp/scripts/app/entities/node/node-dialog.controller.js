'use strict';

angular.module('latticegamesApp').controller('NodeDialogController',
    ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'Node', 'Lattice',
        function($scope, $stateParams, $uibModalInstance, entity, Node, Lattice) {

        $scope.node = entity;
        $scope.lattices = Lattice.query();
        $scope.nodes = Node.query();
        $scope.load = function(id) {
            Node.get({id : id}, function(result) {
                $scope.node = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('latticegamesApp:nodeUpdate', result);
            $uibModalInstance.close(result);
            $scope.isSaving = false;
        };

        var onSaveError = function (result) {
            $scope.isSaving = false;
        };

        $scope.save = function () {
            $scope.isSaving = true;
            if ($scope.node.id != null) {
                Node.update($scope.node, onSaveSuccess, onSaveError);
            } else {
                Node.save($scope.node, onSaveSuccess, onSaveError);
            }
        };

        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
}]);
