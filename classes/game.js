function Game(preset){
    var game = this;  
        
    this.figureCodes = [
        [1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1], //гы
        [1, 1, 0, 0, 0, 1, 1, 1],
        [1, 0 ,0, 1, 0, 0, 1, 1, 1],
        [1, 0, 0, 1, 0, 1, 0, 1, 1],
        [1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,1], //гы х2
        [1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 0, 1, 0, 1, 0, 1]        
    ];    
    this.generateRandomFigure = function(){
        var index = Math.floor(Math.random() * (game.figureCodes.length - 1));
        var rotation = Math.floor(Math.random() * 3);
        var mirrorState = Math.floor(Math.random() * 2);        
        return new Figure(new P(0, 0), game.figureCodes[index], null, null, rotation, mirrorState);
    }    

    this.board = new Board(game.generateRandomFigure, lineCleared); 

    //defaults
    this.fall_interval = 1000;    

    this.board.initMap();
    for (var p in preset)
        this[p] = preset[p];

    var fallTimeout = null;
    this.start = function(){
        fallTick();
    }

    function fallTick(){
        fall(); 
        fallTimeout = setTimeout(fallTick, game.fall_interval);        
    }

    this.pause = function(){
        clearTimeout(fallTimeout);
    }

    function fall(){
        game.board.figure.move(1);
    }        

    function lineCleared(){
        console.warn("WOW!");
    }
}