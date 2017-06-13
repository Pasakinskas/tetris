class Square {
    constructor (x, y, color, pieceHere, downNeighbor) {
        this.x = x;
        this.y = y;
        this.color = null;
        this.pieceHere = false;
        this.neighbors = null;
    }

    setColor(color) {
        this.color = color;
    }

    getColor() {
        return this.color;
    }

    setNeutral() {
        this.pieceHere = false;
        this.color = null;
    }

    setPieceHere(color) {
        // I'm setting the color here too
        // to avoid repetition further into the code,
        // because I want to set and reset the piece being there
        this.pieceHere = true;
        this.color = color;
    }
}