class View {
  constructor(board, $el) {
    this.board = board;
    this.el = $el;
    this.setupSnake();
    this.bindEvents();
  }

  setupSnake() {
    this.el.html('');
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
