'use strict';

var TRANSACTION_DISPLAYED = 10;
var BLOCKS_DISPLAYED = 5;

angular.module('flosight.system').controller('IndexController',
  function($scope, Global, getSocket, Blocks, Status) {
    $scope.global = Global;

    var _getBlocks = function(loadTxs) {
      Blocks.get({
        limit: BLOCKS_DISPLAYED
      }, function(res) {
        $scope.blocks = res.blocks;
        $scope.blocksLength = res.length;

        if (loadTxs) {
          TransactionsByBlock.get({
            block: res.blocks[0].hash
          }, function(txs){
            for (var i = txs.length; i > 0; i--){
              $scope.txs.unshift(txs[i]);
              if (parseInt($scope.txs.length, 10) >= parseInt(TRANSACTION_DISPLAYED, 10)) {
                $scope.txs = $scope.txs.splice(0, TRANSACTION_DISPLAYED);
              }
            }
          })
        }
      });
    };

    var socket = getSocket($scope);

    var _startSocket = function() { 
      socket.emit('subscribe', 'inv');
      socket.on('tx', function(tx) {
        $scope.txs.unshift(tx);
        if (parseInt($scope.txs.length, 10) >= parseInt(TRANSACTION_DISPLAYED, 10)) {
          $scope.txs = $scope.txs.splice(0, TRANSACTION_DISPLAYED);
        }
      });

      socket.on('block', function() {
        _getBlocks(false);
      });
    };

    socket.on('connect', function() {
      _startSocket();
    });

   var _getStatus = function(q) {
      Status.get({
          q: 'get' + q
        },
        function(d) {
          $scope.loaded = 1;
          angular.extend($scope, d);
        },
        function(e) {
          $scope.error = 'API ERROR: ' + e.data;
        });
    };

    $scope.humanSince = function(time) {
      var m = moment.unix(time);
      return m.max().fromNow();
    };

    $scope.index = function() {
      _getBlocks(true);
      _startSocket();
      _getStatus('Info');
    };

    $scope.txs = [];
    $scope.blocks = [];
  });
