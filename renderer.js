function Renderer(div, board){
    var r = this;
    this.div = div;
    this.board = board;
    this.scaledWidth = 0;
    this.scaledHeight = 0;    
    this.draw = SVG(div);
    var mainGroup = this.draw.group();   
    var scaleNested = this.draw.nested();
    mainGroup.add(scaleNested);     

    var netNested = scaleNested.nested();
    var cellsNested = scaleNested.nested();
    var figureNested = scaleNested.nested();

    window.scaleNested = scaleNested;
    window.netNested = netNested;    

    var scale = 1;        

    this.rescale = function(){        
        mainGroup.scale(1 / scale, 1 / scale);
        scale = Math.round(Math.min(div.offsetWidth / board.width, div.offsetHeight / board.height) * 100) / 100;                
        r.scaledWidth = div.offsetWidth / scale;
        r.scaledHeight = div.offsetHeight / scale;
        mainGroup.scale(scale, scale);
    }

    this.init = function(){
        r.draw.clear();
        mainGroup = this.draw.group();
        scaleNested = this.draw.nested();                        
        cellsNested = scaleNested.nested();
        figureNested = scaleNested.nested();
        netNested = scaleNested.nested();
        mainGroup.add(scaleNested);
        r.rescale();                   
        
        var rect = scaleNested.rect(board.width, board.height).attr({stroke: "none", "stroke-width": 0.1, fill: "lightgray", "fill-opacity": 0.3});                
        scaleNested.center(r.scaledWidth / 4, 0);//r.scaledHeight / 2);        
        //mainGroup.add(rect)

        drawCells();
        drawFigure();
        drawNet();                

        r.launchRescaleTimer();
        r.launchRedrawTimer();
    }

    var lastBoardTimecode = 0;
    var lastFigureTimecode = 0;
    var redrawInterval = null;
    this.launchRedrawTimer = function(){
        redrawInterval = setInterval(() => {
            if (board.timecode != lastBoardTimecode){
                board.timecode = lastBoardTimecode;
                drawCells();                                            
            }
            if (board.figure.timecode != lastFigureTimecode){
                board.figure.timecode = lastFigureTimecode;
                drawFigure();                                                       
            }
        }, 16);
    }

    var rescaleInterval = null;
    this.launchRescaleTimer = function(){
        rescaleInterval = setInterval(() => {
            //r.rescale();
        }, 100);
    }

    function redraw(){

    }

    function drawNet(){     
        netNested.clear();   
        for (var x = 0; x <= board.width; x++)
            netNested.add(r.draw.line(x, 0, x, board.height).stroke({width: 0.1, opacity: 0.1}));//.attr({"stroke-opacity": 0.1}));
        for (var y = 0; y <= board.height; y++)
            netNested.add(r.draw.line(0, y, board.width, y).stroke({width: 0.1, opacity: 0.1}));//.attr({"stroke-opacity": 0.1}));
    }

    function drawCells(){
        cellsNested.clear();
        for (var x = 0; x < board.width; x++)
            for (var y = 0; y < board.height; y++){
                if (board.cells[x][y] != 1)
                    continue;
                var rect = cellsNested.rect(1, 1).center(x + 0.5, y + 0.5).fill({color: "lightblue"});
            }
    }

    function drawFigure(){
        figureNested.clear();        
        board.figure.figureCellsIteration((cell) => {
            var rect = figureNested.rect(1, 1).center(cell.x + 0.5, cell.y + 0.5).fill({color: "lightblue"});
            return true;
        });
    }
}