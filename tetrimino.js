class Tetrimino {
    constructor(color, tetriminoSquares, id) {
        this.color = color;
        this.tetriminoSquares = tetriminoSquares;
        this.id = id;
    }

    setTetriminoSquares(squareList) {
        this.tetriminoSquares = squareList;
    }
}