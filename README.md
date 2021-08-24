# @lil_marcrock22/connect4-ai

>### Install
> npm i @lil_marcrock22/connect4-ai

## How to use (TypeScript)
```ts
interface Player {
	turn: number;
	id: string;
	morethings?: any;
}

const { Connect4AI } = require('@lil_marcrock22/connect4-ai'); 
const TheGame = new Connect4AI<Player>({ lengthArr: 6, columns: 7 }, 
	[{ turn: 1, id: '123' }, { turn: 2, id: '456' }]//This is for <Game>.players
);
TheGame.createBoard();
```

## How to use (JavaScript)
```js
const { Connect4AI } = require('@lil_marcrock22/connect4-ai'); 
const TheGame = new Connect4AI({ lengthArr: 6, columns: 7 }, 
	[{ turn: 1, id: '123' }, { turn: 2, id: '456' }]//This is for <Game>.players
);
TheGame.createBoard();
```
```js
console.log(TheGame.map);
/*
{
	0: [{ key: 0, index: 0: column: 0 }, { key: 0, index: 1 column: 0 }, ...]
	1: [{ key: 0, index: 0: column: 1 }, { key: 0, index: 1 column: 1 }, ...],
	...
}
*/
```

```js
const move = 5

if (TheGame.canPlay(move)) {
	TheGame.play(move);
	console.log(`${move} played :D`);
} else {
	console.error(`Cannot play ${move} D:`);
}
```

```js
const difficulty = 'hard'; 
const played = TheGame.playAI(difficulty);//'easy' | 'medium' | 'hard'

console.log(`[AI]: column played ${played}`);
```

# INFO

```ts
interface Move {
	key: number;
	index: number;
	column: number;
}
```
# Properties and getters
|  Property  |    Type     |
|:----------: |:--------------|
|    ```plays```      |  ```number[]```       |
| ```__finished```  | ```boolean```
|  ```winner```   | ```number \| null```  |
|      ```solution```      | ```Move[] \| null```  |
|      ```lengthArr```      | ```number```  |
|      ```columns```      | ```number```  |
|      ```_lastTurn```      | ```number```  |
|      ```start```      | ```number```  |
|    *`getter`* ```turn```      | ```number```  |
|    *`getter`* ```tie```      | ```boolean```  |
|    *`getter`* ```finished```      | ```boolean``` |
|    *`getter`* ```array```      | ```Move[][]``` |

# Methods
|  Property  |    Returns     |
|:----------: |:--------------|
|    ```canPlay(number)```      |  ```boolean``` |
| *`private`* ```checkArr(Move[])```  | ```{ encontrado: number; veces: number; solution: Move[]; }```
|  ```createBoard()```   | ```{ [x: number]: Move[] }```  |
|      ```reset()```      | `this` *`Connect4 \| Connect4AI`* |
| *`Just with Connect4AI`* ```playAI('easy' \| 'medium' \| 'hard')``` | ```number```  |


```html
<!-- You lost the game -->
<!-- https://www.npmjs.com/package/connect4-ai -->
```