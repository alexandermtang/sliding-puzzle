class Board {

  constructor (size = 16) {
    this.rowSize = Math.sqrt(size);
    this.size = size;
    this.board = this._generateBoard(size);
    this.isDirty = true;
  }

  _generateBoard () {
    let { size, rowSize } = this;

    let blocks = Array.from({length: size}).map((n, i) => i)
      .map(n => new Block(n));

    let board = blocks.slice(1);
    board.unshift(new Block());
    board.sort(() => 0.5 - Math.random()); // shuffle board

    let _board = Array.from({length: rowSize}).map(e => []);
    board.forEach((block, i) => {
      const x = i % rowSize;
      const y = Math.floor(i / rowSize);
      block.setPosition(x, y);

      if (block.num === null) this.emptyBlock = block;
      _board[y].push(block);
    });

    return _board;
  }

  _handleClick (block) {
    const { emptyBlock } = this;
    console.log('clicked', block, emptyBlock);

    if (block.isNeighborOf(emptyBlock)) {
      const { x, y } = block;

      this.board[y][x] = emptyBlock;
      this.board[emptyBlock.y][emptyBlock.x] = block;
      block.setPosition(emptyBlock.x, emptyBlock.y);
      emptyBlock.setPosition(x, y);

      console.log('redraw!', this.board);
      this.isDirty = true;
    }
  }

  render () {
    let d = document.createElement('div');
    let len = this.rowSize * 150;
    d.style.height = d.style.width = `${len}px`;
    d.setAttribute('class', 'board');

    this.board
      .reduce((a, b) => a.concat(b))
      .forEach(block => {
        let b = block.render();
        b.addEventListener('click', () => this._handleClick(block));
        d.appendChild(b);
      });

    return d;
  }
}

class Block {

  constructor (num = null) {
    this.num = num;
  }

  setPosition (x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  isAbove (block) {
    const { x, y } = block;
    return this.x === x && this.y === y + 1;
  }

  isBelow (block) {
    const { x, y } = block;
    return this.x === x && this.y === y - 1;
  }

  isLeftOf (block) {
    const { x, y } = block;
    return this.x === x + 1 && this.y === y;
  }

  isRightOf (block) {
    const { x, y } = block;
    return this.x === x - 1 && this.y === y;
  }

  isNeighborOf (block) {
    return this.isAbove(block) || this.isBelow(block)
        || this.isLeftOf(block) || this.isRightOf(block);
  }

  render () {
    let d = document.createElement('div');
    d.textContent = this.num;
    d.style.height = d.style.width = '148px';
    d.setAttribute('class', this.num === null ? 'empty-block' : 'block');

    return d;
  }
}

var board = new Board();
const game = document.getElementById('game');
setInterval(() => {
  if (board.isDirty) {
    while (game.hasChildNodes()) {
      game.removeChild(game.lastChild);
    }
    game.appendChild(board.render());
    board.isDirty = false;
  }
}, 100);

// var d = new Block();
// var d1 = new Block(1);
// document.getElementById('game').appendChild(d.render());
// document.getElementById('game').appendChild(d1.render());
