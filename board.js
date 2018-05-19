function Board(width = 14, height = 25){
    var board = this;
    this.width = width;
    this.height = height;    
    this.cells = [];
    this.figure = null;    
    this.timecode = Date.now();    
    
    this.initMap = function(){
        //clear board
        board.cells = [];
        for (var x = -1; x < board.width + 1; x++){
            board.cells[x] = [];
            for (var y = -1; y < board.height + 1; y++)
                board.cells[x][y] = 0;
        }

        //fill invisible borders
        for (var y = 0; y < board.height; y++){
            board.cells[-1][y] = 1;
            board.cells[board.width][y] = 1;
        }
        
        for (var x = 0; x < board.width; x++)
            board.cells[x][board.height] = 1;
    }    

    //figure managing    
    var initialPosition = new P(6, 1);
    this.initFigure = function(code){
        var figure = new Figure(initialPosition, code, collisionChecker, onDrop);
        board.figure = figure;        
    }    

    function onDrop(){
        checkForFullLine();
    }

    function checkForFullLine(){

    }

    function collisionChecker(figure){        
        return canPlaceFigure(figure);
    }

    function canPlaceFigure(figure){
        var clear = true;
        figure.figureCellsIteration((cell) => {
            var res = board.cells[cell.x][cell.y] == 0;
            clear = res;
            return res;
        });
        return clear;
    }        

    function placeFigure(figure){
        figure.figureCellsIteration((cell) => {
            board.cells[cell.x][cell.y] = 1;
            return true;
        });
        update();
    }   

    function update(){
        board.timecode = Date.now();
    }
}