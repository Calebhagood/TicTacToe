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
    return;
  }

  // change the current player
  if (data.gameChoice === 0) {
    changePlayer(data);
  } else if (data.gameChoice === 1) {
    easyAiMove(data);
    data.currentPlayer = "X";
    //easy AI
  } else if (data.gameChoice === 2) {
    //hard AI with minimax
    changePlayer(data);
    ImpossibleAiMove(data);
    if (endConditions(data)) {
      return;
    }
    changePlayer(data);
    console.log(data);
  }
};

const endConditions = (data) => {
  if (checkWinner(data, data.currentPlayer)) {
    //adjust DOM to reflect win
    adjustDom(
      "displayTurn",
      data.currentPlayer === "X"
        ? "Player 1 has won the game"
        : "Player 2 has won the game"
    );
    return true;
  } else if (data.round === 9) {
    //adjust DOM to reflect tie
    adjustDom("displayTurn", "It's a Tie!");
    data.gameOver = true;
    return true;
  } else {
    return false;
  }
};

const checkWinner = (data, player) => {
  let result = false;
  winningConditions.forEach((condition) => {
    if (
      data.gameBoard[condition[0]] === player &&
      data.gameBoard[condition[1]] === player &&
      data.gameBoard[condition[2]] === player
    ) {
      result = true;
    }
  });
  return result;
};

const adjustDom = (className, textContent) => {
  const elem = document.querySelector(`.${className}`);
  elem.textContent = textContent;
};

const changePlayer = (data) => {
  data.currentPlayer = data.currentPlayer === "X" ? "O" : "X";
  let turnText = data.currentPlayer === "X" ? "Player 1" : "Player 2";
  adjustDom("displayTurn", `${turnText}'s turn`);
};

const easyAiMove = (data) => {
  changePlayer(data);
  data.round++;
  let availableSpaces = data.gameBoard.filter(
    (space) => space !== "X" && space !== "O"
  );
  let move =
    availableSpaces[Math.floor(Math.random() * availableSpaces.length)];
  setTimeout(() => {
    data.gameBoard[move] = data.player2;
    let box = document.getElementById(`${move}`);
    box.textContent = data.player2;
    box.classList.add("player2");
    if (endConditions(data)) {
      return;
    }
    changePlayer(data);
  });
};

const ImpossibleAiMove = (data) => {
  data.round++;
  //get best move from minimax
  const move = minimax(data, "O").index;
  data.gameBoard[move] = data.player2;
  let box = document.getElementById(`${move}`);
  box.textContent = data.player2;
  box.classList.add("player2");

  console.log(move);
};

const minimax = (data, player) => {
  let availableSpaces = data.gameBoard.filter(
    (space) => space !== "X" && space !== "O"
  );
  if (checkWinner(data, data.player1)) {
    return {
      score: -100,
    };
  } else if (checkWinner(data, data.player2)) {
    return {
      score: 100,
    };
  } else if (availableSpaces.length === 0) {
    return {
      score: 0,
    };
  }
  const potentialMoves = [];
  //loop over all spaces to get a list of potential moves and check for win
  for (let i = 0; i < availableSpaces.length; i++) {
    let move = {};
    move.index = data.gameBoard[availableSpaces[i]];
    data.gameBoard[availableSpaces[i]] = player;
    if (player === data.player2) {
      move.score = minimax(data, data.player1).score;
    } else {
      move.score = minimax(data, data.player2).score;
    }
    //set the move
    data.gameBoard[availableSpaces[i]] = move.index;
    //push the move to potential moves array
    potentialMoves.push(move);
  }

  let bestMove = 0;
  if (player === data.player2) {
    let bestScore = -10000;
    for (let i = 0; i < potentialMoves.length; i++) {
      if (potentialMoves[i].score > bestScore) {
        bestScore = potentialMoves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = 10000;
    for (let i = 0; i < potentialMoves.length; i++) {
      if (potentialMoves[i].score < bestScore) {
        bestScore = potentialMoves[i].score;
        bestMove = i;
      }
    }
  }
  return potentialMoves[bestMove];
};
