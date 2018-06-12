class PresetsManager{
    constructor(game_presets = [], renderer_presets = [], controller_presets = []){
        this.presets = {};
        this.presets_active = {};
        this.presets.game = {};        
        this.presets.renderer = {};
        this.presets.controller = {};        
        for (let preset of game_presets)
            this.presets.game[preset.id] = preset;
        for (let preset of renderer_presets)
            this.presets.renderer[preset.id] = preset;
        for (let preset of controller_presets)
            this.presets.controller[preset.id] = preset;
        this.addActivePresets({
            "game": game_presets[0],
            "renderer": renderer_presets[0],
            "controller": controller_presets[0],
        });               
    }

    setPresets(presets, presets_active){
        this.presets = presets;
        this.presets_active = presets_active;        
    }

    addPreset(preset_type, preset){
        this.presets[preset_type][preset.id] = preset;              
    }

    activatePreset(preset_type, preset_id){
        this.presets_active[preset_type] = this.presets[preset_type][preset_id];
    }

    _activatePreset(preset_type, preset){
        //nothing here yet    
    }

    addActivePreset(preset_type, preset){
        this.presets_active[preset_type] = preset;
        this.presets[preset_type][preset.id] = preset;        
    }

    addActivePresets(presets){
        for (let preset_type in presets){
            this.presets_active[preset_type] = presets[preset_type];
            this.presets[preset_type][presets[preset_type].id] = presets[preset_type];
        }                
    }
}    