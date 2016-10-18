const Board = require('./board');
const View = require('./view');

$( () => {
  function runGame() {
    let board = new Board();
    let view = new View(board, $('.snake'));

    let snakeEater = setInterval(function(){
      let now = new Date();
      if(now - board.snake.lastApple > 10000) {
        board.snake.streak = 0;
      }
    }, 500)

    let timer = setInterval(function(){
      board.step();

      view.render();

      if(board.outOfBounds() || board.snake.touchingSelf()) {
        $('.lost').show();
        clearInterval(timer);
        clearInterval(snakeEater);
        $('body').keydown(function(e) {
          $('body').off();
          if(e.keyCode === 13) {
            $('.lost').hide();
            runGame();
          }
        });
      }
    }, 100);
  }

  runGame();

  setInterval(function(){
    $('.activity h2:last').fadeOut("slow", function(){
      $(this).remove();
    });
  }, 10000);
});
