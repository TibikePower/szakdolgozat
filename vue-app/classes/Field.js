class Field{
    constructor(field,name,price,group,upgradeCost,payment){
        this._field=field;
        this._name=name;
        this._price=price;
        this._group=group;
        this._upgradeCost=upgradeCost;
        this._upgrades=0;
        this._payment=payment;
    }
}
module.exports = Field;