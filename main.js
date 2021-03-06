//start values
var controller_preset = {
    sliding_start_delay: 120,
    sliding_interval: 30,
};
var game_preset = {
    board_width: 14,
    board_height: 25,
    lines_need: 20,
    filled_lines: 7,
    fill_chance: 0.7
};
var renderer_preset = {
    colors: {
        glass: "lightgray",
        grid: "black",
        fill: "lightblue",
        figure: "#80aaff",
        background: "#FFFFFF"
    },
    opacities: {
        glass: 0.3,
        grid: 0.1,
        fill: 1,
        figure: 1,
    },
    sub_grid_step: 5,
    horizontal_sub_grid: false,    
};
var presets = {controller_preset: controller_preset, game_preset: game_preset, renderer_preset: renderer_preset};

//cookie restore
var cookie_presets = Cookies.getJSON("presets");
if (typeof cookie_presets === "undefined" || Object.keys(cookie_presets).length == 0)
    Cookies.set("presets", {});     
else{
    controller_preset = cookie_presets.controller_preset;
    game_preset = cookie_presets.game_preset;
    renderer_preset = cookie_presets.renderer_preset;
}

//apply page background
document.getElementById("body").style.background = renderer_preset.colors.background; 


//init global classes
var game = new Game(game_preset);
var controller = new ControllerKeyboard(game, {}, controller_preset);

//init vue.js model
Vue.use(VueMaterial.default);
var app = new Vue({
    el: '#app',
    data: {
        colors: renderer_preset.colors,
        opacities: renderer_preset.opacities,
        sub_grid_step: renderer_preset.sub_grid_step,
        alt_colors: {
            glass: generateAlternativeColor(renderer_preset.colors.glass),        
            grid: generateAlternativeColor(renderer_preset.colors.grid),
            figure: generateAlternativeColor(renderer_preset.colors.figure),
            fill: generateAlternativeColor(renderer_preset.colors.fill),
            background: generateAlternativeColor(renderer_preset.colors.background),
        },        
        colorChoosing: "none",        
        showDropDown: false,
        fall_speed: 1,
        sliding_start_delay: controller_preset.sliding_start_delay,
        sliding_interval: controller_preset.sliding_interval,
        lines_done: 0,
        lines_need: game_preset.lines_need,
        board_width: game_preset.board_width,
        board_height: game_preset.board_height,
        filled_lines: game_preset.filled_lines,
        fill_chance: game_preset.fill_chance,
        game_duration: "0m:0s:0ms",     
        horizontal_sub_grid: renderer_preset.horizontal_sub_grid,
        preview_height: 100,
        hide_interface: false,                
    },
    watch: {
        filled_lines: function(value, oldValue){
            game.filled_lines = value;
        },
        fill_chance: function(value, oldValue){
            game.fill_chance = value;
        },
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
        },    
        horizontal_sub_grid: function(value, oldValue){
            renderer.horizontal_sub_grid = value;
            renderer.reset();
        }    
    },
    methods: {
        changeColor: function(event){            
            var color = event.detail[0];            
            this.$refs.colorPicker.value = color;
            this.color = color;

            var alt = generateAlternativeColor(color);
            this.alternative_color = alt;      
            
            if (this.colorChoosing == "background"){
                var body = document.getElementById("body");
                body.style.background = color;           
                body.style.color = alt;
                this.alt_color_background = alt;     
                renderer_preset.background = color;
                return;           
            }

            if (!(this.colorChoosing in this.colors))
                return;
            this.colors[this.colorChoosing] = color;
            this.alt_colors[this.colorChoosing] = alt;

            renderer.setStyle(this.colors, {});
            renderer_preview.setStyle(this.colors, {});
        },
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
        },
        updateOpacities: function(){            
            renderer.setStyle({}, this.opacities);    
            renderer_preview.setStyle({}, this.opacities);    
        },
        updateSubGrid: function(){
            renderer.sub_grid_step = parseInt(this.sub_grid_step);
            renderer.reset();
        },
        resetPalette: function(){
            var picker = document.getElementById("colorPicker");
            picker.subPalette = undefined;            
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
var renderer = new Renderer(document.getElementById("div_gameboard"), game.board, renderer_preset);
var renderer_preview = new Renderer(document.getElementById("div_figure_preview"), game.board_next_figure_preview, renderer_preset);

//connect renderers to controller
controller.renderers = [renderer, renderer_preview];

//init rendering
renderer.init();
renderer_preview.init();

//cookies save interval
var doCookies = true;
setTimeout(() => {setInterval(saveCookies, 1999)}, 0);
function saveCookies(){
    if (!doCookies) 
        return;
    var presets = {
        controller_preset: {
            sliding_start_delay: controller.sliding_start_delay,
            sliding_interval: controller.sliding_interval,
            fall_speed: controller.fall_speed
        },
        game_preset: {
            board_width: game.board_width,
            board_height: game.board_height,
            lines_need: game.lines_need,
            filled_lines: game.filled_lines,
            fill_chance: game.fill_chance
        },
        renderer_preset: {
            colors: renderer.colors,
            opacities: renderer.opacities,
            sub_grid_step: renderer.sub_grid_step,
            horizontal_sub_grid: renderer.horizontal_sub_grid,
            background: renderer_preset.background
        }
    };
    Cookies.set("presets", presets);               
}

function clearCookies(){
    doCookies = false;
    Cookies.remove("presets");               
}