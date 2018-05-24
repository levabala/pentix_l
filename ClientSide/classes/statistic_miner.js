function StatisticMiner(game, mineCallback, mineInterval = 100){
    var miner = this;
    this.game = game;
    this.mineInterval = 100;

    var timeout = null;
    this.start = function(){
        mine();
    }

    this.pause = function(){
        clearTimeout(timeout);
    }

    function mine(){
        var stats = {
            "lines_done": miner.game.lines_done,
            "lines_need": miner.game.lines_need,
            "game_duration": miner.game.game_duration,
        }
        mineCallback(stats);
        timeout = setTimeout(mine, miner.mineInterval);
    }
}