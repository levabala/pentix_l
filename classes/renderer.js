function Renderer(div, board, preset = {}){
    var r = this;
    this.div = div;
    this.board = board;
    this.scaledWidth = 0;
    this.scaledHeight = 0;   
    this.sub_grid_step = 5;
    this.horizontal_sub_grid = false;    
    this.colors = {
        glass: "lightgray",
        grid: "black",
        fill: "lightblue",
        figure: "#80aaff",
    };
    this.opacities = {
        glass: 0.7,
        grid: 0.2,
        sub_grid: 0.2,
        fill: 1,
        figure: 1,
    };
    for (let property in preset)
        if (typeof preset[property] === "object")
            for (let property2 in preset[property])
                this[property][property2] = preset[property][property2];
        else
            this[property] = preset[property];
    this.draw = SVG(div);        
    var mainGroup = this.draw.group();   
    var scaleNested = this.draw.nested();
    mainGroup.add(scaleNested);     

    var gridNested = scaleNested.nested();
    var cellsNested = scaleNested.nested();
    var figureNested = scaleNested.nested(); 

    var scale = 1;        
    var div_jq = $(div);
    var lastDivWidth = 0;
    var lastDivHeight = 0;
    this.rescale = function(){          
        var width = lastDivWidth = div_jq.width();  
        var height = lastDivHeight = div_jq.height();
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

        //triple rescale to normalize containing div 
        r.rescale();                           
        r.rescale();
        r.rescale();                                 
        
        var rect = scaleNested.rect(board.width, board.height).attr(
                {
                    stroke: "none", 
                    "stroke-width": 0.1, 
                    fill: renderer.colors.glass, 
                    "fill-opacity": renderer.opacities.glass}
            );                        

        cellsNested = scaleNested.nested();
        figureNested = scaleNested.nested();
        gridNested = scaleNested.nested();
        mainGroup.add(scaleNested);
        drawCells();
        drawFigure();
        drawNet();                

        r.launchRescaleTimer();
        r.launchRedrawTimer();
    }    

    this.reset = this.init; // :)

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
            if (!board.figure)
                return;
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
            if (Math.abs(div_jq.width() - lastDivWidth) + Math.abs(div_jq.height() - lastDivHeight) > 2)            
                r.init();
        }, 100);
    }

    function redraw(){

    }

    function drawNet(){     
        gridNested.clear();   
        //main grid
        for (var x = 0; x <= board.width; x++)
            gridNested.add(r.draw.line(x, 0, x, board.height).stroke(
                {
                    width: 0.1, opacity: renderer.opacities.grid, color: renderer.colors.grid
                }));
        for (var y = 0; y <= board.height; y++)
            gridNested.add(r.draw.line(0, y, board.width, y).stroke(
                {
                    width: 0.1, opacity: renderer.opacities.grid, color: renderer.colors.grid
                }));
        //sub grid
        if (renderer.sub_grid_step < board.width)
            for (var x = 0; x <= board.width; x+=renderer.sub_grid_step)
                gridNested.add(r.draw.line(x, 0, x, board.height).stroke(
                    {
                        width: 0.1, opacity: renderer.opacities.sub_grid, color: renderer.colors.sub_grid
                    }));
        if (renderer.horizontal_sub_grid && renderer.sub_grid_step < board.height)
            for (var y = 0; y <= board.height; y+=renderer.sub_grid_step)
                gridNested.add(r.draw.line(0, y, board.width, y).stroke(
                    {
                        width: 0.1, opacity: renderer.opacities.sub_grid, color: renderer.colors.sub_grid
                    }));
    }

    function drawCells(){        
        cellsNested.clear();        
        for (var x = 0; x < board.width; x++)
            for (var y = 0; y < board.height; y++){
                if (board.cells[x][y] != 1)
                    continue;
                var rect = cellsNested.rect(1, 1).center(x + 0.5, y + 0.5).fill(
                    {color: renderer.colors.fill, "opacity": renderer.opacities.fill}
                );
            }
    }

    function drawFigure(){
        figureNested.clear();        
        if (r.board.figure)
            for (let cell of r.board.figure.cells)
                figureNested.rect(1, 1).center(cell.x + 0.5, cell.y + 0.5).fill(
                    {color: renderer.colors.figure, "opacity": renderer.opacities.figure}
                );
    }
}