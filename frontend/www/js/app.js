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


//  var n1 = LatticeGames.Node();

//  lattice.add(n1);


//    $scope.latticeName= "Lattice";
//
//    var nodes = {};
//    var lines = {};
//    var links = {};
//    var texts = {};
//
//
    var element = document.getElementById("createLattice");
//    WIDTH = 600;
//    HEIGHT = 400;
    var renderer = PIXI.autoDetectRenderer();
    element.appendChild(renderer.view);

    // create the root of the scene graph
    var stage = new PIXI.Container();

    // create a texture from an image path
    var texture = PIXI.Texture.fromImage('img/ionic.png');

    var lattice = LatticeGames.Lattice("Lattice", renderer, stage, texture);
    log(lattice);


//
//     function reset() {
//
//          for (i in nodes) {
//              stage.removeChild(nodes[i]);
//              delete nodes[i];
//          }
//
//          for (i in links) {
//              stage.removeChild(links[i]);
//              delete links[i];
//          }
//
//          for (i in texts) {
//              stage.removeChild(texts[i]);
//              delete texts[i];
//          }
//
//          nodes = {};
//          links = {};
//          texts = {};
//
//     }
//
//


//

//
//    function linkNodes(node1, node2) {
//      var line = new PIXI.Graphics();
//      // draw a line
//      line.lineStyle(5, 0x0000FF, 1);
//
//      line.position.x1 = node1.position.x;
//      line.position.y1 = node1.position.y;
//      line.position.x2 = node2.position.x;
//      line.position.y2 = node2.position.y;
//
//      line.moveTo(line.position.x1, line.position.y1);
//      line.lineTo(line.position.x2, line.position.y2);
//
//      if (links[node1.id+"-"+node2.id]){
//        stage.removeChild(links[node1.id+"-"+node2.id]);
//        delete links[node1.id+"-"+node2.id];
//      }
//
//      if (links[node2.id+"-"+node1.id]){
//        stage.removeChild(links[node2.id+"-"+node1.id]);
//        delete links[node2.id+"-"+node1.id];
//      }
//
//      // add it to the stage
//      stage.addChild(line);
//      line.node1 = node1;
//      line.node2 = node2;
//      links[node1.id+"-"+node2.id] = line
//
//      createText(node1);
//      createText(node2);
//
//    }
//
//    function moveLink(node) {
//      for (i in links) {
//        if (i.startsWith(node.id+'-')) {
//          linkNodes(node, links[i].node2);
//        } else if (i.endsWith('-'+node.id)) {
//          linkNodes(links[i].node1, node);
//        }
//      }
//    }
//
    requestAnimationFrame( animate );

    function animate() {

        requestAnimationFrame(animate);

        // render the stage
        renderer.render(stage);
    }
//
//     $scope.loadLattices = function () {
//        $http({
//            method: 'GET',
//            url: API_PROTOCOL + '://' + API_HOST + ':' + API_PORT + '/api/lattices'
//        }).then(
//          function success(response) {
//            $scope.lattices = response.data;
//          },
//          function error(response) {
//            console.log(response);
//          }
//        );
//      }
//
//      $scope.displayLattice = function (latticeId) {
//
//        $http({
//            method: 'GET',
//            url: API_PROTOCOL + '://' + API_HOST + ':' + API_PORT + '/api/lattices/' + latticeId + '/nodes'
//        }).then(
//          function success(response) {
//            console.log(response.data);
//            reset();
//            nodeId = 1;
//            $scope.latticeId = latticeId;
//            nodes = response.data;
//            // TODO show links too in loaded lattice! and fix that friggin bug shite
//            for (i in nodes) {
//              console.debug(nodes[i]);
//              createNode(nodes[i].x, nodes[i].y, nodes[i].name);
//              nodeId++;
//            }
//
//          },
//          function error(response) {
//            console.log("ERROR !!! " + response);
//          }
//        );
//
//
//
//      }
//
//
//      // TODO NOTE we want a service to expose the api in js only, move all backend stuff into a service.
//
//      function updateNodesWithLinks() {
//         for (i in links) {
//
//              var linkNodes = i.split("-");
//
//              console.log("link: " + linkNodes[0] + "->" + linkNodes[1]);
//
//              $http({
//                  method: 'POST',
//                  url: API_PROTOCOL + '://' + API_HOST + ':' + API_PORT + '/api/nodes/link/' + nodes[linkNodes[0]].dbId + '/' + nodes[linkNodes[1]].dbId
//              }).then(
//                function success(response) {
//                  console.log(response.data);
//                },
//                function error(response) {
//                  console.log("ERROR !!! " +  response);
//                }
//              );
//          }
//      }
//
//      function saveNodesForLattice(latticeId) {
//
//        var maxCnt = Object.keys(nodes).length;
//        var cnt = 0;
//        for (i in nodes) {
//
//          console.log("Saving node: " + nodes[i].id + " for lattice: " + latticeId + ", dbid: " + nodes[i].dbId);
//
//          $http({
//              method: nodes[i].dbId == null ? 'POST' : 'PUT',
//              url: API_PROTOCOL + '://' + API_HOST + ':' + API_PORT + '/api/nodes',
//              data: {"id" : nodes[i].dbId , "lattice" : {"id" : $scope.latticeId}, "name" : nodes[i].id, "x" : nodes[i].position.x, "y" : nodes[i].position.y}
//          }).then(
//            function success(response) {
//              console.log(response.data);
//              nodes[response.data.name].dbId = response.data.id;
//              cnt++;
//              console.log(cnt);
//              if (cnt == maxCnt) { // last one and all ok!
//                updateNodesWithLinks();
//              }
//            },
//            function error(response) {
//              console.log("ERROR !!! " +  response);
//            }
//          );
//        }
//      }
//
//      $scope.saveLattice = function () {
//         $http({
//              method: $scope.latticeId == null ? 'POST' : 'PUT',
//              url: API_PROTOCOL + '://' + API_HOST + ':' + API_PORT + '/api/lattices',
//              data: {"id" : $scope.latticeId, "name": $scope.latticeName}
//          }).then(
//            function success(response) {
//              console.log(response.data);
//              $scope.latticeId = response.data.id;
//              saveNodesForLattice($scope.latticeId);
//              $scope.loadLattices();
//            },
//            function error(response) {
//              console.log("ERROR !!! " + response);
//            }
//          );
//        $scope.loadLattices();
//      }
//
//      $scope.loadLattices();
})
