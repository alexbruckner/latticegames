'use strict';

angular.module('latticegamesApp')
    .factory('Lattice', function ($resource, DateUtils) {
        return $resource('api/lattices/:id', {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    });
