'use strict';

var BaseService = require('./service');
var inherits = require('util').inherits;
var fs = require('fs');
var exec = require('child_process').exec;
var pkg = require('../package.json');

var FlosightUI = function(options) {
  BaseService.call(this, options);
  this.apiPrefix = options.apiPrefix || 'api';
  this.routePrefix = options.routePrefix || '';
};

FlosightUI.dependencies = ['flosight-api'];

inherits(FlosightUI, BaseService);

FlosightUI.prototype.start = function(callback) {

  var self = this;
  pkg.flosightConfig.apiPrefix = self.apiPrefix;
  pkg.flosightConfig.routePrefix = self.routePrefix;

  fs.writeFileSync(__dirname + '/../package.json', JSON.stringify(pkg, null, 2));
  exec('cd ' + __dirname + '/../;' +
    ' npm run install-and-build', function(err) {
    if (err) {
      return callback(err);
    }
    self.indexFile = self.filterIndexHTML(fs.readFileSync(__dirname + '/../public/index-template.html', {encoding: 'utf8'}));
    callback();
  });

};

FlosightUI.prototype.getRoutePrefix = function() {
  return this.routePrefix;
};

FlosightUI.prototype.setupRoutes = function(app, express) {
  var self = this;
  app.use(express.static(__dirname + '/../public'));
  // if not in found, fall back to indexFile (404 is handled client-side)
  app.use(function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.send(self.indexFile);
  });
};

FlosightUI.prototype.filterIndexHTML = function(data) {
  var transformed = data;
  if (this.routePrefix !== '') {
    transformed = transformed.replace('<base href="/"', '<base href="/' + this.routePrefix + '/"');
  }
  return transformed;
};

module.exports = FlosightUI;
