// eslint-disable-next-line no-unused-vars
const Game = require("./Game");

class Bot{
    constructor(name,skin,status){
        this._name=name;
        this._skin=skin;
        this._status=status;
        this._isActive=false;
        this._money=-999999;
        this._field=null;
        this._jailtime=-1;
        this._freecard=0;
        this._level=1;
        this._type='bot';

        //Ezek kellenek ahhoz, hogy tudjuk mit csinált már a bot a körben
        this._isUsedDice=false;
        this._doubleDice=0;
        this._jaillimit=5000+(this.level-1)*1500;
    }
    get type(){
        return this._type;
    }
    get jaillimit(){
        return this._jaillimit;
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
    // eslint-disable-next-line no-unused-vars
    calcBotNextAction(game){
        if(this.jailtime>0){
            if(this.freecard>0){
                return 'useFreeCard';
            }else{
                if(this.money>this.jaillimit){
                    return 'useFreeJail';
                }
            }
        }
        if(this.isUsedDice==false){
            this.isUsedDice=true;
            return 'dice';
        }
        if(this.money<0){
            return 'lose';
        }
        this.isUsedDice=false;
        return 'nextTurn';
    }
    // eslint-disable-next-line no-unused-vars
    tradeAccept(data,game){
        data.accept=0;
        return data;
    }
}
module.exports = Bot;