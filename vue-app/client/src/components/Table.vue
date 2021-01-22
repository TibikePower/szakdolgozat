<template>
  <div id="Table" class="row">
    <canvas class="col-10" id="c" height="800"></canvas>
    <div class="col-2 d-flex flex-column">
      <button class="mainButton" :disabled="(!isActive || usedDice || isBuying)" v-on:click="dice()">Dobás</button>
      <button class="mainButton" :disabled="(!isActive || !usedDice)" v-on:click="nextturn()">Kör vége</button>
      <button class="mainButton" :disabled="(!isActive || !usedDice || !isBuying)" v-on:click="accept()">Vásárlás</button>
      <button class="mainButton" :disabled="(!isActive)" v-on:click="sell()">Eladás</button>
      <button class="mainButton" :disabled="(!isActive || !(jailtime>0) || !(freecard>0))" v-on:click="freecard_()">I.Sz.A.B.</button>
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

      <img id="star" src="../assets/images/propupgrades/star.png">
      <img id="crown" src="../assets/images/propupgrades/crown.png">  

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
  emits: ['dice','nextturn', 'tripledouble','jailtime','game'],
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
      this.ctx.font = "15px white";
      this.ctx.fillStyle="white";
      this.ctx.drawImage(document.getElementById("star"),5,0);
      this.ctx.fillText(this.game._fm._stars, 22, 12);
      this.ctx.drawImage(document.getElementById("crown"),40,0);
      this.ctx.fillText(this.game._fm._crowns, 55, 12);
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


      this.drawUpgrades();
    
    },
    drawUpgrades(){
      if(this.game._fm._props[0]._upgrades==5){
        this.ctx.drawImage(document.getElementById("crown"),483,510);
      }
      else if(this.game._fm._props[0]._upgrades>0){
        this.ctx.drawImage(document.getElementById("star"),470,510);
        if(this.game._fm._props[0]._upgrades>1){
          this.ctx.drawImage(document.getElementById("star"),477,510);
          if(this.game._fm._props[0]._upgrades>2){
            this.ctx.drawImage(document.getElementById("star"),484,510);
            if(this.game._fm._props[0]._upgrades>3){
              this.ctx.drawImage(document.getElementById("star"),491,510);
            }
          }
        }
      }
      if(this.game._fm._props[1]._upgrades==5){
        this.ctx.drawImage(document.getElementById("crown"),389,510);
      }
      else if(this.game._fm._props[1]._upgrades>0){
        this.ctx.drawImage(document.getElementById("star"),376,510);
        if(this.game._fm._props[1]._upgrades>1){
          this.ctx.drawImage(document.getElementById("star"),383,510);
          if(this.game._fm._props[1]._upgrades>2){
            this.ctx.drawImage(document.getElementById("star"),390,510);
            if(this.game._fm._props[1]._upgrades>3){
              this.ctx.drawImage(document.getElementById("star"),397,510);
            }
          }
        }
      }
      if(this.game._fm._props[2]._upgrades==5){
        this.ctx.drawImage(document.getElementById("crown"),251,510);
      }
      else if(this.game._fm._props[2]._upgrades>0){
        this.ctx.drawImage(document.getElementById("star"),238,510);
        if(this.game._fm._props[2]._upgrades>1){
          this.ctx.drawImage(document.getElementById("star"),245,510);
          if(this.game._fm._props[2]._upgrades>2){
            this.ctx.drawImage(document.getElementById("star"),252,510);
            if(this.game._fm._props[2]._upgrades>3){
              this.ctx.drawImage(document.getElementById("star"),259,510);
            }
          }
        }
      }
      if(this.game._fm._props[3]._upgrades==5){
        this.ctx.drawImage(document.getElementById("crown"),160,510);
      }
      else if(this.game._fm._props[3]._upgrades>0){
        this.ctx.drawImage(document.getElementById("star"),147,510);
        if(this.game._fm._props[3]._upgrades>1){
          this.ctx.drawImage(document.getElementById("star"),154,510);
          if(this.game._fm._props[3]._upgrades>2){
            this.ctx.drawImage(document.getElementById("star"),161,510);
            if(this.game._fm._props[3]._upgrades>3){
              this.ctx.drawImage(document.getElementById("star"),168,510);
            }
          }
        }
      }
      if(this.game._fm._props[4]._upgrades==5){
        this.ctx.drawImage(document.getElementById("crown"),114,510);
      }
      else if(this.game._fm._props[4]._upgrades>0){
        this.ctx.drawImage(document.getElementById("star"),101,510);
        if(this.game._fm._props[4]._upgrades>1){
          this.ctx.drawImage(document.getElementById("star"),108,510);
          if(this.game._fm._props[4]._upgrades>2){
            this.ctx.drawImage(document.getElementById("star"),115,510);
            if(this.game._fm._props[4]._upgrades>3){
              this.ctx.drawImage(document.getElementById("star"),122,510);
            }
          }
        }
      }
      if(this.game._fm._props[5]._upgrades==5){
        this.ctx.drawImage(document.getElementById("crown"),80,477);
      }
      else if(this.game._fm._props[5]._upgrades>0){
        this.ctx.drawImage(document.getElementById("star"),80,466);
        if(this.game._fm._props[5]._upgrades>1){
          this.ctx.drawImage(document.getElementById("star"),80,473);
          if(this.game._fm._props[5]._upgrades>2){
            this.ctx.drawImage(document.getElementById("star"),80,480);
            if(this.game._fm._props[5]._upgrades>3){
              this.ctx.drawImage(document.getElementById("star"),80,487);
            }
          }
        }
      }
      if(this.game._fm._props[6]._upgrades==5){
        this.ctx.drawImage(document.getElementById("crown"),80,385);
      }
      else if(this.game._fm._props[6]._upgrades>0){
        this.ctx.drawImage(document.getElementById("star"),80,374);
        if(this.game._fm._props[6]._upgrades>1){
          this.ctx.drawImage(document.getElementById("star"),80,381);
          if(this.game._fm._props[6]._upgrades>2){
            this.ctx.drawImage(document.getElementById("star"),80,388);
            if(this.game._fm._props[6]._upgrades>3){
              this.ctx.drawImage(document.getElementById("star"),80,395);
            }
          }
        }
      }
      if(this.game._fm._props[7]._upgrades==5){
        this.ctx.drawImage(document.getElementById("crown"),80,337);
      }
      else if(this.game._fm._props[7]._upgrades>0){
        this.ctx.drawImage(document.getElementById("star"),80,328);
        if(this.game._fm._props[7]._upgrades>1){
          this.ctx.drawImage(document.getElementById("star"),80,335);
          if(this.game._fm._props[7]._upgrades>2){
            this.ctx.drawImage(document.getElementById("star"),80,342);
            if(this.game._fm._props[7]._upgrades>3){
              this.ctx.drawImage(document.getElementById("star"),80,349);
            }
          }
        }
      }
      if(this.game._fm._props[8]._upgrades==5){
        this.ctx.drawImage(document.getElementById("crown"),80,247);
      }
      else if(this.game._fm._props[8]._upgrades>0){
        this.ctx.drawImage(document.getElementById("star"),80,238);
        if(this.game._fm._props[8]._upgrades>1){
          this.ctx.drawImage(document.getElementById("star"),80,245);
          if(this.game._fm._props[8]._upgrades>2){
            this.ctx.drawImage(document.getElementById("star"),80,252);
            if(this.game._fm._props[8]._upgrades>3){
              this.ctx.drawImage(document.getElementById("star"),80,259);
            }
          }
        }
      }
      if(this.game._fm._props[9]._upgrades==5){
        this.ctx.drawImage(document.getElementById("crown"),80,153);
      }
      else if(this.game._fm._props[9]._upgrades>0){
        this.ctx.drawImage(document.getElementById("star"),80,144);
        if(this.game._fm._props[9]._upgrades>1){
          this.ctx.drawImage(document.getElementById("star"),80,151);
          if(this.game._fm._props[9]._upgrades>2){
            this.ctx.drawImage(document.getElementById("star"),80,158);
            if(this.game._fm._props[9]._upgrades>3){
              this.ctx.drawImage(document.getElementById("star"),80,165);
            }
          }
        }
      }
      if(this.game._fm._props[10]._upgrades==5){
        this.ctx.drawImage(document.getElementById("crown"),80,107);
      }
      else if(this.game._fm._props[10]._upgrades>0){
        this.ctx.drawImage(document.getElementById("star"),80,98);
        if(this.game._fm._props[10]._upgrades>1){
          this.ctx.drawImage(document.getElementById("star"),80,105);
          if(this.game._fm._props[10]._upgrades>2){
            this.ctx.drawImage(document.getElementById("star"),80,112);
            if(this.game._fm._props[10]._upgrades>3){
              this.ctx.drawImage(document.getElementById("star"),80,119);
            }
          }
        }
      }
      if(this.game._fm._props[11]._upgrades==5){
        this.ctx.drawImage(document.getElementById("crown"),114,74);
      }
      else if(this.game._fm._props[11]._upgrades>0){
        this.ctx.drawImage(document.getElementById("star"),101,74);
        if(this.game._fm._props[11]._upgrades>1){
          this.ctx.drawImage(document.getElementById("star"),108,74);
          if(this.game._fm._props[11]._upgrades>2){
            this.ctx.drawImage(document.getElementById("star"),115,74);
            if(this.game._fm._props[11]._upgrades>3){
              this.ctx.drawImage(document.getElementById("star"),122,74);
            }
          }
        }
      }
      //
      if(this.game._fm._props[12]._upgrades==5){
        this.ctx.drawImage(document.getElementById("crown"),205,74);
      }
      else if(this.game._fm._props[12]._upgrades>0){
        this.ctx.drawImage(document.getElementById("star"),193,74);
        if(this.game._fm._props[12]._upgrades>1){
          this.ctx.drawImage(document.getElementById("star"),200,74);
          if(this.game._fm._props[12]._upgrades>2){
            this.ctx.drawImage(document.getElementById("star"),207,74);
            if(this.game._fm._props[12]._upgrades>3){
              this.ctx.drawImage(document.getElementById("star"),214,74);
            }
          }
        }
      }
      if(this.game._fm._props[13]._upgrades==5){
        this.ctx.drawImage(document.getElementById("crown"),252,74);
      }
      else if(this.game._fm._props[13]._upgrades>0){
        this.ctx.drawImage(document.getElementById("star"),240,74);
        if(this.game._fm._props[13]._upgrades>1){
          this.ctx.drawImage(document.getElementById("star"),247,74);
          if(this.game._fm._props[13]._upgrades>2){
            this.ctx.drawImage(document.getElementById("star"),254,74);
            if(this.game._fm._props[13]._upgrades>3){
              this.ctx.drawImage(document.getElementById("star"),261,74);
            }
          }
        }
      }
      if(this.game._fm._props[14]._upgrades==5){
        this.ctx.drawImage(document.getElementById("crown"),342,74);
      }
      else if(this.game._fm._props[14]._upgrades>0){
        this.ctx.drawImage(document.getElementById("star"),330,74);
        if(this.game._fm._props[14]._upgrades>1){
          this.ctx.drawImage(document.getElementById("star"),337,74);
          if(this.game._fm._props[14]._upgrades>2){
            this.ctx.drawImage(document.getElementById("star"),344,74);
            if(this.game._fm._props[14]._upgrades>3){
              this.ctx.drawImage(document.getElementById("star"),351,74);
            }
          }
        }
      }
      if(this.game._fm._props[15]._upgrades==5){
        this.ctx.drawImage(document.getElementById("crown"),389,74);
      }
      else if(this.game._fm._props[15]._upgrades>0){
        this.ctx.drawImage(document.getElementById("star"),377,74);
        if(this.game._fm._props[15]._upgrades>1){
          this.ctx.drawImage(document.getElementById("star"),384,74);
          if(this.game._fm._props[15]._upgrades>2){
            this.ctx.drawImage(document.getElementById("star"),391,74);
            if(this.game._fm._props[15]._upgrades>3){
              this.ctx.drawImage(document.getElementById("star"),398,74);
            }
          }
        }
      }
      if(this.game._fm._props[16]._upgrades==5){
        this.ctx.drawImage(document.getElementById("crown"),483,74);
      }
      else if(this.game._fm._props[16]._upgrades>0){
        this.ctx.drawImage(document.getElementById("star"),471,74);
        if(this.game._fm._props[16]._upgrades>1){
          this.ctx.drawImage(document.getElementById("star"),478,74);
          if(this.game._fm._props[16]._upgrades>2){
            this.ctx.drawImage(document.getElementById("star"),485,74);
            if(this.game._fm._props[16]._upgrades>3){
              this.ctx.drawImage(document.getElementById("star"),492,74);
            }
          }
        }
      }
      if(this.game._fm._props[17]._upgrades==5){
        this.ctx.drawImage(document.getElementById("crown"),515,107);
      }
      else if(this.game._fm._props[17]._upgrades>0){
        this.ctx.drawImage(document.getElementById("star"),515,98);
        if(this.game._fm._props[17]._upgrades>1){
          this.ctx.drawImage(document.getElementById("star"),515,105);
          if(this.game._fm._props[17]._upgrades>2){
            this.ctx.drawImage(document.getElementById("star"),515,112);
            if(this.game._fm._props[17]._upgrades>3){
              this.ctx.drawImage(document.getElementById("star"),515,119);
            }
          }
        }
      }
      if(this.game._fm._props[18]._upgrades==5){
        this.ctx.drawImage(document.getElementById("crown"),515,153);
      }
      else if(this.game._fm._props[18]._upgrades>0){
        this.ctx.drawImage(document.getElementById("star"),515,144);
        if(this.game._fm._props[18]._upgrades>1){
          this.ctx.drawImage(document.getElementById("star"),515,151);
          if(this.game._fm._props[18]._upgrades>2){
            this.ctx.drawImage(document.getElementById("star"),515,158);
            if(this.game._fm._props[18]._upgrades>3){
              this.ctx.drawImage(document.getElementById("star"),515,165);
            }
          }
        }
      }
      if(this.game._fm._props[19]._upgrades==5){
        this.ctx.drawImage(document.getElementById("crown"),515,247);
      }
      else if(this.game._fm._props[19]._upgrades>0){
        this.ctx.drawImage(document.getElementById("star"),515,238);
        if(this.game._fm._props[19]._upgrades>1){
          this.ctx.drawImage(document.getElementById("star"),515,245);
          if(this.game._fm._props[19]._upgrades>2){
            this.ctx.drawImage(document.getElementById("star"),515,252);
            if(this.game._fm._props[19]._upgrades>3){
              this.ctx.drawImage(document.getElementById("star"),515,259);
            }
          }
        }
      }
      if(this.game._fm._props[20]._upgrades==5){
        this.ctx.drawImage(document.getElementById("crown"),515,385);
      }
      else if(this.game._fm._props[20]._upgrades>0){
        this.ctx.drawImage(document.getElementById("star"),515,374);
        if(this.game._fm._props[20]._upgrades>1){
          this.ctx.drawImage(document.getElementById("star"),515,381);
          if(this.game._fm._props[20]._upgrades>2){
            this.ctx.drawImage(document.getElementById("star"),515,388);
            if(this.game._fm._props[20]._upgrades>3){
              this.ctx.drawImage(document.getElementById("star"),515,395);
            }
          }
        }
      }
      if(this.game._fm._props[21]._upgrades==5){
        this.ctx.drawImage(document.getElementById("crown"),515,477);
      }
      else if(this.game._fm._props[21]._upgrades>0){
        this.ctx.drawImage(document.getElementById("star"),515,466);
        if(this.game._fm._props[21]._upgrades>1){
          this.ctx.drawImage(document.getElementById("star"),515,473);
          if(this.game._fm._props[21]._upgrades>2){
            this.ctx.drawImage(document.getElementById("star"),515,480);
            if(this.game._fm._props[21]._upgrades>3){
              this.ctx.drawImage(document.getElementById("star"),515,487);
            }
          }
        }
      }
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
    sell(){
      this.$emit('sell');
    },
    freecard_(){
      this.$emit('usefreecard');
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
.mainButton{
  background:rgba(255, 255, 255, 0.6);
  border:2px solid rgba(0, 0, 0, 0.6);
  border-radius: 10px;
  font-weight: 700;
  font-size:20px;
  margin:6px 0px;
  padding:6px;
  transition: 0.5s;
}
.mainButton:hover{
  border-radius: 50px;
  transition: 0.5s;
}
.mainButton:disabled{
  color:rgba(0, 0, 0, 0.2);
  border:2px solid rgba(0, 0, 0, 0.2);
  border-radius:10px;
  transition: 0.5s;
}
.mainButton:focus{
  outline:none;
}
</style>
