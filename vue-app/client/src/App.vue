<template>
	<div v-if="isInventoryCheck">
		<Inventory
			v-bind:game="game"
			v-bind:inventoryCheckName="inventoryCheckName"
			v-bind:cards="cards"
			v-bind:ingame="ingame"
			@close="getClose()"
		/>
	</div>
	<div v-else-if="isSellCheck">
		<Sell
			v-bind:game="game"
			v-bind:name="name"
			v-bind:cards="cards"
			@close="getClose()"
			@sell="getSellAccept($event)"
		/>
	</div>
	<div class="col-12" style="margin-top:10px;">
		<div class="row">
			<div class="col-3">
				<div>
					<div style="height:50%;"><OnlinePlayers 
						v-bind:game="game"
						v-bind:ingame="ingame"
						@playername="getPlayerName($event)"
						/>
					</div>
					<div><Chat @sendmsg="getMessage($event)" v-bind:messages="messages"/></div>
				</div>  
			</div>
			<div class="col-9" v-if="status=='connecting'">
				<div>
					<Login
					v-bind:skins="skins"
					v-bind:game="game"
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
					@tripledouble="tripleDouble()"
					@accept="buyAccept()"
					@usefreecard="getUseFreeCard()"
					@sell="getSell()"
					v-bind:game="game"
					v-bind:isActive="isActive"
					v-bind:isBuying="isBuying"
					v-bind:jailtime="jailtime"
					v-bind:freecard="freecard"
					/>
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
import Inventory from './components/Inventory.vue'
import Sell from './components/Sell.vue'
import io from 'socket.io-client'

import Game from '../../classes/Game'


export default {
	name: 'App',
	data () {
			return {
				socket: {},
				name:'Anonymus',
				skin:null,
				status:'connecting',
				ingame:false,
				isActive:false,
				isBuying:false,
				isInventoryCheck:false,
				isSellCheck:false,
				inventoryCheckName:'',
				skins:[],
				cards:[],
				messages:[],
				jailtime:null,
				freecard:0,
				game:new Game()
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
		this.socket.on('startGame',() =>{
			this.ingame=true;
			this.inventoryCheckName='';
			this.isInventoryCheck=false;	
		})
		this.socket.on('buy',() =>{
			if(this.isActive){
				this.isBuying=true;
			}
		})
		this.socket.on('kicked',(data) =>{
			if(this.name==data){
				this.socket.emit('leaveSocket',(this.name));
				this.socket.emit('kicked',(this.name));
			}
		})
		this.socket.on('refresh',(data) =>{
			this.game=data;
			for(var i=0;i<this.game._pm._players.length;i++){
				if(this.name==this.game._pm._players[i]._name){
					this.status=this.game._pm._players[i]._status;
					this.isActive=this.game._pm._players[i]._isActive;
					this.jailtime=this.game._pm._players[i]._jailtime;
					this.freecard=this.game._pm._players[i]._freecard;
				}
			}
		})
	},
	mounted() {
		this.importAll(require.context('./assets/images/skins/Login', true, /\.png$/),this.skins);
		this.importAll(require.context('./assets/images/propcards', true, /\.png$/),this.cards);
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
		getSell(){
			this.isSellCheck=true;
			this.isInventoryCheck=false;
			this.inventoryCheckName='';
		},
		getSellAccept(field){
			this.socket.emit('sell',field);
		},
		getNextTurn(){
			this.isBuying=false;
			this.isSellCheck=false;
			this.socket.emit('nextTurn');
		},
		getPlayerName(name){
			console.log(name);
			if(!name==''){
				this.isSellCheck=false;
				this.inventoryCheckName=name;
				this.isInventoryCheck=true;
			}
		},
		getSellCheck(){
			this.isSellCheck=true;
		},
		getUseFreeCard(){
			this.socket.emit('useFreeCard');
		},
		getClose(){
			this.inventoryCheckName='';
			this.isInventoryCheck=false;
			this.isSellCheck=false;			
		},
		tripleDouble(){
			this.socket.emit('tripleDouble');
		},
		buyAccept(){
			this.isBuying=false;
			this.socket.emit('buyAccept');
		},

	},
	components: {
		OnlinePlayers,
		Login,
		Waiting,
		Table,
		Chat,
		Inventory,
		Sell
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
