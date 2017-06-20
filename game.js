class Game {
    constructor(boardWidth, boardHeight, graphics, gridSize) {
        this.boardWidth = boardWidth;
        this.boardHeight = boardHeight;
        const self = this;
    }

    placeTetrimino(name) {
        let piece = new PieceCreator(name);
        let startPoint = Math.round(this.players[0].board.width / 2) - 2;
        let squaresOfPiece = [];

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (piece.data[j][i] == 1) {
                    this.players[0].board.fetchSquare(i + startPoint, j).setPieceHere(piece);
                    squaresOfPiece.push(this.players[0].board.fetchSquare(i + startPoint, j));
                }
            }
        }
        let tetrimino = new Tetrimino(piece.color, squaresOfPiece, piece.id);        
        return tetrimino;
    }

    canTetriminoMove(tetrimino, dir) {
        if (dir === "down") {
            for (let square of tetrimino.tetriminoSquares) {
                if (!square.neighbors.downNeighbor) {
                    console.log("sutikau grindis");
                    return false;
                }
                if (square.neighbors.downNeighbor.pieceHere &&
                    !tetrimino.tetriminoSquares.includes(square.neighbors.downNeighbor)) {
                    console.log("sutikau drauga");
                    return false;
                }
            }
            return true;
        }
        else if (dir === "left") {
            for (let square of tetrimino.tetriminoSquares) {
                if (!square.neighbors.leftNeighbor) {
                    console.log("atsitrenkiau i sona");
                    return false;
                }
                if (square.neighbors.leftNeighbor.pieceHere &&
                    !tetrimino.tetriminoSquares.includes(square.neighbors.leftNeighbor)) {
                    console.log("sutikau drauga is sono");
                    return false;
                }
            }
            return true;
        }
        else if (dir === "right") {
            for (let square of tetrimino.tetriminoSquares) {
                if (!square.neighbors.rightNeighbor) {
                    console.log("atsitrenkiau i sona");
                    return false;
                }
                if (square.neighbors.rightNeighbor.pieceHere &&
                    !tetrimino.tetriminoSquares.includes(square.neighbors.rightNeighbor)) {
                    console.log("sutikau drauga is sono");
                    return false;
                }
            }
            return true;
        }
    }

    moveTetrimino(tetrimino, direction) {
        let canTetriMove = this.canTetriminoMove(tetrimino, direction);
        let movedTetriminoSquares = [];
        let dictDir = {
            "down": [0, 1],
            "left": [-1, 0],
            "right": [1, 0]
        };

        if (!canTetriMove && direction === "down") {
            return;
        }
        else if (!canTetriMove && direction !== "down") {
            return tetrimino;
        }

        for (let square of tetrimino.tetriminoSquares) {
            square.setNeutral();
        }

        for (let square of tetrimino.tetriminoSquares) {
            let newSquare = this.players[0].board.fetchSquare(square.x + dictDir[direction][0], square.y + dictDir[direction][1]);
            newSquare.setPieceHere(tetrimino);
            movedTetriminoSquares.push(newSquare);
        }
        tetrimino.setTetriminoSquares(movedTetriminoSquares);
        return tetrimino;
    }

    transpose(a) {
        return Object.keys(a[0]).map(function(c) {
            return a.map(function(r) { return r[c]; });
        });
    }

    rotate(pieceInfo) {
        let pieceAndEmptySqrs = pieceInfo.pieceSquares;
        let pieceMatrix = [];
        let coordsMatrix = [];
        let returnMatrix = [];
        let indexNumber = 0;

        for (let i = 0; i < 4; i++) {
            let row = [];
            for (let j = 0; j < 4; j++) {
                row.push(pieceAndEmptySqrs[indexNumber])
                indexNumber++;
            }
            pieceMatrix.push(row);
        }

        for (let row of pieceMatrix) {
            let listRow = [];
            for (let square of row) {
                listRow.push([square.x, square.y]);
            }
            coordsMatrix.push(listRow);
        }

        coordsMatrix = this.transpose(coordsMatrix);

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                pieceMatrix[i][j].x = coordsMatrix[i][j][0];
                pieceMatrix[i][j].y = coordsMatrix[i][j][1];
            }
        }

        for (let row of pieceMatrix) {
            for (let square of row) {
                returnMatrix.push(square);
            }
        }

        let movedInfo = {
            color: pieceInfo.color,
            pieceSquares: returnMatrix,
            id: pieceInfo.id
        }
        return movedInfo;
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
        let noTetrimino = true;
        let tetrimino;
        let keyIsPressed = false;

        window.setInterval(function () {
            if (noTetrimino === true) {
                tetrimino = this.placeTetrimino(Utilities.randLetter());
                noTetrimino = false;
            }
            else {
                if (tetrimino == null) {
                    noTetrimino = true;
                }
                else { 
                    document.addEventListener("keydown", () => {
                        if (!keyIsPressed) {
                            keyIsPressed = true;
                            if (event.code == "KeyD") {
                                tetrimino = this.moveTetrimino(tetrimino, "right");
                                this.drawPlayers();
                            }
                            else if (event.code == "KeyA") {
                                tetrimino = this.moveTetrimino(tetrimino, "left");
                                this.drawPlayers();
                            }
                            else if (event.code == "KeyW") {
                                tetrimino = this.rotate(tetrimino);
                                this.drawPlayers();
                            }
                        }
                    });
                    tetrimino = this.moveTetrimino(tetrimino, "down");
                    document.addEventListener("keyup", () => {
                        keyIsPressed = false;
                    });
                }
            }
            this.drawPlayers(); 
        }.bind(this), 450);
    }
}

var game = new Game(10, 20);
game.start();
