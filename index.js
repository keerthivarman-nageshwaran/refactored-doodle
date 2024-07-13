import WebSocket from "ws";

const args = process.argv.slice(2);
const argument = args[0];
console.log("Argument from CLI:", argument);
const player = argument[0];

console.log("Bot started...");
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

const ws = new WebSocket(
  `https://api.splplatform.com/samplegame/v1/ws/${player}`
  // `http://localhost:5106/samplegame/v1/ws/${player}`
);

ws.on("error", console.error);

ws.on("open", function open() {
  //   ws.send("something");
});

ws.on("message", function message(data) {
  console.log("received: %s", data);
  let gameState = JSON.parse(data);
  if (gameState.hasOwnProperty("Board")) {
    let emptyCellIndex = getEmptyCellIndex(gameState);
    let move = JSON.stringify({
      CommandID: gameState.CommandID,
      Row: emptyCellIndex.row,
      Col: emptyCellIndex.col,
    });
    console.log("Sent: ", move);
    ws.send(move);
  }
  gameState = null;
});

function getEmptyCellIndex(gameState) {
  for (let row = 0; row < gameState.Board.length; row++) {
    const rowElement = gameState.Board[row];
    for (let col = 0; col < rowElement.length; col++) {
      const element = rowElement[col];
      if (element === 0) {
        return { row, col };
      }
    }
  }
}
