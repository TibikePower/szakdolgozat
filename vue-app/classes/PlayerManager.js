const Player = require('./Player.js')
const Bot = require('./Bot.js')
const Log = require('./Log.js')
class PlayerManager{
    constructor(){
        this._players=[];
        this._hostName='';
        this._isHaveHost=false;
        this._rankList=[];
        this._log=new Log('PLAYER_MANAGER');
    }
    get log(){
        return this._log;
    }
    get players(){
        return this._players;
    }
    get hostName(){
        return this._hostName;
    }
    get isHaveHost(){
        return this._isHaveHost;
    }
    get rankList(){
        return this._rankList;
    }
    set rankList(r){
        this._rankList=r;
    }
    addRankList(name){
        this._rankList.push(name);
    }
    addPlayer(player,type){//Hozzáadja a játékost a players tömbhöz
        if(type=='p'){
            var p = new Player(
                player.name,
                player.skin,
                ''
            );
            if (!this._isHaveHost) {
                p.status = 'host';
                this._hostName=p.name;
                this.log.write("Host neve: "+ this.hostName);
                this._isHaveHost = true;
            } else {
                p.status = 'ready'
            }
            this._players.push(p);
            this.log.write("Player hozzáadva!");
        }else{
            var b = new Bot(
                player.name,
                player.skin,
                '',
                player.level
            );
            this._players.push(b);
            this.log.write("Bot hozzáadva!");
        }
    }
    deletePlayer(p){//Kitörli a játékost a players tömbből, ellenőrzi hogy a host lépett-e le
        var hostLeft = false;
        for(var i=0;i<this._players.length;i++){
            if (this._players[i].name == p) {
                if (this._players[i].status == 'host') {
                    hostLeft = true;
                }
                this._players.splice(i, 1);
            }
        }
        if (hostLeft && this._players.length != 0) {
            this._players[0].status='host';
            this._hostName=this._players[0].name;
            this.log.write("Új host: "+this._players[0].name);
        }
        if(this._players.length==0){
            this._isHaveHost = false;
            this._hostName='';
            this._players=[];
            this.log.write("Nincs host");
        }
        if(this._hostName=='' || this._hostName=='Bot1' || this._hostName=='Bot2' || this._hostName=='Bot3'){
            this._players=[];
        }
        this.log.write("Lelépett: " + p);
    }
    activePlayer(id){//Beállítja az aktív játékost
        this._players[id].isActive=true;
    }
}
module.exports = PlayerManager;