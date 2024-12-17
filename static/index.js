const welcomeScreen = document.getElementById("welcome");
const nameScreen = document.getElementById("name-page");
const gameScreen = document.getElementById("game-page");
const gameTitle = document.getElementById("game-title");
const gridContainer = document.getElementById("grid-container");
const wordInput = document.getElementById("word-input");
const submitBtn = document.getElementById("submit-btn");
const message = document.getElementById("message");
const answerContainer = document.getElementById("answer-container"); 
let playerName = "";
let row = 0;

function navigateTo(screenId) {
  document.querySelectorAll(".container").forEach((el) => {
    el.classList.remove("active");
  });
  document.getElementById(screenId).classList.add("active");
}

function startGame() {
  playerName = document.getElementById("player-name").value.trim();
  if (playerName === "") {
    alert("Please enter your name!");
    return;
  }
  gameTitle.textContent = `Welcome, ${playerName}!`;
  navigateTo("game-page");
}

function createGrid() {
  gridContainer.innerHTML = "";
  for (let i = 0; i < 30; i++) {
    const tile = document.createElement("div");
    tile.className = "tile";
    gridContainer.appendChild(tile);
  }
}

async function checkWord(word) {
  try {
    const response = await fetch("/check_word", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ word }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      message.textContent = errorData.error || "Error checking word.";
      return { feedback: [], win: false, secret_word: "" }; 
    }

    const data = await response.json();
    console.log(data);  
    return data; 
  } catch (error) {
    console.error("Error:", error);
    message.textContent = "Something went wrong. Please try again.";
    return { feedback: [], win: false, secret_word: "" }; 
  }
}

async function handleSubmit() {
  const word = wordInput.value.trim();
  if (word.length !== 5) {
    message.textContent = "Word must be 5 letters long.";
    return;
  }

  const feedback = await checkWord(word);

  if (feedback.error) {
    message.textContent = feedback.error;
    return;
  }

  message.textContent = "";
  const tiles = gridContainer.children;

  for (let i = 0; i < 5; i++) {
    const tile = tiles[row * 5 + i];
    tile.textContent = word[i];
    tile.classList.add(feedback.feedback[i]);
  }

  if (feedback.win) {
    message.textContent = "Congratulations! You guessed the word!";
    submitBtn.disabled = true;
    wordInput.disabled = true;
  } else {
    row++;
    if (row === 6) {
      message.textContent = `Game over! The correct word was: ${
        feedback.secret_word || "Unknown"
      }`;
      answerContainer.textContent = `The correct word was: ${
        feedback.secret_word || "Unknown"
      }`;
      submitBtn.disabled = true;
      wordInput.disabled = true;
    }
  }

  wordInput.value = "";
}

submitBtn.addEventListener("click", handleSubmit);

createGrid();
