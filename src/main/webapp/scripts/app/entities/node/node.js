'use strict';

angular.module('latticegamesApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('node', {
                parent: 'entity',
                url: '/nodes',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'latticegamesApp.node.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/node/nodes.html',
                        controller: 'NodeController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('node');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('node.detail', {
                parent: 'entity',
                url: '/node/{id}',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'latticegamesApp.node.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/node/node-detail.html',
                        controller: 'NodeDetailController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('node');
                        return $translate.refresh();
                    }],
                    entity: ['$stateParams', 'Node', function($stateParams, Node) {
                        return Node.get({id : $stateParams.id});
                    }]
                }
            })
            .state('node.new', {
                parent: 'node',
                url: '/new',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/node/node-dialog.html',
                        controller: 'NodeDialogController',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {
                                    name: null,
                                    x: null,
                                    y: null,
                                    id: null
                                };
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('node', null, { reload: true });
                    }, function() {
                        $state.go('node');
                    })
                }]
            })
            .state('node.edit', {
                parent: 'node',
                url: '/{id}/edit',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/node/node-dialog.html',
                        controller: 'NodeDialogController',
                        size: 'lg',
                        resolve: {
                            entity: ['Node', function(Node) {
                                return Node.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('node', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            })
            .state('node.delete', {
                parent: 'node',
                url: '/{id}/delete',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/node/node-delete-dialog.html',
                        controller: 'NodeDeleteController',
                        size: 'md',
                        resolve: {
                            entity: ['Node', function(Node) {
                                return Node.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('node', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            });
    });
