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
        if (newRotation > 3)     
            newRotation = 0;
        else
            if (newRotation < 0)     
                newRotation = 3;
        updateComparingFigure({"rotation": newRotation});
        if (collisionChecker(comparingFigure)){
            figure.rotation = newRotation;
            update();
            return true;
        }         
        return false;
    }

    this.mirror = function(){
        var newMirrorState = Math.abs(figure.mirrorState - 1);
        updateComparingFigure({"mirrorState": newMirrorState});
        if (collisionChecker(comparingFigure)){
            figure.mirrorState = newMirrorState;
            update();
            return true;
        }        
        return false;
    }






    /*


    какая-то дичь с коллизией
    неверно генерится comparingFigure



    */

    this.drop = function(){        
        while(figure.move(1))
            dropCallback();                    
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
            return true;
        }
        return false;             
    }

    this.figureCellsIteration = function(action){
        var f = figure.clone();

        var maxTranspose = 1 + f.layers * 2;
        var cell = f.center.clone();
        var i = 0;        
        var rotation = f.rotation;

        if (f.code.length <= i)
        return;
        
        //check center
        //console.log(cell);
        if (f.code[i])
            if (!action(cell))
                return;
        i++;

        for (var t = 1; t <= maxTranspose; t++){
            function processAxis(){                
                var step = vectorsMap[rotation].clone().multiply(t);
                //console.log("step:",step)
                while (step.x != 0 && f.code.length > i){            
                    var delta = Math.sign(step.x);
                    cell.add(new P(delta, 0))                    
                    //console.log(cell);           
                    if (f.code[i])
                        if (!action(cell.clone()))
                            return false;            
                    i++;     
                    step.x -= delta;           
                }
                while (step.y != 0 && f.code.length > i){            
                    var delta = Math.sign(step.y);
                    cell.add(new P(0, delta))                    
                    //console.log(cell);           
                    if (f.code[i])
                        if (!action(cell.clone()))
                            return false;            
                    i++;                
                    step.y -= delta;           
                }

                return true;
            }

            //by first axis    
            if (!processAxis())            
                return;
            if (f.code.length <= i)
                    break;

            //now rotate
            rotation += f.mirrorState * 2 - 1; //0 -> -1 && 1 -> 1
            if (rotation > 3)
                rotation = 0;
            else if (rotation < 0)
                rotation = 3;

            //by second axis
            if (!processAxis())            
                return;
            if (f.code.length <= i)
                    break;

            //now rotate
            rotation += f.mirrorState * 2 - 1; 
            if (rotation > 3)
                rotation = 0;
            else if (rotation < 0)
                rotation = 3;
        }
    }

    function update(){
        figure.timecode = Date.now();
    }
    
    this.clone = function(){
        return new Figure(figure.center.clone(), figure.code, collisionChecker, dropCallback, figure.rotation, figure.mirrorState);
    }
}