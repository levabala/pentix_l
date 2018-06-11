function Controller(game, renderers){
    var controller = this;

    //variables
    this.renderers = renderers;

    //defaults    
    this.start_sliding_delay = 100;
    this.slide_interval = 10;    
    
    var last_action_time = Date.now();
    function registerTime(){
        var nowTime = Date.now();
        //console.log(nowTime - last_action_time);
        last_action_time = nowTime;            
    }

    this.pause = function(){
        if (game.isPlaying)
            game.pause();
        else 
            game.continue();
    }

    this.set_falling_speed = function(value){
        game.fall_interval = 1 / value * 1000;
        registerTime();
    }

    this.set_sliding_start_delay = function(value){
        controller.start_sliding_delay = value;
        registerTime();
    }

    this.set_sliding_interval = function(value){
        controller.slide_interval = value;
        registerTime();
    }

    this.next_game = function(){
        if (!game.isPlaying)
            game.start();
        registerTime();
    }

    this.restart = function(){        
        game.start();
        for (var renderer of controller.renderers)
            renderer.init();                            
        //console.log('restart')
        registerTime();
    }

    this.move_right = function(){
        if (!game.isPlaying)
            return;
        //console.log("action:", "move_right")
        game.board.figure.move(0);
        registerTime();
    }

    this.move_left = function(){
        if (!game.isPlaying)
            return;
        //console.log("action:", "move_left")
        game.board.figure.move(2);
        registerTime();
    }    

    this.move_down = function(){
        if (!game.isPlaying)
            return;
        //console.log("action:", "move_down")
        game.board.figure.move(1);
        registerTime();
    }
    
    var slidingInterval = null;    
    this.slide_left_start = function(){
        if (!game.isPlaying)
            return;
        //console.log("action:", "slide_left_start")
        clearInterval(slidingInterval);
        slidingInterval = setInterval(() => {
            controller.move_left();
        }, controller.slide_interval);
        registerTime();
    }    

    this.slide_right_start = function(){
        if (!game.isPlaying)
            return;
        //console.log("action:", "slide_right_start")
        clearInterval(slidingInterval);
        slidingInterval = setInterval(() => {
            controller.move_right();
        }, controller.slide_interval);
        registerTime();
    }

    this.slide_down_start = function(){
        if (!game.isPlaying)
            return;
        //console.log("action:", "slide_down_start")
        clearInterval(slidingInterval);
        slidingInterval = setInterval(() => {
            controller.move_down();
        }, controller.slide_interval);
        registerTime();
    }

    this.slide_stop = function(){
        if (!game.isPlaying)
            return;
        //console.log("action:", "slide_stop")
        clearInterval(slidingInterval);
        registerTime();
    }

    this.rotate_right = function(){
        if (!game.isPlaying)
            return;
        //console.log("action:", "rotate_right")
        game.board.figure.rotate_right();
        registerTime();
    }

    this.rotate_left = function(){
        if (!game.isPlaying)
            return;
        //console.log("action:", "rotate_left")
        game.board.figure.rotate_left();
        registerTime();
    }

    this.mirror = function(){
        if (!game.isPlaying)
            return;
        //console.log("action:", "mirror")
        game.board.figure.mirror();
        registerTime();
    }

    this.drop = function(){
        if (!game.isPlaying)
            return;
        //console.log("action:", "drop")
        game.board.figure.drop();
        registerTime();
    }

    this.drop_down_left = function(){
        if (!game.isPlaying)
            return;
        //console.log("action:", "drop_down_left")
        game.board.figure.drop_down_left();
        registerTime();
    }

    this.drop_down_right = function(){
        if (!game.isPlaying)
            return;
        //console.log("action:", "drop_down_right")
        game.board.figure.drop_down_right();
        registerTime();
    }

    this.exchange = function(){
        if (!game.isPlaying)
            return;
        //console.log("action:", "exchange")
        game.exchangeFigure();
        registerTime();
    }
}