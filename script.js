const form = document.querySelector("#gameForm");

//array of all of the winning conditions
const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
form.addEventListener("submit", (event) => {
  //keeps the page from refreshing when form is submitted
  event.preventDefault();

  //initializes the user form
  const formData = new FormData(form);
  //converts form data into an object
  const data = Object.fromEntries(formData);
  document.querySelector(".modalContainer").setAttribute("hidden", true);
  initializeGame(data);
});

//function that creates all of the game variables
const initializeVariables = (data) => {
  //converts game choice string into a number
  data.gameChoice = +data.gameChoice;
  data.gameBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  data.player1 = "X";
  data.player2 = "O";
  data.round = 0;
  data.currentPlayer = "X";
  data.gameOver = false;
};

//function that adds event listeners to game board
const addEventListenersToGameBoard = (data) => {
  document.querySelectorAll(".gameBox").forEach((box) => {
    box.addEventListener("click", (event) => {
      playMove(event.target, data);
    });
  });
};

//function that starts the game
const initializeGame = (data) => {
  initializeVariables(data);
  addEventListenersToGameBoard(data);
};

const playMove = (box, data) => {
  //checks if the game is over or if a game box is already in play. if so click won't do anything
  if (
    data.gameOver ||
    data.round > 8 ||
    data.gameBoard[box.id] === "X" ||
    data.gameBoard[box.id] === "O"
  ) {
    return;
  }
  //adjust the DOM then check for winner
  data.gameBoard[box.id] = data.currentPlayer;
  box.textContent = data.currentPlayer;

  //if ternary operation that sets the class of box to "gameBox player1" if the current player is X and "gameBox player2" if the current player is not X
  box.classList.add(data.currentPlayer === "X" ? "player1" : "player2");

  //increases the round number
  data.round++;

  //check end conditions
  if (endConditions(data)) {
    //adjust DOM
  }
  console.log(box, data);
};

const endConditions = (data) => {
  if (checkWinner(data)) {
    //adjust DOM to reflect win
    return true;
  } else if (data.round > 8) {
    //adjust DOM to reflect tie
    return true;
  } else {
    return false;
  }
};

const checkWinner = (data) => {
  let result = false;
  winningConditions.forEach((condition) => {
    if (
      data.gameBoard[condition[0]] === data.gameBoard[condition[1]] &&
      data.gameBoard[condition[1]] === data.gameBoard[condition[2]]
    ) {
      console.log("player has won");
      data.gameOver = true;
      result = true;
    }
  });
  return result;
};
