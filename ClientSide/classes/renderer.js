function Renderer(div, board, preset = {}){
    var r = this;
    this.div = div;
    this.board = board;
    this.scaledWidth = 0;
    this.scaledHeight = 0;   
    this.colors = {
        net_background: "lightgray",
        net_lines: "black",
        filled_cells: "lightblue",
        figure_cells: "#80aaff",
    };
    this.opacity = {
        net_background: 0.3,
        net_lines: 0.1,
        filled_cells: 1,
        figure_cells: 1,
    };
    for (let property in preset)
        for (let property2 in preset[property])
            this[property][property2] = preset[property][property2];
    this.draw = SVG(div);        
    var mainGroup = this.draw.group();   
    var scaleNested = this.draw.nested();
    mainGroup.add(scaleNested);     

    var netNested = scaleNested.nested();
    var cellsNested = scaleNested.nested();
    var figureNested = scaleNested.nested(); 

    var scale = 1;        
    var div_jq = $(div);
    this.rescale = function(){          
        var width = div_jq.width();  
        var height = div_jq.height();
        mainGroup.scale(1 / scale, 1 / scale);
        scale = Math.round(Math.min(width * 0.99 / board.width, height * 0.99 / board.height) * 100) / 100;                
        r.scaledWidth = width / scale;
        r.scaledHeight = height / scale;
        mainGroup.scale(scale, scale);

        var maxSide = Math.max(width, height);        
        div_jq.css("width", board.width * height / board.height + "px");        
    }

    this.init = function(){
        scale = 1;  
        //div_jq.css("width", "");
        r.draw.remove();
        r.draw = SVG(div);        
        mainGroup = this.draw.group();
        scaleNested = this.draw.nested();                        
        cellsNested = scaleNested.nested();
        figureNested = scaleNested.nested();
        netNested = scaleNested.nested();
        mainGroup.add(scaleNested);

        //triple rescale to normalize containing div 
        r.rescale();                           
        r.rescale();
        r.rescale();                                 
        
        scaleNested.rect(board.width, board.height).attr(
                {
                    stroke: "none", 
                    "stroke-width": 0.1, 
                    fill: renderer.colors.net_background, 
                    "fill-opacity": renderer.opacity.net_background}
            );                        

        drawCells();
        drawFigure();
        drawNet();                

        //r.launchRescaleTimer();
        r.launchRedrawTimer();
    }    

    this.updateNet = function(){
        scaleNested.remove(netNested);
        netNested = scaleNested.nested();
        drawNet();
    }

    this.setStyle = function(colors = {}, opacities = {}){
        for (let property in colors)
            renderer.colors[property] = colors[property];
        for (let property in opacities)
            renderer.opacities[property] = opacities[property];
        
        renderer.init();
    }

    var lastBoardTimecode = 0;
    var lastFigureTimecode = 0;
    var redrawInterval = null;
    this.launchRedrawTimer = function(){
        clearInterval(redrawInterval)
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
        clearInterval(rescaleInterval)
        rescaleInterval = setInterval(() => {
            r.rescale();
        }, 100);
    }

    function redraw(){

    }

    function drawNet(){     
        netNested.clear();   
        for (var x = 0; x <= board.width; x++)
            netNested.add(r.draw.line(x, 0, x, board.height).stroke(
                {
                    width: 0.1, opacity: renderer.opacity.net_lines, color: renderer.colors.net_lines
                }));
        for (var y = 0; y <= board.height; y++)
            netNested.add(r.draw.line(0, y, board.width, y).stroke(
                {
                    width: 0.1, opacity: renderer.opacity.net_lines, color: renderer.colors.net_lines
                }));
    }

    function drawCells(){        
        cellsNested.clear();        
        for (var x = 0; x < board.width; x++)
            for (var y = 0; y < board.height; y++){
                if (board.cells[x][y] != 1)
                    continue;
                var rect = cellsNested.rect(1, 1).center(x + 0.5, y + 0.5).fill(
                    {color: renderer.colors.filled_cells}
                );
            }
    }

    function drawFigure(){
        figureNested.clear();        
        if (r.board.figure)
            for (let cell of r.board.figure.cells)
                figureNested.rect(1, 1).center(cell.x + 0.5, cell.y + 0.5).fill(
                    {color: renderer.colors.figure_cells}
                );
    }
}