<template>
  <div id="OnlinePlayers" class="onlineTemplate">
    <div class="title">Online játékosok</div>
    <ul class="playerBox d-flex flex-column">
      <li v-on:click="playerName(player._name)" class="playerInBox d-flex justify-content-between" v-for="player in game._pm._players" :key="player.name">
          <div class="nameTag">{{ player._field }} - {{ player._name }}</div>
          <div class="hostTag" v-if="player._isActive"> [AKTÍV]</div>
          <div class="hostTag" v-if="player._status=='host' && !player._isActive"> [HOST]</div>
          <div class="hostTag" v-if="player._status=='lose'"> [CSŐD]</div>
          <div class="jailTag" v-if="player._jailtime>0">{{player._jailtime}}</div>
          <div class="freeTag" v-if="player._freecard>0">{{player._freecard}}</div>
          <div class="moneyTag" v-if="player._money>-999998">{{player._money}} JF</div>
          <div class="moneyTag" >{{player.isActive}}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'OnlinePlayers',
  props: ['game','isTradeCheck'],
  methods:{
    playerName(name) {
      if(!this.isTradeCheck){
        this.$emit('playername',name);
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.onlineTemplate{
  margin:5px;
  padding:5px;
  margin-bottom:15px;
  background-color: rgba(0, 0, 0, 0.2);
  box-shadow: 0px 0px 10px 2px black;
  border-radius:5px;
  backdrop-filter: blur(6px);
  height: 35vh;
}
.title{
  margin-bottom: 10px;
  text-transform: uppercase;
  font-weight: 900;
  color:white;
}
.nameTag{
  font-weight: 800;
  margin-left:10px;
}
.jailTag{
  border:2px dashed black;
  padding:0px 6px;
  font-weight: 800;
}
.freeTag{
  border:2px double black;
  padding:0px 6px;
  font-weight: 800;
  color:white;
  background-image: linear-gradient(45deg, rgba(0, 4, 255, 0.5), rgba(255,0,0,0.5));
}
.moneyTag{
  margin-right:20px;
}
.hostTag{
  color:red;
  font-weight: 800;
}
.playerBox{
  text-align:left;
}
.playerInBox{
  align-items: center;
  display: flex;
  color:black;
  background:rgba(255, 255, 255, 0.6);
  padding:2px 10px;
  margin-top:5px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
