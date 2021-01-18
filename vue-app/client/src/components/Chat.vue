<template>
  <div id="Chat" class="chatTemplate">
    <div class="title">Chat</div>
      <ul class="chatBox d-flex flex-column" ref="chatBox">
        <li v-for="message in messages" :key="message"><b>{{ message.sender }}</b> : {{ message.msg }}</li>
      </ul>
     <input class="sendInput" type="text" v-model="cMsg" @keyup.enter="sendMessage" placeholder="Üzenet">
  </div>
</template>

<script>
export default {
  name: 'Chat',
  props: ['messages'],
  data: function () {
    return {
      cMsg:''
    }
  },
  methods:{
    sendMessage(){
      if(this.cMsg.trim() === "") this.cMsg='';
      if(!this.cMsg) return;
      this.$emit('sendmsg',(this.cMsg));
      this.cMsg='';
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chatTemplate{
  margin:5px;
  padding:5px;
  background-color: rgba(0, 0, 0, 0.2);
  box-shadow: 0px 0px 10px 2px black;
  border-radius:5px;
  backdrop-filter: blur(6px);
  height: 56vh;
}
.title{
  text-transform: uppercase;
  font-weight: 900;
  color:white;
}
.chatBox{
  background-color: rgba(255, 255, 255, 0.8);
  margin-top:15px;
  border-radius:5px;
  font-size:15px;
  overflow:auto;
  text-align:left;
  height: 300px;
}
.chatBox::-webkit-scrollbar {
  width: 5px;
  background-color:none;
  border-radius:10px;
}
.chatBox::-webkit-scrollbar-thumb {
  background-color:rgba(0, 0, 0, 0.35);
  border-radius:40px;
}
.sendInput{
  padding:3px;
  background-color: rgba(255, 255, 255, 0.8);
  border:1px solid black;
  border-radius:5px;
}
.sendInput::placeholder{
  font-weight: 800;
  opacity: 0.6;
  padding-left:10px;
}
:focus{
  outline: none;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  padding:2px;
  margin: 0 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}
a {
  color: #42b983;
}
</style>
