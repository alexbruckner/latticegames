// TODO for now set env crap here

var API_PROTOCOL = "http";
var API_HOST = "localhost";
var API_PORT = 8080;

log = function (o) {
  console.log(""+o);
}

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller('CreateLatticeController', function($scope, $http) {

    $scope.lattice = LatticeGames.Lattice("Lattice", "createLattice");

     $scope.loadLattices = function () {
        $http({
            method: 'GET',
            url: API_PROTOCOL + '://' + API_HOST + ':' + API_PORT + '/api/lattices'
        }).then(
          function success(response) {
            $scope.lattices = response.data;
          },
          function error(response) {
            console.log(response);
          }
        );
      }

      $scope.displayLattice = function (latticeId) {

      $scope.lattice.reset();

        $http({
            method: 'GET',
            url: API_PROTOCOL + '://' + API_HOST + ':' + API_PORT + '/api/lattices/' + latticeId
        }).then(
          function success(response) {
            console.log(response.data);
            $scope.lattice.id = response.data.id;
            log($scope.lattice);
            //TODO draw the fucker plus nodes and links
          },
          function error(response) {
            console.log("ERROR !!! " + response);
          }
        );
      }

      $scope.saveLattice = function () {
         $http({
              method: $scope.lattice.id == null ? 'POST' : 'PUT',
              url: API_PROTOCOL + '://' + API_HOST + ':' + API_PORT + '/api/lattices',
              data: $scope.lattice.toJSON()
          }).then(
            function success(response) {
              console.log(response.data);
              $scope.lattice.id = response.data.id;
              $scope.loadLattices();
            },
            function error(response) {
              console.log("ERROR !!! " + response);
            }
          );
      }
      $scope.loadLattices();
})
