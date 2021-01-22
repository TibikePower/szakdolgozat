<template>
  <div id="Sell" class="sellTemplate">
    <div v-on:click="close()" class="close">X</div>
    <div class="title">ELADÁS</div>
    <div v-if="isClicked" class="verifyBox">{{verifyText}}
      <div class="row">
        <button class="submitButton fa fa-check" v-on:click="this.$emit('sell',this.cField); this.isClicked=false;"></button>
        <button class="cancelButton fa fa-times" v-on:click="this.isClicked=false"></button>
      </div>
    </div>
    <div class="row justify-content-center">
      <div v-if="game._fm._b1Owner==name">
        <img v-on:click="chooseItem(5,0)" src="../assets/images/fieldcards/b1.png">
      </div>
      <div v-if="game._fm._b2Owner==name">
        <img v-on:click="chooseItem(15,0)" src="../assets/images/fieldcards/b2.png">
      </div>
      <div v-if="game._fm._b3Owner==name">
        <img v-on:click="chooseItem(25,0)" src="../assets/images/fieldcards/b3.png">
      </div>
      <div v-if="game._fm._b4Owner==name">
        <img v-on:click="chooseItem(35,0)" src="../assets/images/fieldcards/b4.png">
      </div>
      <div v-if="game._fm._eOwner==name">
        <img v-on:click="chooseItem(28,0)" src="../assets/images/fieldcards/asz.png">
      </div>
      <div v-if="game._fm._wOwner==name">
        <img v-on:click="chooseItem(12,0)" src="../assets/images/fieldcards/vsz.png">
      </div>
      <div v-for="(prop,index) in game._fm._props" :key="prop" >
        <div v-if="prop._owner==name">
          <img v-on:click="chooseItem(prop._field,index)" v-bind:src="require('../assets/images/propcards/p'+prop._field+'.png')">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FieldManager from '../../../classes/FieldManager'

export default {
  name: 'Sell',
  props: ['game','name','cards'],
  data: function () {
    return {
      verifyText:'',
      isClicked:false,
      cField:null
    }
  },
  methods:{
    close(){
      this.$emit('close');
    },
    chooseItem(field,index){
      console.log("Teszt:");
      var f=new FieldManager();
      f=this.game.fm;
      this.cField=field;
      this.isClicked=true;
      console.log(f.isHaveFullGroup(field,this.name));
      if(field==5){
        this.verifyText='Biztos, hogy eladod a Macstec Nutrition-t?';
      }
      else if(field==15){
        this.verifyText='Biztos, hogy eladod a BioTechNOS-t?';
      }
      else if(field==25){
        this.verifyText='Biztos, hogy eladod a GymBoa-t?';
      }
      else if(field==35){
        this.verifyText='Biztos, hogy eladod a protein.brumm-ot?';
      }
      else if(field==12){
        this.verifyText='Biztos, hogy eladod a Vízszolgáltatót?';
      }
      else if(field==28){
        this.verifyText='Biztos, hogy eladod az Áramszolgáltatót?';
      }else{
        this.verifyText='Biztos, hogy eladod a(z) '+this.game._fm._props[index]._name+' -t '+this.game._fm._props[index]._price+' JF-ért?';
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.sellTemplate{
  overflow-y: scroll;
  overflow-x:hidden;
  z-index: 400;
  position:absolute;
  background:rgba(255, 255, 255, 0.8);
  box-shadow: 0px 0px 10px 2px black;
  border-radius:5px;
  backdrop-filter: blur(6px);
  width:50%;
  height:600px;
  margin-left:25%;
  margin-right:25%;
}
.sellTemplate::-webkit-scrollbar {
  width: 15px;
  background-color:none;
  border-radius:10px;
}
.sellTemplate::-webkit-scrollbar-thumb {
  background-color:rgba(0, 0, 0, 0.35);
  border-radius:40px;
}
.verifyBox{
  position:absolute;
  width:80%;
  height:530px;
  margin-left:10%;
  border:1px solid white;
  background:rgba(29, 29, 29, 0.9);
  box-shadow: 0px 0px 10px 2px black;
  border-radius:5px;
  backdrop-filter: blur(6px);
  color:white;
  font-size:50px;
  padding:30px;
}
.close{
  cursor: pointer;
  font-size:30px;
  padding:15px;
  position:absolute;
  margin-left:93%;
}
.title{
  font-size: 30px;
}
img{
  margin:15px 15px;
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
