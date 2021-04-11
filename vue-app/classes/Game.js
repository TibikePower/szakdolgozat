const FieldManager = require("./FieldManager");
const PlayerManager = require("./PlayerManager");
// eslint-disable-next-line no-unused-vars
const BotEasy= require("./BotEasy");
// eslint-disable-next-line no-unused-vars
const BotMedium= require("./BotMedium");
// eslint-disable-next-line no-unused-vars
const BotHard= require("./BotHard");
const Table = require("./Table");
const Log = require("./Log");

class Game{
    constructor(){
        this._pm=new PlayerManager();
        this._fm=new FieldManager();
        this._table=new Table();
        this._dices=[1,1];
        this._isStarted=false;
        this._isBuying=false;
        this._isLuckycard=false;
        this._losers=0; // Ez majd a játék végéhez kell
        this._log=new Log('GAME');
        this._rounds=0;
    }
    get losers(){
        return this._losers;
    }
    get rounds(){
        return this._rounds;
    }
    get log(){
        return this._log;
    }
    set losers(l){
        this._losers=l;
    }
    set rounds(r){
        this._rounds=r;
    }
    get pm(){
        return this._pm;
    }
    get fm(){
        return this._fm;
    }
    get dices(){
        return this._dices;
    }
    get table(){
        return this._table;
    }
    set table(t){
        this._table=t;
    }
    set dices(d){
        this._dices=d;
    }
    get isStarted(){
        return this._isStarted;
    }
    set isStarted(s){
        this._isStarted=s;
    }
    set isLuckycard(l){
        this._isLuckycard=l;
    }
    get isLuckycard(){
        return this._isLuckycard;
    }
    start(){//Játék indítása
        this.log.write("A játék indítása..");
        this.log.write("Játékosok betöltése.. ");
        for(var i=0;i<this.pm.players.length;i++){
            this.table.playerPosition[i][0]=this.table.fieldPos[0][0];
            this.table.playerPosition[i][1]=this.table.fieldPos[0][1];
            this.pm.players[i].field=0;
            this.pm.players[i].money=150000;
            this.pm.players[i].jailtime=0;
            this.log.write("--> "+this.pm.players[i].name+" adatai betöltve!");
        }
        this.log.write("Játékosok betöltve! ");
        this.log.write("Üres játékos helyek betöltése.. ");
        if(this.pm.players.length!=4){
            for(i=this.pm.players.length;i<4;i++){
                do{
                    var ok=true;
                    var bn ='Bot'+3;
                    for(let i = 0; i < 3; i++){
                        var random = Math.floor(Math.random() * 27);
                        bn += String.fromCharCode(97 + random);
                    }
                    this.pm.players.forEach(player => {
                        if(player.name==bn){
                            ok=false;
                        }
                    });
                }while(!ok)
                var p = new BotHard(
                    bn,
                    Math.floor(Math.random() * 4)+1,
                    ''
                );
                this.table.playerPosition[i][0]=this.table.fieldPos[0][0];
                this.table.playerPosition[i][1]=this.table.fieldPos[0][1];
                this.pm.addPlayer(p,'b');
                this.pm.players[i].field=0;
                this.pm.players[i].money=150000;
                this.pm.players[i].jailtime=0;
                
            }
            this.log.write("Üres játékos helyek betöltve! ");
        }
        this.isStarted=true;
        this.table.activeField='start';
        this.log.write("A játék elindult! ");
        this.pm.activePlayer(0);
        this.log.write("--> "+this.pm.players[0].name+" <-- a kezdő játékos.");

        /*this.fm.props[2].owner=this.pm.players[2].name; //teszt
        this.fm.props[3].owner=this.pm.players[2].name; //teszt
        this.fm.props[4].owner=this.pm.players[2].name; //teszt
        this.fm.props[4].upgrades=5;
        this.fm.props[6].owner=this.pm.players[2].name; //teszt
        this.fm.props[7].owner=this.pm.players[1].name; //teszt
        this.pm.players[0].money-=130000;//teszt*/
        //this.pm.players[3].money-=100000;//teszt
        //this.pm.players[1].jailtime=1;//teszt
        //this.pm.players[1].freecard=1;//teszt
    }
    botStart(){//Játék indítása csak botokkal
        this.log.write("Bot játék indítása..");
        this.log.write("Botok betöltése.. ");
        this.pm.players=[];
        for(var i=0;i<4;i++){
                do{
                    var ok=true;
                    var bn ='Bot'+3;
                    for(let i = 0; i < 3; i++){
                        var random = Math.floor(Math.random() * 27);
                        bn += String.fromCharCode(97 + random);
                    }
                    this.pm.players.forEach(player => {
                        if(player.name==bn){
                            ok=false;
                        }
                    });
                }while(!ok)
                var p = new BotHard(
                    bn,
                    Math.floor(Math.random() * 4)+1,
                    ''
                );
                this.table.playerPosition[i][0]=this.table.fieldPos[0][0];
                this.table.playerPosition[i][1]=this.table.fieldPos[0][1];
                this.pm.addPlayer(p,'b');
                this.pm.players[i].field=0;
                this.pm.players[i].money=150000;
                this.pm.players[i].jailtime=0;
        }
        this.log.write("Botok betöltve! ");
        //name,trade_th,trade_up,max_rejects,max_upgrades,min_moneyAfterTrade,min_moneyAfterBuy,stayInJail,isNeedBusiness,isNeedService
        this.pm.players[0].parameters('Elso',1.4,0.2,5,5,20000,20000,10,true,true);
        this.pm.players[1].parameters('Masodik',1.4,0.2,5,5,20000,20000,10,true,true);
        this.pm.players[2].parameters('Harmadik',1.4,0.2,5,5,20000,20000,10,true,true);
        this.pm.players[3].parameters('Negyedik',1.4,0.2,5,5,20000,20000,10,true,true);

        this.isStarted=true;
        this.table.activeField='start';
        this.log.write("A játék elindult! ");
        this.pm.activePlayer(0);
        this.log.write("--> "+this.pm.players[0].name+" <-- a kezdő játékos.");

        //this.fm.props[2].owner=this.pm.players[2].name; //teszt
        //this.fm.props[3].owner=this.pm.players[2].name; //teszt
        //this.fm.props[4].owner=this.pm.players[0].name; //teszt
        //this.pm.players[1].money-=100000;//teszt
        //this.pm.players[3].money-=100000;//teszt
        //this.pm.players[1].jailtime=1;//teszt
        //this.pm.players[1].freecard=1;//teszt
    }
    useDice(){//Dobókocka használata
        this.dices[0]=Math.floor(Math.random() * 6)+1;
        this.dices[1]=Math.floor(Math.random() * 6)+1;
        //this.dices[0]=4; //Ez csak teszt
        //this.dices[1]=5; //Ez csak teszt
        this.isLuckycard=false;
        for(var i=0;i<this.pm.players.length;i++){
            if(this.pm.players[i].isActive){
                var moveTo=this.pm.players[i].field+this.dices[0]+this.dices[1];
                if (this.dices[0]==this.dices[1]){this.pm.players[i].jailtime=0;}
                if(this.pm.players[i].jailtime>0){
                    this.table.activeField="bortonlatogatas";
                    this.pm.players[i].jailtime--;
                }else{
                    if(moveTo>=this.table.fieldPos.length){
                        moveTo-=this.table.fieldPos.length;
                        this.pm.players[i].money+=20000;
                    }
                    switch(moveTo){
                        case 4:
                        case 38: //Adó
                            this.table.activeField="ado";
                            this.pm.players[i].money-=20000;
                            //this.pm.players[i].money-=200000; // teszt
                            break;
                        case 2:
                        case 7:
                        case 17: 
                        case 22:
                        case 33:
                        case 36:    //Kártyák
                            this.isLuckycard=true;
                            this.table.activeField="szerencsekartya";
                            break;
                        case 30:    //Böri
                            this.table.activeField="borton";
                            this.pm.players[i].jailtime=3;
                            moveTo=10;
                            break;
                        case 0: //Start
                            this.table.activeField="start";
                            break;
                        case 10: //Böri látogatás
                            this.table.activeField="bortonlatogatas";
                            break;
                        case 20: //Parkoló
                            this.table.activeField="parkolo";
                            break;
                    }
                    this.table.playerPosition[i][0]=this.table.fieldPos[moveTo][0];
                    this.table.playerPosition[i][1]=this.table.fieldPos[moveTo][1];
                    this.pm.players[i].field=moveTo;
                }
            }
        }
    }
    checkField(){//Megnézi, hogy a játékos melyik mezőre lépett
        this.isBuying=false;
        for(var i=0;i<this.pm.players.length;i++){
            if(this.pm.players[i].isActive){
                if(this.pm.players[i].field==5){
                    this.table.activeField="b1";
                    if(this.fm.b1Owner==""){
                        this.isBuying=true;                           
                    }else{
                        for(var j=0;j<this.pm.players.length;j++){
                            if(this.fm.b1Owner==this.pm.players[j].name){
                                this.pm.players[j].money+=this.fm.countBusinessPay(this.pm.players[j].name);
                                this.pm.players[i].money-=this.fm.countBusinessPay(this.pm.players[j].name);
                            }
                        }
                    }
                }
                else if(this.pm.players[i].field==15){
                    this.table.activeField="b2";
                    if(this.fm.b2Owner==""){
                        this.isBuying=true;                           
                    }else{
                        for(j=0;j<this.pm.players.length;j++){
                            if(this.fm.b2Owner==this.pm.players[j].name){
                                this.pm.players[j].money+=this.fm.countBusinessPay(this.pm.players[j].name);
                                this.pm.players[i].money-=this.fm.countBusinessPay(this.pm.players[j].name);
                            }
                        }
                    }
                }
                else if(this.pm.players[i].field==25){
                    this.table.activeField="b3";
                    if(this.fm.b3Owner==""){
                        this.isBuying=true;                           
                    }else{
                        for(j=0;j<this.pm.players.length;j++){
                            if(this.fm.b3Owner==this.pm.players[j].name){
                                this.pm.players[j].money+=this.fm.countBusinessPay(this.pm.players[j].name);
                                this.pm.players[i].money-=this.fm.countBusinessPay(this.pm.players[j].name);
                            }
                        }
                    }
                }
                else if(this.pm.players[i].field==35){
                    this.table.activeField="b4";
                    if(this.fm.b4Owner==""){
                        this.isBuying=true;                           
                    }else{
                        for(j=0;j<this.pm.players.length;j++){
                            if(this.fm.b4Owner==this.pm.players[j].name){
                                this.pm.players[j].money+=this.fm.countBusinessPay(this.pm.players[j].name);
                                this.pm.players[i].money-=this.fm.countBusinessPay(this.pm.players[j].name);
                            }
                        }
                    }
                }
                else if(this.pm.players[i].field==12){
                    this.table.activeField="vizszolgaltato";
                    if(this.fm.wOwner==""){
                        this.isBuying=true;                           
                    }else{
                        for(j=0;j<this.pm.players.length;j++){
                            if(this.fm.wOwner==this.pm.players[j].name){
                                if(this.fm.wOwner==this.fm.eOwner){
                                    this.pm.players[j].money+=((this.dices[0]+this.dices[1])*1000);
                                    this.pm.players[i].money-=((this.dices[0]+this.dices[1])*1000);                                    
                                }else{
                                    this.log.write(this.pm.players[j].name);
                                    this.pm.players[j].money+=((this.dices[0]+this.dices[1])*400);
                                    this.pm.players[i].money-=((this.dices[0]+this.dices[1])*400);   
                                }
                            }
                        }
                    }
                }
                else if(this.pm.players[i].field==28){
                    this.table.activeField="aramszolgaltato";
                    if(this.fm.eOwner==""){
                        this.isBuying=true;                           
                    }else{
                        for(j=0;j<this.pm.players.length;j++){
                            if(this.fm.eOwner==this.pm.players[j].name){
                                if(this.fm.wOwner==this.fm.eOwner){
                                    this.pm.players[j].money+=((this.dices[0]+this.dices[1])*1000);
                                    this.pm.players[i].money-=((this.dices[0]+this.dices[1])*1000);                                    
                                }else{
                                    this.pm.players[j].money+=((this.dices[0]+this.dices[1])*400);
                                    this.pm.players[i].money-=((this.dices[0]+this.dices[1])*400);   
                                }
                            }
                        }
                    }
                }
                else if(this.pm.players[i].field==0 || this.pm.players[i].field==4 || this.pm.players[i].field==38
                    || this.pm.players[i].field==2 || this.pm.players[i].field==7 || this.pm.players[i].field==17
                    || this.pm.players[i].field==22 || this.pm.players[i].field==33 || this.pm.players[i].field==36
                    || this.pm.players[i].field==30 || this.pm.players[i].field==10 || this.pm.players[i].field==20){
                        return;
                }
                else{
                    this.table.activeField="p"+this.pm.players[i].field;
                    if(this.fm.isHaveOwner(this.pm.players[i].field)){
                        this.pm.players[i].money-=this.fm.countPropPay(this.pm.players[i].field);
                        for(j=0;j<this.pm.players.length;j++){
                            if(this.fm.props[this.fm.chooseField(this.pm.players[i].field)].owner==this.pm.players[j].name){
                                this.pm.players[j].money+=this.fm.countPropPay(this.pm.players[i].field);
                            }
                        }
                    }else{
                        this.isBuying=true;
                    }
                }
            }
        }
    }
    buy(){//Biznisz, szolgáltató, ingatlan vásárlása
        for(var i=0;i<this.pm.players.length;i++){
            if(this.pm.players[i].isActive==true){
                if(this.pm.players[i].field==5){
                    if(this.pm.players[i].money>=20000){
                        this.fm.b1Owner=this.pm.players[i].name;
                        this.pm.players[i].money-=20000;
                        this.isBuying=false;
                        this.log.write("[ FM ]: --> "+this.pm.players[i].name+" <-- megvette a Macstec Nutrition-t.");
                    }
                }
                else if(this.pm.players[i].field==15){
                    if(this.pm.players[i].money>=20000){
                        this.fm.b2Owner=this.pm.players[i].name;
                        this.pm.players[i].money-=20000;
                        this.isBuying=false;
                        this.log.write("[ FM ]: --> "+this.pm.players[i].name+" <-- megvette a BioTechNOS-t.");
                    }
                }
                else if(this.pm.players[i].field==25){
                    if(this.pm.players[i].money>=20000){
                        this.fm.b3Owner=this.pm.players[i].name;
                        this.pm.players[i].money-=20000;
                        this.isBuying=false;
                        this.log.write("[ FM ]: --> "+this.pm.players[i].name+" <-- megvette a GymBoa-t.");
                    }
                }
                else if(this.pm.players[i].field==35){
                    if(this.pm.players[i].money>=20000){
                        this.fm.b4Owner=this.pm.players[i].name;
                        this.pm.players[i].money-=20000;
                        this.isBuying=false;
                        this.log.write("[ FM ]: --> "+this.pm.players[i].name+" <-- megvette a Protein.Brumm-ot.");
                    }
                }
                else if(this.pm.players[i].field==12){
                    if(this.pm.players[i].money>=15000){
                        this.fm.wOwner=this.pm.players[i].name;
                        this.pm.players[i].money-=15000;
                        this.isBuying=false;
                        this.log.write("[ FM ]: --> "+this.pm.players[i].name+" <-- megvette a Vízszolgáltatót.");
                    }
                }
                else if(this.pm.players[i].field==28){
                    if(this.pm.players[i].money>=15000){
                        this.fm.eOwner=this.pm.players[i].name;
                        this.pm.players[i].money-=15000;
                        this.isBuying=false;
                        this.log.write("[ FM ]: --> "+this.pm.players[i].name+" <-- megvette az Áramszolgáltatót.");
                    }
                }
                else{
                    if(this.pm.players[i].field!=0 && this.pm.players[i].field!=2 && this.pm.players[i].field!=4 && this.pm.players[i].field!=7 && this.pm.players[i].field!=10
                        && this.pm.players[i].field!=17 && this.pm.players[i].field!=22 && this.pm.players[i].field!=30 && this.pm.players[i].field!=33
                        && this.pm.players[i].field!=36 && this.pm.players[i].field!=38 && this.pm.players[i].field!=20){
                            console.log(this.pm.players[i].field);
                        if(this.pm.players[i].money>=this.fm.props[this.fm.chooseField(this.pm.players[i].field)].price){
                            this.fm.props[this.fm.chooseField(this.pm.players[i].field)].owner=this.pm.players[i].name;
                            this.pm.players[i].money-=this.fm.props[this.fm.chooseField(this.pm.players[i].field)].price;
                            this.isBuying=false;
                            this.log.write("[ FM ]: --> "+this.pm.players[i].name+" <-- megvette a(z) "+this.fm.props[this.fm.chooseField(this.pm.players[i].field)].name+" telket.");
                        }    
                    }
                    
                }
            }
        }        
    }
    trade(tradeInfo){
        for(var i=0;i<tradeInfo.p1fields.length;i++){
            if(tradeInfo.p1fields[i]==5){
                this.fm.b1Owner=tradeInfo.p2name;
            }else if(tradeInfo.p1fields[i]==15){
                this.fm.b2Owner=tradeInfo.p2name;
            }else if(tradeInfo.p1fields[i]==25){
                this.fm.b3Owner=tradeInfo.p2name;
            }else if(tradeInfo.p1fields[i]==35){
                this.fm.b4Owner=tradeInfo.p2name;
            }else if(tradeInfo.p1fields[i]==28){
                this.fm.eOwner=tradeInfo.p2name;
            }else if(tradeInfo.p1fields[i]==12){
                this.fm.wOwner=tradeInfo.p2name;
            }else{
                this.fm.props[this.fm.chooseField(tradeInfo.p1fields[i])].owner=tradeInfo.p2name;
            }
        }
        for(i=0;i<tradeInfo.p2fields.length;i++){
            if(tradeInfo.p2fields[i]==5){
                this.fm.b1Owner=tradeInfo.p1name;
            }else if(tradeInfo.p2fields[i]==15){
                this.fm.b2Owner=tradeInfo.p1name;
            }else if(tradeInfo.p2fields[i]==25){
                this.fm.b3Owner=tradeInfo.p1name;
            }else if(tradeInfo.p2fields[i]==35){
                this.fm.b4Owner=tradeInfo.p1name;
            }else if(tradeInfo.p2fields[i]==28){
                this.fm.eOwner=tradeInfo.p1name;
            }else if(tradeInfo.p2fields[i]==12){
                this.fm.wOwner=tradeInfo.p1name;
            }else{
                this.fm.props[this.fm.chooseField(tradeInfo.p2fields[i])].owner=tradeInfo.p1name;
            }
        }
        for(i=0;i<this.pm.players.length;i++){
            if(this.pm.players[i].name==tradeInfo.p1name){
                this.pm.players[i].money-=parseInt(tradeInfo.p1money);
                this.pm.players[i].money+=parseInt(tradeInfo.p2money);
                this.pm.players[i].freecard-=parseInt(tradeInfo.p1freecard);
                this.pm.players[i].freecard+=parseInt(tradeInfo.p2freecard);
            }
            if(this.pm.players[i].name==tradeInfo.p2name){
                this.pm.players[i].money-=parseInt(tradeInfo.p2money);
                this.pm.players[i].money+=parseInt(tradeInfo.p1money);
                this.pm.players[i].freecard-=parseInt(tradeInfo.p2freecard);
                this.pm.players[i].freecard+=parseInt(tradeInfo.p1freecard);
            }
        }
    }
    lose(name){
        for(var i=0;i<this.pm.players.length;i++){
            if(name==this.pm.players[i].name){
                this.pm.addRankList(name);
                if(this.fm.b1Owner==name){
                    this.fm.b1Owner='';
                }
                if(this.fm.b2Owner==name){
                    this.fm.b2Owner='';
                }
                if(this.fm.b3Owner==name){
                    this.fm.b3Owner='';
                }
                if(this.fm.b4Owner==name){
                    this.fm.b4Owner='';
                }
                if(this.fm.wOwner==name){
                    this.fm.wOwner='';
                }
                if(this.fm.eOwner==name){
                    this.fm.eOwner='';
                }
                for(var j=0;j<this.fm.props.length;j++){
                    if(this.fm.props[j].owner==name){
                        this.fm.props[j].owner='';
                        this.fm.props[j].upgrades=0;
                    }
                }
                this.pm.players[i].status="lose";
                this.table.playerPosition[i][0]=9999;
                this.table.playerPosition[i][1]=9999;
                if(this.pm.players[i].field==5){
                    if(this.fm.b1Owner!=''){
                        this.pm.players[this.pm.playerIndex(this.fm.b1Owner)].money+=this.pm.players[i].money;
                    }
                }
                if(this.pm.players[i].field==15){
                    if(this.fm.b2Owner!=''){
                        this.pm.players[this.pm.playerIndex(this.fm.b2Owner)].money+=this.pm.players[i].money;
                    }
                }
                if(this.pm.players[i].field==25){
                    if(this.fm.b3Owner!=''){
                        this.pm.players[this.pm.playerIndex(this.fm.b3Owner)].money+=this.pm.players[i].money;
                    }
                }
                if(this.pm.players[i].field==35){
                    if(this.fm.b4Owner!=''){
                        this.pm.players[this.pm.playerIndex(this.fm.b4Owner)].money+=this.pm.players[i].money;
                    }
                }
                if(this.pm.players[i].field==12){
                    if(this.fm.wOwner!=''){
                        this.pm.players[this.pm.playerIndex(this.fm.wOwner)].money+=this.pm.players[i].money;
                    }
                }
                if(this.pm.players[i].field==28){
                    if(this.fm.eOwner!=''){
                        this.pm.players[this.pm.playerIndex(this.fm.eOwner)].money+=this.pm.players[i].money;
                    }
                }
                for(var k=0; k<this.fm.props.length;k++){
                    if(this.fm.props[k].owner!='' && this.fm.props[k].field == this.pm.players[i].field){
                        this.pm.players[this.pm.playerIndex(this.fm.props[k].owner)].money+=this.pm.players[i].money;
                    }
                }
                this.pm.players[i].field=0;
                this.losers++;
                this.nextTurn();
                break;
            }
            
        }
    }
    nextTurn(){//Következő kör
        this.isLuckycard=false;
        this.isBuying=false;
        var index=0;
        var nextActive=0;
        for(var i=0;i<this.pm.players.length;i++){
            if(this.pm.players[i].isActive==true){
                index=i;
                break;
            }
        }
        if(!(this.dices[0]==this.dices[1])){
                for(i=0;i<this.pm.players.length;i++){
                    if(this.pm.players[i].isActive==true){
                        this.pm.players[i].isActive=false;
                        nextActive=i+1;
                    }
                }
                if(this.pm.players.length<=nextActive){
                    nextActive=0;
                    this.rounds++;
                }
                    while(this.pm.players[nextActive].status=="lose"){
                    nextActive++;
                    if(this.pm.players.length<=nextActive){
                        nextActive=0;
                        this.rounds++;
                    }
                    }
        }
        if(this.pm.players[index].status=="lose"){
                for(i=0;i<this.pm.players.length;i++){
                    if(this.pm.players[i].isActive==true){
                        this.pm.players[i].isActive=false;
                        nextActive=i+1;
                    }
                }
                if(this.pm.players.length<=nextActive){
                    nextActive=0;
                    this.rounds++;
                }
                    while(this.pm.players[nextActive].status=="lose"){
                        nextActive++;
                        if(this.pm.players.length<=nextActive){
                            nextActive=0;
                            this.rounds++;
                        }
                    }       
        }
        this.pm.activePlayer(nextActive);
                return;   
    }
    tripleDouble(){//Kezeli azt a lehetőséget hogyha a játékos háromszor dobott duplát
        this.isLuckycard=false;
        this.isBuying=false;
        this.log.write("A játékos háromszor dobott duplát, a kör átadódik!");
        var nextActive=0;
        for(var i=0;i<this.pm.players.length;i++){
            if(this.pm.players[i].isActive==true){
                this.pm.players[i].isActive=false;
                nextActive=i+1;
            }
        }
        if(this.pm.players.length<=nextActive){
            nextActive=0;
            this.rounds++;
        }
            while(this.pm.players[nextActive].status=="lose"){
               nextActive++;
               if(this.pm.players.length<=nextActive){
                   nextActive=0;
                   this.rounds++;
               }
            }
            this.pm.activePlayer(nextActive);
    }
    useFreeCard(){//Használja az Ingyen Szabadulhatsz A Börtönből kártyát
        for(var i=0;i<this.pm.players.length;i++){
            if(this.pm.players[i].isActive==true){
                this.pm.players[i].jailtime=0;
                this.pm.players[i].freecard-=1;
                this.log.write(""+this.pm.players[i].name+" felhasznált egy 'I.Sz.A.B.' kártyát.")
            }
        }
    }
    useFreeJail(){// Kifizette az 5000 JF óvadékot
        for(var i=0;i<this.pm.players.length;i++){
            if(this.pm.players[i].isActive==true){
                this.pm.players[i].jailtime=0;
                this.pm.players[i].money-=5000;
                this.log.write(""+this.pm.players[i].name+" kifizette az 5.000JF óvadékot.")
            }
        }
    }
    sell(field){/* Elad valamilyen bizniszt/szolgáltatást/ingatlant
        - Bizniszek eladási ára: 10000 JF
        - Szolgáltatások eladási ára: 10000JF
        - Ingatlan eladási ár: Vételár fele
        */
        for(var i=0;i<this.pm.players.length;i++){
            if(this.pm.players[i].isActive==true){
                switch(field){
                    case 5:
                        this.fm.b1Owner='';
                        this.pm.players[i].money+=10000;
                        this.log.write("[ FM ]: --> "+this.pm.players[i].name+" <-- eladta a Macstec Nutrition-t.");
                        break;
                    case 15:
                        this.fm.b2Owner='';
                        this.pm.players[i].money+=10000;
                        this.log.write("[ FM ]: --> "+this.pm.players[i].name+" <-- eladta a BioTechNOS-t.");
                        break;  
                    case 25:
                        this.fm.b3Owner='';
                        this.pm.players[i].money+=10000;
                        this.log.write("[ FM ]: --> "+this.pm.players[i].name+" <-- eladta a GymBoa-t.");
                        break; 
                    case 35:
                        this.fm.b4Owner='';
                        this.pm.players[i].money+=10000;
                        this.log.write("[ FM ]: --> "+this.pm.players[i].name+" <-- eladta a protein.brumm-ot.");
                        break;
                    case 12:
                        this.fm.wOwner='';
                        this.pm.players[i].money+=10000;
                        this.log.write("[ FM ]: --> "+this.pm.players[i].name+" <-- eladta a Vízszolgáltatót.");
                        break;
                    case 28:
                        this.fm.eOwner='';
                        this.pm.players[i].money+=10000;
                        this.log.write("[ FM ]: --> "+this.pm.players[i].name+" <-- eladta az Áramszolgáltatót.");
                        break;
                    default:
                        this.fm.props[this.fm.chooseField(field)].owner='';
                        this.log.write("[ FM ]: --> "+this.pm.players[i].name+" <-- eladta a(z) " + this.fm.props[this.fm.chooseField(field)].name+" telket.");
                        this.pm.players[i].money+=this.fm.props[this.fm.chooseField(field)].price/2;
                }
            }
        }
    }
    upgrade(field){ // Ingatlan fejlesztése
        for(var i=0;i<this.pm.players.length;i++){
            if(this.pm.players[i].isActive==true){
                this.pm.players[i].money-=this.fm.props[this.fm.chooseField(field)].upgradeCost;
                this.fm.props[this.fm.chooseField(field)].upgrades=this.fm.props[this.fm.chooseField(field)].upgrades+1;
                this.log.write("[ FM ]: --> "+this.pm.players[i].name+" <-- fejlesztette a(z) " + this.fm.props[this.fm.chooseField(field)].name+" telket. Új fejlesztési szint: "+this.fm.props[this.fm.chooseField(field)].upgrades);
            }
        }
        if(this.fm.props[this.fm.chooseField(field)].upgrades==5){
            this.fm.stars=this.fm.stars+4;
            this.fm.crowns= this.fm.crowns-1;
        }else{
            this.fm.stars=this.fm.stars-1;
        }
    }
    destroy(field){/* Ingatlan visszafejlesztése
        - Egy ház lerombolásáért kapott összeg: Ingatlan fejlesztésének a fele
        */
        for(var i=0;i<this.pm.players.length;i++){
            if(this.pm.players[i].isActive==true){
                if(this.fm.props[this.fm.chooseField(field)].upgrades==5){
                    this.fm.stars=this.fm.stars-4;
                    this.fm.crowns=this.fm.crowns+1;
                }else{
                    this.fm.stars=this.fm.stars+1;
                }
                this.pm.players[i].money+=this.fm.props[this.fm.chooseField(field)].upgradeCost/2;
                this.fm.props[this.fm.chooseField(field)].upgrades=this.fm.props[this.fm.chooseField(field)].upgrades-1;
                this.log.write("[ FM ]: --> "+this.pm.players[i].name+" <-- visszafejlesztette a(z) " + this.fm.props[this.fm.chooseField(field)].name+" telket. Új fejlesztési szint: "+this.fm.props[this.fm.chooseField(field)].upgrades);
            }
        }
        
    }
    gameEnd(){
        var winners=[];
        for(var i=0;i<this.pm.players.length;i++){
            if(this.pm.players[i].status!="lose"){
                if(this.pm.players[i].name==this.fm.eOwner){
                    this.pm.players[i].money+=15000;
                }
                if(this.pm.players[i].name==this.fm.wOwner){
                    this.pm.players[i].money+=15000;
                }
                if(this.pm.players[i].name==this.fm.b1Owner){
                    this.pm.players[i].money+=20000;
                }
                if(this.pm.players[i].name==this.fm.b2Owner){
                    this.pm.players[i].money+=20000;
                }
                if(this.pm.players[i].name==this.fm.b3Owner){
                    this.pm.players[i].money+=20000;
                }
                if(this.pm.players[i].name==this.fm.b4Owner){
                    this.pm.players[i].money+=20000;
                }
                for(var j=0;j<this.fm.props.length;j++){
                    if(this.fm.props[j].owner==this.pm.players[i].name){
                        this.pm.players[i].money+=this.fm.props[j].price;
                        this.pm.players[i].money+=this.fm.props[j].upgrades*this.fm.props[j].upgradeCost;
                    }
                }
                var obj = {};
                obj['name']=this.pm.players[i].name;
                obj['money']=this.pm.players[i].money
                winners.push(obj);
            }
            this.pm.players[i].status="end";
            this.pm.players[i].isActive=false;
            
        }
        winners.sort(function(a, b) {
            return a.money - b.money;
        });
        this.pm.rankList.push(winners[0].name);
        this.pm.rankList.push(winners[1].name);
        this.pm.rankList=this.pm.rankList.reverse();
    }
    
