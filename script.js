const form = document.querySelector("#gameForm");
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

//function that starts the game
const initializeGame = (data) => {
  initializeVariables(data);
  console.log(data);
};
