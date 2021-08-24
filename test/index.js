const {Connect4AI: C4} = require("../src/index.js");
const partida = new C4({lengthArr: 6, columns: 7, necessaryToWin: 5});
partida.createBoard();

partida.play(1);
partida.play(2);
partida.play(1);
partida.play(2);
partida.play(1);
partida.play(2);
partida.play(1);
partida.play(2);
partida.play(1);

console.log(partida);