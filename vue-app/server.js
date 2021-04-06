const Game = require('./classes/Game.js');
const Log = require('./classes/Log.js');
const Bot = require('./classes/Bot.js');

let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

http.listen(3000,'192.168.0.106', () => {
    log.write('listening on :3000');
});

var messages = [];
var game = new Game();
var log = new Log('SERVER');
function activateLog(){
    log.activate();
    game.log.activate();
}
function deactivateLog(){
    log.deactivate();
    game.log.deactivate();
}
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
function isBotName(name){
    for(let i=0; i<game.pm.players.length; i++){
        if(name==game.pm.players[i].name){
            if(game.pm.players[i].type=='bot'){
                return true;
            }else{
                return false;
            }
        }
    }
}
function botIndex(name){
    for(let i=0; i<game.pm.players.length; i++){
        if(name==game.pm.players[i].name){
            return i;
        }
    }
}
function trade(data){
    var smsg={
        'msg': '',
        'sender': 'Szerver'
    }
    if(data.accept==0){
        io.emit('tradeEnd',{name1:data.trade.p1name,name2:data.trade.p2name});
        smsg.msg=data.trade.p2name+ ' elutasította '+data.trade.p1name+' kereskedelmi lehetőségét!';
    }else if(data.accept==1){
        log.write(data.trade.p2name+ ' elfogadta '+data.trade.p1name+' kereskedelmi lehetőségét!');
        game.trade(data.trade);
        io.emit('tradeEnd',{name1:data.trade.p1name,name2:data.trade.p2name});
        smsg.msg=data.trade.p2name+ ' elfogadta '+data.trade.p1name+' kereskedelmi lehetőségét!';
    }
    io.emit('refresh', (game));
    messages.push(smsg); 
    io.emit('sendmessageFromSocket', (messages));
}
function tradeWithBot(data){
    var smsg={
        'msg': '',
        'sender': 'Szerver'
    }
    if(data.accept==0){
        io.emit('tradeEnd',{name1:data.p1name,name2:data.p2name});
        smsg.msg=data.p2name+ ' elutasította '+data.p1name+' kereskedelmi lehetőségét!';
    }else if(data.accept==1){
        log.write(data.p2name+ ' elfogadta '+data.p1name+' kereskedelmi lehetőségét!');
        game.trade(data);
        io.emit('tradeEnd',{name1:data.p1name,name2:data.p2name});
        smsg.msg=data.p2name+ ' elfogadta '+data.p1name+' kereskedelmi lehetőségét!';
    }
    io.emit('refresh', (game));
    messages.push(smsg); 
    io.emit('sendmessageFromSocket', (messages));
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
            log.write("Játék vége");
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
    log.write("A host kitörölte az üzeneteket!");
    var clear=[];
    messages=clear;
    var smsg={
        'msg': 'A host törölte a chatet!',
        'sender': 'Szerver'
    }
    messages.push(smsg);    
}
function callBot(index){ // Ez kezeli azt, hogyha egy bot következik
    log.write("========================");
    log.write("[ BOT - "+index+" ]: "+ game.pm.players[index].name+ " következik.");
    var eAction='';
    do{
        var bAction=game.pm.players[index].botAction(game);
        if(bAction=='dice'){
            dice();
            log.write("[ BOT - "+index+" ]: "+ game.pm.players[index].name+ " dobott a kockával. Dobott számok: "+game.dices[0]+"+"+game.dices[1]);
            if(game.dices[0]==game.dices[1]){
                game.pm.players[index].doubleDice++;
            }
            if(game.pm.players[index].doubleDice==2){
                game.pm.players[index].doubleDice=0;
                game.pm.players[index].useDice=false;
                tripleDouble();
                return;
                bAction='nextTurn';
            }
        }else if(bAction=='useFreeCard'){
            useFreeCard();
            log.write("[ BOT - "+index+" ]: "+ game.pm.players[index].name+ " használt egy I.Sz.A.B. kártyát. Maradt neki további "+game.pm.players[index].freecard+" db");
        }else if(bAction=='useFreeJail'){
            game.pm.players[index].jailtime=0;
            game.pm.players[index].money-=5000;
            this.log.write(""+game.pm.players[index].name+" kifizette az 5.000JF óvadékot.")
            io.emit('refresh', (game));
            log.write("[ BOT - "+index+" ]: "+ game.pm.players[index].name+ " letette az óvadékot. Maradt neki további "+game.pm.players[index].money+" JF");
        }else if(bAction=='buy'){
            game.buy();
        }else if(bAction=='upgrade'){
            game.upgrade(game.fm.props[game.pm.players[index].upgradeIndex].field);
            game.pm.players[index].upgradeIndex=0;
        }else if(bAction=='destroy'){
            game.destroy(game.fm.props[game.pm.players[index].destroyIndex].field);
            game.pm.players[index].destroyIndex=0;
        }else if(bAction=='sell'){
            var s=true;
            if(game.fm.eOwner==game.pm.players[index].name && s){
                game.sell(28);
                s=false;
            }
            if(game.fm.wOwner==game.pm.players[index].name && s){
                game.sell(12);
                s=false;
            }
            if(game.fm.b1Owner==game.pm.players[index].name && s){
                game.sell(5);
                s=false;
            }
            if(game.fm.b2Owner==game.pm.players[index].name && s){
                game.sell(15);
                s=false;
            }
            if(game.fm.b3Owner==game.pm.players[index].name && s){
                game.sell(25);
                s=false;
            }
            if(game.fm.b4Owner==game.pm.players[index].name && s){
                game.sell(35);
                s=false;
            }
            for (let i = 0; i < game.fm.props.length; i++) {
                if(game.fm.props[i].owner==game.pm.players[index].name){
                    game.sell(game.fm.props[i].field);
                    break;
                }
            }
        }
        eAction=bAction;
        var exit=false;
        if(bAction=='nextTurn'||bAction=='lose'){
            exit=true;
        }
    }while(!exit)
    if(eAction=='nextTurn'){
        game.pm.players[index].upgradeIndex=0;
        game.pm.players[index].destroyIndex=0;
        next();
    }else if(eAction=='lose'){
        log.write("[ BOT - "+index+" ]: "+ game.pm.players[index].name+ " csődöt mondott.");
        lose(game.pm.players[index].name);
    }
}
function addBot(level){
    do{
        var ok=true;
        var bn ='Bot'+level;
        for(let i = 0; i < 3; i++){
            var random = Math.floor(Math.random() * 27);
            bn += String.fromCharCode(97 + random);
        }
        game.pm.players.forEach(player => {
            if(player.name==bn){
                ok=false;
            }
        });
    }while(!ok)
    var p = new Bot(
        bn,
        Math.floor(Math.random() * 4)+1,
        '',
        level
    );
    game.pm.addPlayer(p,'b');
    log.write("A host létrehozott egy "+level+" szintű botot: "+p.name);
    var smsg={
        'msg': 'A host létrehozott egy '+level+' szintű botot: '+p.name,
        'sender': 'Szerver'
    }
    messages.push(smsg);
}
function kickBot(name){
    game.pm.players.forEach(player => {
        if(player.name==name){
            if(player.type=='bot'){
                game.pm.deletePlayer(name);
                log.write("A host kickelt egy botot.");
                var smsg={
                    'msg': 'A host kickelt egy botot.',
                    'sender': 'Szerver'
                }
                messages.push(smsg);
            }
        }
    });
    
}
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
                if(cmd[0]=="/addbot"){
                    if(game.pm.players.length<4){
                        if(cmd[1]=="1" || cmd[1]=="2" || cmd[1]=="3"){
                            addBot(cmd[1]);
                        }
                    }
                    free=false;
                    socket.emit('refresh', (game));
                }
                if(cmd[0]=="/kickbot"){
                    if(!game.isStarted){
                        kickBot(cmd[1]);
                        free=false;
                        socket.emit('refresh', (game));
                    }
                }
                if(cmd[0]=="/start"){
                    if(!game.isStarted){
                        startGame();
                    }
                    free=false;
                }
                if(cmd[0]=="/alog"){
                    activateLog();
                    log.write("Log aktiválva!");
                    free=false;
                }
                if(cmd[0]=="/dlog"){
                    log.write("Log deaktiválva!");
                    deactivateLog();
                    free=false;
                }
            }
        }
        if(free) messages.push(data);
        io.emit('sendmessageFromSocket', (messages));
    })

    socket.on('loginSocket', (data) => {
        log.write("Egy játékos bejelentkezett -> "+data.name+" <- néven.");
        game.pm.addPlayer(data,'p');
        io.emit('refresh', (game));
    })
    socket.on('teszt', () => {
        log.write("teszt");
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
        if(isBotName(data.p2name)){
            tradeWithBot(game.pm.players[botIndex(data.p2name)].tradeAccept(data,game));
        }else{
            io.emit('tradePartner', {name:data.p2name,infos:data});
        }
    })
    socket.on('lose', (name) => {
        lose(name);
    })
    socket.on('partnerTrade', (data) => {
        trade(data);
    })
    socket.on('leaveSocket', (data) => {
        game.pm.deletePlayer(data);
        
        if (game.pm.players.length == 0) {
            game.isStarted=false;
            log.write("Nincs host");
        }
        io.emit('refresh', (game));
    })
})