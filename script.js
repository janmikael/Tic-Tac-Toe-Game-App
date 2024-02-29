// Initialize the Tic-Tac-Toe game variables
var origBoard; // Represents the initial state of the game board
const huPlayer = "O"; // Symbol for the human player
const aiPlayer = "X"; // Symbol for the AI player
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
]; // Possible winning combinations on the board

const cells = document.querySelectorAll(".cell"); // Get all cells on the board
startGame(); // Start the game

// Function to set up the game
function startGame() {
  document.querySelector(".endgame").style.display = "none"; // Hide the game over message

  origBoard = Array.from(Array(9).keys()); // Create an array representing the initial empty board
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = ""; // Clear text inside each cell
    cells[i].style.removeProperty("background-color"); // Reset cell background color
    cells[i].addEventListener("click", turnClick, false); // Add a click event listener to each cell
  }
}

// Event handler for a cell click
function turnClick(square) {
  if (typeof origBoard[square.target.id] == "number") {
    turn(square.target.id, huPlayer); // Handle human player's move
    if (!checkTie()) turn(bestSpot(), aiPlayer); // Check for a tie and then make AI move
  }
}

// Function to handle a player's move
function turn(squareId, player) {
  origBoard[squareId] = player; // Update the board with the player's move
  document.getElementById(squareId).innerText = player; // Update the visual display
  let gameWon = checkWin(origBoard, player); // Check if the player has won
  if (gameWon) gameOver(gameWon); // Handle game over if there's a winner
}

// Function to check if a player has won
function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []); // Get indices of the player's moves
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every((elem) => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player }; // Player has won
      break;
    }
  }
  return gameWon;
}

// Function to handle the end of the game
function gameOver(gameWon) {
  // Highlight the winning combination cells
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == huPlayer ? "blue" : "red";
  }
  // Remove click event listeners from cells
  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnClick, false);
  }
  // Declare the winner in the endgame message
  declareWinner(gameWon.player == huPlayer ? "You Win!" : "You lose.");
}

// Function to display the endgame message
function declareWinner(who) {
  document.querySelector(".endgame").style.display = "block"; // Show the endgame message
  document.querySelector(".endgame .text").innerText = who; // Display the winner or tie message
}

// Function to get empty squares on the board
function emptySquares() {
  return origBoard.filter((s) => typeof s == "number");
}

// Function to determine the AI's best move using minimax algorithm
function bestSpot() {
  return minimax(origBoard, aiPlayer).index;
}

// Function to check if the game is a tie
function checkTie() {
  if (emptySquares().length == 0) {
    // Game is a tie
    for (var i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "green"; // Highlight cells in green
      cells[i].removeEventListener("click", turnClick, false); // Remove click event listeners
    }
    // Declare tie in the endgame message
    declareWinner("Tie Game!");
    return true;
  }
  return false;
}

// Minimax algorithm for AI decision-making
function minimax(newBoard, player) {
  var availSpots = emptySquares(newBoard);

  if (checkWin(newBoard, player)) {
    return { score: -10 }; // If AI wins, return a score of -10
  } else if (checkWin(newBoard, aiPlayer)) {
    return { score: 20 }; // If human wins, return a score of 20
  } else if (availSpots.length === 0) {
    return { score: 0 }; // If it's a tie, return a score of 0
  }

  var moves = [];
  for (var i = 0; i < availSpots.length; i++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player == aiPlayer) {
      var result = minimax(newBoard, huPlayer);
      move.score = result.score;
    } else {
      var result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }
    newBoard[availSpots[i]] = move.index;

    moves.push(move);
  }

  var bestMove;
  if (player === aiPlayer) {
    // If it's the AI's turn, find the move with the highest score
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    // If it's the human's turn, find the move with the lowest score
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove]; // Return the best move
}
