const PlayerManager = require('./classes/PlayerManager.js')

let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

http.listen(process.env.PORT || 3000, () => {
    console.log('listening on :3000');
});
//props : field - Melyik mezőn található
//      : name - Ingatlan neve
//      : owner - Ki az ingatlan tulajdonosa   
//      : price - Mennyibe kerül az ingatlan
//      : group - Melyik csoportba tartozik az ingatlan
//      : upgrades - Mennyi fejlesztés van az ingatlanon
//      : upgradeCost - Mennyibe kerül az ingatlan fejlesztése
//      : payment - Ingatlanra lépéskor ennyit kell fizetnie a játékosnak az ingatlan tulajának.
var props=[
    {
        'field':1,
        'name':'Első tesztingatlan',
        'owner':'none',
        'price':6000,
        'group':1,
        'upgrades':0,
        'upgradeCost':5000,
        'payment':[
            200,
            1000,
            3000,
            9000,
            16000,
            25000
        ]
    }
];
var gameStarted=false;
var dices =[1,1];
var messages = [];
var pm = new PlayerManager();
function startTheGame(){
    pm.start();
    gameStarted=true;
    console.log("A host elindította a játékot!");
    io.emit('startGame',(dices));
    io.emit('refreshPlayers', (pm.players));
    io.emit('sendmessageFromSocket', (messages));
}
function clearMessages(){
    console.log("A host kitörölte az üzeneteket!");
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
    socket.emit('refreshPlayers', (pm.players));
    socket.emit('sendmessageFromSocket', (messages));

    socket.on('sendmessageSocket', (data) => {
        var free=true;
        if(data.sender==pm.hostName){
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
                    if(!gameStarted){
                        startTheGame();
                    }
                    free=false;
                } 
            }
        }
        if(free) messages.push(data);
        io.emit('sendmessageFromSocket', (messages));
    })

    socket.on('loginSocket', (data) => {
        console.log("Login: "+data.name);
        pm.addPlayer(data);
        io.emit('refreshPlayers', (pm.players));
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
        dices[0]=Math.floor(Math.random() * 6)+1;
        dices[1]=Math.floor(Math.random() * 6)+1;
        pm.useDice(dices[0],dices[1]);
        io.emit('refreshPlayers', (pm.players));
        io.emit('refreshDices', (dices));
    })
    socket.on('nextTurn', () => {
        pm.nextPlayer();
        io.emit('refreshPlayers', (pm.players));
    })
    socket.on('leaveSocket', (data) => {
        console.log("Exit: "+data);
        pm.deletePlayer(data);
        
        if (pm.players.length == 0) {
            gameStarted=false;
            console.log("Nincs host");
        }
        io.emit('refreshPlayers', (pm.players));
    })
})