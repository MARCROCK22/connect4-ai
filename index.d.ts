interface Obj {
    key: number;
    index: number;
    column: number;
}

declare namespace ModuleConnect4 {
    class Connect4<PLAYER> {
        public map: {
            [x: number]: Obj[];
        };
        players: [PLAYER, PLAYER];
        readonly plays: number[];
        private __finished: boolean;
        readonly winner: null | number;
        readonly solution: null | Obj[];
        readonly lengthArr: number;
        readonly columns: number;
        readonly necessaryToWin: number
        readonly _lastTurn: number;
        readonly start: null | number;
        readonly turn: number;

        public play(played: number): void;

        public canPlay(play: number): boolean;

        readonly array: Obj[][];

        private checkArr(arr: Obj[]): {
            encontrado: number;
            veces: number;
            solution: Obj[];
        };

        readonly tie: boolean;
        readonly finished: boolean;

        public createBoard(): {
            [x: number]: Obj[];
        };

        public reset(): this;

        constructor(options: {
            lengthArr: number;
            columns: number;
            necessaryToWin: number;
        }, players: [PLAYER, PLAYER]);
    }

    class Connect4AI<PLAYER> extends Connect4<PLAYER> {
        playAI(difficulty: "easy" | "medium" | "hard"): number;

        constructor(options: {
            lengthArr: number;
            columns: number;
            necessaryToWin: number;
        }, players: [PLAYER, PLAYER], recursiveDepthLimit?: number);
    }

    export { Connect4, Connect4AI };
}

export default ModuleConnect4;