    luckyCard(){
        var card=Math.floor(Math.random() * 19)+1; // A csillag után a legutolsó case-t kell beírni
        //var card=4; // Ez csak teszt
        var msg='';
        switch(card){
            case 1:
                for(var i=0;i<this.pm.players.length;i++){
                    if(this.pm.players[i].isActive==true){
                        this.pm.players[i].money+=10000;
                        msg=this.pm.players[i].name+" kapott 10.000JF-ot.";
                    }
                }
                break;
            case 2:
                for(i=0;i<this.pm.players.length;i++){
                    if(this.pm.players[i].isActive==true){
                        this.pm.players[i].money+=20000;
                        msg=this.pm.players[i].name+" kapott 20.000JF-ot.";
                    }
                }
                break;
            case 3:
                for(i=0;i<this.pm.players.length;i++){
                    if(this.pm.players[i].isActive==true){
                        this.pm.players[i].money+=30000;
                        msg=this.pm.players[i].name+" kapott 30.000JF-ot.";
                    }
                }
                break;
            case 4:
                for(i=0;i<this.pm.players.length;i++){
                    if(this.pm.players[i].isActive==true){
                        this.pm.players[i].freecard+=1;
                        msg=this.pm.players[i].name+" kapott egy 'Ingyen szabadulhatsz a börtönből' kártyát.";
                    }
                }
                break;
            case 5:
                for(i=0;i<this.pm.players.length;i++){
                    if(this.pm.players[i].isActive==true){
                        this.pm.players[i].field+=3;
                        if(this.pm.players[i].field>=this.table.fieldPos.length){
                            this.pm.players[i].field-=this.table.fieldPos.length;
                        }
                        this.isBuying=false;
                        //this.table.playerPosition[i][0]=this.table.fieldPos[this.pm.players[i].field][0];//teszt miatt kommentezve
                        //this.table.playerPosition[i][1]=this.table.fieldPos[this.pm.players[i].field][1];//teszt miatt kommentezve
                        msg=this.pm.players[i].name+" előre lép 3 mezőt!";
                        this.checkField();
                    }
                }
                break;
            case 6:
                for(i=0;i<this.pm.players.length;i++){
                    if(this.pm.players[i].isActive==true){
                        this.pm.players[i].field+=2;
                        if(this.pm.players[i].field>=this.table.fieldPos.length){
                            this.pm.players[i].field-=this.table.fieldPos.length;
                        }
                        this.isBuying=false;
                        //this.table.playerPosition[i][0]=this.table.fieldPos[this.pm.players[i].field][0];//teszt miatt kommentezve
                        //this.table.playerPosition[i][1]=this.table.fieldPos[this.pm.players[i].field][1];//teszt miatt kommentezve
                        msg=this.pm.players[i].name+" előre lép 2 mezőt!";
                        this.checkField();
                    }
                }
                break;
            case 7:
                for(i=0;i<this.pm.players.length;i++){
                    if(this.pm.players[i].isActive==true){
                        this.pm.players[i].field-=1;
                        this.isBuying=false;
                        //this.table.playerPosition[i][0]=this.table.fieldPos[this.pm.players[i].field][0]; //teszt miatt kommentezve
                        //this.table.playerPosition[i][1]=this.table.fieldPos[this.pm.players[i].field][1];//teszt miatt kommentezve
                        msg=this.pm.players[i].name+" vissza lép 1 mezőt!";
                        this.checkField();
                    }
                }
                break;
            case 8:
                for(i=0;i<this.pm.players.length;i++){
                    if(this.pm.players[i].isActive==true){
                        this.pm.players[i].field=1;
                        this.isBuying=false;
                        //this.table.playerPosition[i][0]=this.table.fieldPos[this.pm.players[i].field][0];//teszt miatt kommentezve
                        //this.table.playerPosition[i][1]=this.table.fieldPos[this.pm.players[i].field][1];//teszt miatt kommentezve
                        msg=this.pm.players[i].name+" szeretné meglátogatni az Uhu-kat, ezért visszalép az első mezőre!";
                        this.checkField();
                    }
                }
                break;
            case 9:
                for(i=0;i<this.pm.players.length;i++){
                    if(this.pm.players[i].isActive==true){
                        this.pm.players[i].field=39;
                        this.isBuying=false;
                        //this.table.playerPosition[i][0]=this.table.fieldPos[this.pm.players[i].field][0];//teszt miatt kommentezve
                        //this.table.playerPosition[i][1]=this.table.fieldPos[this.pm.players[i].field][1];//teszt miatt kommentezve
                        msg="Éppen Krokodil etetés zazjlik, ezért "+this.pm.players[i].name+" már rohan is hozzájuk.";
                        this.checkField();
                    }
                }
                break;
            case 10:
                for(i=0;i<this.pm.players.length;i++){
                    if(this.pm.players[i].isActive==true){
                        this.pm.players[i].field=15;
                        if(this.pm.players[i].field>15){
                            this.pm.players[i].money+=20000;
                        }
                        this.isBuying=false;
                        //this.table.playerPosition[i][0]=this.table.fieldPos[this.pm.players[i].field][0];//teszt miatt kommentezve
                        //this.table.playerPosition[i][1]=this.table.fieldPos[this.pm.players[i].field][1];//teszt miatt kommentezve
                        msg=this.pm.players[i].name+"-nak/-nek fogyóban a fehérje készlete, ezért előre lép a BioTechNOS üzletbe. (Ha áthalad a START mezőn kap +20.000JF-ot.)";
                        this.checkField();
                    }
                }
                break;
            case 11:
                for(i=0;i<this.pm.players.length;i++){
                    if(this.pm.players[i].isActive==true){
                        this.pm.players[i].field=24;
                        if(this.pm.players[i].field>24){
                            this.pm.players[i].money+=20000;
                        }
                        this.isBuying=false;
                        //this.table.playerPosition[i][0]=this.table.fieldPos[this.pm.players[i].field][0];//teszt miatt kommentezve
                        //this.table.playerPosition[i][1]=this.table.fieldPos[this.pm.players[i].field][1];//teszt miatt kommentezve
                        msg="Lám, a láma! "+this.pm.players[i].name+" előre lép a Lámákhoz! (Ha áthalad a START mezőn kap +20.000JF-ot.)";
                        this.checkField();
                    }
                }
                break;
            case 12:
                for(i=0;i<this.pm.players.length;i++){
                    if(this.pm.players[i].isActive==true){
                        this.pm.players[i].money-=5000;
                        msg=this.pm.players[i].name+" nem fizetett kondibérletet! -5.000JF";
                        this.checkField();
                    }
                }
                break;
            case 13:
                for(i=0;i<this.pm.players.length;i++){
                    if(this.pm.players[i].isActive==true){
                        msg=this.pm.players[i].name+"-nak/nek nem sikerült kinyomni a 100kg-ot fekve, ezért egy körből kimarad!";
                        this.pm.players[i].jailtime=1;
                        this.nextTurn();
                    }
                }
                break;  
            case 14:
                for(i=0;i<this.pm.players.length;i++){
                    if(this.pm.players[i].isActive==true){
                        msg=this.pm.players[i].name+"-nak/nek születésnapja van! Minden játékostól kap 5000JF-ot.";
                        for(var j=0;j<this.pm.players.length;j++){
                            if(this.pm.players[j].name!=this.pm.players[i].name){
                                if(this.pm.players[j].status!="lose"){
                                    this.pm.players[j].money-=5000;
                                    this.pm.players[i].money+=5000;
                                }
                            }
                        }
                    }
                }
                break;
            case 15:
                for(i=0;i<this.pm.players.length;i++){
                    if(this.pm.players[i].isActive==true){
                        msg="Bolhariadó! Minden Csillag fejlesztés után fizess 3000JF-ot, illetve minden Korona fejlesztés után 10000JF-ot!";
                        for(j=0;j<this.fm.props.length;j++){
                            if(this.fm.props[j].owner==this.pm.players[i].name){
                                if(this.fm.props[j].upgrades==5){
                                    this.pm.players[i].money-=10000;
                                }else{
                                    this.pm.players[i].money-=3000*this.fm.props[j].upgrades;
                                }
                            }
                        }
                    }
                }
                break;
            case 16:
                for(i=0;i<this.pm.players.length;i++){
                    if(this.pm.players[i].isActive==true){
                        this.pm.players[i].field=10;
                        //this.table.playerPosition[i][0]=this.table.fieldPos[this.pm.players[i].field][0];//teszt miatt kommentezve
                        //this.table.playerPosition[i][1]=this.table.fieldPos[this.pm.players[i].field][1];//teszt miatt kommentezve
                        msg=this.pm.players[i].name+"-t kokszoláson kapták! Irány a börtön!";
                        this.isBuying=false;
                        this.pm.players[i].jailtime=3;
                    }
                }
                break;
            case 17:
            case 18:
            case 19:   
                for(i=0;i<this.pm.players.length;i++){
                    if(this.pm.players[i].isActive==true){
                        this.pm.players[i].money+=5000;
                        msg=this.pm.players[i].name+" kapott 5.000JF-ot.";
                    }
                }
                break;
            
        }
        return msg;
    }

}
module.exports = Game;