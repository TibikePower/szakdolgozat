// eslint-disable-next-line no-unused-vars
const Game = require("./Game");

class BotMedium{
    constructor(name,skin,status){
        this._name=name;
        this._skin=skin;
        this._status=status;
        this._isActive=false;
        this._money=-999999;
        this._field=null;
        this._jailtime=-1;
        this._freecard=0;
        this._level=2;
        this._type='bot';

        //Ezek kellenek ahhoz, hogy tudjuk mit csinált már a bot a körben
        this._isUsedDice=false;
        this._doubleDice=0;
        this._jaillimit=5000+(this.level-1)*1500;
        this._upgradeIndex=0;
        this._destroyIndex=0;
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
    get upgradeIndex(){
        return this._upgradeIndex;
    }
    get destroyIndex(){
        return this._destroyIndex;
    }
    set name(n){
        this._name=n;
    }
    set upgradeIndex(i){
        this._upgradeIndex=i;
    }
    set destroyIndex(i){
        this._destroyIndex=i;
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
    botAction(game){
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
        if(this.money>20000){
                for(var i=this.upgradeIndex; i<game.fm.props.length;i++){
                    if(game.fm.props[i].owner==this.name && game.fm.props[i].upgrades<=5){
                        if(this.money-game.fm.props[i].upgradeCost>20000 &&
                        this.isHaveFullGroup(game.fm.props[i].field, this.name, game) &&
                        this.isOtherUpgradesOk(game.fm.props[i].field, game) &&
                        this.isHaveUpgradeMaterial(game.fm.props[i].field, game)){
                            this.upgradeIndex=i;
                            return 'upgrade';         
                        }
                    }
                }
        }
        if(this.money<0){
                for(i=this.destroyIndex; i<game.fm.props.length;i++){
                    if(game.fm.props[i].owner==this.name && game.fm.props[i].upgrades>0){
                        if(this.isHaveFullGroup(game.fm.props[i].field, this.name, game) &&
                        this.isOtherUpgradesOk_destroy(game.fm.props[i].field, game) &&
                        this.isHaveDestroyMaterial(game.fm.props[i].field, game)){
                            this.destroyIndex=i;
                            return 'destroy';       
                        }
                    }
                }
                if(game.fm.eOwner==this.name || game.fm.wOwner==this.name || game.fm.b1Owner==this.name||
                    game.fm.b2Owner==this.name || game.fm.b3Owner==this.name || game.fm.b4Owner==this.name){
                        return 'sell';
                }
                for (let i = 0; i < game.fm.props.length; i++) {
                    if(game.fm.props[i].owner==this.name){
                        return 'sell';
                    }
                }
            return 'lose';
        }
            if(game.isBuying){
                if(this.field==5){
                    if(this.money>=20000){
                        return 'buy';
                    }
                }
                else if(this.field==15){
                    if(this.money>=20000){
                        return 'buy';
                    }
                }
                else if(this.field==25){
                    if(this.money>=20000){
                        return 'buy';
                    }
                }
                else if(this.field==35){
                    if(this.money>=20000){
                        return 'buy';
                    }
                }
                else if(this.field==12){
                    if(this.money>=15000){
                        return 'buy';
                    }
                }
                else if(this.field==28){
                    if(this.money>=15000){
                        return 'buy';
                    }
                }
                else{
                    if(this.money>=game.fm.props[game.fm.chooseField(this.field)].price){
                        return 'buy';
                    }
                }
            }
        this.isUsedDice=false;
        return 'nextTurn';
    }
    tradeAccept(data,game){
        var val=0;
        var i=0;
        var s_th=1.5;
        for(i=0; i<data.p1fields.length; i++){
                if(data.p1fields[i]==5 || data.p1fields[i]==15 || data.p1fields[i]==25 || data.p1fields[i]==35){
                    val+=20000;
                }
                else if(data.p1fields[i]==12 || data.p1fields[i]==28){
                    val+=15000;
                }else{
                    val+=game.fm.props[game.fm.chooseField(data.p1fields[i])].price;
                }
            }
            if(data.p1freecard>0){
                val+=data.p1freecard*1000;
            }
            val=parseInt(data.p1money);
            for(i=0; i<data.p2fields.length; i++){
                if(data.p2fields[i]==5 || data.p2fields[i]==15 || data.p2fields[i]==25 || data.p2fields[i]==35){
                    val-=20000*s_th;
                }
                else if(data.p2fields[i]==12 || data.p2fields[i]==28){
                    val-=15000*s_th;
                }else{
                    val-=(game.fm.props[game.fm.chooseField(data.p2fields[i])].price)*s_th;
                }
            }
            if(data.p2freecard>0){
                val-=data.p2freecard*1000;
            }
            val-=parseInt(data.p2money);
            console.log(data);
            console.log(val);
            if(val>=0){
                data.accept=1;
            }else{
                data.accept=0;
            }
            return data;
    }
    isHaveFullGroup(field, owner, game){ //Ellenőrzi, hogy a játékos-é az összes azonos csoportba tartozó telek, majd a telekfejlesztésnél lesz jelentősége
        var count=0;
        for(var i=0;i<game.fm.props.length;i++){
            if(game.fm.props[i].field==field){
                var group=game.fm.props[i].group;
            }
        }
        for(i=0;i<game.fm.props.length;i++){
            if(game.fm.props[i].group==group && game.fm.props[i].owner==owner){
                count++;
            }
        }
        if(group==0 || group==7){
            if(count==2){
                return true;
            }else{
                return false;
            }
        }else{
            if(count==3){
                return true;
            }else{
                return false;
            }
        }
    }
    isOtherUpgradesOk(field, game){
        for(var i=0;i<game.fm.props.length;i++){
            if(game.fm.props[i].field==field){
                var group=game.fm.props[i].group;
                var index=i;
            }
        }
        for(i=0;i<game.fm.props.length;i++){
            if(game.fm.props[i].group==group){
                var n = game.fm.props[index].upgrades-game.fm.props[i].upgrades+1; // A +1 azért kell, mert a következő fejlesztéshez viszonyítjuk
                if(!(n>=-1 && n<=1)){
                  return false;
                }
            }
        }
        return true;    
    }
    isOtherUpgradesOk_destroy(field, game){
        for(var i=0;i<game.fm.props.length;i++){
            if(game.fm.props[i].field==field){
                var group=game.fm.props[i].group;
                var index=i;
            }
        }
        for(i=0;i<game.fm.props.length;i++){
            if(game.fm.props[i].group==group){
                var n = game.fm.props[index].upgrades-game.fm.props[i].upgrades-1; // A +1 azért kell, mert a következő fejlesztéshez viszonyítjuk
                if(!(n>=-1 && n<=1)){
                  return false;
                }
            }
        }
        return true;    
    }
    isHaveUpgradeMaterial(field, game){
      for(var i=0;i<game.fm.props.length;i++){
        if(game.fm.props[i].field==field){
          if(game.fm.props[i].upgrades+1==5){
            if(game.fm.crowns>0){
              return true;
            }else{
              return false;
            }
          }else if(game.fm.props[i].upgrades+1<5){
            if(game.fm.stars>0){
              return true;
            }else{
              return false;
            }
          }
        }
      }
    }
    isHaveDestroyMaterial(field,game){
      for(var i=0;i<game.fm.props.length;i++){
        if(game.fm.props[i].field==field){
          if(game.fm.props[i].upgrades==5){
            if(game.fm.stars>=4){
              return true;
            }else{
              return false;
            }
          }else{
            return true;
          }
        }
      }
    }
}
module.exports = BotMedium;