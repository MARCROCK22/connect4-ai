const { Connect4AI: C4 } = require("../src/index.js");
const partida = new C4({ lengthArr: 6, columns: 7, necessaryToWin: 3 });
partida.createBoard();

partida.play(0);//Player
partida.play(1);
partida.play(0);//Player
partida.play(1);
partida.play(1);//Player
partida.play(1);
partida.play(2);//Player
partida.play(2);
partida.play(2);//Player
partida.play(2);
partida.play(0);
console.log(partida);