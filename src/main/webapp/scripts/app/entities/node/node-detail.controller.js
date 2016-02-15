'use strict';

angular.module('latticegamesApp')
    .controller('NodeDetailController', function ($scope, $rootScope, $stateParams, entity, Node, Lattice) {
        $scope.node = entity;
        $scope.load = function (id) {
            Node.get({id: id}, function(result) {
                $scope.node = result;
            });
        };
        var unsubscribe = $rootScope.$on('latticegamesApp:nodeUpdate', function(event, result) {
            $scope.node = result;
        });
        $scope.$on('$destroy', unsubscribe);

    });
