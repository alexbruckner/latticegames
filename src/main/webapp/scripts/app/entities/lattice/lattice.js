'use strict';

angular.module('latticegamesApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('lattice', {
                parent: 'entity',
                url: '/lattices',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'latticegamesApp.lattice.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/lattice/lattices.html',
                        controller: 'LatticeController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('lattice');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('lattice.detail', {
                parent: 'entity',
                url: '/lattice/{id}',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'latticegamesApp.lattice.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/lattice/lattice-detail.html',
                        controller: 'LatticeDetailController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('lattice');
                        return $translate.refresh();
                    }],
                    entity: ['$stateParams', 'Lattice', function($stateParams, Lattice) {
                        return Lattice.get({id : $stateParams.id});
                    }]
                }
            })
            .state('lattice.new', {
                parent: 'lattice',
                url: '/new',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/lattice/lattice-dialog.html',
                        controller: 'LatticeDialogController',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {
                                    name: null,
                                    id: null
                                };
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('lattice', null, { reload: true });
                    }, function() {
                        $state.go('lattice');
                    })
                }]
            })
            .state('lattice.edit', {
                parent: 'lattice',
                url: '/{id}/edit',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/lattice/lattice-dialog.html',
                        controller: 'LatticeDialogController',
                        size: 'lg',
                        resolve: {
                            entity: ['Lattice', function(Lattice) {
                                return Lattice.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('lattice', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            })
            .state('lattice.delete', {
                parent: 'lattice',
                url: '/{id}/delete',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/lattice/lattice-delete-dialog.html',
                        controller: 'LatticeDeleteController',
                        size: 'md',
                        resolve: {
                            entity: ['Lattice', function(Lattice) {
                                return Lattice.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('lattice', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            });
    });
