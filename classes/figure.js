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
        var newRotation = figure.rotation + delta;
        newRotation = (newRotation + 4 + delta) % 4
        updateComparingFigure({"rotation": newRotation});
        if (figure.collisionChecker(comparingFigure) || ignoreCollision){
            figure.rotation = newRotation;
            update();
            return true;
        }         
        return false;
    }

    this.mirror = function(){
        var newMirrorState = Math.abs(figure.mirrorState - 1);
        updateComparingFigure({"mirrorState": newMirrorState});
        if (figure.collisionChecker(comparingFigure)){                        
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

    var comparingFigure = null;
    function updateComparingFigure(postReplace){
        if (comparingFigure === null)
            comparingFigure = new Figure(center, figure.code, collisionChecker, figure.rotation, figure.mirrorState);        
        comparingFigure.replaceFigure(figure);
        for (var property in postReplace)
            comparingFigure[property] = postReplace[property];
    }

    this.move = function(direction){         
        var newCenter = figure.center.clone().add(figure.vectorsMap[direction]);
        updateComparingFigure({"center": newCenter});
        if (figure.collisionChecker(comparingFigure)){
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