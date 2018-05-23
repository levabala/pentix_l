function Figure_Radial(){
    Figure.apply(this, arguments);    

    //через figure. доступно:
    //code
    //rotation
    //mirrorState

    //example: figure.code

    var figure = this;    
    this.figureCellsIteration = function(action){
        //вызываешь action для каждой клетки фигуры == 1
        //example: action(new P(0, 1));
    }
}