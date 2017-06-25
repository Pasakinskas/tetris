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
        tetrimino.setOriginPoint(this.players[0].board.fetchSquare(startPoint, 0));

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (tetrimino.instructions[j][i] == 1) {
                    this.players[0].board.fetchSquare(i + startPoint, j).setPieceHere(tetrimino);
                    squaresOfPiece.push(this.players[0].board.fetchSquare(i + startPoint, j));
                }
            }
        }
        tetrimino.setTetriminoSquares(squaresOfPiece);    
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
        // moveTetrimino shouldnt concern itself with moving origen point
        // will have to divide into two or more pieces. After proof of concept
        let canTetriMove = this.canTetriminoMove(tetrimino, direction);
        let movedTetriminoSquares = [];
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
            let movedX = square.x + dirDict[direction][0];
            let movedY = square.y + dirDict[direction][1];
            let newSquare = this.players[0].board.fetchSquare(movedX, movedY);
            
            newSquare.setPieceHere(tetrimino);
            movedTetriminoSquares.push(newSquare);
        }
        tetrimino.setOriginPoint(movedOriPoint);
        tetrimino.setTetriminoSquares(movedTetriminoSquares);
        return tetrimino;
    }

    rotate(tetrimino) {
        // if new piece in place of pieces, that do not have
        // "mine" id, i cant flip. Tetrimino cant be placed in the last
        // to the left. due to origin point becoming undefined
        let movedTetriminoSquares = [];
        let rotatedInstructions = this.rotateMatrix(tetrimino.instructions);
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

    rotateMatrix(matrix) {
        let newMatrix = [[], [], [], []];
        for (let i = 3; i >= 0; i--) {
            for (let j = 0; j < 4; j++) {
                newMatrix[j].push(matrix[i][j]);
            }
        }
        return newMatrix;
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
                }
            }
            this.drawPlayers();
        }.bind(this), 500);
    }
}

var game = new Game(10, 20);
game.start();
