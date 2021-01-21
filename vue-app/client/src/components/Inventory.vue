<template>
  <div v-if="ingame" id="Inventory" class="inventoryTemplate">
    <div v-on:click="close()" class="close">X</div>
    <div class="title">{{inventoryCheckName}}</div>
    <div class="row justify-content-center">
      <div v-if="game._fm._b1Owner==inventoryCheckName">
        <img src="../assets/images/fieldcards/b1.png">
      </div>
      <div v-if="game._fm._b2Owner==inventoryCheckName">
        <img src="../assets/images/fieldcards/b2.png">
      </div>
      <div v-if="game._fm._b3Owner==inventoryCheckName">
        <img src="../assets/images/fieldcards/b3.png">
      </div>
      <div v-if="game._fm._b4Owner==inventoryCheckName">
        <img src="../assets/images/fieldcards/b4.png">
      </div>
      <div v-if="game._fm._eOwner==inventoryCheckName">
        <img src="../assets/images/fieldcards/asz.png">
      </div>
      <div v-if="game._fm._wOwner==inventoryCheckName">
        <img src="../assets/images/fieldcards/vsz.png">
      </div>
      <div v-for="prop in game._fm._props" :key="prop" >
        <div v-if="prop._owner==inventoryCheckName">
          <img v-bind:src="require('../assets/images/propcards/p'+prop._field+'.png')">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Inventory',
  props: ['game','inventoryCheckName','ingame','cards'],
  methods:{
    close(){
      this.$emit('close');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.inventoryTemplate{
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
.inventoryTemplate::-webkit-scrollbar {
  width: 15px;
  background-color:none;
  border-radius:10px;
}
.inventoryTemplate::-webkit-scrollbar-thumb {
  background-color:rgba(0, 0, 0, 0.35);
  border-radius:40px;
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
}
</style>
