let userScoreUpdate = 0;
let compScoreUpdate = 0;

// take user choice
const choices = document.querySelectorAll(".choice");
choices.forEach((choice) => {
  choice.addEventListener("click", () => {
    const userChoice = choice.getAttribute("id");
    playGame(userChoice);
  });
});

// generate computer choice
const genCompChoice = () => {
  const options = ["rock", "paper", "scissors"];
  const randIdx = Math.floor(Math.random() * 3);
  return options[randIdx];
};

// play game
const playGame = (userChoice) => {
  //Generate computer choice
  const compChoice = genCompChoice();

  if (userChoice === compChoice) {
    //Draw Game
    drawGame();
  } 
  else {
    let userWin = true;
    if (userChoice === "rock") {
      //scissors, paper
      userWin = compChoice === "paper" ? false : true;
    } else if (userChoice === "paper") {
      //rock, scissors
      userWin = compChoice === "scissors" ? false : true;
    } else {
      //rock, paper
      userWin = compChoice === "rock" ? false : true;
    }
    showWinner(userWin, userChoice, compChoice);
  }
};

// game drow fun
const msg = document.querySelector("#msg");

const drawGame = () => {
  msg.innerText = "Game was Draw. Play again.";
  msg.style.backgroundColor = "#081b31";
};

// winner show fun
const userScore = document.querySelector("#user-score");
const compScore = document.querySelector("#comp-score");

const showWinner = (userWin, userChoice, compChoice) => {
  if (userWin) {
    userScoreUpdate++;
    userScore.innerText = userScoreUpdate;
    msg.innerText = `You win! Your ${userChoice} beats ${compChoice}`;
    msg.style.backgroundColor = "green";
  } else {
    compScoreUpdate++;
    compScore.innerText = compScoreUpdate;
    msg.innerText = `You lost. ${compChoice} beats your ${userChoice}`;
    msg.style.backgroundColor = "red";
  }
};

// Restart Game
const restartButton = document.querySelector("#restart");

restartButton.addEventListener("click", () => {

    userScoreUpdate = 0;
    compScoreUpdate = 0;

    userScore.innerText = 0;
    compScore.innerText = 0;

    msg.innerText = "Play your move";
    msg.style.backgroundColor = "#081b31";

});