 'use strict';

angular.module('latticegamesApp')
    .factory('notificationInterceptor', function ($q, AlertService) {
        return {
            response: function(response) {
                var alertKey = response.headers('X-latticegamesApp-alert');
                if (angular.isString(alertKey)) {
                    AlertService.success(alertKey, { param : response.headers('X-latticegamesApp-params')});
                }
                return response;
            }
        };
    });
