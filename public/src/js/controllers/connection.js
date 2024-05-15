'use strict';

angular.module('flosight.connection').controller('ConnectionController',
  function($scope, $window, Status, getSocket, PeerSync) {

    // Set initial values
    $scope.apiOnline = true;
    $scope.serverOnline = true;
    $scope.clienteOnline = true;

    var socket = getSocket($scope);
    var disconnectTimeout;

    // Check for the node server connection
    // Check for the node server connection
    socket.on('connect', function() {
      $scope.serverOnline = true;
      clearTimeout(disconnectTimeout);

      socket.on('disconnect', function() {
        // Set a timeout to change serverOnline status after 5 seconds
        disconnectTimeout = setTimeout(function() {
          $scope.serverOnline = false;
          $scope.$apply(); // Ensure scope is updated
        }, 5000);
      });

      socket.on('reconnect', function() {
        // Clear the timeout if it reconnects within 5 seconds
        clearTimeout(disconnectTimeout);
        $scope.serverOnline = true;
        $scope.$apply(); // Ensure scope is updated
      });
    });

    // Check for the  api connection
    $scope.getConnStatus = function() {
      PeerSync.get({},
        function(peer) {
          $scope.apiOnline = peer.connected;
          $scope.host = peer.host;
          $scope.port = peer.port;
        },
        function() {
          $scope.apiOnline = false;
        });
    };

    socket.emit('subscribe', 'sync');
    socket.on('status', function(sync) {
      $scope.sync = sync;
      $scope.apiOnline = (sync.status !== 'aborted' && sync.status !== 'error');
    });

    // Check for the client conneciton
    $window.addEventListener('offline', function() {
      $scope.$apply(function() {
        $scope.clienteOnline = false;
      });
    }, true);

    $window.addEventListener('online', function() {
      $scope.$apply(function() {
        $scope.clienteOnline = true;
      });
    }, true);

  });
