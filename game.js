class Game {
    constructor(boardWidth, boardHeight, graphics, gridSize) {
        this.boardWidth = boardWidth;
        this.boardHeight = boardHeight;
        const self = this;
        this.speed = 500;

        this.noTetrimino = true;
        this.keyNotPressed = true;
        this.tetrimino;
        this.idStart = 0;
        this.points = 0;
    }

    placeTetrimino(name, idStart) {
        let id = idStart;
        let tetrimino = new Tetrimino(name, id);
        let startPoint = Math.round(this.players[0].board.width / 2) - 2;
        let squaresOfPiece = [];
        let tetriOriginSquare = this.players[0].board.fetchSquare(startPoint, 0);

        tetrimino.setOriginPoint(tetriOriginSquare);

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (tetrimino.instructions[j][i] == 1) {
                    let squareTetriHere = this.players[0].board.fetchSquare(i + startPoint, j);

                    squareTetriHere.setPieceHere(tetrimino.color, tetrimino.id);
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
            // if false - squares have no neighbor - they
            // have met a wall.
            if (!dirDict[direction]) {
                return false;
            }
            // the neighbor of a square is already occupied
            // by a different piece
            if (dirDict[direction].pieceHere &&
                !tetrimino.tetriminoSquares.includes(dirDict[direction])) {
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
            
            newSquare.setPieceHere(tetrimino.color, tetrimino.id);
            movedTetriminoSquares.push(newSquare);
        }

        this.moveOriginPoint(tetrimino, direction);
        tetrimino.setTetriminoSquares(movedTetriminoSquares);
        return tetrimino;
    }

    rotate(tetrimino) {
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
                    let rotatedSquare = this.players[0].board.moveSquare(origin, i, j);
                    rotatedSquare.setPieceHere(tetrimino.color, tetrimino.id);
                    movedTetriminoSquares.push(rotatedSquare);
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
            newSquare.pieceHere = true;
            newSquare.setColor(square.label);
        }
    }
    
    assignPoints (clearedRowNumb) {
        return Math.pow(clearedRowNumb, 2) * 100;
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
            this.points += this.assignPoints(rowsToClear.length);
            return;
        }
        else {
            return 0;
        }
    }

    getScore () {
        var output = document.getElementById("game-output");
        output.innerHTML = "";
        output.innerHTML += this.points + " pts";
    }

    movement () {
        if (event.code == "KeyD") {
            this.tetrimino = this.moveTetrimino(this.tetrimino, "right");
            this.drawPlayers();
        }
        if (event.code == "KeyA") {
            this.tetrimino = this.moveTetrimino(this.tetrimino, "left");
            this.drawPlayers();
        }
        if (event.code == "KeyW" && this.keyNotPressed) {
            this.tetrimino = this.rotate(this.tetrimino);
            this.drawPlayers();
            this.keyNotPressed = false;
        }
        if (event.code == "KeyS") {
            if (this.tetrimino == null) {
                this.noTetrimino = true;
                return;
            }
            this.tetrimino = this.moveTetrimino(this.tetrimino, "down");
            if (!this.tetrimino) {
                this.clearFullRows();
                this.getScore();
            }
            this.drawPlayers();
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

        document.addEventListener("keydown", () => {
            this.movement();
        });

        document.addEventListener("keyup", () => {
            this.keyNotPressed = true;
        });

        this.drawPlayers();
        this.update();
    }

    update() {
        window.setInterval(() => {
            if (this.noTetrimino === true) {
                this.tetrimino = this.placeTetrimino(Utilities.randLetter(), this.idStart);
                this.noTetrimino = false;
                this.idStart++;
            }
            else {
                if (this.tetrimino == null) {
                    this.noTetrimino = true;
                }
                else { 
                    this.tetrimino = this.moveTetrimino(this.tetrimino, "down");
                    if (!this.tetrimino) {
                        this.clearFullRows();
                    }
                }
            }
            this.drawPlayers();
        }, this.speed);
    }
}

var game = new Game(10, 20);
game.start();
