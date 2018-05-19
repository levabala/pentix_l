var g = new Game();

g.board.initFigure([1, 1, 0, 1, 1, 1]);

var renderer = new Renderer(document.getElementById("gameboard_div"), g.board);
renderer.init();

var controller = new ControllerKeyboard(g);

g.start();

