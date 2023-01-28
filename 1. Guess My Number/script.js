"use strict";

// ELEMENT SELECTION
const guess = document.querySelector(".guess");
const score = document.querySelector(".score");
const highscore = document.querySelector(".highscore");
const guessingText = document.querySelector(".guessing-text");
const questionMark = document.querySelector(".questionMark");
const btnCheck = document.querySelector(".btn--check");
const btnAgain = document.querySelector(".btn--again");

// GlOBALS
let currentScore = 20;
let highScore = 0;

// FUNCTIONS
const generateRandomNumber = () => {
  return Math.trunc(Math.random() * 20 + 1);
};

const compareGuess = (randomNumber, guess) => {
  if (guess > 0 && typeof guess !== "string" && guess < 21) {
    if (randomNumber !== guess) {
      score.textContent = --currentScore;

      if (currentScore !== 0) {
        console.log(randomNumber, guess);
        return guess > randomNumber
          ? (guessingText.textContent = "📈 Too high!")
          : (guessingText.textContent = "📉 Too low!");
      }

      document.body.classList.add("lost");
      return (guessingText.textContent = "💥 You lost the game!");
    }

    questionMark.textContent = guess;
    if (currentScore > highScore)
      highscore.textContent = highScore = currentScore;

    document.body.classList.add("won");
    return (guessingText.textContent = "🎉 Correct Number!");
  }
  return (guessingText.textContent = "⛔️ Inputs must be numbers from 1-20!");
};

const resetGame = () => {
  randomNumber = generateRandomNumber();
  document.body.classList.remove("won");
  document.body.classList.remove("lost");
  score.textContent = currentScore = 20;
  guessingText.textContent = "Start guessing...";
  guess.value = "";
  questionMark.textContent = "?";
};

// EVENT HANDLERS

let randomNumber = generateRandomNumber();

btnCheck.addEventListener("click", function () {
  compareGuess(randomNumber, Number(guess.value));
});

btnAgain.addEventListener("click", resetGame);
