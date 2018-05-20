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
        sliding_interval: 30,
        lines_done: 0,
        lines_need: 20,
        game_duration: "0m:0s:0ms"
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

//statistic
var statisticMiner = new StatisticMiner(g, (stats) => {    
    Vue.set(app, "lines_done", stats.lines_done);
    Vue.set(app, "lines_need", stats.lines_need);

    var elapsed = stats.game_duration
    //var mins = Math.floor(elapsed / 1000 / 60);        
    var seconds = Math.floor(elapsed / 1000);
    var ms = elapsed - seconds * 1000;
    if (ms < 100)
        ms = "0" + ms;
    Vue.set(app, "game_duration", `${seconds}s:${ms}ms`);    
}, 100);
statisticMiner.start();

//init renderer (after vue.js - it's important!)
var renderer = new Renderer(document.getElementById("div_gameboard"), g.board);

//start game
renderer.init();
g.start();

