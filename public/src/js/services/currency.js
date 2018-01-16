'use strict';

angular.module('flosight.currency').factory('Currency',
  function($resource, Api) {
    return $resource(Api.apiPrefix + '/currency');
});
