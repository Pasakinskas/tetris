class Tetrimino {
    constructor(name) {
        let templates = this.createPiece(name);

        this.name = name;
        this.instructions = templates[0];
        this.color = templates[1];
        this.tetriminoSquares;
        this.originPoint = null;
        this.id = Utilities.randinteger(9999);
    }

    setTetriminoSquares(squareList) {
        this.tetriminoSquares = squareList;
    }

    setOriginPoint(square) {
        this.originPoint = square;
    }

    getOriginPoint() {
        return this.originPoint;
    }

    createPiece(name) {    
        let pieces = {
            I: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
            J: [[0, 0, 0, 0], [1, 1, 1, 0], [0, 0, 1, 0], [0, 0, 0, 0]],
            L: [[0, 0, 0, 0], [1, 1, 1, 0], [1, 0, 0, 0], [0, 0, 0, 0]],
            O: [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]],
            S: [[0, 0, 0, 0], [0, 1, 1, 0], [1, 1, 0, 0], [0, 0, 0, 0]],
            T: [[0, 0, 0, 0], [1, 1, 1, 0], [0, 1, 0, 0], [0, 0, 0, 0]],
            Z: [[0, 0, 0, 0], [1, 1, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0]],
        }
        switch (name) {
            case "I":
                return [pieces.I, "cyan"];
                break;
            case "J":
                return [pieces.J, "blue"];
                break;
            case "L":
                return [pieces.L, "orange"];
                break;
            case "O":
                return [pieces.O, "yellow"];
                break;
            case "S":
                return [pieces.S, "lime"];
                break;
            case "T":
                return [pieces.T, "purple"];
                break;
            case "Z":
                return [pieces.Z, "red"];
                break;
        }
    }


}