class Square {
    constructor (x, y, color, pieceHere) {
        this.x = x;
        this.y = y;
        this.color = null;
        this.pieceHere = false;
        this.neighbors = null;
        this.id = null
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

    setPieceHere(color, id) {
        this.pieceHere = true;
        this.color = color;
        this.id = id;
    }
}