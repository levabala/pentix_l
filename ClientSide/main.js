//start values
var controller_preset = new Preset("_base_controller", {
    sliding_start_delay: 120,
    sliding_interval: 30,
});
var game_preset = new Preset("_base_game", {
    board_width: 15,
    board_height: 25,
    lines_need: 20,
    filled_lines: 7,
    fill_chance: 0.7
});
var renderer_preset = new Preset("_base_renderer", {
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
    horizontal_sub_grid: false
});
var presets_manager = new PresetsManager([game_preset], [renderer_preset], [controller_preset]);
//shortcut
var pm = presets_manager;

//for cookies updating
var preset_updated_time = Date.now();
var preset_updated = false;

//cookies restore
/*if (document.cookie[0] != "{")
    document.cookie = "{}";
else {
    var cookie_all_presets = JSON.parse(document.cookie);
    if (Object.keys(cookie_all_presets).length > 0)
        presets_manager.setPresets(cookie_all_presets.presets, cookie_all_presets.presets_active);
}
console.log(pm.presets_active.renderer.data)*/

//apply page background
document.getElementById("body").style.background = pm.presets_active[Preset.RENDERER].data.colors.background; 


//init global classes
var game = new Game(pm.presets_active.game.data);
var controller = new ControllerKeyboard(game, {}, pm.presets_active.controller.data);

//init vue.js model
Vue.use(VueMaterial.default);
var app = new Vue({
    el: '#app',
    data: {
        colors: pm.presets_active.renderer.data.colors,
        opacities: pm.presets_active.renderer.data.opacities,
        sub_grid_step: pm.presets_active.renderer.data.sub_grid_step,
        alt_colors: {
            glass: generateAlternativeColor(pm.presets_active.renderer.data.colors.glass),        
            grid: generateAlternativeColor(pm.presets_active.renderer.data.colors.grid),
            figure: generateAlternativeColor(pm.presets_active.renderer.data.colors.figure),
            fill: generateAlternativeColor(pm.presets_active.renderer.data.colors.fill),
            background: generateAlternativeColor(pm.presets_active.renderer.data.colors.background),
        },        
        colorChoosing: "none",        
        showDropDown: false,
        fall_speed: 1,
        sliding_start_delay: pm.presets_active.controller.data.sliding_start_delay,
        sliding_interval: pm.presets_active.controller.data.sliding_interval,
        lines_done: 0,
        lines_need: pm.presets_active.game.data.lines_need,
        board_width: pm.presets_active.game.data.board_width,
        board_height: pm.presets_active.game.data.board_height,
        filled_lines: pm.presets_active.game.data.filled_lines,
        fill_chance: pm.presets_active.game.data.fill_chance,
        game_duration: "0m:0s:0ms",     
        horizontal_sub_grid: pm.presets_active.renderer.data.horizontal_sub_grid,
        preview_height: 100,
        hide_interface: false,                
    },
    watch: {
        filled_lines: function(value, oldValue){
            game.filled_lines = value;
            preset_updated = Date.now();
            preset_updated = true;
        },
        fill_chance: function(value, oldValue){
            game.fill_chance = value;
            preset_updated = Date.now();
            preset_updated = true;
        },
        lines_need: function(value, oldValue){
            game.lines_need = value;
            preset_updated = Date.now();
            preset_updated = true;
        },
        fall_speed: function(value, oldValue){
            controller.set_falling_speed(value);
            preset_updated = Date.now();
            preset_updated = true;
        },
        sliding_start_delay: function(value, oldValue){
            controller.set_sliding_start_delay(value);
            preset_updated = Date.now();
            preset_updated = true;
        },
        sliding_interval: function(value, oldValue){
            controller.set_sliding_interval(value);
            preset_updated = Date.now();
            preset_updated = true;
        },    
        horizontal_sub_grid: function(value, oldValue){
            renderer.horizontal_sub_grid = value;
            renderer.reset();
            preset_updated = Date.now();
            preset_updated = true;
        }    
    },
    methods: {
        changeColor: function(event){            
            var color = event.detail[0];            
            this.$refs.colorPicker.value = color;
            this.color = color;

            var alt = generateAlternativeColor(color);
            this.alternative_color = alt;      
            
            preset_updated = Date.now();
            preset_updated = true;

            if (this.colorChoosing == "background"){
                var body = document.getElementById("body");
                body.style.background = color;           
                body.style.color = alt;                
            }

            if (!(this.colorChoosing in this.colors))
                return;
            this.colors[this.colorChoosing] = color;
            this.alt_colors[this.colorChoosing] = alt;

            renderer.setStyle(this.colors, {});
            renderer_preview.setStyle(this.colors, {});
            renderer_preview.init();
        },
        restart: function(){
            controller.restart();            
        },
        updateBoardSize: function(){
            game.board_width = app.board_width;            
            game.board_height = app.board_height;    
            preset_updated = Date.now();    
            preset_updated = true;              
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
            preset_updated = Date.now(); 
            preset_updated = true;
        },
        updateSubGrid: function(){
            renderer.sub_grid_step = parseInt(this.sub_grid_step);
            renderer.reset();
            preset_updated = Date.now();
            preset_updated = true;
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
console.log(pm.presets_active.renderer.data)
var renderer = new Renderer(document.getElementById("div_gameboard"), game.board, pm.presets_active.renderer.data);
var renderer_preview = new Renderer(document.getElementById("div_figure_preview"), game.board_next_figure_preview, pm.presets_active.renderer.data);

//connect renderers to controller
controller.renderers = [renderer, renderer_preview];

//init rendering
renderer.init();
renderer_preview.init();

//cookies save interval
var doCookies = true;
var cookies_after_update_time = 2000;
setTimeout(() => {setInterval(saveCookies, 1999)}, 0);
function saveCookies(){    
    if (!doCookies || !preset_updated || !Date.now() - preset_updated_time > cookies_after_update_time) 
        return;

    preset_updated = false;

    var presets_active = {
        controller: new Preset(generateUnicId(), {
            sliding_start_delay: controller.sliding_start_delay,
            sliding_interval: controller.sliding_interval,
            fall_speed: controller.fall_speed
        }),
        game: new Preset(generateUnicId(), {
            board_width: game.board_width,
            board_height: game.board_height,
            lines_need: game.lines_need,
            filled_lines: game.filled_lines,
            fill_chance: game.fill_chance
        }),
        renderer: new Preset(generateUnicId(), {
            colors: objectDeepClone(renderer.colors),
            opacities: renderer.opacities,
            sub_grid_step: renderer.sub_grid_step,
            horizontal_sub_grid: renderer.horizontal_sub_grid,
            background: renderer.colors.background
        })
    };    
    pm.addActivePresets(presets_active);     
    /*
    document.cookie = JSON.stringify({presets: pm.presets, presets_active: pm.presets_active});    
    var preset = JSON.parse(document.cookie);
    console.log("W:", pm.presets_active.renderer.data.colors.background, pm.presets_active.renderer.data.colors.glass)
    console.log("R:", preset.presets_active.renderer.data.colors.background, preset.presets_active.renderer.data.colors.glass)
    */
    document.cookie = JSON.stringify({a: renderer.colors.background});    
    var preset = JSON.parse(document.cookie);
    console.log("W:", {a: renderer.colors.background});
    console.log("W:", {a: pm.presets_active.renderer.data.colors.background});
    console.log("R:", preset);
}

function clearCookies(){
    doCookies = false;
    document.cookie = "";     
}