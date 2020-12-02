class Player{
    constructor(name,skin,status){
        this._name=name;
        this._skin=skin;
        this._status=status;
        this._isActive=false;
        this._money=-999999;
        this._posX=null;
        this._posY=null;
        this._field=null;
        this._jailtime=-1;
        this._inventory=[];
    }
    get name(){
        return this._name;
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
    get posX(){
        return this._posX;
    }
    get posY(){
        return this._posY;
    }
    get field(){
        return this._field;
    }
    get jailtime(){
        return this._jailtime;
    }
    get inventory(){
        return this._inventory;
    }
    set name(n){
        this._name=n;
    }
    set skin(s){
        this._skin=s;
    }
    set status(s){
        this._status=s;
    }
    set isActive(a){
        this._Active=a;
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
    set posX(x){
        this._posX=x;
    }
    set posY(y){
        this._posY=y;
    }
    set inventory(i){
        this._inventory=i;
    }
    movePlayer(posX,posY,field){
        this._posX=posX;
        this._posY=posY;
        this._field=field;
    }
}
module.exports = Player;