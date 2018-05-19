function Game(preset){
    var game = this;        
    this.board = new Board();     

    //defaults
    this.fall_interval = 1000;
    this.slide_start_delay = 100;
    this.slide_interval = 10;    

    this.board.initMap();
    for (var p in preset)
        this[p] = preset[p];

    var fallIntervalPtr = null;
    this.start = function(){
        fallIntervalPtr = setInterval(() => {fall();}, game.fall_interval);
    }

    this.pause = function(){
        clearInterval(fallIntervalPtr);
    }

    function fall(){
        game.board.figure.move(1);
    }    
    
    var commandsMap = {
        RIGHT: () => {
            game.board.figure.move(0);
        },
        DOWN: () => {
            game.board.figure.move(1);
        },
        LEFT: () => {
            game.board.figure.move(2);
        },                
        DROP: () => {
            game.board.dropFigure();
        },
        MIRROR: () => {
            
        },
    }
    this.command = function(command){

    }
}