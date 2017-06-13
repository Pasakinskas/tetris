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
        let neighbors = {}
        let x = square.x;
        let y = square.y;
        // down neighbors
        if (y + 1 < this.data.length) {
            neighbors.downNeighbor = this.fetchSquare(x, y + 1);
        }
        // neighbors to right
        if (x + 1 < this.data[0].length) {
            neighbors.rightNeighbor = this.fetchSquare(x + 1, y);
        }
        // neighbors to the left
        if (x !== 0) {
            neighbors.leftNeighbor = this.fetchSquare(x - 1, y);
        }
        return neighbors;
    }

    populateNeighbors() {
        for (let row of this.data) {
            for (let square of row) {
                square.neighbors = this.getDownNeighbor(square);
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