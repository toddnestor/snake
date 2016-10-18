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
	  }, 100);

	  setInterval(function(){
	    $('.activity h2:last').fadeOut("slow", function(){
	      $(this).remove();
	    });
	  }, 10000);

	  setInterval(function(){
	    let now = new Date();
	    if(now - board.snake.lastApple > 10000) {
	      board.snake.streak = 0;
	    }
	  }, 500)
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Snake = __webpack_require__(2);
	const Node = __webpack_require__(5);

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


/***/ },
/* 2 */
/***/ function(module, exports) {

	class Snake {
	  constructor(pos) {
	    this.direction = this.randomDirection();
	    this.segments = [pos];
	    this.applesEaten = 0;
	    this.toGrow = 0;
	    this.movesToApple = 0;
	    this.streak = 0;
	    this.lastApple = new Date();
	  }

	  randomDirection() {
	    let index = Math.floor(Math.random() * 3);
	    return Object.keys(Snake.DIRECTIONS)[index];
	  }

	  move() {
	    this.movesToApple++;
	    let last = this.segments[this.segments.length - 1];

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

	  partOfSnake(pos) {
	    let segments = this.segments;
	    for(let i = 0; i < segments.length; i++) {
	      let segment = segments[i];
	      if(segment[0] === pos[0] && segment[1] === pos[1]) {
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

	    let points = this.board.snake.applesEaten;
	    let streak = this.board.snake.streak;
	    $('.score').html(points);
	    $('.streak').html(streak);
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


/***/ },
/* 5 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);