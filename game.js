class Game {
    constructor(boardWidth, boardHeight, graphics, gridSize) {
        this.boardWidth = boardWidth;
        this.boardHeight = boardHeight;
        const self = this;
    }

    placeTetrimino(name) {
        let piece = new Piece(name);
        let startPoint = Math.round(this.players[0].board.width / 2) - 2;
        let squaresOfPiece = [];
        // take out the hardcoded fours
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (piece.data[j][i] == 1) {
                    this.players[0].board.fetchSquare(i + startPoint, j).setPieceHere(piece.color);
                    squaresOfPiece.push(this.players[0].board.fetchSquare(i + startPoint, j));
                }
            }
        }
        return squaresOfPiece;
    }

    goDown(squaresOfTetrimino) {
        let color = squaresOfTetrimino[0].getColor();
        let movedTetrimino = [];
        for (let square of squaresOfTetrimino) {
            if (!square.downNeighbor) {
                console.log("sutikau grindis");
                return null;
            }
            if (square.downNeighbor.pieceHere && !squaresOfTetrimino.includes(square.downNeighbor)) {
                console.log("sutikau drauga");
                return null;
            }
        }
        for (let square of squaresOfTetrimino) {
            square.setNeutral();
        }
        for (let square of squaresOfTetrimino) {
            let newSquare = this.players[0].board.fetchSquare(square.x, square.y + 1);
            newSquare.setPieceHere(color);
            movedTetrimino.push(newSquare);
        }   
        return movedTetrimino;
    }

    createPlayers() {
        const names = ["Mrello"];
        this.players = names.map(name => {
            return new Player(name);
        });
 
        this.players.forEach((player) => {
            player.board = new Board(this.boardWidth, this.boardHeight);
        });
    }

    drawPlayers() {
        const dataList = this.players.map(player => player.board.data);
        this.graphics.draw(dataList);
    }

    start () {
        this.createPlayers();
        this.graphics = new Graphics({
            cellWidth: 25,
            cellHeight: 25,
            spcBetweenSquares: 2,
            boardWidth: this.boardWidth,
            boardHeight: this.boardHeight,
            playerNumber: this.players.length,
            backgroundColor: "grey",
            emptySquare: "black"
        });
        this.drawPlayers();
        this.update();
    }

    update() {
        let state = false;
        let tetrimino;
        let down = false;
        window.setInterval(function () {
            if (state === false) {
                tetrimino = this.placeTetrimino(Utilities.randLetter());
                state = true;
            }
            else {
                if (tetrimino === null) {
                    state = false;
                }
                else {
                    document.addEventListener("keydown", () => {
                        if (!down) {
                            down = true;
                            let color = tetrimino[0].getColor();
                            let movedTetrimino = [];
                            if (event.code == "KeyD") {
                                for (let square of tetrimino) {
                                    square.setNeutral();
                                }
                                for (let square of tetrimino) {
                                    let newSquare = this.players[0].board.fetchSquare(square.x + 1, square.y);
                                    newSquare.setPieceHere(color);
                                    movedTetrimino.push(newSquare);
                                }
                                tetrimino = movedTetrimino;
                                this.drawPlayers();
                            }
                            else if (event.code == "KeyA") {
                                for (let square of tetrimino) {
                                    square.setNeutral();
                                }
                                for (let square of tetrimino) {
                                    let newSquare = this.players[0].board.fetchSquare(square.x - 1, square.y);
                                    newSquare.setPieceHere(color);
                                    movedTetrimino.push(newSquare);
                                }
                                tetrimino = movedTetrimino;
                                this.drawPlayers();
                            }
                            else if (event.code == "KeyW") {
                                for (let square of tetrimino) {
                                    square.setNeutral();
                                }
                                for (let square of tetrimino) {
                                    let newSquare = this.players[0].board.fetchSquare(square.y, square.x);
                                    newSquare.setPieceHere(color);
                                    movedTetrimino.push(newSquare);
                                }
                                tetrimino = movedTetrimino;
                                this.drawPlayers();
                            }
                        }
                    });
                    tetrimino = this.goDown(tetrimino);
                    document.addEventListener("keyup", () => {
                        down = false;
                    });
                }
            }
            this.drawPlayers(); 
        }.bind(this), 600);
    }
}

var game = new Game(12, 20);
game.start();
