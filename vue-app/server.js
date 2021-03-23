const Game = require('./classes/Game.js');

let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

http.listen(3000,'192.168.0.106', () => {
    console.log('listening on :3000');
});

var messages = [];
var game = new Game();
function dice(){
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
}
function tripleDouble(){
    game.tripleDouble();
    for (let i = 0; i < game.pm.players.length; i++) {
        if(game.pm.players[i].isActive==true){
            if(game.pm.players[i].type=='bot'){
                callBot(i);
            }
        }
    }
    io.emit('refresh', (game));
}
function useFreeCard(){
    game.useFreeCard();
    io.emit('refresh', (game));
}
function useFreeJail(){
    game.useFreeJail();
    io.emit('refresh', (game));
}
function lose(name){
    game.lose(name);
        if(game.losers==2){
            console.log("[ SERVER ]: Játék vége");
            game.gameEnd();
        }
    io.emit('refresh', (game));
}
function next(){
    game.nextTurn();
        for (let i = 0; i < game.pm.players.length; i++) {
            if(game.pm.players[i].isActive==true){
                if(game.pm.players[i].type=='bot'){
                    callBot(i);
                }
            }
        }
        io.emit('refresh', (game));
}
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
function callBot(index){ // Ez kezeli azt, hogyha egy bot következik
    console.log("========================");
    console.log("[ BOT - "+index+" ]: "+ game.pm.players[index].name+ " következik.");
    var eAction='';
    do{
        var bAction=game.pm.players[index].botAction();
        if(bAction=='dice'){
            dice();
            console.log("[ BOT - "+index+" ]: "+ game.pm.players[index].name+ " dobott a kockával. Dobott számok: "+game.dices[0]+"+"+game.dices[1]);
            if(game.dices[0]==game.dices[1]){
                game.pm.players[index].doubleDice++;
            }
            if(game.pm.players[index].doubleDice==2){
                game.pm.players[index].doubleDice=0;
                tripleDouble();
                bAction='nextTurn';
            }
        }else if(bAction=='useFreeCard'){
            useFreeCard();
            console.log("[ BOT - "+index+" ]: "+ game.pm.players[index].name+ " használt egy I.Sz.A.B. kártyát. Maradt neki további "+game.pm.players[index].freecard+" db");
        }else if(bAction=='useFreeJail'){
            useFreeJail();
            console.log("[ BOT - "+index+" ]: "+ game.pm.players[index].name+ " letette az óvadékot. Maradt neki további "+game.pm.players[index].money+" JF");
        }
        eAction=bAction;
        var exit=false;
        if(bAction=='nextTurn'||bAction=='lose'){
            exit=true;
        }
    }while(!exit)
    if(eAction=='nextTurn'){
        console.log("[ BOT - "+index+" ]: "+ game.pm.players[index].name+ " befejezte a körét.");
        console.log("========================");  
        next();
    }else if(eAction=='lose'){
        console.log("[ BOT - "+index+" ]: "+ game.pm.players[index].name+ " csődöt mondott.");
        console.log("========================");
        lose(game.pm.players[index].name);
    }
    
    

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
        game.pm.addPlayer(data,'p');
        io.emit('refresh', (game));
    })
    socket.on('teszt', () => {
        console.log("teszt");
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
        dice();
    })
    socket.on('tripleDouble', () => {
        tripleDouble();
        io.emit('notBuying');
    })
    socket.on('buyAccept', () => {
        game.buy();
        io.emit('refresh', (game));
    })
    socket.on('sell', (field) => {
        game.sell(field);
        io.emit('refresh', (game));
    })
    socket.on('destroy', (field) => {
        game.destroy(field);
        io.emit('refresh', (game));
    })
    socket.on('upgrade', (field) => {
        game.upgrade(field);
        io.emit('refresh', (game));
    })
    socket.on('useFreeCard', () => {
        useFreeCard();
    })
    socket.on('useFreeJail', () => {
        useFreeJail();
    })
    socket.on('nextTurn', () => {
        next();
        io.emit('notBuying');
    })
    socket.on('mainTrade', (data) => {
        io.emit('tradePartner', {name:data.p2name,infos:data});
    })
    socket.on('lose', (name) => {
        lose(name);
    })
    socket.on('partnerTrade', (data) => {
        var smsg={
            'msg': '',
            'sender': 'Szerver'
        }
        if(data.accept==0){
            io.emit('tradeEnd',{name1:data.trade.p1name,name2:data.trade.p2name});
            smsg.msg=data.trade.p2name+ ' elutasította '+data.trade.p1name+' kereskedelmi lehetőségét!';
        }else if(data.accept==1){
            console.log(data.trade.p2name+ ' elfogadta '+data.trade.p1name+' kereskedelmi lehetőségét!');
            console.log(data.trade);
            game.trade(data.trade);
            io.emit('tradeEnd',{name1:data.trade.p1name,name2:data.trade.p2name});
            smsg.msg=data.trade.p2name+ ' elfogadta '+data.trade.p1name+' kereskedelmi lehetőségét!';
        }
        io.emit('refresh', (game));
        messages.push(smsg); 
        io.emit('sendmessageFromSocket', (messages));
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