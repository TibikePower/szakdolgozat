<template>
  <div id="OnlinePlayers" class="onlineTemplate">
    <div class="title">Online játékosok</div>
    <ul class="playerBox d-flex flex-column">
      <li class="playerInBox d-flex justify-content-between" v-for="player in players" :key="player.name">
          <div class="nameTag">{{ player.name }}</div>
          <div class="hostTag" v-if="player.active"> [AKTÍV]</div>
          <div class="hostTag" v-if="player.status=='host' && !player.active"> [HOST]</div>
          <div class="jailTag" v-if="player.jailtime>0">{{player.jailtime}}</div>
          <div class="moneyTag" v-if="player.money>-999998">{{player.money}} JF</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'OnlinePlayers',
  props: ['players']
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
  margin-left:20px;
}
.jailTag{
  border:2px dashed black;
  padding:0px 6px;
  font-weight: 800;
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
