const Player = require('./Player.js')
class PlayerManager{
    constructor(){
        this.players=[];
        this.hostName='';
        this.haveHost=false;
        this.fieldPos=[
            [522,542],
            [476,542],
            [428,542],
            [382,542],
            [336,542],
            [290,542],
            [246,542],
            [199,542],
            [153,542],
            [105,542],
            [30,542], //Sarok
            [30,470],
            [30,423],
            [30,377],
            [30,330],
            [30,285],
            [30,240],
            [30,193],
            [30,146],
            [30,99],
            [30,30], //Sarok
            [105,30],
            [152,30],
            [199,30],
            [246,30],
            [290,30],
            [336,30],
            [382,30],
            [428,30],
            [475,30],
            [545,30], //Sarok
            [545,99],
            [545,146],
            [545,193],
            [545,240],
            [545,285],
            [545,330],
            [545,377],
            [545,423],
            [545,470]
        ];
    }
    addPlayer(player){
        var p = new Player(
            player.name,
            player.skin,
            ''
        );
        if (!this.haveHost) {
            p.status = 'host';
            this.hostName=p.name;
            console.log("PM: Host neve: ", this.hostName);
            this.haveHost = true;
        } else {
            p.status = 'ready'
        }
        this.players.push(p);
        console.log("PM: Player hozzáadva!");
    }
    deletePlayer(p){
        var hostLeft = false;
        for(var i=0;i<this.players.length;i++){
            if (this.players[i].name == p) {
                if (this.players[i].status == 'host') {
                    hostLeft = true;
                }
                this.players.splice(i, 1);
            }
        }
        if (hostLeft && this.players.length != 0) {
            this.players[0].status='host';
            this.hostName=this.players[0].name;
            console.log("PM: Új host: "+this.players[0].name);
        }
        if(this.players.length==0){
            this.haveHost = false;
            this.hostName='';
            this.players=[];
            console.log("PM: Nincs host");
        }
        if(this.hostName=='' || this.hostName=='Bot1' || this.hostName=='Bot2' || this.hostName=='Bot3'){
            this.players=[];
        }
        console.log("PM: Lelépett: " + p);
    }
    start(){
        for(var i=0;i<this.players.length;i++){
            this.players[i].movePlayer(this.fieldPos[0][0],this.fieldPos[0][1], 0);
            this.players[i].money=150000;
            this.players[i].field=0;
            this.players[i].jailtime=0;
        }
        if(this.players.length!=4){
            for(i=this.players.length;i<4;i++){    
                var p = new Player(
                    '',
                    1,
                    ''
                );
                p.money=-999999;
                p.posX=9999;
                p.posY=9999;
                p.jailtime=-1;
                p.field=-1;
                this.players.push(p);
            }
        }
        this.players[0].isActive=true;
    }
    nextPlayer(){
        var nextActive=0;
        for(var i=0;i<this.players.length;i++){
            if(this.players[i].isActive==true){
                this.players[i].isActive=false;
                nextActive=i+1;
            }
        }
        if(this.players.length<=nextActive){
            this.players[0].isActive=true;
        }else{
            if(this.players[nextActive].name==''){
                this.players[0].isActive=true;
            }else{
                this.players[nextActive].isActive=true;
            }
        }       
    }
    useDice(d1,d2){
        for(var i=0;i<this.players.length;i++){
            if(this.players[i].isActive){
                var moveTo=this.players[i].field+d1+d2;
                if (d1==d2){this.players[i].jailtime=0;}
                if(this.players[i].jailtime>0){
                    this.players[i].jailtime--;
                }else{
                    if(moveTo>=this.fieldPos.length){
                        moveTo-=this.fieldPos.length;
                        this.players[i].money+=20000;
                    }
                    switch(moveTo){
                        case 4:
                        case 38: //Adó
                            this.players[i].money-=20000;
                            break;
                        case 2:
                        case 7:
                        case 17: 
                        case 22:
                        case 33:
                        case 36:    //Kártyák
                            break;
                        case 30:    //Böri
                            this.players[i].jailtime=3;
                            moveTo=10;
                            break;
                    }
                    this.players[i].movePlayer(this.fieldPos[moveTo][0],this.fieldPos[moveTo][1], moveTo);
                }
            }
        };
    }
}
module.exports = PlayerManager;