class Log{
    constructor(name){
        this._name=name;
        this._isActive=false;
    }
    get name(){
        return this._name;
    }
    get isActive(){
        return this._isActive;
    }
    activate(){
        this._isActive=true;
    }
    deactivate(){
        this._isActive=false;
    }
    write(text){
        if(this.isActive){
            let [hour, minute, second] = new Date().toLocaleTimeString("en-US").split(/:| /);
            console.log("[ "+hour+":"+minute+":"+second+" ][ "+this.name+" ]: "+text);
        }
    }
}
module.exports = Log;