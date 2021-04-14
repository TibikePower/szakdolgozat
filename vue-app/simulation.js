const Game = require('./classes/Game.js');
const Log = require('./classes/Log.js');
const BotEasy= require("./classes/BotEasy");
const BotMedium= require("./classes/BotMedium");
const BotHard= require("./classes/BotHard");

var game = new Game();
var log = new Log('SERVER');

function dice(){
    game.useDice();
        game.checkField();
        /*if(game.isLuckycard){
            var smsg={
                'msg': game.luckyCard(),
                'sender': 'Szerencsekártya'
            }
        }*/
}
function tripleDouble(){
    game.tripleDouble();
    for (let i = 0; i < game.pm.players.length; i++) {
        if(game.pm.players[i].isActive==true){
            if(game.pm.players[i].type=='bot'){
                callBot(i);
                break;
            }
        }
    }
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
function lose(name){
    game.lose(name);
        if(game.losers==2){
            log.write("Játék vége");
            log.write("Körök száma: "+game.rounds);
            game.gameEnd();
        }
        for (let i = 0; i < game.pm.players.length; i++) {
        if(game.pm.players[i].isActive==true){
            if(game.pm.players[i].type=='bot'){
                callBot(i);
                break;
            }
        }
    }
}
function correction(){
    for (let i = 0; i < game.pm.players.length; i++) {
        if(game.pm.players[i].isActive==true){
            if(game.pm.players[i].status=='lose'){
                var j=i+1;
                var ok=false;
                while (!ok) {
                    if(j>game.pm.players.length){
                        j=0;
                    }
                    if(game.pm.players[j].status!=lose){
                        game.pm.players[i].isActive=false;
                        game.pm.players[j].isActive=true;
                        ok=true;
                    }
                }
            }
        }
    }
}
function error(){
    if(game.pm.players[0].isActive && game.pm.players[1].isActive || game.pm.players[0].isActive && game.pm.players[2].isActive ||
    game.pm.players[0].isActive && game.pm.players[3].isActive){
        return true;
    }
    if(game.pm.players[1].isActive && game.pm.players[0].isActive || game.pm.players[1].isActive && game.pm.players[2].isActive ||
    game.pm.players[1].isActive && game.pm.players[3].isActive){
        return true;
    }
    if(game.pm.players[2].isActive && game.pm.players[0].isActive || game.pm.players[2].isActive && game.pm.players[1].isActive ||
    game.pm.players[2].isActive && game.pm.players[3].isActive){
        return true;
    }
    if(game.pm.players[3].isActive && game.pm.players[0].isActive || game.pm.players[3].isActive && game.pm.players[2].isActive ||
    game.pm.players[3].isActive && game.pm.players[1].isActive){
        return true;
    }
    return false;
}

function next(){
    game.nextTurn();
    if(game.rounds==roundLimit){
        game.losers=2;
        lose();
    }
    correction();
        for (let i = 0; i < game.pm.players.length; i++) {
            if(game.pm.players[i].isActive==true){
                if(game.pm.players[i].type=='bot'){
                    callBot(i);
                    break;
                }
            }
        }
}
function botGame(){
    game= new Game();
    game.botStart();
    callBot(game.firstIndex);
}
function selectOwner(name,group){
    for(var i=0; i<game.fm.props.length;i++){
        if(game.fm.props[i].group==group && game.fm.props[i].owner!=name){
            if(game.fm.props[i].owner==''){
                return 'none';
            }else{
                return game.fm.props[i].owner;
            }
        }
    }
}
function selectField(name,group){
    for(var i=0; i<game.fm.props.length;i++){
        if(game.fm.props[i].group==group && game.fm.props[i].owner!=name){
            return i;
        }
    }
}
function callBot(index){ // Ez kezeli azt, hogyha egy bot következik
    log.write("========================");
    log.write("[ BOT - "+index+" ]: "+ game.pm.players[index].name+ " következik.");
    var eAction='';
    do{
        var bAction=game.pm.players[index].calcBotNextAction(game);
        if(bAction=='dice'){
            dice();
            log.write("[ BOT - "+index+" ]: "+ game.pm.players[index].name+ " dobott a kockával. Dobott számok: "+game.dices[0]+"+"+game.dices[1]);
            if(game.dices[0]==game.dices[1]){
                game.pm.players[index].doubleDice++;
            }else{
                game.pm.players[index].doubleDice=0;
            }
            if(game.pm.players[index].doubleDice==2){
                game.pm.players[index].doubleDice=0;
                game.pm.players[index].useDice=false;
                bAction='tripleDouble';
            }
        }else if(bAction=='useFreeCard'){
            game.pm.players[index].jailtime=0;
            game.pm.players[index].freecard-=1;
            log.write("[ BOT - "+index+" ]: "+ game.pm.players[index].name+ " használt egy I.Sz.A.B. kártyát. Maradt neki további "+game.pm.players[index].freecard+" db");
        }else if(bAction=='useFreeJail'){
            game.pm.players[index].jailtime=0;
            game.pm.players[index].money-=5000;
            game.log.write(""+game.pm.players[index].name+" kifizette az 5.000JF óvadékot.")
            log.write("[ BOT - "+index+" ]: "+ game.pm.players[index].name+ " letette az óvadékot. Maradt neki további "+game.pm.players[index].money+" JF");
        }else if(bAction=='buy'){
            game.buy();
        }else if(bAction=='upgrade'){
            game.upgrade(game.fm.props[game.pm.players[index].upgradeIndex].field);
            game.pm.players[index].upgradeIndex=0;
        }else if(bAction=='destroy'){
            game.destroy(game.fm.props[game.pm.players[index].destroyIndex].field);
            game.pm.players[index].destroyIndex=0;
        }else if(bAction=='wantProp'){
            var g=game.pm.players[index].countGroup(game);
            var oName=selectOwner(game.pm.players[index].name,g);
            if(oName!="none"){
                var selectedFieldIndex=selectField(game.pm.players[index].name,g);
                var pay = game.fm.props[selectedFieldIndex].price*(0.8+(game.pm.players[index].tradeIncrement*game.pm.players[index].rejects));
                if(game.pm.players[index].money>pay){
                    if(game.pm.players[botIndex(oName)].isTradeAccept(pay,selectedFieldIndex,game)){
                        game.fm.props[selectedFieldIndex].owner=game.pm.players[index].name;
                        game.pm.players[index].tradeIndex++;
                        game.pm.players[index].rejects=0;
                    }else{
                        game.pm.players[index].rejects++;
                    }
                }else{
                    game.pm.players[index].tradeIndex++;
                    game.pm.players[index].rejects=0;
                }
            }else{
                game.pm.players[index].tradeIndex++;
                game.pm.players[index].rejects=0;
            }
            if(game.pm.players[index].tradeIndex>game.fm.props.length){
                game.pm.players[index].rejects=game.pm.players[index].maxRejectCount;
            }
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
        if(bAction=='nextTurn'||bAction=='lose'||bAction=='tripleDouble'){
            exit=true;
        }
    }while(!exit)
    if(eAction=='nextTurn'){
        game.pm.players[index].upgradeIndex=0;
        game.pm.players[index].destroyIndex=0;
        game.pm.players[index].tradeIndex=0;
        game.pm.players[index].rejects=0;
        next();
    }else if(eAction=='lose'){
        log.write("[ BOT - "+index+" ]: "+ game.pm.players[index].name+ " csődöt mondott.");
        lose(game.pm.players[index].name);
        for (let i = 0; i < game.pm.players.length; i++) {
            if(game.pm.players[i].isActive==true){
                if(game.pm.players[i].type=='bot'){
                    callBot(i);
                    break;
                }
            }
        }
    }else if(eAction=='tripleDouble'){
        tripleDouble();
    }
}
function changeRanks(){
    for(var i=0; i<4;i++){
        for(var j=0; j<game.pm.players.length; j++){
            if(game.pm.players[j].name==game.pm.rankList[i]){
                ranks[i][j]++;
            }
        }
    }
}
function writeRanks(){
    console.log("========================");
    console.log("\t"+game.pm.players[0].name+"\t"+game.pm.players[1].name+"\t"+game.pm.players[2].name+game.pm.players[3].name);
    for(var i=0; i<4;i++){
        console.log(i+1+"\t"+ranks[i][0]+"\t"+ranks[i][1]+"\t"+ranks[i][2]+"\t"+ranks[i][3]);
    }
}
function changeFirstData(){
    firstStart[game.firstIndex]++;
}
function writeFirstData(){
    console.log("========================");
    console.log("1.\t2.\t3.\t4.");
    console.log(firstStart[0]+"\t"+firstStart[1]+"\t"+firstStart[2]+"\t"+firstStart[3]+"\t");
}
var turns=1000;
var fitnesCount=10;
var full_turns=0;
var avg_rounds=0;
var roundLimit=200;
var ranks=[
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0]
];
var firstStart=[0,0,0,0];

function fitnes(){
    return ranks[0][0]*4+ranks[1][0]*1+ranks[2][0]*0.25+ranks[3][0]*0.125;
}

var fMax=0;
var fMaxNum=0;

for(var c=1.0;c<=2.0;c+=0.1){
    var fValue=0;
    for(var l=0; l<fitnesCount; l++){
        for(var g=0; g<turns;g++){
            botGame();
            //A c-t mindig az aktuálisan vizsgált paraméter helyére kell írni
            var p1_parameters={
                name: 'Elso',
                tradeRate: c,
                tradeIncrement: 0.2,
                maxRejectCount: 5,
                maxUpgradeCount: 5,
                minMoneyAfterTrade: 0,
                minMoneyAfterBuy: 0,
                stayInJailRound: 10,
                needBusiness: false,
                needService: false
            }
            game.pm.players[0].parameters(p1_parameters);
            if(game.rounds<roundLimit){
                full_turns++;
                avg_rounds+=game.rounds;
                changeRanks();
                changeFirstData();
            }
        }
        fValue+=fitnes(); 
        ranks=[
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0]
        ];
    }
    console.log(c+" esetén: "+ fValue/fitnesCount);
    if(fValue/fitnesCount>fMax){
        fMax=fValue/fitnesCount;
        fMaxNum=c;
    }  
}

console.log("Max: "+fMax + " "+ fMaxNum + " esetén");
//writeRanks();
console.log("Körök: " +full_turns);
console.log("Átlagos hossz: "+avg_rounds/full_turns);