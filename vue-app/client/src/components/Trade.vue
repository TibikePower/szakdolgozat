<template>
  <div id="Trade" class="tradeTemplate">
    <div v-on:click="close()" class="close">X</div>
    <div v-on:click="trade()" class="ok">OK</div>
    <div class="title">Csere</div>
        <div v-if="errors.length">
          <div class="container">
            <div class="row justify-content-center">
                <div id="errorblock" class="errorRow col-4">
                  <div class="fa fa-close errorIcon"></div>
                  <ul class="d-flex flex-column">
                    <li class="align-self-center errorText" v-for="error in errors" :key="error">{{ error }}</li>
                  </ul>
                </div>
            </div>    
          </div>      
        </div>
      <div class="row">
        <div class="trade_Template">{{name}}
          <div class="row justify-content-center">
            <div v-if="game._fm._b1Owner==name">
              <img :id="5+'p1'" v-on:click="chooseItem(5,id)" src="../assets/images/fieldcards/b1.png">
            </div>
            <div v-if="game._fm._b2Owner==name">
              <img :id="15+'p1'" v-on:click="chooseItem(15,id)" src="../assets/images/fieldcards/b2.png">
            </div>
            <div v-if="game._fm._b3Owner==name">
              <img :id="25+'p1'" v-on:click="chooseItem(25,id)" src="../assets/images/fieldcards/b3.png">
            </div>
            <div v-if="game._fm._b4Owner==name">
              <img :id="35+'p1'" v-on:click="chooseItem(35,id)" src="../assets/images/fieldcards/b4.png">
            </div>
            <div v-if="game._fm._eOwner==name">
              <img :id="28+'p1'" v-on:click="chooseItem(28,id)" src="../assets/images/fieldcards/asz.png">
            </div>
            <div v-if="game._fm._wOwner==name">
              <img :id="12+'p1'" v-on:click="chooseItem(12,id)" src="../assets/images/fieldcards/vsz.png">
            </div>
            <div v-for="prop in game._fm._props" :key="prop" >
              <div v-if="prop._owner==name && prop._upgrades==0">
                <img :id="prop._field+'p1'" v-on:click="chooseItem(prop._field)" v-bind:src="require('../assets/images/propcards/p'+prop._field+'.png')">
              </div>
            </div>
          </div>

        </div>
        <div class="trade_Template">
          Kiválasztott játékos: <select required v-model="t_name">
            <option :value="player" v-for="player in fPlayers" :key="player">
              {{player}}
            </option>
          </select>
          <div class="row justify-content-center">
            <div v-if="game._fm._b1Owner==t_name">
              <img :id="5+'p2'" v-on:click="chooseItem2(5,id)" src="../assets/images/fieldcards/b1.png">
            </div>
            <div v-if="game._fm._b2Owner==t_name">
              <img :id="15+'p2'" v-on:click="chooseItem2(15,id)" src="../assets/images/fieldcards/b2.png">
            </div>
            <div v-if="game._fm._b3Owner==t_name">
              <img :id="25+'p2'" v-on:click="chooseItem2(25,id)" src="../assets/images/fieldcards/b3.png">
            </div>
            <div v-if="game._fm._b4Owner==t_name">
              <img :id="35+'p2'" v-on:click="chooseItem2(35,id)" src="../assets/images/fieldcards/b4.png">
            </div>
            <div v-if="game._fm._eOwner==t_name">
              <img :id="28+'p2'" v-on:click="chooseItem2(28,id)" src="../assets/images/fieldcards/asz.png">
            </div>
            <div v-if="game._fm._wOwner==t_name">
              <img :id="12+'p2'" v-on:click="chooseItem2(12,id)" src="../assets/images/fieldcards/vsz.png">
            </div>
            <div v-for="prop in game._fm._props" :key="prop" >
              <div v-if="prop._owner==t_name && prop._upgrades==0">
                <img :id="prop._field+'p2'" v-on:click="chooseItem2(prop._field)" v-bind:src="require('../assets/images/propcards/p'+prop._field+'.png')">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="trade_Template2">
          <div>Összeg: <input :disabled="tradeStatus==2 || isTrading" v-model="p1Money" type="number" class="tInput"/> JF</div>
          <div>I.Sz.A.B. kártya: <input :disabled="tradeStatus==2 || isTrading" v-model="p1Freecard" type="number" class="tInput"/> db</div>
        </div>
        <div class="trade_Template2">
          <div>Összeg: <input :disabled="tradeStatus==2 || isTrading" v-model="p2Money" type="number" class="tInput"/> JF</div>
          <div>I.Sz.A.B. kártya: <input  :disabled="tradeStatus==2 || isTrading" v-model="p2Freecard" type="number" class="tInput"/> db</div>
        </div>
      </div>
  </div>
