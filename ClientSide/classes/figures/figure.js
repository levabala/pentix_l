function Figure(center, code, collisionChecker, dropCallback, rotation = 0, mirrorState = 0){
    var figure = this;
    this.center = center; 
    this.code = code;
    this.rotation = rotation;
    this.mirrorState = mirrorState;
    this.layers = 1 + ((code.length > 8) ? 1 : 0);
    this.timecode = Date.now();
    this.collisionChecker = collisionChecker;
    this.dropCallback = dropCallback;

    this.replaceFigure = function(figure2){
        figure.center = figure2.center.clone();
        figure.code = figure2.code;        
        figure.rotation = figure2.rotation;        
        figure.mirrorState = figure2.mirrorState;        
        figure.layers = figure2.layers;   
        update();   
    }    

    this.rotate = function(delta, ignoreCollision = false){
        var newRotation = figure.rotation
        console.log(newRotation, delta)
        newRotation = (newRotation + 3 + delta) % 3
        console.log(newRotation)
        figure.updateComparingFigure({"rotation": newRotation});
        if (figure.collisionChecker(figure.comparingFigure) || ignoreCollision){
            figure.rotation = newRotation;
            update();
            return true;
        }         
        return false;
    }

    this.mirror = function(){
        var newMirrorState = Math.abs(figure.mirrorState - 1);
        figure.updateComparingFigure({"mirrorState": newMirrorState});
        if (figure.collisionChecker(figure.comparingFigure)){                        
            figure.mirrorState = newMirrorState;
            update();
            return true;
        }        
        return false;
    }

    this.drop = function(){        
        while(figure.move(1));            
    }

    this.vectorsMap = {
        0: new P(1, 0),
        1: new P(0, 1),
        2: new P(-1, 0),
        3: new P(0, -1)
    }    

    this.comparingFigure = null;
    this.updateComparingFigure = function(postReplace){
        if (figure.comparingFigure === null)
            figure.comparingFigure = new Figure(figure.center, figure.code, figure.collisionChecker, figure.rotation, figure.mirrorState);        
        figure.comparingFigure.replaceFigure(figure);
        for (var property in postReplace)
            figure.comparingFigure[property] = postReplace[property];
    }

    this.move = function(direction){         
        var newCenter = figure.center.clone().add(figure.vectorsMap[direction]);
        figure.updateComparingFigure({"center": newCenter});
        if (figure.collisionChecker(figure.comparingFigure)){
            figure.center = newCenter;
            update();            
            return true;
        }
        if (direction == 1)
            figure.dropCallback();
        return false;             
    }

    this.figureCellsIteration = function(action){
        
    }

    function update(){
        figure.timecode = Date.now();
    }
    
    this.clone = function(){
        return new Figure(
            figure.center.clone(), figure.code, figure.collisionChecker, 
            figure.dropCallback, figure.rotation, figure.mirrorState);
    }
}