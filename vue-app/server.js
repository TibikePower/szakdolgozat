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

var fieldPos=[
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
var gameStarted=false;
var dices =[1,1];
var players = [];
var messages = [];
var haveHost = false;
var hostName = '';


function nextTurn(){
    var i=0;
        var nextActive=0;
        players.forEach(player => {
            i++;
            if(player.active==true){
                player.active=false;
                nextActive=i;
            }
        })
        if(players.length<=nextActive){
            players[0].active=true;
        }else{
            if(players[nextActive].name==''){
                players[0].active=true;
            }else{
                players[nextActive].active=true;
            }
        }
}
function useDice(){
    var smsg=[];
    dices[0]=Math.floor(Math.random() * 6)+1;
        dices[1]=Math.floor(Math.random() * 6)+1;

        var i=0;
        players.forEach(player => {
            if(player.active){
                var moveTo=player.field+dices[0]+dices[1];
                if (dices[0]==dices[1]){player.jailtime=0;}
                if(player.jailtime>0){
                    player.jailtime--;
                }else{
                    if(moveTo>=fieldPos.length){
                        smsg={
                            'msg': player.name + ' áthaladt a START mezőn!(+20000JF)',
                            'sender': 'Szerver'
                        }
                        messages.push(smsg);
                        moveTo-=fieldPos.length;
                        player.money+=20000;
                    }
                    switch(moveTo){
                        case 4:
                        case 38: //Adó
                            player.money-=20000;
                            smsg={
                                'msg': player.name + ' adó mezőre lépett!(-20000JF)',
                                'sender': 'Szerver'
                            }
                            messages.push(smsg);
                            break;
                        case 2:
                        case 7:
                        case 17: 
                        case 22:
                        case 33:
                        case 36:    //Kártyák
                            smsg={
                                'msg': player.name + ' húzott egy szerencsekártyát!',
                                'sender': 'Szerver'
                            }
                            messages.push(smsg);
                            break;
                        case 30:    //Böri
                            smsg={
                                'msg': player.name + ' börtönbe került 3 körre!',
                                'sender': 'Szerver'
                            }
                            messages.push(smsg);
                            player.jailtime=3;
                            moveTo=10;
                            break;
                    }
                    movePlayer(i, moveTo);
                }
            }
            i++;
        });
        io.emit('sendmessageFromSocket', (messages));
}
function movePlayer(id, field){
    players[id].posX=fieldPos[field][0];
    players[id].posY=fieldPos[field][1];
    players[id].field=field;
}
function startTheGame(){
    gameStarted=true;
    var i=0;
    var smsg={
        'msg': 'A host elindította a játékot!',
        'sender': 'Szerver'
    }
    players.forEach(player => {
        movePlayer(i, 0);
        player.money=150000;
        player.field=0;
        player.jailtime=2;
        i++;
    });
    dices[0]=dices[1]=1;

    if(players.length!=4){
        for(i=players.length;i<4;i++){    
            var player = {
                'name': '',
                'skin': 1,
                'status': '',
                'active':false,
                'money':-999999,
                'posX':9999,
                'posY':9999,
                'jailtime':-1,
                'field':null,
                'inventory':[]
            };
            players.push(player);
        }
    }
    players[0].active=true;
    console.log("A host elindította a játékot!");
    console.log(players);
    messages.push(smsg);
    io.emit('startGame',({players,dices}));
    io.emit('refreshPlayers', (players));
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
function addBot(level){
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
    io.emit('refreshPlayers', (players));
}
io.on('connection', socket => {
    socket.emit('refreshPlayers', (players));
    socket.emit('sendmessageFromSocket', (messages));

    socket.on('sendmessageSocket', (data) => {
        var free=true;
        if(data.sender==hostName){
            if(data.msg[0]=="/"){
                var cmd = data.msg.split(" ");
                if(cmd[0]=="/clear"){
                    clearMessages();
                    free=false;
                }
                if(cmd[0]=="/addbot"){
                    if(players.length<4){
                        if(cmd[1]=="1" || cmd[1]=="2" || cmd[1]=="3"){
                            addBot(cmd[1]);
                        }
                    }
                    free=false;
                    io.emit('refreshPlayers', (players));
                }
                if(cmd[0]=="/kick"){
                    io.emit('kicked', cmd[1]);
                    console.log("A host kickelt egy játékost: "+cmd[1]);
                    free=false;
                }
                if(cmd[0]=="/kickbot"){
                    kickBot(cmd[1]);
                    free=false;
                }
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
        var player = {
            'name': data.name,
            'skin': data.skin,
            'status': '',
            'active':false,
            'money':-999999,
            'posX':null,
            'posY':null,
            'field':null,
            'jailtime':-1,
            'inventory':[]
        };
        if (!haveHost) {
            player.status = 'host';
            hostName=data.name;
            console.log("Host neve: ", hostName);
            haveHost = true;
        } else {
            player.status = 'ready'
        }
        players.push(player);
        io.emit('refreshPlayers', (players));
    })
    socket.on('kicked', (data) => {
        var smsg={
            'msg': data + ' kickelve lett!',
            'sender': 'Szerver'
        }
        messages.push(smsg);
        io.emit('sendmessageFromSocket', (messages));
        socket.disconnect();
    })
    socket.on('dice', () => {
        useDice();
        io.emit('refreshPlayers', (players));
        io.emit('refreshDices', (dices));
    })
    socket.on('nextTurn', () => {
        nextTurn();
        io.emit('refreshPlayers', (players));
    })
    socket.on('leaveSocket', (data) => {
        console.log("Exit: "+data);
        var i = 0;
        var hostLeft = false;
        players.forEach(player => {
            if (player.name == data) {
                if (player.status == 'host') {
                    hostLeft = true;
                }
                players.splice(i, 1);
            }
            i++;
        });
        if (hostLeft && players.length != 0) {
            players[0].status = 'host';
            hostName=players[0].name;
            console.log("Új host: "+players[0].name);
        }
        if(hostName=='' || hostName=='Bot1' || hostName=='Bot2' || hostName=='Bot3'){
            players=[];
        }
        if (players.length == 0) {
            gameStarted=false;
            haveHost = false;
            hostName='';
            console.log("Nincs host");
        }
        
        io.emit('refreshPlayers', (players));
    })
})