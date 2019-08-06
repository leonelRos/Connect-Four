/*----- constants -----*/
const COLORS = {
    '0': 'white',
    '1': 'purple',
    '-1': 'lime'
  };
  
  /*----- app's state (variables) -----*/ 
  let board, turn, winner;
  
  /*----- cached element references -----*/
  const msgEl = document.getElementById('msg');
  
  /*----- event listeners -----*/ 
  document.querySelector('section.markers')
    .addEventListener('click', handleClick);
  
  /*----- functions -----*/
  init();
  
  function init() {
    board = [
      [0, 0, 0, 0, 0, 0],   // column 1 (index 0)
      [0, 0, 0, 0, 0, 0],   // column 2 (index 1)
      [0, 0, 0, 0, 0, 0],   // column 3 (index 2)
      [0, 0, 0, 0, 0, 0],   // column 4 (index 3)
      [0, 0, 0, 0, 0, 0],   // column 5 (index 4)
      [0, 0, 0, 0, 0, 0],   // column 6 (index 5)
      [0, 0, 0, 0, 0, 0],   // column 7 (index 6)
    ];
    turn = 1;
    winner = null;  // 1, -1, null (no winner), 'T' (tie)
    render();
  }
  
  function render() {
    // Render the board
    board.forEach(function(colArr, colIdx) {
      // hide/show the column's marker depending if there are 0's or not
      let marker = document.getElementById(`col${colIdx}`);
      // <conditional exp> ? <truthy thing to return> : <falsey thing to return>;
      // This is a ternary expression that replaces the if/else below it.
      marker.style.visibility = colArr.indexOf(0) === -1 ? 'hidden' : 'visible';
      // if (colArr.indexOf(0) === -1) {
      //   marker.style.visibility = 'hidden';
      // } else {
      //   marker.style.visibility = 'visible';
      // }
      colArr.forEach(function(cell, rowIdx) {
        let div = document.getElementById(`c${colIdx}r${rowIdx}`);
        div.style.backgroundColor = COLORS[cell];
      });
    });
    // Render the message
    if (winner) {
      if (winner === 'T') {
        msgEl.textContent = "It's a Tie!";
      } else {
        msgEl.innerHTML = `<span style="color:${COLORS[winner]}">${COLORS[winner].toUpperCase()}</span> Wins!`;
      }
    } else {
      msgEl.innerHTML = `<span style="color:${COLORS[turn]}">${COLORS[turn].toUpperCase()}</span>'s Turn`;
    }
  }
  
  function handleClick(evt) {
    // get index of column's marker clicked
    let idx = parseInt(evt.target.id.replace('col', ''));
    // make sure the MARKER was clicked
    if (isNaN(idx) || winner) return;
    // obtain the actual column array in board array
    let colArr = board[idx];
    // get the index of the first 0 in the col array
    let rowIdx = colArr.indexOf(0);
    // if the col is full, there are no zeroes, therefore
    // indexOf returns -1.
    // Do nothing if no zeroes available (col full)
    if (rowIdx === -1) return;
    // update the col array (within the board) with
    // the player whose turn it is
    colArr[rowIdx] = turn;
    // flip turns from 1 to -1; -1 to 1
    turn *= -1;
    // update the winner
    winner = getWinner();
    render();
  }
  
  function getWinner() {
    // return the winner, 'T' or null
    let winner = null;
    // using a for loop because we want to stop looping if we find a winner
    for (let colIdx = 0; colIdx < board.length; colIdx++) {
      // check if any cells in the col lead to a winner
      winner = checkCol(colIdx);
      // done if winner is found, no reason to keep looking
      if (winner) break;
    }
    return winner;
  }
  
  function checkCol(colIdx) {
    let winner = null;
    for (let rowIdx = 0; rowIdx < board[colIdx].length; rowIdx++) {
      // using the logical OR operator (||) prevents the checks to the right 
      // from ever running if a winner is found.  For example, if checkUp returns
      // a truthy value, checkRight and the checkDiag will never be called
      winner = checkUp(colIdx, rowIdx) || checkRight(colIdx, rowIdx) || checkDiag(colIdx, rowIdx, 1) || checkDiag(colIdx, rowIdx, -1);
      if (winner) break;
    }
    return winner;
  }
  
  function checkUp(colIdx, rowIdx) {
    // boundary check (can't check up if rowIdx is greater than 2)
    if (rowIdx > 2) return null;
    const colArr = board[colIdx];
    // ternary expression deluxe!
    return ( Math.abs(colArr[rowIdx] + colArr[rowIdx + 1] + colArr[rowIdx + 2] + colArr[rowIdx + 3]) === 4 ) ? colArr[rowIdx] : null;
  }
  
  function checkRight(colIdx, rowIdx) {
    if (colIdx > 3) return null;
    return ( Math.abs(board[colIdx][rowIdx] + board[colIdx + 1][rowIdx] + board[colIdx + 2][rowIdx] + board[colIdx + 3][rowIdx]) === 4 ) ? board[colIdx][rowIdx] : null;
  }
  
  // Notice the extra vertOffset parameter for determining whether checking up or down vertically
  function checkDiag(colIdx, rowIdx, vertOffset) {
    // lot's of boundaries to check
    if (colIdx > 3 || (vertOffset > 0 && rowIdx > 2) || (vertOffset < 0 && rowIdx < 3)) return null;
    return ( Math.abs(board[colIdx][rowIdx] + board[colIdx + 1][rowIdx + vertOffset] + board[colIdx + 2][rowIdx + (vertOffset * 2)] + board[colIdx + 3][rowIdx + (vertOffset * 3)]) === 4 ) ? board[colIdx][rowIdx] : null;
  }