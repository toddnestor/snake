const Board = require('./board');
const View = require('./view');

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
