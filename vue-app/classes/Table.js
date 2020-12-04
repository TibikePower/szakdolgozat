class Table{
    constructor(){
        this._playerPosition=[
            [0,0],
            [0,0],
            [0,0],
            [0,0]
        ];
        this._dices=[1,1];
        this._activeField=null;
    }
    get playerPosition(){
        return this._playerPosition;
    }
    get dices(){
        return this._dices;
    }
    get activeField(){
        return this._activeField;
    }
    set playerPosition(p){
        this._playerPosition=p;
    }
    set dices(d){
        this._dices=d;
    }
    set activeField(a){
        this._activeField=a;
    }
}
module.exports = Table;