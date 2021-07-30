class Connect4 {
	constructor(options = {}, players = []) {
		this.players = players || [];
		this.__finished = false;
		this.winner = null;
		this.solution = null;
		this.columns = options.columns || 7;
		this.lengthArr = options.lengthArr || 6;
		this.player1 = options.player1 || 1;
		this.player2 = options.player2 || 2;
		this._lastTurn = this.player2;
		this.start = null;
		this.plays = [];
	}

	get turn() {
		return this._lastTurn == this.player1 ? this.player2 : this.player1;
	}

	/**
	 * @param {number} played
	 */
	play(played) {
		if (!this.canPlay(played)) throw new Error(`Can't play ${played}`);
		if (!this.start) this.start = Date.now();

		const turn = this.turn;
		this._lastTurn = turn;
		let method = 0;
		this.map[played][
			this.map[played].filter((x) => x.key != 0).length
		].key = turn;
		this.plays.push(played);
		let seguir = true;

		while (seguir) {
			switch (method) {
				case 0:
					{
						for (const i of this.array) {
							const { encontrado, veces } = this.checkArr(i);

							if (veces >= 4) {
								this.winner = encontrado;
								this.__finished = true;
								seguir = false;
								break;
							}
						}
						++method;
					}
					break;

				case 1:
					{
						for (const INDEX in this.array) {
							const arr = this.array.map((x) => x[INDEX]);
							if (
								!arr ||
								!arr.filter((x) => x !== undefined).length
							)
								break;

							const { encontrado, veces } = this.checkArr(arr);

							if (veces >= 4) {
								this.winner = encontrado;
								this.__finished = true;
								seguir = false;
								break;
							}
						}
						++method;
					}
					break;

				case 2:
					{
						const arrLateral = lateralArray(this.array);
						for (const arr of arrLateral) {
							const { encontrado, veces } = this.checkArr(
								arr,
								method
							);

							if (veces >= 4) {
								this.winner = encontrado;
								this.__finished = true;
								seguir = false;
								break;
							}
						}
						++method;
					}
					break;

				default:
					{
						const arrLateral = lateralArray(
							this.array.map((x) => {
								let arrUWU = [];
								for (let i of x) arrUWU.push(i);
								return arrUWU.reverse();
							})
						);
						for (const arr of arrLateral) {
							const { encontrado, veces } = this.checkArr(arr);

							if (veces >= 4) {
								this.winner = encontrado;
								this.__finished = true;
								seguir = false;
								break;
							}
						}
						++method;
						seguir = false;
					}
					break;
			}
		}
	}
	/**
	 * @param {number} play
	 */
	canPlay(play) {
		try {
			if (isNaN(play)) return false;
			if (!this.start) return true;
			if (this.finished) return false;
			return this.map[play][this.lengthArr - 1].key == 0;
		} catch {
			return false;
		}
	}

	get array() {
		return Object.values(this.map);
	}
	/**
	 * @private
	 * @param {any[]} arr
	 */
	checkArr(arr) {
		let encontrado = false;
		let veces = 0;
		let solution = [];
		for (const j of arr) {
			if (!encontrado) {
				if (j.key === this.player1 || j.key === this.player2) {
					encontrado = j.key;
					++veces;
					solution.push(j);
					continue;
				}
			} else {
				if (j.key === encontrado) {
					++veces;
					solution.push(j);
				} else {
					if (veces >= 4) break;
					encontrado = j.key;
					veces = 1;
					solution = [j];
				}
			}
		}
		if (!solution || solution.length < 4) solution = null;
		this.solution = solution;
		return { encontrado, veces, solution };
	}

	get tie() {
		return !this.winner && this.finished;
	}

	get finished() {
		return (
			this.__finished ||
			this.array.every(
				(item) => item.filter((x) => x.key == 0).length == 0
			)
		);
	}

	createBoard() {
		this.map = {};
		for (let i = 0; i < this.columns; i++) {
			this.map[i] = [];
			for (let y = 0; y < this.lengthArr; y++) {
				this.map[i].push({
					key: 0,
					index: y,
					column: i,
				});
			}
		}
		return this.map;
	}

	reset() {
		this.createBoard();
		this.__finished = false;
		this.winner = null;
		this.solution = null;
		this._lastTurn = 2;
		this.start = null;
		return this;
	}
}

function getLateralLine(mapa, queCosa) {
	if (queCosa <= mapa.length) {
		const res = [];
		let x = queCosa;
		let y = 0;
		for (let i = 0; i < queCosa; i++) {
			if (mapa[x - 1] && mapa[x - 1][y]) res.push(mapa[--x][y++]);
		}
		return res;
	} else {
		let x = mapa.length;
		const res = [];
		while (mapa[--x])
			if (mapa[x][queCosa - x - 1]) res.push(mapa[x][queCosa - x - 1]);
		return res;
	}
}

function lateralArray(arr) {
	const res = [];

	for (let i = 0; i < arr.length + arr[0].length - 1; i++)
		res.push(getLateralLine(arr, i + 1));

	return res;
}

module.exports = Connect4;
