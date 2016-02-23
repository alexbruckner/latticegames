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

var Lattice = function (name) {
  this.id = null;
  this.name = name;
  this.nodes = [];
  this.add = function (node) {
    if (!this.nodes.contains(node)) {
      node.name = this.nodes.length + 1;
      node.lattice = this;
      this.nodes.push(node);
    } else {
      console.error("{0} already a member of {1}".format(node, this));
    }
  }
  this.toString = function(){
    return "Lattice {id: {0}, name: {1}, nodes: {2}}".format(this.id, this.name, this.nodes.join(", "));
  }
  return this;
}

var Node = function () {
  this.id = null;
  this.name = null;
  this.lattice = null;
  this.neighbours = [];
  this.link = function (otherNode, dontDoOther) {
    if (this.lattice === otherNode.lattice) {
      if (!this.neighbours.contains(otherNode)) {
        this.neighbours.push(otherNode);
      } else {
        console.error("{0} is already a neighbour.".format(otherNode));
        return;
      }
      if (!dontDoOther) {
        otherNode.link(this, true);
      }
    } else {
      console.error("{0} and {1} do not belong to the same lattice.".format(this, otherNode));
    }
  }
  this.toString = function(){
    return "Node {id: {0}, name: {1}, neighbours: {2}}".format(this.id, this.name, this.neighbours.map(function (neighbour) {return neighbour.name;}).join(", "));
  }
  return this;
}

LatticeGames = {

    Lattice: function (name) {
      return new Lattice(name);
    },

    Node: function (name) {
      return new Node(name);
    }

}

}());
