<template>
<div class="loginTemplate container-fluid">
  <img src="../assets/images/logo.svg" style="margin-top:15px;">
  <form class="justify-content-center" id="Login" @submit.prevent="checkForm">  
      <div><input type="text" class="nameInput" v-model="name" placeholder="Felhasználónév"></div>
      <div>
        <div class="row justify-content-center">
          <div v-for="(skin,index) in skins" :key="skin">
              <input :id="index" type="radio" v-model="choosenSkin" name="profileImg" :value="index+1">
              <label :for="index">
                  <img  width="150" :src="skin.pathLong">
              </label>
          </div>
        </div>
      </div>
      <div>
        <button class="submitButton fa fa-check" type="submit"></button>
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
      </div>
  </form>
</div>
</template>

<script>
export default {
  name: 'Login',
  data: function () {
    return {
      errors:[],
      choosenSkin:null,
      name:null
    }
  },
  props: ['game','skins'],
  methods:{
    checkForm:function() {
      this.errors = [];
      var ok=true;
      for(var i=0;i<this.game._pm._players.length;i++){
        if(this.game._pm._players[i]._name===this.name)
        {
          this.errors.push("Ez a név foglalt!");
          ok=false;
          break;
        }
      }
      if(this.name){
        if(this.name.trim() === "") this.name='';
      }
      if(!this.name) {this.errors.push("Adj meg egy felhasználónevet!"); ok=false;}
      if(this.game._pm._players.length==4) {this.errors.push("Sajnos a játék megtelt!"); ok=false;}
      if(this.game._isStarted) {this.errors.push("A játék már elindult!"); ok=false;}
      if(!this.choosenSkin) {this.errors.push("Válassz egy kinézetet!"); ok=false;}
      if(ok) this.$emit('login',{name:this.name,skin:this.choosenSkin});
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
.loginTemplate{
  margin:15px;
  margin-left:0;
  background-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0px 0px 30px 10px white;
  border-radius:5px;
  backdrop-filter: blur(6px);
  overflow-y: scroll;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  height: 90vh;
}
.loginTemplate::-webkit-scrollbar {
  width: 15px;
  background-color:none;
  border-radius:10px;
}
.loginTemplate::-webkit-scrollbar-thumb {
  background-color:rgba(0, 0, 0, 0.35);
  border-radius:40px;
}
#Login{
  padding-top:40px;
  margin-bottom: 40px;
  padding-bottom:10px;
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
.nameInput{
  text-align: center;
  font-size:25px;
  font-weight: 800;
  border-radius:10px;
  border:none;
  box-shadow: 0px 0px 5px 3px black;
  background:linear-gradient(to bottom right, #c0c0c0, #ffffff);
  transition: 0.4s;
}
.nameInput::placeholder{
  font-weight: 500;
  opacity: 0.5;
}
.nameInput:hover{
  text-align: center;
  font-size:25px;
  border-radius:10px;
  border:none;
  box-shadow: 0px 0px 10px 5px black;
  transition: 0.4s;
  background:linear-gradient(to bottom right, #ffffff, #c0c0c0);
}
.nameInput:focus{
  outline:none;
  box-shadow: 0px 0px 10px 5px black;
  background:linear-gradient(to bottom right, #ffffff, #c0c0c0);
  transition: 0.4s;
}
.submitButton{
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
.submitButton:hover{
  background:linear-gradient(to bottom right, #00b400, #00ff00);
  box-shadow: 0px 0px 4px 2px white;
  color:white;

  transition: 0.3s;
}
.submitButton:focus{
  outline:none;
}
[type="radio"]{
  display: none;
}
[type=radio] + label {
  cursor: pointer;
  margin:50px;
  margin-bottom:-20px;
  transition: 0.5s;
  border-radius:10px;
  border:5px solid white;
}
[type=radio]:checked + label {
  box-shadow: 0px 0px 10px 1px black;
  border-radius:10px;
  background: linear-gradient(45deg, rgba(99, 99, 99, 0.5), rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.0),rgba(255, 255, 255, 0.5),rgba(99, 99, 99,0.5));
  transform: scale(1.1);
  transition: 0.5s;
}
[type=radio]:hover + label {
  box-shadow: 0px 0px 10px 1px black;  
  border-radius:10px;
  transition: 0.5s;
}
</style>
