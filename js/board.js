const Snake = require('./snake');
const Node = require('./node');

class Board {
  constructor(size = 20) {
    this.size = size;
    this.grid = this.setupGrid();
    this.snake = new Snake(this.randomPos());
    this.apple = this.createApple();
    this.shortestLength = this.shortestAppleRoute();
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
    return this.offBoard(last);
  }

  shortestAppleRoute() {
    let node = new Node(this.snake.lastMove());
    let queue = [node];
    let checked_pos = [node.value];
    let changes = [[-1,0], [1,0], [0,-1], [0,1]];
    let apple = this.apple;

    while (queue.length > 0) {
      let current = queue.pop();
      for (let i = 0; i < changes.length; i ++) {
        let change = changes[i];
        let pos = [change[0] + current.value[0], change[1] + current.value[1]];
        if (!this.offBoard(pos) && !this.snake.partOfSnake(pos) && !this.inArray(checked_pos, pos)) {
          // console.log(pos);
          checked_pos.push(pos);
          let newNode = new Node(pos, current);
          if (apple[0] === pos[0] && apple[1] === pos[1]){
            return newNode.pathLength();
          } else {
            queue.unshift(newNode);
          }
        }
      }
    }

    return null;
  }

  inArray(arr, pos) {
    for(let i = 0; i < arr.length; i++) {
      if(arr[i][0] === pos[0] && arr[i][1] === pos[1]) {
        return true;
      }
    }

    return false;
  }

  offBoard(pos) {
    return pos[0] < 0 || pos[0] >= this.size || pos[1] < 0 || pos[1] >= this.size;
  }

  step() {
    this.snake.move();
    let last = this.snake.lastMove();
    let apple = this.apple;

    if(apple[0] === last[0] && apple[1] === last[1]) {
      this.snake.lastApple = new Date();
      let difference = this.snake.movesToApple - this.shortestLength;

      if(difference === 0 ) {
        this.addActivity('perfect!!!!');
        this.snake.streak++;
      } else if(difference <= 10) {
        this.addActivity('great!!!!');
        this.snake.streak++;
      } else if(difference <= 20) {
        this.addActivity('meh...');
        this.snake.streak = 0;
      } else {
        this.addActivity('really?');
        this.snake.streak = 0;
      }
      this.snake.toGrow = 2;
      this.snake.applesEaten++;
      this.apple = this.createApple();
      this.shortestLength = this.shortestAppleRoute();
      this.snake.movesToApple = 0;
    }
  }

  addActivity(msg) {
    $('.activity').prepend($('<h2>').html(msg));
    $('.activity h2:gt(9)').fadeOut("slow", function(){
      $(this).remove();
    });
  }
}

module.exports = Board;
