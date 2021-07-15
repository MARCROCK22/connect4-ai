const AI = require("./uwu.js").Connect4AI;
const Connect4 = require("./normal.js");
class Connect4AI extends Connect4 {
	playAI(difficulty = "medium") {
		const board = new AI();
		for (let i of this.plays) {
			board.play(i);
		}
		const aiPlay = board.playAI(difficulty);
		this.play(aiPlay);
		return aiPlay;
	}
}

module.exports = Connect4AI;
