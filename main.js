//init global classes
var g = new Game();
var controller = new ControllerKeyboard(g);

//init vue.js model
Vue.use(VueMaterial.default);
var app = new Vue({
    el: '#app',
    data: {
        fall_speed: 1,
        sliding_start_delay: 50,
        sliding_interval: 30
    },
    watch: {
        "fall_speed": function(value, oldValue){
            controller.set_falling_speed(value);
        },
        "sliding_start_delay": function(value, oldValue){
            controller.set_sliding_start_delay(value);
        },
        "sliding_interval": function(value, oldValue){
            controller.set_sliding_interval(value);
        }
    }
});

//init renderer (after vue.js - it's important!)
var renderer = new Renderer(document.getElementById("gameboard_div"), g.board);

//start game
g.board.initFigure(g.generateRandomFigure());
renderer.init();
g.start();

