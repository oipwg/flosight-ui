'use strict';

var defaultLanguage = localStorage.getItem('flosight-language') || 'en';
var defaultCurrency = localStorage.getItem('flosight-currency') || 'BTC';

angular.module('flosight',[
  'ngAnimate',
  'ngResource',
  'ngRoute',
  'ngProgress',
  'ui.bootstrap',
  'ui.route',
  'monospaced.qrcode',
  'gettext',
  'angularMoment',
  'flosight.system',
  'flosight.socket',
  'flosight.api',
  'flosight.blocks',
  'flosight.transactions',
  'flosight.address',
  'flosight.search',
  'flosight.status',
  'flosight.connection',
  'flosight.currency',
  'flosight.messages'
]);

angular.module('flosight.system', []);
angular.module('flosight.socket', []);
angular.module('flosight.api', []);
angular.module('flosight.blocks', []);
angular.module('flosight.transactions', []);
angular.module('flosight.address', []);
angular.module('flosight.search', []);
angular.module('flosight.status', []);
angular.module('flosight.connection', []);
angular.module('flosight.currency', []);
angular.module('flosight.messages', []);
