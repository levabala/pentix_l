function Figure(center, code, collisionChecker, dropCallback, rotation = 0, mirrorState = 0){
    var figure = this;
    this.center = center; 
    this.code = code;
    this.rotation = rotation;
    this.mirrorState = mirrorState;
    this.layers = 1 + ((code.length > 8) ? 1 : 0);
    this.timecode = Date.now();

    this.replaceFigure = function(figure2){
        figure.code = figure2.code;        
        figure.rotation = figure2.rotation;        
        figure.mirrorState = figure2.mirrorState;        
        figure.layers = figure2.layers;   
        update();   
    }    

    this.rotate = function(delta){
        var newRotation = figure.rotation + delta;
        newRotation = inRange(newRotation, 0, 3);        
        updateComparingFigure({"rotation": newRotation});
        if (collisionChecker(comparingFigure)){
            figure.rotation = newRotation;
            update();
        }
        else 
            return false;
    }

    this.mirror = function(){
        var newMirrorState = Math.abs(figure.mirrorState - 1);
        updateComparingFigure({"mirrorState": newMirrorState});
        if (collisionChecker(comparingFigure)){
            figure.mirrorState = newMirrorState;
            update();
        }
        else 
            return false;
    }

    this.drop = function(){        
        while(figure.move(1)){
            dropCallback();
            return;
        }
    }

    var vectorsMap = {
        0: new P(1, 0),
        1: new P(0, 1),
        2: new P(-1, 0),
        3: new P(0, -1)
    }    

    var comparingFigure = null;
    function updateComparingFigure(postReplace){
        if (comparingFigure === null)
            comparingFigure = new Figure(center, figure.code, collisionChecker, figure.rotation, figure.mirrorState);        
        comparingFigure.replaceFigure(figure);
        for (var property in postReplace)
            comparingFigure[property] = postReplace[property];
    }

    this.move = function(direction){         
        var newCenter = figure.center.clone().add(vectorsMap[direction]);
        updateComparingFigure({"center": newCenter});
        if (collisionChecker(comparingFigure)){
            figure.center = newCenter;
            update();
        }
        else 
            return false;
    }

    this.figureCellsIteration = function(action){
        var maxTranspose = 1 + figure.layers * 2;
        var cell = figure.center.clone();
        var i = 0;        
        var rotation = figure.rotation;

        if (figure.code.length <= i)
        return;
        
        //check center
        //console.log(cell);
        if (figure.code[i])
            if (!action(cell))
                return;
        i++;

        for (var t = 1; t <= maxTranspose; t++){
            function processAxis(){                
                var step = vectorsMap[rotation].clone().multiply(t);
                //console.log("step:",step)
                while (step.x != 0 && figure.code.length > i){            
                    var delta = Math.sign(step.x);
                    cell.add(new P(delta, 0))
                    //console.log(cell);           
                    if (figure.code[i])
                        if (!action(cell))
                            break;            
                    i++;     
                    step.x -= delta;           
                }
                while (step.y != 0 && figure.code.length > i){            
                    var delta = Math.sign(step.y);
                    cell.add(new P(0, delta))
                    //console.log(cell);           
                    if (figure.code[i])
                        if (!action(cell))
                            break;            
                    i++;                
                    step.y -= delta;           
                }
            }

            //by first axis    
            processAxis();
            if (figure.code.length <= i)
                    break;

            //now rotate
            rotation += figure.mirrorState * 2 - 1; //0 -> -1 && 1 -> 1
            if (rotation > 3)
                rotation = 0;
            else if (rotation < 0)
                rotation = 3;

            //by second axis
            processAxis();
            if (figure.code.length <= i)
                    break;

            //now rotate
            rotation += figure.mirrorState * 2 - 1; 
            if (rotation > 3)
                rotation = 0;
            else if (rotation < 0)
                rotation = 3;
        }
    }

    function update(){
        figure.timecode = Date.now();
    }
}