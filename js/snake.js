class Snake {
  constructor(pos) {
    this.direction = this.randomDirection();
    this.segments = [pos];
    this.applesEaten = 0;
    this.toGrow = 0;
  }

  randomDirection() {
    let index = Math.floor(Math.random() * 3);
    return Object.keys(Snake.DIRECTIONS)[index];
  }

  move() {
    let last = this.segments[this.segments.length - 1]

    if( this.toGrow > 0 ) {
      this.toGrow--;
    } else {
      this.segments.shift();
    }

    let dir = Snake.DIRECTIONS[this.direction];
    let next = [last[0] + dir[0], last[1] + dir[1]];
    this.segments.push(next);
  }

  turn(dir) {
    if(!(dir === Snake.OPPOSITES[this.direction])) {
      this.direction = dir;
    }
  }

  lastMove() {
    return this.segments[this.segments.length - 1];
  }

  touchingSelf() {
    let segments = this.segments;
    let last = this.lastMove();
    for(let i = 0; i < segments.length - 1; i++) {
      let segment = segments[i];
      if(segment[0] === last[0] && segment[1] === last[1]) {
        return true;
      }
    }

    return false;
  }
}

Snake.DIRECTIONS = {up: [-1,0], right: [0,1], down: [1,0], left: [0, -1]};
Snake.OPPOSITES = {up: 'down', right: 'left', down: 'up', left: 'right'};

module.exports = Snake;
