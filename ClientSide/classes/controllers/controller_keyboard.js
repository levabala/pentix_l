function ControllerKeyboard(game, renderer, preset = {}, control_triggers = {}){    
    Controller.apply(this, arguments);    
    var controller = this;

    //defaults
    this.sliding_start_delay = 50;
    this.slide_interval = 30;

    for (let property in preset)
        this[property] = preset[property];

    /*control_triggers example    
    var c_t = {
        move_down: [70, 43], //action: array of keycodes
        mode_left: [13, 15, 65, 99],
        ...
    }*/

    var keydown_keys_map = {
        move_right: [39, 33],
        move_left: [37, 36],
        move_down: [40],
        drop: [68, 32],
        drop_down_left: [35],
        drop_down_right: [34],
        rotate_left: [],
        rotate_right: [12, 38],
        mirror: [65, 81],
        exchange: [50, 83, 87],
        restart: [13],
        next_game: [],
        slide_left_start: [],
        slide_left_stop: [],
        slide_right_start: [],
        slide_right_stop: [],
        slide_down_start: [],
        slide_down_stop: [],
    }
    var action_timeouts = {
        slide_left_start: null,
        slide_right_start: null,
        slide_down_start: null,
    };
    var slide_connected_keys = [39, 33, 37, 36, 40]
    var keydown_keys_map_revert = {};
    var keys_down = {};    

    function fillRevertMaps(){
        for (var action in keydown_keys_map)
            for (var keyCode in keydown_keys_map[action])
                keydown_keys_map_revert[keydown_keys_map[action][keyCode]] = action;                    
    }
    fillRevertMaps();
    
    console.log(keydown_keys_map_revert)

    window.addEventListener("keydown", (e) => {
        var k = e.keyCode;
        console.log(k)
        if (!(k in keydown_keys_map_revert))
            return;

        if (!(k in keys_down))
            keys_down[k] = true;
        else 
            if (slide_connected_keys.indexOf(k) != -1 && keys_down[k] == true) //we do not count repeated "keydown" events
                return;

        keys_down[k] = true;

        console.log(keydown_keys_map_revert[k])
        controller[keydown_keys_map_revert[k]]();

        //sliding timeouts 
        if (keydown_keys_map.move_right.indexOf(k) != -1){
            clearTimeout(action_timeouts.slide_left_start);
            clearTimeout(action_timeouts.slide_down_start);
            action_timeouts.slide_left_start = null;
            action_timeouts.slide_down_start = null;

                if (action_timeouts.slide_right_start == null)
                action_timeouts.slide_right_start = 
                    setTimeout(controller.slide_right_start, controller.sliding_start_delay);                            
        }
        if (keydown_keys_map.move_left.indexOf(k) != -1){
            clearTimeout(action_timeouts.slide_right_start);
            clearTimeout(action_timeouts.slide_down_start);            
            action_timeouts.slide_down_start = null;            
            action_timeouts.slide_right_start = null;

            if (action_timeouts.slide_left_start == null)
                action_timeouts.slide_left_start = 
                    setTimeout(controller.slide_left_start, controller.sliding_start_delay);                                                    
        }
        if (keydown_keys_map.move_down.indexOf(k) != -1){
            clearTimeout(action_timeouts.slide_right_start);            
            clearTimeout(action_timeouts.slide_left_start);            
            action_timeouts.slide_left_start = null;                        
            action_timeouts.slide_right_start = null;

            if (action_timeouts.slide_down_start == null)
                action_timeouts.slide_down_start = 
                    setTimeout(controller.slide_down_start, controller.sliding_start_delay);                                                    
        }
    });
    
    window.addEventListener("keyup", (e) => {
        var k = e.keyCode;        
        keys_down[k] = false;

        if (keydown_keys_map.move_right.indexOf(k) != -1){
            clearTimeout(action_timeouts.slide_right_start);
            action_timeouts.slide_right_start = null;
            controller.slide_stop();
        }
        if (keydown_keys_map.move_left.indexOf(k) != -1){
            clearTimeout(action_timeouts.slide_left_start);
            action_timeouts.slide_left_start = null;
            controller.slide_stop();
        }
        if (keydown_keys_map.move_down.indexOf(k) != -1){
            clearTimeout(action_timeouts.slide_down_start);
            action_timeouts.slide_down_start = null;
            controller.slide_stop();
        }
    });
}