class Bot{
    constructor(name,skin,status,level){
        this._name=name;
        this._skin=skin;
        this._status=status;
        this._isActive=false;
        this._money=-999999;
        this._field=null;
        this._jailtime=-1;
        this._freecard=0;
        this._level=level;
        this._type='bot';

        //Ezek kellenek ahhoz, hogy tudjuk mit csinált már a bot a körben
        this._isUsedDice=false;
        this._doubleDice=0;
    }
    get type(){
        return this._type;
    }
    get doubleDice(){
        return this._doubleDice;
    }
    get isUsedDice(){
        return this._isUsedDice;
    }
    set isUsedDice(d){
        this._isUsedDice=d;
    }
    get usedDice(){
        return this._type;
    }
    get name(){
        return this._name;
    }
    get level(){
        return this._level;
    }
    get skin(){
        return this._skin;
    }
    get status(){
        return this._status;
    }
    get isActive(){
        return this._isActive;
    }
    get money(){
        return this._money;
    }
    get field(){
        return this._field;
    }
    get jailtime(){
        return this._jailtime;
    }
    set name(n){
        this._name=n;
    }
    set doubleDice(d){
        this._doubleDice=d;
    }
    set skin(s){
        this._skin=s;
    }
    set status(s){
        this._status=s;
    }
    set isActive(a){
        this._isActive=a;
    }
    set money(m){
        this._money=m;
    }
    set jailtime(j){
        this._jailtime=j;
    }
    set field(f){
        this._field=f;
    }
    get freecard(){
        return this._freecard;
    }
    set freecard(f){
        this._freecard=f;
    }
    botAction(){
        if(this.money<0){
            return 'lose';
        }
        if(this.jailtime>0){
            if(this.freecard>0){
                return 'useFreeCard';
            }else{//Ide majd lehet tenni egy ifet ami nézi hogy hanyas szintű a bot
                if(this.money>5000){
                    return 'useFreeJail';
                }
            }
        }
        if(this.isUsedDice==false){
            this.isUsedDice=true;
            return 'dice';
        }
        this.isUsedDice=false;
        return 'nextTurn';
    }
}
module.exports = Bot;