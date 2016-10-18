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
