'use strict';

angular.module('latticegamesApp')
    .factory('Register', function ($resource) {
        return $resource('api/register', {}, {
        });
    });


