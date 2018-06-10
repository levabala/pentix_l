//start values
var controller_preset = {
    sliding_start_delay: 120,
    sliding_interval: 30,
};
var game_preset = {
    board_width: 14,
    board_height: 25,
    lines_need: 20
};
var presets = {controller_preset: controller_preset, game_preset: game_preset};

//cookie restore
var cookie_presets = Cookies.getJSON("presets");
if (typeof cookie_presets === "undefined")
    Cookies.set("presets", {});     
else{
    controller_preset = cookie_presets.controller_preset;
    game_preset = cookie_presets.game_preset;
}

//cookie save interval
setTimeout(() => {
    setInterval(() => {        
        var presets = {
            controller_preset: {
                sliding_start_delay: controller.sliding_start_delay,
                sliding_interval: controller.sliding_interval,
                fall_speed: controller.fall_speed
            },
            game_preset: {
                board_width: game.board_width,
                board_height: game.board_height,
                lines_need: game.lines_need
            }
        };
        Cookies.set("presets", presets);               
    }, 1999);
}, 0);//2000);

//init global classes
var game = new Game(game_preset);
var controller = new ControllerKeyboard(game, {}, controller_preset);

//init vue.js model
Vue.use(VueMaterial.default);
var app = new Vue({
    el: '#app',
    data: {
        fall_speed: 1,
        sliding_start_delay: controller_preset.sliding_start_delay,
        sliding_interval: controller_preset.sliding_interval,
        lines_done: 0,
        lines_need: game_preset.lines_need,
        board_width: game_preset.board_width,
        board_height: game_preset.board_height,
        game_duration: "0m:0s:0ms"
    },
    watch: {
        lines_need: function(value, oldValue){
            game.lines_need = value;
        },
        fall_speed: function(value, oldValue){
            controller.set_falling_speed(value);
        },
        sliding_start_delay: function(value, oldValue){
            controller.set_sliding_start_delay(value);
        },
        sliding_interval: function(value, oldValue){
            controller.set_sliding_interval(value);
        }
    },
    methods: {
        restart: function(){
            controller.restart();            
        },
        updateBoardSize: function(){
            game.board_width = app.board_width;            
            game.board_height = app.board_height;                      
        },
        checkResize: function(){
            function resize(){
                renderer.init();
            }
            
            var timeout = null;
            window.onresize = function(){
              clearTimeout(timeout);
              timeout = setTimeout(resize, 200);
            };
        }
    },
    created: function() {
        window.addEventListener('resize', this.checkResize);
    },
    destroyed: function() {
        window.removeEventListener('resize', this.checkResize);
    }
});

//statistic
var statisticMiner = new StatisticMiner(game, (stats) => {    
    Vue.set(app, "lines_done", stats.lines_done);

    var elapsed = stats.game_duration;
    //var mins = Math.floor(elapsed / 1000 / 60);        
    var seconds = Math.floor(elapsed / 1000);
    var ms = elapsed - seconds * 1000;
    if (ms < 100)
        ms = "0" + ms;
    if (ms > 999)
        ms = 999;
    Vue.set(app, "game_duration", `${seconds}s:${ms}ms`);    
}, 100);
statisticMiner.start();

//init renderer (after vue.js - it's important!)
var renderer = new Renderer(document.getElementById("div_gameboard"), game.board);
var renderer_preview = new Renderer(document.getElementById("div_figure_preview"), game.board_next_figure_preview);

//connect renderers to controller
controller.renderers = [renderer, renderer_preview];

//start game
renderer.init();
renderer_preview.init();
game.start();

//socket.io
//var client = new Client();

