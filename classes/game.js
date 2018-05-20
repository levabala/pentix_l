function Game(preset){
    var game = this;  
        
    this.figureCodes = [
        [1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 0, 0, 0, 1, 1, 1],
        [1, 0 ,0, 1, 0, 0, 1, 1, 1],
        [1, 0, 0, 1, 0, 1, 0, 1, 1],
        [1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 0, 0, 0, 1, 1, 0, 1],
        [1, 0, 0, 0, 1, 1, 0, 1, 1],
        [1, 1, 0, 0, 1, 1, 0, 0, 1]
    ];    
    this.generateRandomFigure = function(){
        var index = Math.floor(Math.random() * (game.figureCodes.length - 1));
        var rotation = Math.floor(Math.random() * 3);
        var mirrorState = Math.floor(Math.random() * 2);        
        return new Figure(new P(0, 0), game.figureCodes[index], null, null, rotation, mirrorState);
    }    

    this.board = new Board(game.generateRandomFigure, lose, lineCleared); 

    //defaults
    this.fall_interval = 1000; 
    
    //stats
    this.game_duration = 0;
    this.lines_done = 0;
    this.lines_need = 20;

    this.board.initMap();
    for (var p in preset)
        this[p] = preset[p];

    var fallTimeout = null;
    var startTime = 0;        
    this.start = function(){
        game.lines_done = 0;
        game.board.initMap();
        game.board.initFigure(game.generateRandomFigure());
        game.continue();        
    }

    setInterval(timeUpdate, 33);
    function timeUpdate(){
        var nowTime = Date.now();
        var elapsed = nowTime - startTime;        
        game.game_duration = elapsed;
    }

    function fallTick(){
        fall(); 
        fallTimeout = setTimeout(fallTick, game.fall_interval);        
    }

    this.pause = function(){
        clearTimeout(fallTimeout);
    }

    this.continue = function(){
        startTime = Date.now();
        fallTick();
    }

    function fall(){
        game.board.figure.move(1);
    }        

    function lineCleared(){
        game.lines_done++;
        if (game.lines_done >= game.lines_need)
            win();
    }

    function win(){
        console.warn("WON")
    }

    function lose(){
        console.warn("GAME OVER")
    }
}