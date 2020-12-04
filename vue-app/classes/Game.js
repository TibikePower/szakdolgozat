const PlayerManager = require("./PlayerManager");
const Table = require("./Table");

class Game{
    constructor(){
        this._pm=new PlayerManager();
        this._table=new Table();
        this._dices=[1,1];
    }
    start(){

    }
    useDice(){

    }
    nextTurn(){
        
    }
}
module.exports = Game;