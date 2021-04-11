// eslint-disable-next-line no-unused-vars
const Game = require("./Game");

class BotHard{
    constructor(name,skin,status){
        this._name=name;
        this._skin=skin;
        this._status=status;
        this._isActive=false;
        this._money=-999999;
        this._field=null;
        this._jailtime=-1;
        this._freecard=0;
        this._level=3;
        this._type='bot';

        //Ezek kellenek ahhoz, hogy tudjuk mit csinált már a bot a körben
        this._isUsedDice=false;
        this._doubleDice=0;
        this._jaillimit=5000+(this.level-1)*1500;
        this._upgradeIndex=0;
        this._destroyIndex=0;
        this._tradeIndex=0;
        this._rejects=0;

        //Paraméterek
        this._trade_th=1.4;
        this._trade_up=0.2;
        this._max_rejects=5;
        this._max_upgrades=5;
        this._min_moneyAfterTrade=20000;
        this._min_moneyAfterBuy=20000;
        this._stayInJail=10;
        this._isNeedBusiness=true;
        this._isNeedService=true;
        

    }
    parameters(name,trade_th,trade_up,max_rejects,max_upgrades,min_moneyAfterTrade,min_moneyAfterBuy,stayInJail,isNeedBusiness,isNeedService){
        this._name=name;
        this._trade_th=trade_th;
        this._trade_up=trade_up;
        this._max_rejects=max_rejects;
        this._max_upgrades=max_upgrades;
        this._min_moneyAfterTrade=min_moneyAfterTrade;
        this._min_moneyAfterBuy=min_moneyAfterBuy;
        this._stayInJail=stayInJail;
        this._isNeedBusiness=isNeedBusiness;
        this._isNeedService=isNeedService;
    }
    get type(){
        return this._type;
    }
    get stayInJail(){
        return this._stayInJail;
    }
    get isNeedBusiness(){
        return this._isNeedBusiness;
    }
    get isNeedService(){
        return this._isNeedService;
    }
    get trade_th(){
        return this._trade_th;
    }
    get trade_up(){
        return this._trade_up;
    }
    get max_rejects(){
        return this._max_rejects;
    }
    get max_upgrades(){
        return this._max_upgrades;
    }
    get min_moneyAfterTrade(){
        return this._min_moneyAfterTrade;
    }
    get min_moneyAfterBuy(){
        return this._min_moneyAfterTrade;
    }
    get rejects(){
        return this._rejects;
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
    get tradeIndex(){
        return this._tradeIndex;
    }
    set name(n){
        this._name=n;
    }
    set rejects(r){
        this._rejects=r;
    }
    set upgradeIndex(i){
        this._upgradeIndex=i;
    }
    set destroyIndex(i){
        this._destroyIndex=i;
    }
    set tradeIndex(i){
        this._tradeIndex=i;
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
        if(game.rounds<this.stayInJail){
            if(this.jailtime>0){
                if(this.freecard>0){
                    return 'useFreeCard';
                }else{
                    if(this.money>this.jaillimit){
                        return 'useFreeJail';
                    }
                }
            }    
        }
        
        if(this.isUsedDice==false){
            this.isUsedDice=true;
            return 'dice';
        }
        if(game.isBuying){
            if(this.field==5){
                if(this.money>=20000 && this.isNeedBusiness){
                    return 'buy';
                }
            }
            else if(this.field==15){
                if(this.money>=20000 && this.isNeedBusiness){
                    return 'buy';
                }
            }
            else if(this.field==25){
                if(this.money>=20000 && this.isNeedBusiness){
                    return 'buy';
                }
            }
            else if(this.field==35){
                if(this.money>=20000 && this.isNeedBusiness){
                    return 'buy';
                }
            }
            else if(this.field==12 && this.isNeedService){
                if(this.money>=15000){
                    return 'buy';
                }
            }
            else if(this.field==28 && this.isNeedService){
                if(this.money>=15000){
                    return 'buy';
                }
            }
            else{
                if(this.money-game.fm.props[game.fm.chooseField(this.field)].price>=this.min_moneyAfterBuy){
                    return 'buy';
                }
            }
        }
        var g=this.countGroup(game);
        if(g!='none' && this.rejects<this.max_rejects){
            return 'wantProp';
        }
        if(this.money>this.min_moneyAfterTrade){
                for(var i=this.upgradeIndex; i<game.fm.props.length;i++){
                    if(game.fm.props[i].owner==this.name && game.fm.props[i].upgrades<=5){
                        var cost=this.money-game.fm.props[i].upgradeCost;
                        if(cost>this.min_moneyAfterTrade &&
                        this.isHaveFullGroup(game.fm.props[i].field, this.name, game) &&
                        this.isOtherUpgradesOk(game.fm.props[i].field, game) &&
                        this.isHaveUpgradeMaterial(game.fm.props[i].field, game) &&
                        game.fm.props[i].upgrades<=this.max_upgrades){
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
        this.isUsedDice=false;
        return 'nextTurn';
    }
    isTradeAccept(pay,fieldindex,game){
        if(pay>=game.fm.props[fieldindex].price*this.trade_th){
            return true;
        }else{
            return false;
        }
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
    countGroup(game){ // Hogyha már csak egy telek kell, hogy meglegyen az összes azonos színűből
        var count=0;
        var group='';
        main:
        for(var i=this.tradeIndex;i<game.fm.props.length;i++){
            count=0;
            if(game.fm.props[i].owner==this.name){
                group=game.fm.props[i].group;
                for(var j=0;j<game.fm.props.length;j++){
                    if(game.fm.props[j].group==group && game.fm.props[j].owner==this.name){
                        count++;
                    }
                }
                if(group==0 || group==7){
                    if(count==1){
                        break main;
                    }
                }else{
                    if(count==2){
                        break main;
                    }
                }
            }
        }
        if(group==0 || group==7){
            if(count==1){
                return group;
            }else{
                return 'none';
            }
        }else{
            if(count==2){
                return group;
            }else{
                return 'none';
            }
        }
    }
}
module.exports = BotHard;