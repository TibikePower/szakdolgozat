class Table{
    constructor(){
        this.fieldPos=[
            [522,542],
            [476,542],
            [428,542],
            [382,542],
            [336,542],
            [290,542],
            [246,542],
            [199,542],
            [153,542],
            [105,542],
            [30,542], //Sarok
            [30,470],
            [30,423],
            [30,377],
            [30,330],
            [30,285],
            [30,240],
            [30,193],
            [30,146],
            [30,99],
            [30,30], //Sarok
            [105,30],
            [152,30],
            [199,30],
            [246,30],
            [290,30],
            [336,30],
            [382,30],
            [428,30],
            [475,30],
            [545,30], //Sarok
            [545,99],
            [545,146],
            [545,193],
            [545,240],
            [545,285],
            [545,330],
            [545,377],
            [545,423],
            [545,470]
        ];
        this._playerPosition=[
            [0,0],
            [0,0],
            [0,0],
            [0,0]
        ];
        this._activeField='start';
    }
    get playerPosition(){
        return this._playerPosition;
    }
    get activeField(){
        return this._activeField;
    }
    set playerPosition(p){
        this._playerPosition=p;
    }
    set activeField(a){
        this._activeField=a;
    }
}
module.exports = Table;