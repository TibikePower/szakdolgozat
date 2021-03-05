<template>
  <div id="TradePartner" class="tradeTemplate"> <!--Ez abbamaradt, -->
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
        <div class="trade_Template">{{tradeWindow.p1name}}
          <div class="row justify-content-center">
            <div v-if="isSelected(5,1)">
              <img :id="5+'p1'" src="../assets/images/fieldcards/b1.png">
            </div>
            <div v-if="isSelected(15,1)">
              <img :id="15+'p1'" src="../assets/images/fieldcards/b2.png">
            </div>
            <div v-if="isSelected(25,1)">
              <img :id="25+'p1'" src="../assets/images/fieldcards/b3.png">
            </div>
            <div v-if="isSelected(35,1)">
              <img :id="35+'p1'" src="../assets/images/fieldcards/b4.png">
            </div>
            <div v-if="isSelected(28,1)">
              <img :id="28+'p1'" src="../assets/images/fieldcards/asz.png">
            </div>
            <div v-if="isSelected(12,1)">
              <img :id="12+'p1'" src="../assets/images/fieldcards/vsz.png">
            </div>
            <div v-for="prop in game._fm._props" :key="prop" >
              <div v-if="isSelected(prop._field,1)">
                <img :id="prop._field+'p1'" v-bind:src="require('../assets/images/propcards/p'+prop._field+'.png')">
              </div>
            </div>
          </div>

        </div>
        <div class="trade_Template">
          {{tradeWindow.p2name}}
          <div class="row justify-content-center">
            <div v-if="isSelected(5,2)">
              <img :id="5+'p2'" src="../assets/images/fieldcards/b1.png">
            </div>
            <div v-if="isSelected(15,2)">
              <img :id="15+'p2'" src="../assets/images/fieldcards/b2.png">
            </div>
            <div v-if="isSelected(25,2)">
              <img :id="25+'p2'" src="../assets/images/fieldcards/b3.png">
            </div>
            <div v-if="isSelected(35,2)">
              <img :id="35+'p2'" src="../assets/images/fieldcards/b4.png">
            </div>
            <div v-if="isSelected(28,2)">
              <img :id="28+'p2'" src="../assets/images/fieldcards/asz.png">
            </div>
            <div v-if="isSelected(12,2)">
              <img :id="12+'p2'" src="../assets/images/fieldcards/vsz.png">
            </div>
            <div v-for="prop in game._fm._props" :key="prop" >
              <div v-if="isSelected(prop._field,2)">
                <img :id="prop._field+'p2'" v-bind:src="require('../assets/images/propcards/p'+prop._field+'.png')">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="trade_Template2">
          <div>Összeg: {{tradeWindow.p1money}} JF</div>
          <div>I.Sz.A.B. kártya: {{tradeWindow.p1freecard}} db</div>
        </div>
        <div class="trade_Template2">
          <div>Összeg: {{tradeWindow.p2money}} JF</div>
          <div>I.Sz.A.B. kártya: {{tradeWindow.p2freecard}} db</div>
        </div>
      </div>
  </div>
</template>

<script>

export default {
  name: 'TradePartner',
  props: ['game','cards','tradeStatus','tradeWindow'],
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
      this.$emit('close',0);
    },
    trade(){
      this.$emit('close',1);
    },
    isSelected(field,player){
      if(player==1 && this.tradeWindow.p1fields.length>0){
        for(var i=0;i<this.tradeWindow.p1fields.length;i++){
          if(this.tradeWindow.p1fields[i]==field){
            return true;
          }
        }
      }else if(player==2 && this.tradeWindow.p2fields.length>0){
        for(i=0;i<this.tradeWindow.p2fields.length;i++){
          if(this.tradeWindow.p2fields[i]==field){
            return true;
          }
        }
      }
      return false;
    }
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
