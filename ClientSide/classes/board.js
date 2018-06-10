function Board(boardStackedCallback, lineClearedCallback, figureDropCallback, width = 14, height = 25, filled_height = 7){
    var board = this;        
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

        random_fill(filled_height)
    }    

    var initialPosition;
    this.setFilledHeight = function(height){
        board.filled_height = height;
        board.initMap();
    }
    this.setFilledHeight(filled_height);
    this.setSize = function(width, height){
        board.width = width;
        board.height = height;
        initialPosition = new P(Math.ceil(board.width / 2) - 1, 2);        
    }
    this.setSize(width, height);

    //figure managing        
    this.initFigure = function(figure){
        figure.center = initialPosition.clone();        
        figure.collisionChecker = collisionChecker;
        figure.dropCallback = onDrop; 
        figure.try_alternative_positons(); 
        figure.update_cells();              
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
        figure.try_alternative_positons();

        if (canPlaceFigure(figure)){
            var f = figure.clone();
            var f2 = board.figure.clone();
            board.figure = f;
            return f2;
        }

        return figure;
    }

    function random_fill(lines = 3, fill_chance = 0.5){
        for (var x = 0; x < board.width; x++)
            for (var y = board.height - 1; y > board.height - lines - 1; y--)
                if (Math.random() <= fill_chance)
                    board.cells[x][y] = 1;
        update();
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
        for (let cell of figure.cells)
            if (inRange(cell.x, -1, board.width) || inRange(cell.y, -1, board.height) || board.cells[cell.x][cell.y] == 1)
                return false;    
        return true;
    }        

    function placeFigure(figure){
        for (let cell of figure.cells)
            board.cells[cell.x][cell.y] = 1;       
        update();        
    }   

    function update(){
        board.timecode = Date.now();
    }
}