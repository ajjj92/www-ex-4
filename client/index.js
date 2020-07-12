// @AtteJantunen

// document.getElementById("app").innerHTML = `
// <h1>Hello Vanilla!</h1>
// <div>
//   We use the same configuration as Parcel to bundle this sandbox, you can find more
//   info about Parcel
//   <a href="https://parceljs.org" target="_blank" rel="noopener noreferrer">here</a>.
// </div>
// `;

function setActivePlayer() {
  let activePlayer = document.getElementById("activeplayer");
  if (activePlayer.innerHTML === "X") {
    activePlayer.innerHTML = "O";
  } else {
    activePlayer.innerHTML = "X";
  }
}

function cellClick(cellClickEvent) {
  let activePlayer = document.getElementById("activeplayer");
  const clickedCell = cellClickEvent.target;
  const rowIndex = clickedCell.id;
  const colIndex = clickedCell.parentElement.id;
  if (clickedCell.innerHTML === "") {
    sendBoardState(colIndex, rowIndex);
    clickedCell.innerHTML = activePlayer.innerHTML;
    setActivePlayer();
  }
}
window.addEventListener("DOMContentLoaded", event => {
  let table = document.getElementById("board");
  table.addEventListener("click", cellClick);
});

function solveWinner(winner) {
  if (winner === 1) {
    alert("Player 1 won!");
  } else if (winner === 2) {
    alert("Player 2 won!");
  }
}
function getWinState() {
  fetch("/getWinner")
    .then(response => response.json())
    .then(data => solveWinner(data.winner));
}

function sendBoardState(colIndex, rowIndex) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ col: colIndex, row: rowIndex })
  };
  fetch("setBoard", requestOptions).then(getWinState());
}
