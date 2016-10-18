class Node {
  constructor( value, parent = null) {
    this.value = value;
    this.parent = parent;
  }
  pathLength() {
    let length = 0
    let node = this;
    while (node.parent) {
      length++;
      node = node.parent;
    }
    return length;
  }
}

module.exports = Node;
