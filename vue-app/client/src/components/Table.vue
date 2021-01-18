<template>
  <div id="Table" class="row">
    <canvas class="col-10" id="c" height="800"></canvas>
    <div class="col-2 d-flex flex-column">
      <ul class="propTest" v-for="prop in game._fm._props" :key="prop.owner">
        <li>{{prop._name}} - {{prop._owner}}</li>
      </ul>
      <button :disabled="(!isActive || usedDice || isBuying)" v-on:click="dice()">Dobás</button>
      <button :disabled="(!isActive || !usedDice)" v-on:click="nextturn()">Kör vége</button>
      <button :disabled="(!isActive || !usedDice || !isBuying)" v-on:click="accept()">Vásárlás</button>
      <button :disabled="(!isActive || !(jailtime>0) || !(freecard>0))" v-on:click="accept()">I.Sz.A.B.</button>
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

      <img id="f_ado" src="../assets/images/fieldcards/ado.png">
      <img id="f_aramszolgaltato" src="../assets/images/fieldcards/asz.png">
      <img id="f_b1" src="../assets/images/fieldcards/b1.png">
      <img id="f_b2" src="../assets/images/fieldcards/b2.png">
      <img id="f_b3" src="../assets/images/fieldcards/b3.png">
      <img id="f_b4" src="../assets/images/fieldcards/b4.png">
      <img id="f_borton" src="../assets/images/fieldcards/bori.png">
      <img id="f_bortonlatogatas" src="../assets/images/fieldcards/bori_latogatas.png">
      <img id="f_parkolo" src="../assets/images/fieldcards/parkolo.png">
      <img id="f_start" src="../assets/images/fieldcards/start.png">
      <img id="f_szerencsekartya" src="../assets/images/fieldcards/szk.png">
      <img id="f_vizszolgaltato" src="../assets/images/fieldcards/vsz.png">

    </div>
</template>

<script>
export default {
  name: 'Table',
  emits: ['dice','nextturn', 'tripledouble','jailtime'],
  data:function () {
    return {
      usedDice:false,
      firstDice:true,
      doubleDice:0,
      ctx:null
    }
  },
  props: ['game','isActive','isBuying','jailtime','freecard'],
  methods:{
    draw() {
      this.ctx.clearRect(0, 0, document.getElementById('c').width, document.getElementById('c').height);
      this.ctx.drawImage(document.getElementById("table"), 5, 0);
      //                                                +jobb +le
      //                                                -bal  -fel
      this.ctx.drawImage(document.getElementById("s"+this.game._pm._players[0]._skin), parseInt(this.game._table._playerPosition[0][0])-10, parseInt(this.game._table._playerPosition[0][1])-10);//1.
      this.ctx.drawImage(document.getElementById("s"+this.game._pm._players[1]._skin), parseInt(this.game._table._playerPosition[1][0])+10, parseInt(this.game._table._playerPosition[1][1])-10);//2.
      this.ctx.drawImage(document.getElementById("s"+this.game._pm._players[2]._skin), parseInt(this.game._table._playerPosition[2][0])-10, parseInt(this.game._table._playerPosition[2][1])+10);//3.
      this.ctx.drawImage(document.getElementById("s"+this.game._pm._players[3]._skin), parseInt(this.game._table._playerPosition[3][0])+10, parseInt(this.game._table._playerPosition[3][1])+10);//4.

      var dice1 = "d"+this.game._dices[0];
      var dice2 = "d"+this.game._dices[1];
      this.ctx.drawImage(document.getElementById(dice1),310,450);
      this.ctx.drawImage(document.getElementById(dice2),240,450);

      this.ctx.drawImage(document.getElementById("f_"+this.game._table._activeField),620,150);
      //Itt lesznek majd a mezőknek a kártyái, ez egyelőre csak egy teszt
      //this.ctx.drawImage(document.getElementById("b1"),620,150);
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
      if(this.doubleDice==3){
        this.$emit('tripledouble');
      }
    },
    accept(){
      this.$emit('accept');
    },
    fixDice(){
      if(this.isActive){
        if(this.firstDice){
          this.usedDice=false;
        }
      }
    }
  },
  mounted() {
    let canvas = document.getElementById('c');
    this.ctx = canvas.getContext('2d');
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
.propTest{
  margin:0px;
  color:black;
}
</style>
