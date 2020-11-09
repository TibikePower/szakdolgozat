<template>
  <div id="Table" class="row">
    <canvas class="col-10" id="c" style="border:1px solid blue;" height="800"></canvas>
    <div class="col-2 d-flex flex-column">
      <button :disabled="(!active || usedDice)" v-on:click="dice()">Dobás</button>
      <button :disabled="(!active || !usedDice)" v-on:click="nextturn()">Kör vége</button>
    </div>
  </div>
    <div style="display:none;">
      <img id="table" src="../assets/images/table.png">

      <img id="s1" src="../assets/images/skins/IG/1.png">
      <img id="s2" src="../assets/images/skins/IG/2.png">
      <img id="s3" src="../assets/images/skins/IG/3.png">
      <img id="s4" src="../assets/images/skins/IG/4.png"> 
      
      <img id="d1" src="../assets/images/dice/dice1.png">
      <img id="d2" src="../assets/images/dice/dice2.png">
      <img id="d3" src="../assets/images/dice/dice3.png">
      <img id="d4" src="../assets/images/dice/dice4.png">
      <img id="d5" src="../assets/images/dice/dice5.png">
      <img id="d6" src="../assets/images/dice/dice6.png">
    </div>
</template>

<script>
export default {
  name: 'Table',
  emits: ['dice','nextturn', 'jailtime'],
  data:function () {
    return {
      usedDice:false,
      firstDice:true,
      doubleDice:0,
      ctx:null
    }
  },
  props: ['players','dices','active'],
  methods:{
    draw() {
      this.ctx.clearRect(0, 0, document.getElementById('c').width, document.getElementById('c').height);
      this.ctx.drawImage(document.getElementById("table"), 5, 0);
      //                                                +jobb +le
      //                                                -bal  -fel
      this.ctx.drawImage(document.getElementById("s"+this.players[0].skin), parseInt(this.players[0].posX)-10, parseInt(this.players[0].posY)-10);//1.
      this.ctx.drawImage(document.getElementById("s"+this.players[1].skin), parseInt(this.players[1].posX)+10, parseInt(this.players[1].posY)-10);//2.
      this.ctx.drawImage(document.getElementById("s"+this.players[2].skin), parseInt(this.players[2].posX)-10, parseInt(this.players[2].posY)+10);//3.
      this.ctx.drawImage(document.getElementById("s"+this.players[3].skin), parseInt(this.players[3].posX)+10, parseInt(this.players[3].posY)+10);//4.

      var dice1 = "d"+this.dices[0];
      var dice2 = "d"+this.dices[1];
      this.ctx.drawImage(document.getElementById(dice1),310,450);
      this.ctx.drawImage(document.getElementById(dice2),240,450);

      this.ctx.fillRect(620,150,210,300);
    },
    nextturn(){
      this.$emit('nextturn');
      this.usedDice=false;
      this.doubleDice=0;
      this.firstDice=true;
    },
    dice(){
      this.firstDice=false;
      this.usedDice=true;
      this.$emit('dice');
      this.doubleDice++;
    },
    fixDice(){
      if(this.active){
        if(this.firstDice){
          this.usedDice=false;
        }else{
          if(this.dices[0]==this.dices[1]){
            this.usedDice=false;
            if(this.doubleDice==3){
              this.nextturn();
            }
          }else{
            this.usedDice=true;
          }
        }
      }
    }
  },
  mounted() {
    let canvas = document.getElementById('c');
    let ctx = canvas.getContext('2d');
    this.ctx=ctx;
    canvas.width = 800;
    canvas.height = 800;
    setInterval(this.draw, 50);
    setInterval(this.fixDice, 10);
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#Table{
  height:50%;
}
</style>
