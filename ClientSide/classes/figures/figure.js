//ES6
class Figure{
    constructor(center, code, collisionChecker, dropCallback){                
        this.center = center; 
        this.code = code;                       
        this.collisionChecker = collisionChecker;
        this.dropCallback = dropCallback;
        this.directions = {
            "RIGHT": 0,
            "DOWN": 1,
            "LEFT": 2
        };
        this.move_map = {
            0: this.move_right,
            1: this.move_down,
            2: this.move_left
        };        
        //code to cells transforming
        this.update_cells();                     
    }

    //we use "reverted" argument to have an ability to revert function action
    move_left(reverted = -1){
        this.center.x += -1 * -reverted;
    } 

    move_right(reverted = -1){
        this.center.x += 1 * -reverted;
    }

    move_down(reverted = -1){
        this.center.y += 1 * -reverted;
    }    

    //BIND PERFOMANCE IS UNDER QUESTION!
    move(direction){
        this.move_map[direction].bind(this)();
        this.update_cells(); 
        if (!this.collisionChecker(this)){
            //if collision event dispatched we revert moving
            this.move_map[direction].bind(this)(1);
            this.update_cells();        
            return false;
        }        
        return true;
    }

    drop(){
        while (this.move(this.directions.DOWN)){
            //while move() returns "true" we call move() again 
        }
        this.dropCallback();
    }

    rotate_right(){
        const not_rotated = Matrix.clone(this.code);
        const rotated = Matrix.rotate(this.code);
        this.code = rotated;
        this.update_cells();
        if (!this.collisionChecker(this) && !this.try_alternative_positons()){
            this.code = not_rotated;         
            this.update_cells();
        }
    }

    rotate_left(){
        const not_rotated = Matrix.clone(this.code);
        const rotated = Matrix.rotateCounterClockwise(this.code);
        this.code = rotated;
        this.update_cells();
        if (!this.collisionChecker(this) && !this.try_alternative_positons()){
            this.code = not_rotated;         
            this.update_cells();
        }
    }

    mirror(){
        const not_flipped = Matrix.clone(this.code);
        const flipped = Matrix.reverse(this.code);
        this.code = flipped;
        this.update_cells();
        if (!this.collisionChecker(this) && !this.try_alternative_positons()){
            this.code = not_flipped;         
            this.update_cells();
        }
    }

    try_alternative_positons(max_delta = 5){
        let basePosition = this.center.clone();
        for (let d = 0; d < max_delta; d++){
            this.center.move(d, 0);
            this.update_cells();
            if (this.collisionChecker(this))
                return true;
            this.center.move(-2 * d, 0);
            this.update_cells();
            if (this.collisionChecker(this))
                return true;            
            this.center.move(d, 0);
        }
        this.center = basePosition;
        return false;
    }

    update_cells(){
        this.cells = this.create_board_projection();
        this.update();
    }

    create_board_projection(){
        //-2 is because we have 5x5 square and offset by 2
        let cells = []
        for (let x in this.code)
            for (let y in this.code[x])
                if (this.code[x][y] == 1)
                    cells.push(new P(parseInt(x) + this.center.x - 2, parseInt(y) + this.center.y - 2));         
        return cells;
    }        

    update(){
        this.timecode = Date.now();
    }

    clone(){
        let cloned = new Figure(this.center, this.code, this.collisionChecker, this.dropCallback);        
        cloned.update_cells();
        return cloned;
    }
}