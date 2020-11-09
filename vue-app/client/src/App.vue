<template>
	<div class="col-12" style="margin-top:10px;">
		<div class="row">
			<div class="col-3">
				<div>
					<div style="height:50%;"><OnlinePlayers v-bind:players="players"/></div>
					<div><Chat @sendmsg="getMessage($event)" v-bind:messages="messages"/></div>
				</div>  
			</div>
			<div class="col-9" v-if="status=='connecting'">
				<div>
					<Login
					v-bind:skins="skins"
					v-bind:players="players"
					@login="getLoginDatas($event)"
					/>
				</div>
			</div>
			<div class="col-9" v-else>
				<div v-if="!ingame">
					<Waiting
					v-bind:status="status"
					/>
				</div>
				<div v-else>
					<Table
					@dice="getDice()"
					@nextturn="getNextTurn()"
					v-bind:players="players"
					v-bind:active="active"
					v-bind:plusinfo="plusinfo"
					v-bind:jailtime="jailtime"
					v-bind:dices="dices"/>
				</div>
			</div>
		</div>
	</div>	
</template>

<script>
import OnlinePlayers from './components/OnlinePlayers.vue'
import Login from './components/Login.vue'
import Chat from './components/Chat.vue'
import Waiting from './components/Waiting.vue'
import Table from './components/Table.vue'
import io from 'socket.io-client'
export default {
	name: 'App',
	data () {
			return {
				socket: {},
				count:0,
				name:'Anonymus',
				skin:null,
				status:'connecting',
				ingame:false,
				active:false,
				dices:[],
				skins:[],
				messages:[],
				jailtime:null,
				plusinfo:null,
				players:[]
			}
	},
	created(){
		this.socket = io("http://localhost:3000");

		window.onbeforeunload = () => {
			this.socket.emit('leaveSocket',(this.name));
		};
		this.socket.on('sendmessageFromSocket',(data) =>{
			this.messages=data;
		})
		this.socket.on('startGame',(data) =>{
			this.dices=data.dices;
			this.ingame=true;
		})
		this.socket.on('kicked',(data) =>{

			console.log("name:");
			console.log(this.name);
			console.log("data:");
			console.log(data);
			if(this.name==data){
				this.socket.emit('leaveSocket',(this.name));
				this.socket.emit('kicked',(this.name));
			}
		})
		this.socket.on('refreshPlayers',(data) =>{
			this.players=data;
			data.forEach(player => {
				if(player.name==this.name){
					this.status=player.status;
					this.active=player.active;
					this.jailtime=player.jailtime;
				}
			});
		})
		this.socket.on('refreshDices',(data) =>{
			this.dices=data;
		})
	},
	mounted() {
		this.importAll(require.context('./assets/images/skins/Login', true, /\.png$/),this.skins);
	},
	methods:{
		importAll(r, to) {
			r.keys().forEach(key => (to.push({ pathLong: r(key), pathShort: key })));
		},
		getLoginDatas(data){
			this.name=data.name;
			this.skin=data.skin;
			this.status="ready";
			this.socket.emit('loginSocket',{name:this.name,skin:this.skin});
		},
		getMessage(data){
			this.socket.emit('sendmessageSocket',{msg:data,sender:this.name});
		},
		getDice(){
			this.socket.emit('dice');
		},
		getNextTurn(){
			this.socket.emit('nextTurn');
		}
	},
	components: {
		OnlinePlayers,
		Login,
		Waiting,
		Table,
		Chat
	}
}
</script>

<style>
#app {
	font-family: 'Montserrat', sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	height: 100%;
	height:100%;
}
</style>
