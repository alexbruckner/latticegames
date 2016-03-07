(function () {

String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

var Lattice = function (name, renderer, stage, texture) {
  this.id = null;
  this.name = name;
  this.nodes = [];
  this.addNode = function (stage, texture, x, y) {
    var name = this.nodes.length + 1;
    node = new Node(this, renderer, stage, texture, name, x, y);
    if (!this.nodes.contains(node)) {
      node.lattice = this;
      this.nodes.push(node);
    } else {
      console.error("{0} already a member of {1}".format(node, this));
    }
  }
  this.toString = function(){
    return "Lattice {id: {0}, name: {1}, nodes: {2}}".format(this.id, this.name, this.nodes.join(", "));
  }
  this.graphics = createBackground(this, renderer, stage, texture);
  function createBackground(lattice, renderer, stage, texture) {

      // create our little background friend..
      var background = new PIXI.Sprite();

      // enable the background to be interactive... this will allow it to respond to mouse and touch events
      background.interactive = true;

      // this button mode will mean the hand cursor appears when you roll over the background with your mouse
      background.buttonMode = true;

      background.width = renderer.width;
      background.height = renderer.height;


      background.on('mousedown', backgroundMouseDown)
                .on('touchstart', backgroundMouseDown);

      function backgroundMouseDown (e) {
         var x = renderer.plugins.interaction.eventData.data.global.x;
         var y = renderer.plugins.interaction.eventData.data.global.y;
         lattice.addNode(stage, texture, x, y);
      }

      // move the sprite to its designated position
      background.position.x = 0;
      background.position.y = 0;

      // add it to the stage
      stage.addChild(background);

  }
  return this;
}

var Node = function (lattice, renderer, stage, texture, name, x, y) {
  this.id = null;
  this.name = name;
  this.lattice = lattice;
  this.neighbours = [];
  this.link = function (otherNode, dontDoOther) {
    if (this.lattice === otherNode.lattice) {
      if (this === otherNode) {
        console.error("Node cannot be linked to itself.".format(this));
      } else if (this.neighbours.contains(otherNode)) {
        console.error("{0} is already a neighbour.".format(otherNode));
      } else {
        this.neighbours.push(otherNode);
        if (!dontDoOther) {
          otherNode.link(this, true);
        }
      }
    } else {
      console.error("{0} and {1} do not belong to the same lattice.".format(this, otherNode));
    }
  }
  this.toString = function(){
    return "Node {id: {0}, name: {1}, neighbours: {2}}".format(this.id, this.name, this.neighbours.map(function (neighbour) {return neighbour.name;}).join(", "));
  }
  this.graphics = graphics(this.name, stage, texture, x, y);
  function graphics(name, stage, texture, x, y) {
          // create our little node friend..
            var node = new PIXI.Sprite(texture);

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

//            // add text to node
            var text = new PIXI.Text(name, {font:"20px Arial", fill:"red"});
            text.x = node.position.x-text.width/2;
            text.y = node.position.y-text.height/2;
            stage.addChild(text);

            node.text = text;

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


    //                    if (currentNode) {
    //
    //                      x2 = renderer.plugins.interaction.eventData.data.global.x;
    //                      y2 = renderer.plugins.interaction.eventData.data.global.y
    //
    //                      for (i in nodes) {
    //                        if (x2 > nodes[i].position.x - nodes[i].width/2 && x2 < nodes[i].position.x + nodes[i].width/2 &&
    //                            y2 > nodes[i].position.y - nodes[i].height/2 && y2 < nodes[i].position.y + nodes[i].height/2) {
    //                              // fine
    //                              linkNodes(currentNode, nodes[i]);
    //                            } else {
    //                              stage.removeChild(lines[currentNode.id]);
    //                              delete lines[currentNode.id];
    //                            }
    //                      }
    //
    //                      currentNode = null;
    //                    }

      }

      function onDragMove()
      {
    //      if (currentNode) {
    //          x2 = renderer.plugins.interaction.eventData.data.global.x;
    //          y2 = renderer.plugins.interaction.eventData.data.global.y
    //          createLine(currentNode, x2, y2);
    //      }

          if (this.dragging)
          {
              var newPosition = this.data.getLocalPosition(this.parent);

              if (newPosition.x < this.width/2 ||
                  newPosition.y < this.height/2 ||
                  newPosition.x > renderer.width - this.width/2 ||
                  newPosition.y > renderer.height - this.height/2) {
                return;
              }

              this.position.x = newPosition.x;
              this.position.y = newPosition.y;

              this.text.x = node.position.x-text.width/2;
              this.text.y = node.position.y-text.height/2;

    //          moveLink(this);
    //          createText(this);

          }
      }

    return node;
  }

  return this;
}


LatticeGames = {

    Lattice: function (name, renderer, stage, texture) {
      return new Lattice(name, renderer, stage, texture);
    }
}

}());
