class PieceCreator {
    constructor(name) {
        this.name = name;
        let something = this.createPiece(name);
        this.data = something[0];
        this.color = something[1];
        this.id = Utilities.randinteger(99999);
    }

    createPiece(name) {    
        let pieces = {
            I: [[[0],[0],[0],[0]], [[1],[1],[1],[1]], [[0],[0],[0],[0]], [[0],[0],[0],[0]]],
            J: [[[0],[0],[0],[0]], [[1],[1],[1],[0]], [[0],[0],[1],[0]], [[0],[0],[0],[0]]],
            L: [[[0],[0],[0],[0]], [[1],[1],[1],[0]], [[1],[0],[0],[0]], [[0],[0],[0],[0]]],
            O: [[[0],[0],[0],[0]], [[0],[1],[1],[0]], [[0],[1],[1],[0]], [[0],[0],[0],[0]]],
            S: [[[0],[0],[0],[0]], [[0],[0],[1],[1]], [[0],[1],[1],[0]], [[0],[0],[0],[0]]],
            T: [[[0],[0],[0],[0]], [[1],[1],[1],[0]], [[0],[1],[0],[0]], [[0],[0],[0],[0]]],
            Z: [[[0],[0],[0],[0]], [[1],[1],[0],[0]], [[0],[1],[1],[0]], [[0],[0],[0],[0]]],
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

    transpose() { 	
    }
}