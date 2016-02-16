// TODO for now set env crap here

var API_PROTOCOL = "http";
var API_HOST = "localhost";
var API_PORT = 8080;



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

    $scope.latticeName= "Lattice";

    var nodes = {};
    var lines = {};
    var links = {};
    var texts = {};

    var element = document.getElementById("createLattice");
    WIDTH = 600;
    HEIGHT = 400;
    var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT);
    element.appendChild(renderer.view);

    // create the root of the scene graph
    var stage = new PIXI.Container();

    // create a texture from an image path
    var texture = PIXI.Texture.fromImage('img/ionic.png');

    createBackground();

    function createBackground() {

        // create our little background friend..
        var background = new PIXI.Sprite();

        // enable the background to be interactive... this will allow it to respond to mouse and touch events
        background.interactive = true;

        // this button mode will mean the hand cursor appears when you roll over the background with your mouse
        background.buttonMode = true;

        // make it a bit bigger, so it's easier to grab
        background.width = WIDTH;
        background.height = HEIGHT;

        background.on('mousedown', backgroundMouseDown)
                  .on('touchstart', backgroundMouseDown);

        function backgroundMouseDown (e) {
           x = renderer.plugins.interaction.eventData.data.global.x;
           y = renderer.plugins.interaction.eventData.data.global.y;
           createNode(x, y);
        }

        // move the sprite to its designated position
        background.position.x = 0;
        background.position.y = 0;

        // add it to the stage
        stage.addChild(background);

    }

    var nodeId = 1;
    function createNode(x, y)
    {
        // create our little node friend..
        var node = new PIXI.Sprite(texture);

        node.id = nodeId++;

        // enable the node to be interactive... this will allow it to respond to mouse and touch events
        node.interactive = true;

        // this button mode will mean the hand cursor appears when you roll over the node with your mouse
        node.buttonMode = true;

        // center the node's anchor point
        node.anchor.set(0.5);

        // make it a bit bigger, so it's easier to grab
        node.scale.set(1);

        // setup events
        node
            // events for drag start
            .on('mousedown', onDragStart)
            .on('touchstart', onDragStart)
            // events for drag end
            .on('mouseup', onDragEnd)
            .on('mouseupoutside', onDragEnd)
            .on('touchend', onDragEnd)
            .on('touchendoutside', onDragEnd)
            // events for drag move
            .on('mousemove', onDragMove)
            .on('touchmove', onDragMove);

        // move the sprite to its designated position
        node.position.x = x;
        node.position.y = y;

        // add it to the stage
        stage.addChild(node);

        nodes[node.id] = node;

        createText(node);

    }

    function createText(node) {

      var text = new PIXI.Text(node.id, {font:"20px Arial", fill:"red"});
      text.x = node.position.x-text.width/2;
      text.y = node.position.y-text.height/2;

      if (texts[node.id]) {
        stage.removeChild(texts[node.id]);
        delete texts[node.id];
      }

      texts[node.id] = text;

      stage.addChild(text);
    }

    function createLine(node, x2, y2) {
      var line = new PIXI.Graphics();
      // draw a line
      line.lineStyle(5, 0x0000FF, 1);

      line.position.x1 = node.position.x;
      line.position.y1 = node.position.y;
      line.position.x2 = x2;
      line.position.y2 = y2;


      line.moveTo(line.position.x1, line.position.y1);
      line.lineTo(line.position.x2, line.position.y2);

      if (lines[node.id]){
        stage.removeChild(lines[node.id]);
      }
      // add it to the stage
            stage.addChild(line);
      lines[node.id] = line


    }

    function linkNodes(node1, node2) {
      var line = new PIXI.Graphics();
      // draw a line
      line.lineStyle(5, 0x0000FF, 1);

      line.position.x1 = node1.position.x;
      line.position.y1 = node1.position.y;
      line.position.x2 = node2.position.x;
      line.position.y2 = node2.position.y;

      line.moveTo(line.position.x1, line.position.y1);
      line.lineTo(line.position.x2, line.position.y2);

      if (links[node1.id+"-"+node2.id]){
        stage.removeChild(links[node1.id+"-"+node2.id]);
        delete links[node1.id+"-"+node2.id];
      }

      if (links[node2.id+"-"+node1.id]){
        stage.removeChild(links[node2.id+"-"+node1.id]);
        delete links[node2.id+"-"+node1.id];
      }

      // add it to the stage
      stage.addChild(line);
      line.node1 = node1;
      line.node2 = node2;
      links[node1.id+"-"+node2.id] = line

      createText(node1);
      createText(node2);

    }

    function moveLink(node) {
      for (i in links) {
        if (i.startsWith(node.id+'-')) {
          linkNodes(node, links[i].node2);
        } else if (i.endsWith('-'+node.id)) {
          linkNodes(links[i].node1, node);
        }
      }
    }

    requestAnimationFrame( animate );

    function animate() {

        requestAnimationFrame(animate);

        // render the stage
        renderer.render(stage);
    }

    var currentNode;
    function onDragStart(event)
    {

       // check dblclick
        if (this.lastClickTime) {

         if (Date.now() - this.lastClickTime < 200) {
             currentNode = this;
             return;
         }

       }
       this.lastClickTime = Date.now();



        // store a reference to the data
        // the reason for this is because of multitouch
        // we want to track the movement of this particular touch
        this.data = event.data;
        this.alpha = 0.5;
        this.dragging = true;
    }

    function onDragEnd()
    {
        this.alpha = 1;

        this.dragging = false;

        // set the interaction data to null
        this.data = null;


        if (currentNode) {

          x2 = renderer.plugins.interaction.eventData.data.global.x;
          y2 = renderer.plugins.interaction.eventData.data.global.y

          for (i in nodes) {
            if (x2 > nodes[i].position.x - nodes[i].width/2 && x2 < nodes[i].position.x + nodes[i].width/2 &&
                y2 > nodes[i].position.y - nodes[i].height/2 && y2 < nodes[i].position.y + nodes[i].height/2) {
                  // fine
                  linkNodes(currentNode, nodes[i]);
                } else {
                  stage.removeChild(lines[currentNode.id]);
                  delete lines[currentNode.id];
                }
          }

          currentNode = null;
        }

    }

    function onDragMove()
    {
        if (currentNode) {
            x2 = renderer.plugins.interaction.eventData.data.global.x;
            y2 = renderer.plugins.interaction.eventData.data.global.y
            createLine(currentNode, x2, y2);
        }

        if (this.dragging)
        {
            var newPosition = this.data.getLocalPosition(this.parent);

            if (newPosition.x < this.width/2 ||
                newPosition.y < this.height/2 ||
                newPosition.x > WIDTH - this.width/2 ||
                newPosition.y > HEIGHT - this.height/2) {
              return;
            }

            this.position.x = newPosition.x;
            this.position.y = newPosition.y;

            moveLink(this);
            createText(this);

        }
    }

    $scope.logLinks = function () {
      console.log(links);
    }



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

      $scope.saveLattice = function () {

        //TODO create nodes, update nodes with links
         $http({
              method: $scope.latticeId == null ? 'POST' : 'PUT',
              url: API_PROTOCOL + '://' + API_HOST + ':' + API_PORT + '/api/lattices',
              data: {"id" : $scope.latticeId, "name": $scope.latticeName}
          }).then(
            function success(response) {
              console.log(response.data);
              $scope.latticeId = response.data.id;
              $scope.loadLattices();
            },
            function error(response) {
              console.log(response);
            }
          );


        $scope.loadLattices();
      }

      $scope.loadLattices();

})
