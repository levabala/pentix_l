function Controller(game){
    var controller = this;

    //defaults    
    //this.slide_start_delay = 100;
    this.slide_interval = 10;    

    this.move_right = function(){
        console.log("action:", "move_right")
        game.board.figure.move(0);
    }

    this.move_left = function(){
        console.log("action:", "move_left")
        game.board.figure.move(2);
    }    

    this.move_down = function(){
        console.log("action:", "move_down")
        game.board.figure.move(1);
    }
    
    var slidingInterval = null;    
    this.slide_left_start = function(){
        console.log("action:", "slide_left_start")
        clearInterval(slidingInterval);
        slidingInterval = setInterval(() => {
            controller.move_left();
        }, controller.slide_interval);
    }    

    this.slide_right_start = function(){
        console.log("action:", "slide_right_start")
        clearInterval(slidingInterval);
        slidingInterval = setInterval(() => {
            controller.move_right();
        }, controller.slide_interval);
    }

    this.slide_down_start = function(){
        console.log("action:", "slide_down_start")
        clearInterval(slidingInterval);
        slidingInterval = setInterval(() => {
            controller.move_down();
        }, controller.slide_interval);
    }

    this.slide_stop = function(){
        console.log("action:", "slide_stop")
        clearInterval(slidingInterval);
    }

    this.rotate = function(){
        console.log("action:", "rotate")
        game.board.figure.rotate(1);
    }

    this.mirror = function(){
        console.log("action:", "mirror")
        game.board.figure.mirror();
    }

    this.drop = function(){
        console.log("action:", "drop")
        game.board.figure.drop();
    }

    this.exchange = function(){
        console.log("action:", "exchange")
        //nothing here yet 
    }
}