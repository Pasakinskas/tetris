class Game {
    constructor(boardWidth, boardHeight, graphics, gridSize) {
        this.boardWidth = boardWidth;
        this.boardHeight = boardHeight;
        const self = this;
    }

    placeTetrimino(name) {
        // will need that id for piece, so it can decide, can it
        // actually rotate. To differenciate between itself and others.
        let tetrimino = new Tetrimino(name);
        let startPoint = Math.round(this.players[0].board.width / 2) - 2;
        let squaresOfPiece = [];
        let tetriOriginSquare = this.players[0].board.fetchSquare(startPoint, 0);

        tetrimino.setOriginPoint(tetriOriginSquare);

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (tetrimino.instructions[j][i] == 1) {
                    let squareTetriHere = this.players[0].board.fetchSquare(i + startPoint, j);

                    squareTetriHere.setPieceHere(tetrimino);
                    squaresOfPiece.push(squareTetriHere);
                }
            }
        }
        tetrimino.setTetriminoSquares(squaresOfPiece);    
        return tetrimino;
    }

    canTetriminoMove(tetrimino, direction) {
        for (let square of tetrimino.tetriminoSquares) {
            let dirDict = {
                "down": square.neighbors.downNeighbor,
                "left": square.neighbors.leftNeighbor,
                "right": square.neighbors.rightNeighbor
            };

            if (!dirDict[direction]) {
                console.log("neradau kaimyno, siena");
                return false;
            }
            if (dirDict[direction].pieceHere &&
                !tetrimino.tetriminoSquares.includes(dirDict[direction])) {
                console.log("judejimo kryptimi sutinku kita tetrimina");
                return false;
            }
        }
        return true;
    }

    canTetriminoRotate(tetrimino) {
        let movedTetriminoSquares = [];
        let rotatedInstructions = Utilities.rotateMatrix(tetrimino.instructions);
        let origin = tetrimino.getOriginPoint();

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (rotatedInstructions[j][i] == 1) {
                    let rotatedSquare = this.players[0].board.fetchSquare(origin.x + i, origin.y + j);
                    if (!rotatedSquare) {
                        return false;
                    }
                    if (rotatedSquare.pieceHere && rotatedSquare.id !== tetrimino.id) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    moveOriginPoint(tetrimino, direction) {
        let dirDict = {
            "down": [0, 1],
            "left": [-1, 0],
            "right": [1, 0]
        };
        let origenPoint = tetrimino.getOriginPoint();
        let movedOriX = origenPoint.x + dirDict[direction][0];
        let movedOriY = origenPoint.y + dirDict[direction][1];
        let movedOriPoint = this.players[0].board.fetchSquare(movedOriX, movedOriY);

        if (!movedOriPoint) {
            movedOriPoint = new Square(movedOriX, movedOriY);
        }
        tetrimino.setOriginPoint(movedOriPoint);
        return tetrimino;
    }

    moveTetrimino(tetrimino, direction) {
        let canTetriMove = this.canTetriminoMove(tetrimino, direction);
        let movedTetriminoSquares = [];
        let dirDict = {
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
            let moveX = dirDict[direction][0];
            let moveY = dirDict[direction][1];
            let newSquare = this.players[0].board.moveSquare(square, moveX, moveY);
            
            newSquare.setPieceHere(tetrimino);
            movedTetriminoSquares.push(newSquare);
        }

        this.moveOriginPoint(tetrimino, direction);
        tetrimino.setTetriminoSquares(movedTetriminoSquares);
        return tetrimino;
    }

    rotate(tetrimino) {
        // if new piece in place of pieces, that do not have
        // "mine" id, i cant flip. 
        let canRotate = this.canTetriminoRotate(tetrimino);
        if (!canRotate) {
            return tetrimino;
        }
        let movedTetriminoSquares = [];
        let rotatedInstructions = Utilities.rotateMatrix(tetrimino.instructions);
        tetrimino.instructions = rotatedInstructions;
        let origin = tetrimino.getOriginPoint();

        for (let square of tetrimino.tetriminoSquares) {
            square.setNeutral();
        }

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (rotatedInstructions[j][i] == 1) {
                    this.players[0].board.fetchSquare(origin.x + i, origin.y + j).setPieceHere(tetrimino);
                    movedTetriminoSquares.push(this.players[0].board.fetchSquare(origin.x + i, origin.y + j));
                }
            }
        }
        tetrimino.setTetriminoSquares(movedTetriminoSquares);
        return tetrimino;
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

    clear(rowsToClear, board) {
        let squaresToMove = [];
        let numbOfRows = rowsToClear.length;
        let firstRow = rowsToClear[0];

        for (let row of rowsToClear) {
            for (let square of row) {
                square.setNeutral();
            }
        }
        for (let i = 0; i < firstRow[0].y; i++) {
            for (let j = 0; j < firstRow.length; j++) {
                if (board.data[i][j].pieceHere) {
                    squaresToMove.push({
                        value: board.data[i][j],
                        label: board.data[i][j].color
                    });
                }  
            }
        }
        for (let square of squaresToMove) {
            square.value.setNeutral();
        }
        for (let square of squaresToMove) {
            let newSquare = board.moveSquare(square.value, 0, numbOfRows);
            // have to fix this in the future
            newSquare.pieceHere = true;
            newSquare.setColor(square.label);
        }
    }

    clearFullRows () {
        let board = this.players[0].board;
        let rowsToClear = [];

        for (let row of board.data) {
            let squaresInLine = 0;
            for (let square of row) {
                if (square.pieceHere) {
                    squaresInLine++;
                }
            }
            if (squaresInLine == row.length) {
                rowsToClear.push(row);
            }
        }
        if (rowsToClear.length > 0) {
            this.clear(rowsToClear, board);
        }
    }

    start () {
        this.createPlayers();
        this.graphics = new Graphics({
            cellWidth: 20,
            cellHeight: 20,
            spcBetweenSquares: 3,
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

        document.addEventListener("keydown", () => {
            if (event.code == "KeyD") {
                tetrimino = this.moveTetrimino(tetrimino, "right");
                this.drawPlayers();
            }
            if (event.code == "KeyA") {
                tetrimino = this.moveTetrimino(tetrimino, "left");
                this.drawPlayers();
            }
            if (event.code == "KeyW") {
                tetrimino = this.rotate(tetrimino);
                this.drawPlayers();
            }
            if (event.code == "KeyS") {
                if (tetrimino == null) {
                    noTetrimino = true;
                    return;
                }
                tetrimino = this.moveTetrimino(tetrimino, "down");
                if (!tetrimino) {
                    this.clearFullRows();
                }
                this.drawPlayers();
            }
        });

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
                    tetrimino = this.moveTetrimino(tetrimino, "down");
                    if (!tetrimino) {
                        this.clearFullRows();
                    }
                }
            }
            this.drawPlayers();
        }.bind(this), 500);
    }
}

var game = new Game(10, 20);
game.start();
