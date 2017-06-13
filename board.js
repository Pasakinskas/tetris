class Board {
    constructor (width, height) {
        this.width = width;
        this.height = height;
        this.data = this.createSquareArray();
        this.populateNeighbors();
    }

    fetchSquare(x, y) {
        if (this.data[y] && this.data[y][x])
            return this.data[y][x];
        else
            return null;
    }
  
    getDownNeighbor(square) {
        let downNeighbor;
        let x = square.x;
        let y = square.y;
        if (y + 1 < this.data.length) {
            downNeighbor = this.fetchSquare(x, y + 1);
        }
        return downNeighbor;
    }

    populateNeighbors() {
        for (let row of this.data) {
            for (let square of row) {
                square.downNeighbor = this.getDownNeighbor(square);
            }
        }
    }

    createSquareArray () {
        var board = [];
        while (board.length < this.height) {
            var row = [];
            while (row.length < this.width) {
                const square = new Square(row.length, board.length);
                row.push(square);
            }
            board.push(row);
        }
        return board;
    }
}