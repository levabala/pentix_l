function toRange(num, from, to){
    if (from >= num)
        return from;
    if (to <= num)
        return to;
    return num;
}

function inRange(num, from, to){
    if (from >= num)
        return true;
    if (to <= num)
        return true;
    return false;
}

function P(x, y){
    var p = this;
    this.x = x;
    this.y = y;    

    this.add = function(p2){
        p.x += p2.x;
        p.y += p2.y;
        return p;
    }

    this.move = function(dx, dy){
        p.x += dx;
        p.y += dy;
        return p;
    }

    this.clone = function(){
        return new P(p.x, p.y);
    }

    this.multiply = function(value){
        p.x *= value;
        p.y *= value;
        return p;
    }
}

function generateAlternativeColor(hex_color){
    let color_value = parseInt("0x" + hex_color.replace("#", ''));            
    let black = "#000000";
    let white = "#ffffff";           
    let while_value = parseInt("0x" + white.replace("#", ''));            

    if (while_value - 2 * color_value > 0)
        return white;
    else return black;            
}