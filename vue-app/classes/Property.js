class Property{
    constructor(field,name,price,group,upgradeCost,payment){
        this._field=field;
        this._name=name;
        this._price=price;
        this._group=group;
        this._upgradeCost=upgradeCost;
        this._upgrades=0;
        this._payment=payment;
        this._owner='';
    }
    get name(){
        return this._name;
    }
    get payment(){
        return this._payment;
    }
    get field(){
        return this._field;
    }
    get upgrades(){
        return this._upgrades;
    }
    get price(){
        return this._price;
    }
    get owner(){
        return this._owner;
    }
    get group(){
        return this._group;
    }
    set owner(o){
        this._owner=o;
    }
}
module.exports = Property;