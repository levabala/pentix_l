function Controller(game){
    var controller = this;

    //defaults    
    this.start_sliding_delay = 100;
    this.slide_interval = 10;    
    
    this.set_falling_speed = function(value){
        game.fall_interval = 1 / value * 1000;
    }

    this.set_sliding_start_delay = function(value){
        controller.start_sliding_delay = value;
    }

    this.set_sliding_interval = function(value){
        controller.slide_interval = value;
    }

    this.next_game = function(){
        if (!game.isPlaying)
            game.start();
    }

    this.restart = function(){
        game.start();
    }

    this.move_right = function(){
        if (!game.isPlaying)
            return;
        console.log("action:", "move_right")
        game.board.figure.move(0);
    }

    this.move_left = function(){
        if (!game.isPlaying)
            return;
        console.log("action:", "move_left")
        game.board.figure.move(2);
    }    

    this.move_down = function(){
        if (!game.isPlaying)
            return;
        console.log("action:", "move_down")
        game.board.figure.move(1);
    }
    
    var slidingInterval = null;    
    this.slide_left_start = function(){
        if (!game.isPlaying)
            return;
        console.log("action:", "slide_left_start")
        clearInterval(slidingInterval);
        slidingInterval = setInterval(() => {
            controller.move_left();
        }, controller.slide_interval);
    }    

    this.slide_right_start = function(){
        if (!game.isPlaying)
            return;
        console.log("action:", "slide_right_start")
        clearInterval(slidingInterval);
        slidingInterval = setInterval(() => {
            controller.move_right();
        }, controller.slide_interval);
    }

    this.slide_down_start = function(){
        if (!game.isPlaying)
            return;
        console.log("action:", "slide_down_start")
        clearInterval(slidingInterval);
        slidingInterval = setInterval(() => {
            controller.move_down();
        }, controller.slide_interval);
    }

    this.slide_stop = function(){
        if (!game.isPlaying)
            return;
        console.log("action:", "slide_stop")
        clearInterval(slidingInterval);
    }

    this.rotate_right = function(){
        if (!game.isPlaying)
            return;
        console.log("action:", "rotate_right")
        game.board.figure.rotate_right();
    }

    this.rotate_left = function(){
        if (!game.isPlaying)
            return;
        console.log("action:", "rotate_left")
        game.board.figure.rotate_left();
    }

    this.mirror = function(){
        if (!game.isPlaying)
            return;
        console.log("action:", "mirror")
        game.board.figure.mirror();
    }

    this.drop = function(){
        if (!game.isPlaying)
            return;
        console.log("action:", "drop")
        game.board.figure.drop();
    }

    this.exchange = function(){
        if (!game.isPlaying)
            return;
        console.log("action:", "exchange")
        game.exchangeFigure();
    }
}