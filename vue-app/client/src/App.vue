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
	<div v-else-if="isUpgradeCheck">
		<Upgrade
			v-bind:game="game"
			v-bind:name="name"
			v-bind:cards="cards"
			@close="getClose()"
			@upgrade="getUpgradeAccept($event)"
		/>
	</div>
	<div v-else-if="isDestroyCheck">
		<Destroy
			v-bind:game="game"
			v-bind:name="name"
			v-bind:cards="cards"
			@close="getClose()"
			@destroy="getDestroyAccept($event)"
		/>
	</div>
	<div v-else-if="isTradeCheck">
		<div v-if="tradeStatus==1">
			<Trade
				v-bind:game="game"
				v-bind:name="name"
				v-bind:cards="cards"
				v-bind:money="money"
				v-bind:isTrading="isTrading"
				v-bind:freecard="freecard"
				v-bind:tradeStatus="tradeStatus"
				@close="getCloseTrade()"
				@trade="getMainTrade($event)"
			/>
		</div>
		<div v-else-if="tradeStatus==2">
			<TradePartner
				v-bind:game="game"
				v-bind:cards="cards"
				v-bind:tradeStatus="tradeStatus"
				v-bind:tradeWindow="tradeWindow"
				@close="getCloseFromTradePartner($event)"
			/>
		</div>
	</div>
	<div class="col-12" style="margin-top:10px;">
		<div class="row">
			<div class="col-3">
				<div>
					<div style="height:50%;"><OnlinePlayers 
						v-bind:game="game"
						v-bind:isTradeCheck="isTradeCheck"
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
			<div class="col-9" v-else-if="status=='end'">
				<li class="d-flex justify-content-between" v-for="(player, index) in game._pm._rankList" :key="player">
					{{index+1}} - {{player}}
				</li>
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
					@usefreejail="getUseFreeJail()"
					@sell="getSell()"
					@upgrade="getUpgrade()"
					@destroy="getDestroy()"
					@trade="getTrade()"
					@lose="getLose()"
					@changedoubledice="getChangeDoubleDice($event)"
					v-bind:game="game"
					v-bind:isActive="isActive"
					v-bind:isBuying="isBuying"
					v-bind:jailtime="jailtime"
					v-bind:freecard="freecard"
					v-bind:money="money"
					v-bind:tradeStatus="tradeStatus"
					v-bind:doubleDice="doubleDice"
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
import Upgrade from './components/Upgrade.vue'
import Destroy from './components/Destroy.vue'
import Trade from './components/Trade.vue'
import TradePartner from './components/TradePartner.vue'
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
				isUpgradeCheck:false,
				isDestroyCheck:false,
				isTradeCheck:false,
				tradeStatus:0,
				isTrading:false,
				tradeWindow:null,
				inventoryCheckName:'',
				skins:[],
				cards:[],
				messages:[],
				jailtime:null,
				freecard:0,
				money:0,
				doubleDice:0,
				game:new Game()
			}
	},
	created(){
		this.socket = io("http://192.168.0.106:3000");

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
		this.socket.on('notBuying',() =>{
			if(this.isActive){
				this.isBuying=false;
			}
		})
		this.socket.on('tradeEnd',(data) =>{
			if(this.name==data.name1 || this.name==data.name2){
				this.isTrading=false;
				this.isTradeCheck=false;
				this.tradeStatus=0;
			}
		})
		this.socket.on('tradePartner',(data) =>{
			if(this.name==data.name){
				this.isSellCheck=false;
				this.isInventoryCheck=false;
				this.isUpgradeCheck=false;
				this.isDestroyCheck=false;
				this.isTrading=false;
				this.tradeStatus=2;
				this.isTradeCheck=true;
				this.tradeWindow=data.infos;
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
					this.money=this.game._pm._players[i]._money;
				}
			}
			if(!this.isActive){
				this.doubleDice=0;
			}
			console.log(this.game);
			console.log(this.status);
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
		getLose(){
			this.socket.emit('lose',this.name);
		},
		getChangeDoubleDice(data){
			this.doubleDice=data;
		},
		getMainTrade(data){
			this.isTrading=true;
			this.socket.emit('mainTrade',data);
		},
		getSell(){
			this.isSellCheck=true;
			this.isInventoryCheck=false;
			this.isUpgradeCheck=false;
			this.isDestroyCheck=false;
			this.inventoryCheckName='';
		},
		getUpgrade(){
			this.isUpgradeCheck=true;
			this.isSellCheck=false;
			this.isInventoryCheck=false;
			this.isDestroyCheck=false;
			this.inventoryCheckName='';
		},
		getDestroy(){
			this.isUpgradeCheck=false;
			this.isSellCheck=false;
			this.isInventoryCheck=false;
			this.isDestroyCheck=true;
			this.inventoryCheckName='';
		},
		getTrade(){
			this.isInventoryCheck=false;
			this.isUpgradeCheck=false;
			this.isDestroyCheck=false;
			this.tradeStatus=1;
			this.isTradeCheck=true;
		},
		getCloseFromTradePartner(data){
			this.socket.emit('partnerTrade',{accept:data,trade:this.tradeWindow});
		},
		getSellAccept(field){
			this.socket.emit('sell',field);
		},
		getUpgradeAccept(field){
			this.socket.emit('upgrade',field);
		},
		getDestroyAccept(field){
			this.socket.emit('destroy',field);
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
		getUseFreeCard(){
			this.socket.emit('useFreeCard');
		},
		getUseFreeJail(){
			this.socket.emit('useFreeJail');
		},
		getClose(){
			this.inventoryCheckName='';
			this.isInventoryCheck=false;
			this.isSellCheck=false;			
			this.isUpgradeCheck=false;	
			this.isDestroyCheck=false;
		},
		getCloseTrade(){
			this.isTradeCheck=false;
			this.tradeStatus=0;
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
		Sell,
		Upgrade,
		Destroy,
		Trade,
		TradePartner
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
