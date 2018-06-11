function Game(preset = {}){
    var game = this;      
    this.figureCodes = [
        [[0,0,0,0,0],[0,0,0,0,0],[1,1,1,1,1],[0,0,0,0,0],[0,0,0,0,0],],
		[[0,0,0,0,0],[0,0,0,1,0],[0,1,1,1,0],[0,0,0,1,0],[0,0,0,0,0],],
		[[0,0,0,0,0],[0,0,1,1,0],[0,1,1,1,0],[0,0,0,0,0],[0,0,0,0,0],],
		[[0,0,0,0,0],[0,0,1,0,0],[0,1,1,1,0],[0,0,1,0,0],[0,0,0,0,0],],
		[[0,0,0,0,0],[0,0,0,1,0],[0,1,1,1,0],[0,0,1,0,0],[0,0,0,0,0],],
		[[0,0,0,0,0],[0,0,1,1,0],[0,1,1,0,0],[0,1,0,0,0],[0,0,0,0,0],],
		[[0,0,0,0,0],[0,1,1,1,0],[0,1,0,0,0],[0,1,0,0,0],[0,0,0,0,0],],
		[[0,0,0,0,0],[0,0,0,0,0],[1,1,1,1,0],[0,0,0,1,0],[0,0,0,0,0],],
		[[0,0,0,0,0],[0,0,0,0,0],[1,1,1,1,0],[0,0,1,0,0],[0,0,0,0,0],],
		[[0,0,0,0,0],[0,0,1,1,0],[1,1,1,0,0],[0,0,0,0,0],[0,0,0,0,0],],
		[[0,0,0,0,0],[0,0,0,1,0],[0,1,1,1,0],[0,1,0,0,0],[0,0,0,0,0],],
		[[0,0,0,0,0],[0,1,0,1,0],[0,1,1,1,0],[0,0,0,0,0],[0,0,0,0,0],]
    ];    
    this.figureCodes = this.figureCodes.map(figa => Matrix.rotate(Matrix.reverse(figa)));
    this.generateRandomFigure = function(){
        var index = Math.floor(Math.random() * (game.figureCodes.length));        
        return new Figure(new P(0, 0), game.figureCodes[index]);
    };
    //defaults
    this.board_width = 14;
    this.board_height = 25;
    this.fall_interval = 1000; 
    this.lines_need = 20;
    this.filled_lines = 5;
    this.fill_chance = 0.7;
    for (let property in preset)
        this[property] = preset[property];

    this.board = new Board(lose, lineCleared, figureDropped, this.board_width, this.board_height, this.filled_lines, this.fill_chance); 
    this.board_next_figure_preview = new Board(() => {}, () => {}, () => {}, 5, 5, 0);    
    
    //stats
    this.isPlaying = false;
    this.game_duration = 0;
    this.lines_done = 0;    

    //variables
    this.reserved_figure = game.generateRandomFigure();    

    this.board.initMap();
    updatePreviewBoard();
    for (var p in preset)
        this[p] = preset[p];

    var fallTimeout = null;
    var startTime = 0;        
    this.start = function(){        
        game.reserved_figure = game.generateRandomFigure(); 
        game.board.setSize(game.board_width, game.board_height);
        game.board.setFilledHeight(game.filled_lines);
        game.board.setFillChance(game.fill_chance);
        updatePreviewBoard();
        game.isPlaying = true;
        game.lines_done = 0;
        game.board.initMap();
        game.board.initFigure(game.generateRandomFigure());
        clearTimeout(fallTimeout);
        game.continue();                        
    }

    var timeInterval = null;
    function timeUpdate(){
        var nowTime = Date.now();
        var elapsed = nowTime - startTime;        
        game.game_duration = elapsed;
    }

    function fallTick(){
        if (!game.isPlaying)
            return;
        fall(); 
        fallTimeout = setTimeout(fallTick, game.fall_interval);        
    }

    this.exchangeFigure = function(){
        var figure = game.board.exchangeFigure(game.reserved_figure);        
        game.reserved_figure = figure;
        updatePreviewBoard();
    }

    this.pause = function(){
        clearTimeout(fallTimeout);
        clearInterval(timeInterval);
    }

    this.continue = function(){
        startTime = Date.now();        
        fallTick();
        clearInterval(timeInterval);
        timeInterval = setInterval(timeUpdate, 33);
    }

    function fall(){
        if (!game.board.figure.move(1))
            game.board.figure.drop();
    }        

    function lineCleared(){
        game.lines_done++;
        if (game.lines_done >= game.lines_need)
            win();
    }

    function figureDropped(){
        game.board.initFigure(game.reserved_figure.clone());
        game.reserved_figure = game.generateRandomFigure();    
        updatePreviewBoard();    
    }

    function updatePreviewBoard(){                
        game.board_next_figure_preview.initMap();
        game.board_next_figure_preview.initFigure(game.reserved_figure);
    }

    function win(){
        console.warn("WON")
        game.pause();

        game.isPlaying = false;
    }

    function lose(){
        console.warn("GAME OVER")
        game.pause();

        game.isPlaying = false;
    }
}