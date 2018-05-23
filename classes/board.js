function Board(boardStackedCallback, lineClearedCallback, figureDropCallback, width = 14, height = 25){
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

        update();
    }    

    //figure managing    
    var initialPosition = new P(Math.ceil(board.width / 2) - 1, 2);
    this.initFigure = function(figure){
        figure.center = initialPosition;        
        figure.collisionChecker = collisionChecker;
        figure.dropCallback = onDrop;                
        board.figure = figure;                  
        
        if (!canPlaceFigure(figure)){
            //game over
            boardStackedCallback();
            return;
        }                    
    }    

    this.exchangeFigure = function(figure){
        figure.center = board.figure.center.clone();
        figure.collisionChecker = collisionChecker;
        figure.dropCallback = onDrop;

        if (canPlaceFigure(figure)){
            var f = figure.clone();
            var f2 = board.figure.clone();
            board.figure = f;
            return f2;
        }

        return figure;
    }

    function onDrop(){
        placeFigure(board.figure);
        checkForFullLine();

        figureDropCallback();
    }

    function checkForFullLine(){
        for (var y = board.height - 1; y >= 0; y--){ 
            var full = true;            
            for (var x = 0; x < board.width; x++)
                if (board.cells[x][y] != 1){
                    full = false; 
                    break;
                }            
            if (full){
                removeLine(y);
                slideAllDown(y);
                lineClearedCallback();
                checkForFullLine();
                return;
            }
        }
    }

    function removeLine(y){
        for (var x = 0; x < board.width; x++)
            board.cells[x][y] = 0;
    }

    function slideAllDown(low_y){
        for (var y = low_y - 1; y >= 0; y--){
            for (var x = 0; x < board.width; x++){
                if (board.cells[x][y] == 0)
                    continue;
                board.cells[x][y] = 0;
                board.cells[x][y + 1] = 1;
            }
        }
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