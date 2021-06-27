class Game{
    constructor() {
        this.turn = "X";
        this.board = new Array(9).fill(null);
    }

    nextTurn() {
        this.turn = this.turn === "X" ? "O" : "X";
    }

    makeMove(i) {
        if (!this.isInProgress()) {
            return;
        }

        if (this.board[i]) {
            return;
        }

        this.board[i] = this.turn;

        if (!this.findWinningCombination()) {
            this.nextTurn();
        }
    }

    findWinningCombination() {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (const combination of winningCombinations) {
            const [a, b, c] = combination;

            if (this.board[a] && (this.board[a] === this.board[b] && this.board[a] === this.board[c])) {
                return combination;
            }
        }

        return null;
    }

    isInProgress() {
        return !this.findWinningCombination() && this.board.includes(null);
    }
}

class Gameview{
    constructor(root){
        this.root = root;
        this.root.innerHTML = `
            <div class = "header">
                <div class = "header__turn">
                </div>
                <div class = "header__status">
                    In Progress
                </div>
                <button type="button" class = "header__restart">
                    <i class="material-icons">refresh</i>
                </button>
            </div>
            <div class = "board">
                <div class="board__tile" data-index="0"></div>
                <div class="board__tile" data-index="1"></div>
                <div class="board__tile" data-index="2"></div>
                <div class="board__tile" data-index="3"></div>
                <div class="board__tile" data-index="4"></div>
                <div class="board__tile" data-index="5"></div>
                <div class="board__tile" data-index="6"></div>
                <div class="board__tile" data-index="7"></div>
                <div class="board__tile" data-index="8"></div>
            </div>
        `;

        this.onTileClick = undefined;
        this.onRestartClick = undefined;

        this.root.querySelectorAll(".board__tile").forEach(tile =>{
            tile.addEventListener("click", () =>{
                if(this.onTileClick){
                    this.onTileClick(tile.dataset.index);
                }
            })
        })

        this.root.querySelector(".header__restart").addEventListener("click", ()=>{
            if(this.onRestartClick){
                this.onRestartClick();
            }
        })
    }

    update(game){
        this.updateTurn(game);
        this.updateStatus(game);
        this.updateBoard(game);
    }

    updateTurn(game){
        this.root.querySelector(".header__turn").textContent = `${game.turn}'s Turn`;
    }

    updateStatus(game){
        let status = "In Progress"

        if(game.findWinningCombination()){
            status = `${game.turn} is the Winner`;
        }else if(!game.isInProgress()){
            status = "It's a Tie!"
        }
        this.root.querySelector(".header__status").textContent = status;
    }

    updateBoard(game){
        const winningCombination = game.findWinningCombination();

        for(let i = 0; i < game.board.length; i++){
            const tile = this.root.querySelector(`.board__tile[data-index="${i}"]`);

            tile.classList.remove("board__tile--winner");
            tile.textContent = game.board[i];

            if(winningCombination && winningCombination.includes(i)){
                tile.classList.add("board__tile--winner");
            }
        }
    }
}


let game = new Game();

let gameView = new Gameview(document.getElementById("app"));

gameView.onTileClick = function(i){
    game.makeMove(i);
    gameView.update(game);
};
gameView.onRestartClick = function(){
    game = new Game();
    gameView.update(game);
};

gameView.update(game);
