var g = new Game();

g.board.initFigure(g.generateRandomFigure());

var renderer = new Renderer(document.getElementById("gameboard_div"), g.board);
renderer.init();

var controller = new ControllerKeyboard(g);

g.start();

