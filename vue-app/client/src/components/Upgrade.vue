<template>
  <div id="Upgrade" class="upgradeTemplate">
    <div v-on:click="close()" class="close">X</div>
    <div class="title">FEJLESZTÉS</div>
    <div v-if="isClicked" class="verifyBox">{{verifyText}}
      <div class="row">
        <button class="submitButton fa fa-check" v-on:click="this.$emit('upgrade',this.cField); this.isClicked=false;"></button>
        <button class="cancelButton fa fa-times" v-on:click="this.isClicked=false"></button>
      </div>
    </div>
    <div class="row justify-content-center">
      <div v-for="(prop,index) in game._fm._props" :key="prop" >
        <div v-if="prop._owner==name && isHaveFullGroup(prop._field,name) && prop._upgrades<5 && isOtherUpgradesOk(prop._field) && isHaveUpgradeMaterial(prop._field)">
          <img v-on:click="chooseItem(prop._field,index)" v-bind:src="require('../assets/images/propcards/p'+prop._field+'.png')">
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Upgrade',
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
      this.cField=field;
      this.verifyText='Biztos, hogy fejleszted a(z) '+this.game._fm._props[index]._name+' -t '+this.game._fm._props[index]._upgradeCost+' JF-ért?';
      this.isClicked=true;
    },
    isHaveFullGroup(field, owner){ //Ellenőrzi, hogy a játékos-é az összes azonos csoportba tartozó telek, majd a telekfejlesztésnél lesz jelentősége
        var count=0;
        for(var i=0;i<this.game._fm._props.length;i++){
            if(this.game._fm._props[i]._field==field){
                var group=this.game._fm._props[i]._group;
            }
        }
        for(i=0;i<this.game._fm._props.length;i++){
            if(this.game._fm._props[i]._group==group && this.game._fm._props[i]._owner==owner){
                count++;
            }
        }
        console.log("Count: "+count);
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
    },
    isOtherUpgradesOk(field){
        for(var i=0;i<this.game._fm._props.length;i++){
            if(this.game._fm._props[i]._field==field){
                var group=this.game._fm._props[i]._group;
                var index=i;
            }
        }
        for(i=0;i<this.game._fm._props.length;i++){
            if(this.game._fm._props[i]._group==group){
                var n = this.game._fm._props[index]._upgrades-this.game._fm._props[i]._upgrades+1; // A +1 azért kell, mert a következő fejlesztéshez viszonyítjuk
                if(!(n>=-1 && n<=1)){
                  return false;
                }
            }
        }
        return true;    
    },
    isHaveUpgradeMaterial(field){
      for(var i=0;i<this.game._fm._props.length;i++){
        if(this.game._fm._props[i]._field==field){
          if(this.game._fm._props[i]._upgrades+1==5){
            if(this.game._fm._crowns>0){
              return true;
            }else{
              return false;
            }
          }else if(this.game._fm._props[i]._upgrades+1<5){
            if(this.game._fm._stars>0){
              return true;
            }else{
              return false;
            }
          }
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.upgradeTemplate{
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
.upgradeTemplate::-webkit-scrollbar {
  width: 15px;
  background-color:none;
  border-radius:10px;
}
.upgradeTemplate::-webkit-scrollbar-thumb {
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
