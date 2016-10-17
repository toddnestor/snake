/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Board = __webpack_require__(1);
	const View = __webpack_require__(4);

	$( () => {
	  let board = new Board();
	  let view = new View(board, $('.snake'));

	  let timer = setInterval(function(){
	    board.step();

	    view.render();

	    if(board.outOfBounds() || board.snake.touchingSelf()) {
	      alert('You lost!');
	      clearInterval(timer);
	    }
	  }, 100)
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Snake = __webpack_require__(2);

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


/***/ },
/* 2 */
/***/ function(module, exports) {

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


/***/ },
/* 3 */,
/* 4 */
/***/ function(module, exports) {

	class View {
	  constructor(board, $el) {
	    this.board = board;
	    this.el = $el;
	    this.setupSnake();
	    this.bindEvents();
	  }

	  setupSnake() {
	    let grid = this.board.grid;
	    for(let i = 0; i < grid.length; i++) {
	      let ul = $('<ul>');

	      for(let j = 0; j < grid[i].length; j++) {
	        ul.append($('<li>'));
	      }

	      this.el.append(ul);

	    }
	    this.render();
	  }

	  render() {
	    $('.snake-parts').removeClass('snake-parts');
	    $('.apple').removeClass('apple');
	    this.board.snake.segments.forEach(segment => {
	      $(`.snake ul:nth-child(${segment[0]+1}) li:nth-child(${segment[1]+1})`).addClass('snake-parts');
	    });

	    let apple = this.board.apple;
	    $(`.snake ul:nth-child(${apple[0]+1}) li:nth-child(${apple[1]+1})`).addClass('apple');
	  }

	  bindEvents() {
	    let that = this;

	    $('body').keydown(function(e) {
	      switch(e.keyCode) {
	        case 37:
	          that.board.snake.turn('left');
	        break;
	        case 38:
	          that.board.snake.turn('up');
	        break;
	        case 39:
	          that.board.snake.turn('right');
	        break;
	        case 40:
	          that.board.snake.turn('down');
	        break;
	      }
	    });
	  }
	}

	module.exports = View;


/***/ }
/******/ ]);