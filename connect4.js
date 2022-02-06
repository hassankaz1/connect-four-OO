class Game {
  constructor(p1, p2) {
    this.HEIGHT = 6;
    this.WIDTH = 7;
    this.p1 = p1;
    this.p2 = p2;
    this.currPlayer = p1;
    this.board = [];
    this.gameOver = false;

    this.makeBoard();
    this.makeHtmlBoard();

  }
  /** makeBoard: create in-JS board structure:
 *   board = array of rows, each row is array of cells  (board[y][x])
 */

  makeBoard() {
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }
  /** makeHtmlBoard: make HTML table and row of column tops. */
  makeHtmlBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick.bind(this));

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);
    //let WIDTH = this.WIDTH;

    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }
  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;
    //piece.classList.add(`p${this.currPlayer}`);
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }
  /** endGame: announce game end */

  endGame(msg) {
    alert(msg);
  }
  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    if (this.gameOver === true) return;

    // get x from ID of clicked cell
    const x = +evt.target.id;
    console.log(x);

    // get next spot in column (if none, ignore click)'
    let y = this.findSpotForCol(x);
    //console.log(y);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer.color} won!`);
    }

    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }

    // switch players
    this.currPlayer = this.currPlayer === this.p1 ? this.p2 : this.p1;
  }
  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    const _win = (cells) =>
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currPlayer
      )


    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          this.gameOver = true;
          return true;
        }
      }
    }
  }

}
//create Player class that takes in a string representing color
class Player {
  constructor(color) {
    this.color = color;
  }
}
//find the form from our document
const form = document.querySelector("form");


form.addEventListener("submit", function (e) {
  e.preventDefault();
  //get input values from form to get color 
  const p1Color = form.querySelector("#p1").value;
  const p2Color = form.querySelector("#p2").value;
  //create new players from the colors provided  by user
  const p1 = new Player(p1Color);
  const p2 = new Player(p2Color);
  //create a new Game with players
  new Game(p1, p2);

})










