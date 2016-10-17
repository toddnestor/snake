const Snake = require('./snake');

class Board {
  constructor(size = 20) {
    this.size = size;
    this.grid = this.setupGrid();
    this.snake = new Snake(this.randomPos());
    this.apple = this.createApple();
  }

  randomPos() {
    let row = Math.floor(Math.random() * this.size);
    let col = Math.floor(Math.random() * this.size);
    return [row, col];
  }

  createApple() {
    let pos = this.randomPos();

    while(!this.unoccupiedSquare(pos)) {
      pos = this.randomPos();
    }

    return pos;
  }

  unoccupiedSquare(pos) {
    let segments = this.snake.segments;

    for(let i = 0; i < segments.length; i++) {
      let segment = segments[i];
      if(segment[0] === pos[0] && segment[1] === pos[1]) {
        return false;
      }
    }

    return true;
  }

  setupGrid() {
    let grid = [];
    for (let i = 0; i < this.size; i++ ) {
      let row = [];
      for (let j = 0; j < this.size; j++ ) {
        row.push(null);
      }
      grid.push(row);
    }
    return grid;
  }

  outOfBounds() {
    let last = this.snake.lastMove();
    return last[0] < 0 || last[0] >= this.size || last[1] < 0 || last[1] >= this.size
  }

  step() {
    this.snake.move();
    let last = this.snake.lastMove();
    let apple = this.apple;

    if(apple[0] === last[0] && apple[1] === last[1]) {
      this.snake.toGrow = 2;
      this.snake.applesEaten++;
      this.apple = this.createApple();
    }
  }
}

module.exports = Board;
