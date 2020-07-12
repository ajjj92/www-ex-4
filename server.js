const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var path = require("path");
const db = require("./database");
const dbController = new db();

// view engine setup  - default
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let currentSize = 5;
let winner = false;
let activePlayer = "X";
let moves = 0;
let winState = false;
let boardState = [];

function resetBoard() {
  winner = false;
  moves = 0;
  winState = false;
  activePlayer = "X";
  boardState = [
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""]
  ];
}

function neighborAlgo(rowIndex, colIndex) {
  // boardState[rowIndex][colIndex] = activePlayer;
  winRow(rowIndex, colIndex);
  winCol(rowIndex, colIndex);
  winDiags(rowIndex, colIndex);
  if (winner === true) {
    if (activePlayer === "X") {
      winState = 1;
    } else {
      winState = 2;
    }

    winner = false;
  } else {
    moves++;
    if (moves < Math.pow(currentSize, 2)) {
      setActivePlayer();
    } else {
      winner = false;
    }
  }
}

function winDiags(rowIndex, colIndex) {
  // diagonal search
  let xDiagWin = 0;
  let yDiagWin = 0;
  let xDiag2Win = 0;
  let yDiag2Win = 0;
  let xDiag3Win = 0;
  let yDiag3Win = 0;
  let xDiag4Win = 0;
  let yDiag4Win = 0;
  let m = colIndex;
  let n = rowIndex;
  let p = colIndex;
  let c = rowIndex;

  for (let range = 0; range < 5; range++) {
    // UpRightDiag
    if (c >= 0 && m < currentSize) {
      if (boardState[c][m] === "X") {
        yDiag3Win = 0;
        xDiag3Win++;
      } else if (boardState[c][m] === "O") {
        xDiag3Win = 0;
        yDiag3Win++;
      } else {
        xDiag3Win = 0;
        yDiag3Win = 0;
      }
    }
    // DownLeftDiag
    if (n < currentSize && p >= 0) {
      if (boardState[n][p] === "X") {
        yDiag4Win = 0;
        xDiag4Win++;
      } else if (boardState[n][p] === "O") {
        xDiag4Win = 0;
        yDiag4Win++;
      } else {
        xDiag4Win = 0;
        yDiag4Win = 0;
      }
    }
    // UpLeftDiag
    if (c >= 0 && p >= 0) {
      if (boardState[c][p] === "X") {
        yDiag2Win = 0;
        xDiag2Win++;
      } else if (boardState[c][p] === "O") {
        xDiag2Win = 0;
        yDiag2Win++;
      } else {
        xDiag2Win = 0;
        yDiag2Win = 0;
      }
    }
    // DownRightDiag
    if (m < currentSize && n < currentSize) {
      if (boardState[n][m] === "X") {
        yDiagWin = 0;
        xDiagWin++;
      } else if (boardState[n][m] === "O") {
        xDiagWin = 0;
        yDiagWin++;
      } else {
        xDiagWin = 0;
        yDiagWin = 0;
      }
    }
    // Check for win condition
    if (xDiagWin + xDiag2Win > 5) {
      winner = true;
      break;
    } else if (yDiagWin + yDiag2Win > 5) {
      winner = true;
      break;
    }

    if (xDiag3Win + xDiag4Win > 5) {
      winner = true;
      break;
    } else if (yDiag3Win + yDiag4Win > 5) {
      winner = true;
      break;
    }
    m++;
    n++;
    p--;
    c--;
  }
}

function matrixColumn(matrix, n) {
  return matrix.map(x => x[n]);
}

function winCol(colIndex, rowIndex) {
  let xColWin = 0;
  let yColWin = 0;
  let scoreArray = [];
  let startIndex = rowIndex - 4;
  let endIndex = rowIndex + 4;

  if (startIndex < 0) {
    startIndex = 0;
  }
  if (endIndex > currentSize) {
    endIndex = currentSize;
  }
  scoreArray = matrixColumn(
    boardState.slice(startIndex, endIndex + 1),
    colIndex
  );
  const range = scoreArray.length;

  for (let j = startIndex; j <= range; j++) {
    // check col, reset Y if X found
    if (scoreArray[j] === "X") {
      yColWin = 0;
      xColWin++;
    } else if (scoreArray[j] === "O") {
      xColWin = 0;
      yColWin++;
    } else {
      xColWin = 0;
      yColWin = 0;
    }

    if (xColWin >= 5) {
      scoreArray = [];
      winner = true;
      break;
    } else if (yColWin >= 5) {
      scoreArray = [];
      winner = true;
      break;
    }
  }
}

function winRow(colIndex, rowIndex) {
  let xRowWin = 0;
  let yRowWin = 0;
  let scoreArray = [];
  let startIndex = colIndex - 4;
  let endIndex = colIndex + 4;

  if (startIndex < 0) {
    startIndex = 0;
  }

  if (endIndex > currentSize) {
    endIndex = currentSize;
  }
  scoreArray = boardState[rowIndex].slice(startIndex, endIndex + 1);
  const range = scoreArray.length;

  for (let i = startIndex; i <= range; i++) {
    // check row, reset X if Y found
    if (scoreArray[i] === "X") {
      yRowWin = 0;
      xRowWin++;
    } else if (scoreArray[i] === "O") {
      xRowWin = 0;
      yRowWin++;
      // If empty cell between reset both
    } else {
      xRowWin = 0;
      yRowWin = 0;
    }

    if (xRowWin >= 5) {
      scoreArray = [];
      winner = true;
      break;
    } else if (yRowWin >= 5) {
      scoreArray = [];
      winner = true;
      break;
    }
  }
}
function setActivePlayer() {
  if (activePlayer === "X") {
    activePlayer = "O";
  } else {
    activePlayer = "X";
  }
}
function processMove(rowIndex, colIndex) {
  boardState[colIndex][rowIndex] = activePlayer;
  neighborAlgo(rowIndex, colIndex);
}

app.use(express.static(__dirname + "/client"));

app.get("/", (req, res) => {
  dbController.queryDb().then(function(result) {
    res.render("index", {
      title: "Tic-Tac-Toe",
      player: result.activeUser,
      board: result.boardState
    });
  });

  // //res.sendFile('index.html');
  // res.render("index", {
  //   title: "Tic-Tac-Toe",
  //   player: activePlayer,
  //   board: boardState,
  // });
});

app.get("/data", (req, res) => {
  dbController.queryDb().then(result => console.log(result));
});

app.get("/reset", (req, res) => {
  resetBoard();
  let update = {
    $set: {
      identifier: "GameStatus",
      activeUser: activePlayer,
      boardState: boardState
    }
  };
  let query = { identifier: "GameStatus" };
  dbController.updateDb(query, update);
  dbController.queryDb().then(function(result) {
    res.render("index", {
      title: "Tic-Tac-Toe",
      player: result.activeUser,
      board: result.boardState
    });
  });
});

app.get("/getWinner", (req, res) => {
  res.json({ winner: winState });
});

app.post("/setBoard", (req, res) => {
  if (req.body) {
    processMove(req.body.row, req.body.col);
    let update = {
      $set: {
        identifier: "GameStatus",
        activeUser: activePlayer,
        boardState: boardState
      }
    };
    let query = { identifier: "GameStatus" };
    dbController.updateDb(query, update);
    res.render("index", {
      title: "Tic-Tac-Toe",
      player: "activePlayer",
      board: boardState
    });
  } else {
    res.sendStatus(400);
  }
});

app.listen(8080);
