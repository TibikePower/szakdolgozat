const FieldManager = require("./FieldManager");
const PlayerManager = require("./PlayerManager");
const Player= require("./Player");
const Table = require("./Table");

class Game{
    constructor(){
        this._pm=new PlayerManager();
        this._fm=new FieldManager();
        this._table=new Table();
        this._dices=[1,1];
        this._isStarted=false;
        this._isBuying=false;
        this._isLuckycard=false;
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
        console.log("[ SERVER ]: A játék indítása..");
        console.log("[ SERVER ]: Játékosok betöltése.. ");
        for(var i=0;i<this.pm.players.length;i++){
            this.table.playerPosition[i][0]=this.table.fieldPos[0][0];
            this.table.playerPosition[i][1]=this.table.fieldPos[0][1];
            this.pm.players[i].field=0;
            this.pm.players[i].money=150000;
            this.pm.players[i].jailtime=0;
            console.log("[ SERVER ]: --> "+this.pm.players[i].name+" adatai betöltve!");
        }
        console.log("[ SERVER ]: Játékosok betöltve! ");
        console.log("[ SERVER ]: Üres játékos helyek betöltése.. ");
        if(this.pm.players.length!=4){
            for(i=this.pm.players.length;i<4;i++){
                var p = new Player(
                    '',
                    1,
                    ''
                );
                p.money=-999999;
                p.jailtime=-1;
                p.field=0;
                this.table.playerPosition[i][0]=9999;
                this.table.playerPosition[i][1]=9999;
                this.pm.players.push(p);
            }
            console.log("[ SERVER ]: Üres játékos helyek betöltve! ");
        }
        this.isStarted=true;
        this.table.activeField='start';
        console.log("[ SERVER ]: A játék elindult! ");
        this.pm.activePlayer(0);
        console.log("[ SERVER ]: --> "+this.pm.players[0].name+" <-- a kezdő játékos.");

        this.fm.props[0].owner=this.pm.players[0].name; //teszt
    }
    useDice(){//Dobókocka használata
        //this.dices[0]=Math.floor(Math.random() * 6)+1;
        //this.dices[1]=Math.floor(Math.random() * 6)+1;
        this.dices[0]=1; //Ez csak teszt
        this.dices[1]=2; //Ez csak teszt
        for(var i=0;i<this.pm.players.length;i++){
            if(this.pm.players[i].isActive){
                var moveTo=this.pm.players[i].field+this.dices[0]+this.dices[1];
                if (this.dices[0]==this.dices[1]){this.pm.players[i].jailtime=0;}
                if(this.pm.players[i].jailtime>0){
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
                            break;
                        case 2:
                        case 7:
                        case 17: 
                        case 22:
                        case 33:
                        case 36:    //Kártyák
                            //Ez még nincsen kész
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
                                    console.log(this.pm.players[j].name);
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
                    this.table.activeField="p"+this.pm.players[i].field;//Ezeknél még nincsenek képek
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
                        console.log("[ FM ]: --> "+this.pm.players[i].name+" <-- megvette a Macstec Nutrition-t.");
                    }
                }
                else if(this.pm.players[i].field==15){
                    if(this.pm.players[i].money>=20000){
                        this.fm.b2Owner=this.pm.players[i].name;
                        this.pm.players[i].money-=20000;
                        this.isBuying=false;
                        console.log("[ FM ]: --> "+this.pm.players[i].name+" <-- megvette a BioTechNOS-t.");
                    }
                }
                else if(this.pm.players[i].field==25){
                    if(this.pm.players[i].money>=20000){
                        this.fm.b3Owner=this.pm.players[i].name;
                        this.pm.players[i].money-=20000;
                        this.isBuying=false;
                        console.log("[ FM ]: --> "+this.pm.players[i].name+" <-- megvette a GymBoa-t.");
                    }
                }
                else if(this.pm.players[i].field==35){
                    if(this.pm.players[i].money>=20000){
                        this.fm.b4Owner=this.pm.players[i].name;
                        this.pm.players[i].money-=20000;
                        this.isBuying=false;
                        console.log("[ FM ]: --> "+this.pm.players[i].name+" <-- megvette a Protein.Brumm-ot.");
                    }
                }
                else if(this.pm.players[i].field==12){
                    if(this.pm.players[i].money>=15000){
                        this.fm.wOwner=this.pm.players[i].name;
                        this.pm.players[i].money-=15000;
                        this.isBuying=false;
                        console.log("[ FM ]: --> "+this.pm.players[i].name+" <-- megvette a Vízszolgáltatót.");
                    }
                }
                else if(this.pm.players[i].field==28){
                    if(this.pm.players[i].money>=15000){
                        this.fm.eOwner=this.pm.players[i].name;
                        this.pm.players[i].money-=15000;
                        this.isBuying=false;
                        console.log("[ FM ]: --> "+this.pm.players[i].name+" <-- megvette az Áramszolgáltatót.");
                    }
                }
                else{
                    if(this.pm.players[i].money>=this.fm.props[this.fm.chooseField(this.pm.players[i].field)].price){
                        this.fm.props[this.fm.chooseField(this.pm.players[i].field)].owner=this.pm.players[i].name;
                        this.pm.players[i].money-=this.fm.props[this.fm.chooseField(this.pm.players[i].field)].price;
                        this.isBuying=false;
                        console.log("[ FM ]: --> "+this.pm.players[i].name+" <-- megvette a(z) "+this.fm.props[this.fm.chooseField(this.pm.players[i].field)].name+" telket.");
                    }
                }
            }
        }        
    }
    nextTurn(){//Következő kör
        this.isLuckycard=false;
        this.isBuying=false;
        if(!(this.dices[0]==this.dices[1])){
            var nextActive=0;
            for(var i=0;i<this.pm.players.length;i++){
                if(this.pm.players[i].isActive==true){
                    this.pm.players[i].isActive=false;
                    nextActive=i+1;
                }
            }
            if(this.pm.players.length<=nextActive){
                this.pm.activePlayer(0);
            }else{
                if(this.pm.players[nextActive].name==''){
                    this.pm.activePlayer(0);
                }else{
                    this.pm.activePlayer(nextActive);
                }
            }        
        }else{
            console.log("[ SERVER ]: A játékos duplát dobott, újból ő következik!");
        }
    }
    tripleDouble(){//Kezeli azt a lehetőséget hogyha a játékos háromszor dobott duplát
        this.isBuying=false;
        console.log("[ SERVER ]: A játékos háromszor dobott duplát, a kör átadódik!");
        var nextActive=0;
        for(var i=0;i<this.pm.players.length;i++){
            if(this.pm.players[i].isActive==true){
                this.pm.players[i].isActive=false;
                nextActive=i+1;
            }
        }
        if(this.pm.players.length<=nextActive){
            this.pm.activePlayer(0);
        }else{
            if(this.pm.players[nextActive].name==''){
                this.pm.activePlayer(0);
            }else{
                this.pm.activePlayer(nextActive);
            }
        }        
    }
    useFreeCard(){
        for(var i=0;i<this.pm.players.length;i++){
            if(this.pm.players[i].isActive==true){
                this.pm.players[i].jailtime=0;
                this.pm.players[i].freecard-=1;
                console.log("[ SZERVER ]: "+this.pm.players[i].name+" felhasznált egy 'I.Sz.A.B.' kártyát.")
            }
        }
    }
    useFreeJail(){
        for(var i=0;i<this.pm.players.length;i++){
            if(this.pm.players[i].isActive==true){
                this.pm.players[i].jailtime=0;
                this.pm.players[i].money-=5000;
                console.log("[ SZERVER ]: "+this.pm.players[i].name+" kifizette az 5.000JF óvadékot.")
            }
        }
    }
    sell(field){
        for(var i=0;i<this.pm.players.length;i++){
            if(this.pm.players[i].isActive==true){
                switch(field){
                    case 5:
                        this.fm.b1Owner='';
                        this.pm.players[i].money+=400000;//ezt majd kiszámolom egyelőre csak teszt
                        console.log("[ FM ]: --> "+this.pm.players[i].name+" <-- eladta a Macstec Nutrition-t.");
                        break;
                    case 15:
                        this.fm.b2Owner='';
                        this.pm.players[i].money+=400000;//ezt majd kiszámolom egyelőre csak teszt
                        console.log("[ FM ]: --> "+this.pm.players[i].name+" <-- eladta a BioTechNOS-t.");
                        break;  
                    case 25:
                        this.fm.b3Owner='';
                        this.pm.players[i].money+=400000;//ezt majd kiszámolom egyelőre csak teszt
                        console.log("[ FM ]: --> "+this.pm.players[i].name+" <-- eladta a GymBoa-t.");
                        break; 
                    case 35:
                        this.fm.b4Owner='';
                        this.pm.players[i].money+=400000;//ezt majd kiszámolom egyelőre csak teszt
                        console.log("[ FM ]: --> "+this.pm.players[i].name+" <-- eladta a protein.brumm-ot.");
                        break;
                    case 12:
                        this.fm.wOwner='';
                        this.pm.players[i].money+=400000;//ezt majd kiszámolom egyelőre csak teszt
                        console.log("[ FM ]: --> "+this.pm.players[i].name+" <-- eladta a Vízszolgáltatót.");
                        break;
                    case 28:
                        this.fm.eOwner='';
                        this.pm.players[i].money+=400000;//ezt majd kiszámolom egyelőre csak teszt
                        console.log("[ FM ]: --> "+this.pm.players[i].name+" <-- eladta az Áramszolgáltatót.");
                        break;
                    default:
                        this.fm.props[this.fm.chooseField(field)].owner='';
                        console.log("[ FM ]: --> "+this.pm.players[i].name+" <-- eladta a(z) " + this.fm.props[this.fm.chooseField(field)].name+" telket.");
                        this.pm.players[i].money+=this.fm.props[this.fm.chooseField(field)].price; // ez sem ennyi lesz
                }
            }
        }
    }
    upgrade(field){
        for(var i=0;i<this.pm.players.length;i++){
            if(this.pm.players[i].isActive==true){
                this.pm.players[i].money-=this.fm.props[this.fm.chooseField(field)].upgradeCost;
                this.fm.props[this.fm.chooseField(field)].upgrades=this.fm.props[this.fm.chooseField(field)].upgrades+1;
                console.log("[ FM ]: --> "+this.pm.players[i].name+" <-- fejlesztette a(z) " + this.fm.props[this.fm.chooseField(field)].name+" telket. Új fejlesztési szint: "+this.fm.props[this.fm.chooseField(field)].upgrades);
            }
        }
        if(this.fm.props[this.fm.chooseField(field)].upgrades==5){
            this.fm.stars=this.fm.stars+4;
            this.fm.crowns= this.fm.crowns-1;
        }else{
            this.fm.stars=this.fm.stars-1;
        }
    }
    destroy(field){
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
                console.log("[ FM ]: --> "+this.pm.players[i].name+" <-- visszafejlesztette a(z) " + this.fm.props[this.fm.chooseField(field)].name+" telket. Új fejlesztési szint: "+this.fm.props[this.fm.chooseField(field)].upgrades);
            }
        }
        
    }
    luckyCard(){ //Ez még nincs kész, a szerencsekártyákat ez a funkció fogja kezelni
        //var card=Math.floor(Math.random() * 4)+1; // A csillag után a legutolsó case-t kell beírni
        var card=4; // Ez csak teszt
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
            /*case 4:
                for(i=0;i<this.pm.players.length;i++){
                    if(this.pm.players[i].isActive==true){
                        this.pm.players[i].field+=3;
                        this.table.playerPosition[i][0]=this.table.fieldPos[this.pm.players[i].field][0];
                        this.table.playerPosition[i][1]=this.table.fieldPos[this.pm.players[i].field][1];
                        msg=this.pm.players[i].name+" lép valamennyit";
                    }
                }
                break;*/
            
        }
        return msg;
    }

}
module.exports = Game;