class Graphics {
    constructor(options) {
        this.cellWidth = options.cellWidth;
        this.cellHeight = options.cellHeight;
        this.spcBetweenSquares = options.spcBetweenSquares;
        this.gridSize = this.getGridSize(options.boardWidth, options.boardHeight);
        this.backgroundColor = options.backgroundColor;
        this.emptySquare = options.emptySquare;
        this.initGraphics(this.gridSize[0], this.gridSize[1], options.playerNumber);
    }

    getGridSize (width, height) {
        let singleGridWidth = (width * (this.cellWidth + this.spcBetweenSquares)
         + this.spcBetweenSquares);
        let singleGridHeight = (height * (this.cellHeight + this.spcBetweenSquares)
         + this.spcBetweenSquares); 
         return [singleGridWidth, singleGridHeight];
    }

    initGraphics (singleGridWidth, singleGridHeight, playerNmb) {
        let canvas = document.getElementById('canvas');
        canvas.width = singleGridWidth * playerNmb * 1.25 - 0.25 * singleGridWidth;
        canvas.height = singleGridHeight;
        
        this.context = canvas.getContext("2d");
        this.context.fillStyle = this.backgroundColor;
        this.context.fillRect(0, 0, canvas.width, canvas.height);
    }

    drawBoard (data, paddingLeft, paddingTop) {
        data.forEach ((row, y) => {
            row.forEach ((square, x) => {
                if (!square.getColor()) {
                    this.context.fillStyle = this.emptySquare;                    
                }
                this.context.fillStyle = square.getColor();
                this.context.fillRect(x * (this.cellWidth + this.spcBetweenSquares) +
                    paddingLeft + this.spcBetweenSquares, 
                    y * (this.cellHeight + this.spcBetweenSquares) +
                    paddingTop + this.spcBetweenSquares,
                    this.cellWidth, this.cellHeight);
            });
        });
    }

    draw(boardDataList) {
        let z = 0;
        for (const data of boardDataList) {
            this.drawBoard(data, Math.floor(z * this.gridSize[0]), 0);
            z += 1.25;
        }
    }
}