const Game = require('./classes/Game.js');

let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

http.listen(process.env.PORT || 3000, () => {
    console.log('listening on :3000');
});

var messages = [];
var game = new Game();
function startGame(){
    game.start();
    io.emit('startGame');
    io.emit('refresh', (game));
    io.emit('sendmessageFromSocket', (messages));
}
function clearMessages(){
    console.log("[ SERVER ]: A host kitörölte az üzeneteket!");
    var clear=[];
    messages=clear;
    var smsg={
        'msg': 'A host törölte a chatet!',
        'sender': 'Szerver'
    }
    messages.push(smsg);    
}
/*function addBot(level){
    do{
        var ok=true;
        var bn ='Bot'+level;
        for(let i = 0; i < 3; i++){
            var random = Math.floor(Math.random() * 27);
            bn += String.fromCharCode(97 + random);
        }
        players.forEach(player => {
            if(player.name==bn){
                ok=false;
            }
        });
    }while(!ok)
    var bot = {
        'name': bn,
        'skin': 1,
        'status': 'bot'+level,
        'active':false,
        'money':-999999,
        'posX':null,
        'posY':null,
        'field':null,
        'jailtime':null,
        'inventory':[]
    };
    console.log("A host létrehozott egy "+level+" szintű botot: "+bot.name);
    var smsg={
        'msg': 'A host létrehozott egy '+level+' szintű botot: '+bot.name,
        'sender': 'Szerver'
    }
    messages.push(smsg);
    players.push(bot);
}
function kickBot(name){
    var i=0;
    players.forEach(player => {
        if(player.name==name){
            if(player.status=='bot1' ||
                player.status=='bot2' ||
                player.status=='bot3'){
                    players.splice(i, 1);
                }
        }
        i++;
    });
    console.log("A host kickelt egy botot.");
    io.emit('refreshPlayers', (pm.players));
}*/
io.on('connection', socket => {
    socket.emit('refresh', (game));
    socket.emit('sendmessageFromSocket', (messages));

    socket.on('sendmessageSocket', (data) => {
        var free=true;
        if(data.sender==game.pm.hostName){
            if(data.msg[0]=="/"){
                var cmd = data.msg.split(" ");
                if(cmd[0]=="/clear"){
                    clearMessages();
                    free=false;
                }
                /*if(cmd[0]=="/addbot"){
                    if(players.length<4){
                        if(cmd[1]=="1" || cmd[1]=="2" || cmd[1]=="3"){
                            addBot(cmd[1]);
                        }
                    }
                    free=false;
                    io.emit('refreshPlayers', (pm.players));
                }
                if(cmd[0]=="/kick"){
                    io.emit('kicked', cmd[1]);
                    console.log("A host kickelt egy játékost: "+cmd[1]);
                    free=false;
                }
                if(cmd[0]=="/kickbot"){
                    kickBot(cmd[1]);
                    free=false;
                }*/
                if(cmd[0]=="/start"){
                    if(!game.isStarted){
                        startGame();
                    }
                    free=false;
                } 
            }
        }
        if(free) messages.push(data);
        io.emit('sendmessageFromSocket', (messages));
    })

    socket.on('loginSocket', (data) => {
        console.log("[ SERVER ]: Egy játékos bejelentkezett -> "+data.name+" <- néven.");
        game.pm.addPlayer(data);
        io.emit('refresh', (game));
    })
    /*socket.on('kicked', (data) => {
        var smsg={
            'msg': data + ' kickelve lett!',
            'sender': 'Szerver'
        }
        messages.push(smsg);
        io.emit('sendmessageFromSocket', (messages));
        socket.disconnect();
    })*/
    socket.on('dice', () => {
        game.useDice();
        game.checkField();
        if(game.isBuying){
            io.emit('buy');
        }
        if(game.isLuckycard){
            var smsg={
                'msg': game.luckyCard(),
                'sender': 'Szerencsekártya'
            }
            messages.push(smsg); 
        }
        io.emit('refresh', (game));
        io.emit('sendmessageFromSocket', (messages));
    })
    socket.on('tripleDouble', () => {
        game.tripleDouble();
        io.emit('refresh', (game));
    })
    socket.on('buyAccept', () => {
        game.buy();
        io.emit('refresh', (game));
    })
    socket.on('nextTurn', () => {
        game.nextTurn();
        io.emit('refresh', (game));
    })
    socket.on('leaveSocket', (data) => {
        game.pm.deletePlayer(data);
        
        if (game.pm.players.length == 0) {
            game.isStarted=false;
            console.log("[ SERVER ]: Nincs host");
        }
        io.emit('refresh', (game));
    })
})