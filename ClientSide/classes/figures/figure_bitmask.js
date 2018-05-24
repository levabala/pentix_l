function Figure_Bitmask(){
    Figure.apply(this, arguments);    

    //через figure. доступно:
    //code - array
    //rotation - int от 0 до 3
    //mirrorState - int от 0 до 1

    //example: figure.code

    var figure = this;    
    this.figureCellsIteration = function(action){
        //вызываешь action для каждой клетки фигуры == 1
        //example: action(new P(0, 1));
    }
}