function Figure_Radial(){
    Figure.apply(this, arguments);        

    var figure = this;    
    this.figureCellsIteration = function(action){            
        var f = figure;//.clone();

        var maxTranspose = 1 + f.layers * 2;
        var cell = f.center.clone();
        var i = 0;        
        var rotation = f.rotation;

        if (f.code.length <= i)
        return;
        
        //check center
        //console.log(cell);
        if (f.code[i])
            if (!action(cell.clone()))
                return;
        i++;

        for (var t = 1; t <= maxTranspose; t++){
            function processAxis(){                
                var step = figure.vectorsMap[rotation].clone().multiply(t);
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

    //override cloning to our class
    this.clone = function(){
        return new Figure_Radial(
            figure.center.clone(), figure.code, figure.collisionChecker, 
            figure.dropCallback, figure.rotation, figure.mirrorState);
    }

    //and compring figure    
    this.updateComparingFigure = function(postReplace){
        if (figure.comparingFigure === null)
            figure.comparingFigure = new Figure_Radial(figure.center, figure.code, figure.collisionChecker, figure.rotation, figure.mirrorState);        
        figure.comparingFigure.replaceFigure(figure);
        for (var property in postReplace)
            figure.comparingFigure[property] = postReplace[property];
    }
}