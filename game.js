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
    board.push(new Block());
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
    const { x, y } = block;
    const xE = emptyBlock.x, yE = emptyBlock.y;
    // console.log('clicked', block, emptyBlock);

    if (block.isNeighborOf(emptyBlock)) {
      this.board[y][x] = emptyBlock.setPosition(x, y);
      this.board[yE][xE] = block.setPosition(xE, yE);

      this.isDirty = true;
    } else if (block.isSameRow(emptyBlock)) {
      console.log('same row!', emptyBlock, block);
      // this.board[y][x] = emptyBlock;


      this.isDirty = true;
    } else if (block.isSameColumn(emptyBlock)) {
      console.log('same col!', block);
      // this.board[y][x] = emptyBlock;

      this.isDirty = true;
    }
  }

  checkWin () {
    return this.board
             .reduce((a, b) => a.concat(b))
             .every((b, i) => b.num === i + 1 || b.num === null);
  }

  render () {
    let d = document.createElement('div');
    let len = this.rowSize * 150;
    d.style.height = d.style.width = `${len}px`;
    d.setAttribute('class', 'board');
    let e = null;

    this.board
      .reduce((a, b) => a.concat(b))
      .forEach(block => {
        let b = block.render();
        if (block.num === null) e = b;
        b.addEventListener('click', () => this._handleClick(block));
        d.appendChild(b);
      });

    if (this.checkWin()) {
      e.textContent = 'You win!';
    }

    return d;
  }
}

class Block {

  constructor (num = null, x = 0, y = 0) {
    this.num = num;
    this.x = x;
    this.y = y;
  }

  setPosition (x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  isAbove ({x, y}) {
    return this.x === x && this.y === y + 1;
  }

  isBelow ({x, y}) {
    return this.x === x && this.y === y - 1;
  }

  isLeftOf ({x, y}) {
    return this.x === x + 1 && this.y === y;
  }

  isRightOf ({x, y}) {
    return this.x === x - 1 && this.y === y;
  }

  isNeighborOf (block) {
    return this.isAbove(block) || this.isBelow(block)
        || this.isLeftOf(block) || this.isRightOf(block);
  }

  isSameRow ({y}) {
    return this.y === y;
  }

  isSameColumn ({x}) {
    return this.x === x;
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
