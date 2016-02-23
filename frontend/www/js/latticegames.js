(function () {

String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

var Lattice = function (name) {
  this.id = null;
  this.name = name;
  this.nodes = [];
  this.add = function (node) {
     this.nodes.push(node);
  }
  this.toString = function(){
    return "Lattice {id: {0}, name: {1}, nodes: {2}}".format(this.id, this.name, this.nodes.join(", "));
  }
  return this;
}

var Node = function (name) {
  this.id = null;
  this.name = name;
  this.toString = function(){
    return "Node {id: {0}, name: {1}}".format(this.id, this.name);
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
