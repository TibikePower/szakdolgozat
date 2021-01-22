const Property = require('./Property.js')

class FieldManager{
    constructor(){
        this._props=[
            //Mező, Név(egyelőre ezek még csak a mezőszámok), Ár, Csoport, Fejlesztés összeg, Fizetések
            new Property(1,"1",6000,0,5000,[200,1000,3000,9000,16000,25000]),
            new Property(3,"3",6000,0,5000,[400,2000,6000,18000,32000,45000]),
            new Property(6,"6",10000,1,5000,[600,3000,9000,27000,40000,55000]),
            new Property(8,"8",10000,1,5000,[600,3000,9000,27000,40000,55000]),
            new Property(9,"9",12000,1,5000,[800,4000,10000,30000,45000,60000]),
            new Property(11,"11",14000,2,10000,[1000,5000,15000,45000,62500,75000]),
            new Property(13,"13",14000,2,10000,[1000,5000,15000,45000,62500,75000]),
            new Property(14,"14",16000,2,10000,[1200,6000,18000,50000,70000,90000]),
            new Property(16,"16",18000,3,10000,[1400,7000,20000,55000,75000,95000]),
            new Property(18,"18",18000,3,10000,[1400,7000,20000,55000,75000,95000]),
            new Property(19,"19",20000,3,10000,[1600,8000,22000,60000,80000,100000]),
            new Property(21,"21",22000,4,15000,[1800,9000,25000,70000,87500,105000]),
            new Property(23,"23",22000,4,15000,[1800,9000,25000,70000,87500,105000]),
            new Property(24,"24",24000,4,15000,[2000,10000,30000,75000,92500,110000]),
            new Property(26,"26",26000,5,15000,[2200,11000,33000,80000,97500,115000]),
            new Property(27,"27",26000,5,15000,[2200,11000,33000,80000,97500,115000]),
            new Property(29,"29",28000,5,15000,[2400,12000,36000,85000,102500,120000]),
            new Property(31,"31",30000,6,20000,[2600,13000,39000,90000,110000,127500]),
            new Property(32,"32",30000,6,20000,[2600,13000,39000,90000,110000,127500]),
            new Property(34,"34",32000,6,20000,[2800,15000,45000,100000,120000,140000]),
            new Property(37,"37",35000,7,20000,[3500,17500,50000,110000,130000,150000]),
            new Property(39,"39",40000,7,20000,[5000,20000,60000,140000,170000,200000])
        ];
        this._eOwner="";
        this._wOwner="";
        this._b1Owner="";
        this._b2Owner="";
        this._b3Owner="";
        this._b4Owner="";
        this._stars=32;
        this._crowns=12;
    }
    get b1Owner(){
        return this._b1Owner;
    }
    get b2Owner(){
        return this._b2Owner;
    }
    get b3Owner(){
        return this._b3Owner;
    }
    get b4Owner(){
        return this._b4Owner;
    }
    get eOwner(){
        return this._eOwner;
    }
    get wOwner(){
        return this._wOwner;
    }
    get props(){
        return this._props;
    }
    set b1Owner(o){
        this._b1Owner=o;
    }
    set b2Owner(o){
        this._b2Owner=o;
    }
    set b3Owner(o){
        this._b3Owner=o;
    }
    set b4Owner(o){
        this._b4Owner=o;
    }
    set eOwner(o){
        this._eOwner=o;
    }
    set wOwner(o){
        this._wOwner=o;
    }
    chooseField(field){ //Kiválasztja az aktuális telek sorszámát a props tömbben
        for(var i=0;i<this._props.length;i++){
            if(this._props[i].field==field){
                return i;
            }
        }       
    }
    countBusinessPay(oname){ //Összeszámolja hogy mennyit kell fizetni ha rálép egy bizniszre a játékos
        var count=0;
        if(this.b1Owner==oname){count++;}
        if(this.b2Owner==oname){count++;}
        if(this.b3Owner==oname){count++;}
        if(this.b4Owner==oname){count++;}
        switch(count){
            case 1: return 2500;
            case 2: return 5000;
            case 3: return 10000;
            case 4: return 20000;
        }
    }
    isHaveOwner(field){ // Ellenőrzi, hogy a teleknek van-e már tulajdonosa
        for(var i=0;i<this._props.length;i++){
            if(this._props[i].field==field){
                if(this._props[i].owner==""){
                    return false;
                }
                else{
                    return true;
                }
            }
        }
    }
    countPropPay(field){ // Összeszámolja, hogy mennyit kell fizetni a telekrelépéskor
        for(var i=0;i<this._props.length;i++){
            if(this._props[i].field==field){
                return this._props[i].payment[this._props[i].upgrades];
            }
        }
    }
    isHaveFullGroup(field, owner){ //Ellenőrzi, hogy a játékos-é az összes azonos csoportba tartozó telek, majd a telekfejlesztésnél lesz jelentősége
        var count=0;
        for(var i=0;i<this._props.length;i++){
            if(this._props[i].field==field){
                var group=this._props[i].group;
            }
        }
        for(i=0;i<this._props.length;i++){
            if(this._props[i].group==group && this._props[i].owner==owner){
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
}
module.exports = FieldManager;
