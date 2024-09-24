const boxes = document.querySelectorAll(".box");
const restartButton = document.getElementById("restartButton");

const GameScript = function() {
  const message = document.getElementById("message");
  let currentPlayer = "X";
  let gameOn = true;
  
  const win = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  
  let container = ["", "", "", "", "", "", "", "", ""];
  
  const player1 = localStorage.getItem('player1') || "Player 1";
  const player2 = localStorage.getItem('player2') || "Player 2";
  
  const urlParams = new URLSearchParams(window.location.search);
  let gameId = urlParams.get('id');
  
  console.log("Current players:", player1, player2);
  console.log("Game id", gameId);
  
  const loadGame = (id) => {
    const gameResults = JSON.parse(localStorage.getItem('gameResults')) || [];
    const gameData = gameResults.find(game => game.id == id);
  
    if (gameData) {
      container = gameData.container || ["", "", "", "", "", "", "", "", ""];
      currentPlayer = gameData.currentPlayer || "X";
      gameOn = gameData.gameOn !== undefined ? gameData.gameOn : true;
  
      container.forEach((value, index) => {
        if (value) {
          boxes[index].textContent = value;
        }
      });
  
      if (!gameOn) {
        message.textContent = `Game Over: ${gameData.winName}`;
      } else {
        message.textContent = `Now ${currentPlayer === "X" ? gameData.player1 : gameData.player2} turn`;
      }
    } else {
      console.error(`Game with ID ${id} not found.`);
    }
  };
  
  const createNewGame = () => {
    const gameResults = JSON.parse(localStorage.getItem('gameResults')) || [];
    const newId = gameResults.length + 1;
    const gameData = {
      id: newId,
      player1: player1,
      player2: player2,
      container: container,
      currentPlayer: currentPlayer,
      gameOn: gameOn,
      winName: "Incomplete"
    };
    gameResults.push(gameData);
    localStorage.setItem('gameResults', JSON.stringify(gameResults));
    window.history.replaceState({}, '', `?id=${newId}`);
    gameId = newId;
    return newId;
  };
  

  
  const winFunction = () => {
    for (let i = 0; i < win.length; i++) {
      console.log(win[i])
      const [a, b, c] = win[i];
      if (container[a] && container[a] === container[b] && container[a] === container[c]) {
        boxes[a].style.backgroundColor = "green";
        boxes[b].style.backgroundColor = "green";
        boxes[c].style.backgroundColor = "green";
        gameOn = false;
        message.textContent = `${currentPlayer === "X" ? player1 : player2} Wins!`;
        saveGameResult(currentPlayer === "X" ? player1 : player2);
        return true;
      }
    }
    return false;
  };
  
  const checkTie = () => {
    if (container.every(box => box !== '')) {
      message.textContent = `Match Tie!`;
      gameOn = false;
      saveGameResult("Tie");
    }
  };
  
  const boxFunction = (e) => {
    const box = Array.from(boxes);
    const boxIndex = box.indexOf(e.target);
  
    if (gameOn === false || container[boxIndex] !== "") return;
  
    container[boxIndex] = currentPlayer;
    e.target.textContent = currentPlayer;
  
    if (!winFunction()) {
      checkTie();
    }
  
    if (gameOn) {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      message.textContent = `Now ${currentPlayer === "X" ? player1 : player2} turn`;
    }
  
    saveIncompleteGame();
  };
  
  const restartFunction = () => {
    container = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameOn = true;
    boxes.forEach((box) => {
      box.textContent = "";
      box.style.backgroundColor = "#252525";
    });
    message.textContent = `Now ${currentPlayer === "X" ? player1 : player2} turn`;
    createNewGame();
  };
  
  
  const saveGameResult = (winner) => {
    const gameResults = JSON.parse(localStorage.getItem('gameResults')) || [];
    console.log(gameResults)
    const gameData = gameResults.find(game => game.id == gameId);
    console.log(gameData)
    if (gameData) {
      gameData.container = container;
      gameData.currentPlayer = currentPlayer;
      gameData.gameOn = gameOn;
      gameData.winName = winner;
      localStorage.setItem('gameResults', JSON.stringify(gameResults));
      setTimeout(() => {
        window.location.href = 'results.html';
      }, 1000);
    }
  };
  
  const saveIncompleteGame = () => {
    const gameResults = JSON.parse(localStorage.getItem('gameResults')) || [];
    const gameData = gameResults.find(game => game.id == gameId);
    if (gameData) {
      gameData.container = container;
      gameData.currentPlayer = currentPlayer;
      gameData.gameOn = gameOn;
      if (gameOn) {
        gameData.winName = "Incomplete"; 
      }
      localStorage.setItem('gameResults', JSON.stringify(gameResults));
    }
  };

  return {
    restartFunction, boxFunction, loadGame, createNewGame
  }

}()

if (gameId) {
  GameScript.loadGame(gameId);
} else {
  GameScript.createNewGame();
}

boxes.forEach((box) => {
  box.addEventListener("click", GameScript.boxFunction());
});

restartButton.addEventListener("click", GameScript.restartFunction());

