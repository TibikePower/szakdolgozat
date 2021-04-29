const Game = require('../../classes/Game.js');
const Log = require('../../classes/Log.js');
const BotEasy= require("../../classes/BotEasy");
const BotMedium= require("../../classes/BotMedium");
const BotHard= require("../../classes/BotHard");

var game = new Game();

var roundLimit=100;
var turns=100000;
var full_turns=0;

var ranks=[
	[0,0,0,0],
	[0,0,0,0],
	[0,0,0,0],
	[0,0,0,0]
];
//Fájlba kiíratás
const Excel = require('exceljs');
const workbook = new Excel.Workbook();
const worksheet = workbook.addWorksheet("ws");
worksheet.columns = [
 {header: 'Paraméter érték', key: 'p_ertek'},
 {header: 'Átlagos helyezés', key: 'avg'}, 
];
//Fájlba kiíratás
for(var p=0;p<=1;p+=1){ // Paraméterek megadásának ciklusa
	var v=true;
	if(p==1){
		v=false;
	}
	ranks=[
		[0,0,0,0],
		[0,0,0,0],
		[0,0,0,0],
		[0,0,0,0]
	];
	full_turns=0;
	for(var g=0; g<turns;g++){
		botGame();
		if(game.rounds<roundLimit){
			full_turns++;
			changeRanks();
		}
	}
	console.log(p);
	var avg_place=(ranks[0][0]+ranks[1][0]*2+ranks[2][0]*3+ranks[3][0]*4)/full_turns;
	worksheet.addRow({p_ertek: v, avg: avg_place});
}

workbook.xlsx.writeFile('./excels/parameter9.xlsx');

const buffer = workbook.xlsx.writeBuffer();

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}
function getRndDouble(min, max) {
	var range = max - min;
    return parseFloat(min + range * Math.random().toFixed(2));
}
function getRndBoolean() {
  return Math.random() < 0.5;
}

function giveParameters(p){
		var p1_parameters={
			name: 'Elso',
			tradeRate: 2.5,
			tradeIncrement: 0.5,
			maxRejectCount: 6,
			maxUpgradeCount: 5,
			minMoneyAfterTrade: 21000,
			minMoneyAfterBuy: 32000,
			stayInJailRound: 21,
			needBusiness: false,
			needService: p
		}
		var p2_parameters={
			name: 'Masodik',
			tradeRate: getRndDouble(1.2,2.5),
			tradeIncrement: getRndDouble(0.2,2.1),
			maxRejectCount: getRndInteger(3,10),
			maxUpgradeCount: getRndInteger(3,5),
			minMoneyAfterTrade: getRndInteger(0,40000),
			minMoneyAfterBuy: getRndInteger(0,40000),
			stayInJailRound: getRndInteger(20,50),
			needBusiness: getRndBoolean(),
			needService: getRndBoolean()
		}
		var p3_parameters={
			name: 'Harmadik',
			tradeRate: getRndDouble(1.2,2.5),
			tradeIncrement: getRndDouble(0.2,2.1),
			maxRejectCount: getRndInteger(3,10),
			maxUpgradeCount: getRndInteger(3,5),
			minMoneyAfterTrade: getRndInteger(0,40000),
			minMoneyAfterBuy: getRndInteger(0,40000),
			stayInJailRound: getRndInteger(20,50),
			needBusiness: getRndBoolean(),
			needService: getRndBoolean()
		}
		var p4_parameters={
			name: 'Negyedik',
			tradeRate: getRndDouble(1.2,2.5),
			tradeIncrement: getRndDouble(0.2,2.1),
			maxRejectCount: getRndInteger(3,10),
			maxUpgradeCount: getRndInteger(3,5),
			minMoneyAfterTrade: getRndInteger(0,40000),
			minMoneyAfterBuy: getRndInteger(0,40000),
			stayInJailRound: getRndInteger(20,50),
			needBusiness: getRndBoolean(),
			needService: getRndBoolean()
		}
		game.pm.players[0].parameters(p1_parameters);
		game.pm.players[1].parameters(p2_parameters);
		game.pm.players[2].parameters(p3_parameters);
		game.pm.players[3].parameters(p4_parameters);
}

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
	giveParameters(v);
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
	var eAction='';
	do{
		var bAction=game.pm.players[index].calcBotNextAction(game);
		if(bAction=='dice'){
			dice();
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
		}else if(bAction=='useFreeJail'){
			game.pm.players[index].jailtime=0;
			game.pm.players[index].money-=5000;
			game.log.write(""+game.pm.players[index].name+" kifizette az 5.000JF óvadékot.")
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
function fitness(){
	return ranks[0][0]*4+ranks[1][0]*1+ranks[2][0]*(-1)+ranks[3][0]*(-4);
}
function visitProps(){
	var owner=game.pm.rankList[0];
	for(var i=0;i<8;i++){
		var count=0;
		var group=i;
		for(var j=0;j<game.fm.props.length;j++){
			if(game.fm.props[j].group==group && game.fm.props[j].owner==owner){
				count++;
			}
		}
		if(group==0 || group==7){
			if(count==2){
				propCounter[group]++;
			}
		}else{
			if(count==3){
				propCounter[group]++;
			}
		}
	}
}
function visitServices(){
	var counter=0;
	if(game.fm.eOwner==game.pm.rankList[0]){
		counter++;
	}
	if(game.fm.wOwner==game.pm.rankList[1]){
		counter++;
	}
	serviceCounter[counter]++;
}
function visitBusinesses(){
	var counter=0;
	if(game.fm.b1Owner==game.pm.rankList[0]){
		counter++;
	}
	if(game.fm.b2Owner==game.pm.rankList[1]){
		counter++;
	}
	if(game.fm.b3Owner==game.pm.rankList[1]){
		counter++;
	}
	if(game.fm.b4Owner==game.pm.rankList[1]){
		counter++;
	}
	businessCounter[counter]++;
}

writeRanks();