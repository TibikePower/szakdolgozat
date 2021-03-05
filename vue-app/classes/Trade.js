class Trade{
    constructor(p1name,p2name,p1money,p2money,p1fields,p2fields,p1freecard,p2freecard){
        this._p1name=p1name;
        this._p1money=p1money;
        this._p1fields=p1fields;
        this._p1freecard=p1freecard;
        this._p12name=p2name;
        this._p2money=p2money;
        this._p2fields=p2fields;
        this._p2freecard=p2freecard;
        this._p1accept=true;
        this._p2accept=false;
    }
    get p1name(){
        return this._p1name;
    }
    get p1money(){
        return this._p1money;
    }
    get p1fields(){
        return this._p1fields;
    }
    get p1freecard(){
        return this._p1freecard;
    }
    get p1accept(){
        return this._p1accept;
    }
    get p2name(){
        return this._p2name;
    }
    get p2money(){
        return this._p2money;
    }
    get p2fields(){
        return this._p2fields;
    }
    get p2freecard(){
        return this._p2freecard;
    }
    get p2accept(){
        return this._p2accept;
    }
    set p2accept(p){
        this._p2accept=p;
    }
}
module.exports = Trade;