</template>

<script>

export default {
  name: 'Trade',
  props: ['game','name','cards','money','tradeStatus','freecard','isTrading'],
  data: function () {
    return {
      errors:[],
      fPlayers:[],
      t_name:'012346780',
      p1Fields:[],
      p2Fields:[],
      p1Money:0,
      p2Money:0,
      p1Freecard:0,
      p2Freecard:0
    }
  },
  methods:{
    close(){
      if(!this.isTrading){
        this.$emit('close');
      }
    },
    trade(){
      if(!this.isTrading){
        this.errors=[];
        var ok=true;
        for(var i=0;i<this.game._pm._players.length;i++){
          if(this.t_name==this.game._pm._players[i]._name){
            var index=i;
          }
        }
        if(!(this.money<0 && this.p1Money==0)){
          if(this.p1Money>this.money){this.errors.push("Nincs ennyi pénzed!"); ok=false;}
        }
        if(this.p2Money>this.game._pm._players[index]._money){this.errors.push("A játékosnak nincs ennyi pénze!"); ok=false;}
        if(this.p1Freecard>this.freecard){this.errors.push("Nincs ennyi I.Sz.A.B. kártyád!"); ok=false;}
        if(this.p2Freecard>this.game._pm._players[index]._freecard){this.errors.push("A játékosnak nincs ennyi I.Sz.A.B. kártyája!"); ok=false;}
        if(ok){
          this.$emit('trade',{p1name:this.name,p2name:this.t_name,p1freecard:this.p1Freecard,p2freecard:this.p2Freecard,
          p1money:this.p1Money,p2money:this.p2Money,p1fields:this.p1Fields,p2fields:this.p2Fields});
        }
      }
    },
    filterPlayers(){ //Kiszűri a listázandó játékosokat, akikkel cserélhet a játékos.
      for(var i=0; i<this.game._pm._players.length;i++){
        if(this.game._pm._players[i]._name!='' && this.game._pm._players[i]._name!=this.name){
          this.fPlayers.push(this.game._pm._players[i]._name);
        }
      }
    },
    isChoosen(field,player){ // Megnézi, hogy már hozzá van-e adva a kártya a kereskedéshez.
      if(player=="p1"){
        for(var i=0;i<this.p1Fields.length;i++){
          if(this.p1Fields[i]==field){
            return true;
          }
        }
        return false;
      }else{
        for(i=0;i<this.p2Fields.length;i++){
          if(this.p2Fields[i]==field){
            return true;
          }
        }
        return false;
      }
    },
    sliceItem(field, player){
      if(player=="p1"){
        var index = this.p1Fields.indexOf(field);
          this.p1Fields.splice(index, 1);
      }else{
        var index2 = this.p2Fields.indexOf(field);
          this.p2Fields.splice(index2, 1);
      }
    },
    chooseItem(field){
      if(this.tradeStatus==1 && !this.isTrading){
        if(!this.isChoosen(field,"p1")){
          this.p1Fields.push(field);
          document.getElementById(field+"p1").classList.add('choosen');
          console.log("Class hozzáadva");
        }else{
          this.sliceItem(field,"p1");
          document.getElementById(field+"p1").classList.remove('choosen');
          console.log("Class leszedve");
        }
      }
    },
    chooseItem2(field){
      if(this.tradeStatus==1 && !this.isTrading){
        if(!this.isChoosen(field,"p2")){
          this.p2Fields.push(field);
          document.getElementById(field+"p2").classList.add('choosen');
        }else{
          this.sliceItem(field,"p2");
          document.getElementById(field+"p2").classList.remove('choosen');
        }
      }
    }
  },
  mounted() {
    this.filterPlayers();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
.errorRow{
  margin:50px;
  padding-bottom: 10px;
  justify-content: center;
  box-shadow: 0px 0px 14px 5px red;
  border-radius:10px;
  background-color:rgba(0, 0, 0, 0.1)
}
.errorIcon{
  font-size:60px;
  color:red;
  margin-bottom: 20px;
}
.errorText{
  color:red;
  font-weight: 600;
  font-size:20px;
}
.choosen{
  background:red;
  border:2px solid red;
  box-shadow: 0px 0px 10px 2px red;
}
select:required:invalid {
  color: gray;
}
option[value=""][disabled] {
  display: none;
}
option {
  color: black;
}
.tInput{
  text-align: center;
  font-size:15px;
  font-weight: 800;
  border-radius:10px;
  border:none;
  border:1px solid black;
  background:linear-gradient(to bottom right, #c0c0c0, #ffffff);
  transition: 0.4s;
  margin-top:10px;
}
.tInput:hover{
  text-align: center;
  font-size:15px;
  border-radius:10px;
  border:none;
  transition: 0.4s;
  border:1px solid black;
  background:linear-gradient(to bottom right, #ffffff, #c0c0c0);
}
.tInput:focus{
  outline:none;
  border:1px solid black;
  background:linear-gradient(to bottom right, #ffffff, #c0c0c0);
  transition: 0.4s;
}
.tradeTemplate{
  overflow-y: scroll;
  overflow-x:hidden;
  z-index: 400;
  position:absolute;
  background:rgba(255, 255, 255, 0.8);
  box-shadow: 0px 0px 10px 2px black;
  border-radius:5px;
  backdrop-filter: blur(6px);
  width:60%;
  height:600px;
  margin-left:25%;
  margin-right:25%;
}
.trade_Template{
  overflow-y: scroll;
  overflow-x:hidden;
  z-index: 401;
  background:rgba(255, 255, 255, 0.8);
  box-shadow: 0px 0px 10px 2px black;
  border-radius:5px;
  backdrop-filter: blur(6px);
  width:40%;
  height:450px;
  margin-left:5%;
  margin-right:5%;
}
.trade_Template2{
  overflow-y: hidden;
  overflow-x:hidden;
  z-index: 401;
  width:40%;
  height:150px;
  margin-top:20px;
  margin-left:5%;
  margin-right:5%;
}
.tradeTemplate::-webkit-scrollbar {
  width: 15px;
  background-color:none;
  border-radius:10px;
}
.tradeTemplate::-webkit-scrollbar-thumb {
  background-color:rgba(0, 0, 0, 0.35);
  border-radius:40px;
}
.trade_Template::-webkit-scrollbar {
  width: 15px;
  background-color:none;
  border-radius:10px;
}
.trade_Template::-webkit-scrollbar-thumb {
  background-color:rgba(0, 0, 0, 0.35);
  border-radius:40px;
}

.close{
  cursor: pointer;
  font-size:30px;
  position:absolute;
  margin-left:93%;
  color:red;
}
.ok{
  cursor: pointer;
  font-size:30px;
  position:absolute;
  margin-left:3%;
  color:green;
}
.title{
  font-size: 30px;
}
img{
  margin:15px 15px;
  width:150px;
  cursor:pointer;
}
.submitButton{
  margin-top:70px;
  margin-left:25%;
  border-radius: 100%;
  width:90px;
  height:90px;
  border:none;
  font-size:60px;
  transition: 0.3s;

  background:linear-gradient(to bottom right, #ffffff, #acacac);
  box-shadow: 0px 0px 4px 2px black;
  color:black;
}
.submitButton:hover{
  background:linear-gradient(to bottom right, #00b400, #00ff00);
  box-shadow: 0px 0px 4px 2px white;
  color:white;

  transition: 0.3s;
}
.submitButton:focus{
  outline:none;
}
.cancelButton{
  margin-left:20%;
  margin-top:70px;
  border-radius: 100%;
  width:90px;
  height:90px;
  border:none;
  font-size:60px;
  transition: 0.3s;

  background:linear-gradient(to bottom right, #ffffff, #acacac);
  box-shadow: 0px 0px 4px 2px black;
  color:black;
}
.cancelButton:hover{
  background:linear-gradient(to bottom right, #a30000, #ff0000);
  box-shadow: 0px 0px 4px 2px white;
  color:white;

  transition: 0.3s;
}
.cancelButton:focus{
  outline:none;
}
</style>
