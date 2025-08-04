<template>
  <div id="app">
    <!-- Modal components -->
    <Inventory 
      v-if="isInventoryCheck"
      :game="game"
      :inventoryCheckName="inventoryCheckName"
      :cards="cards"
      :ingame="ingame"
      @close="handleClose"
    />

    <Sell 
      v-else-if="isSellCheck"
      :game="game"
      :name="name"
      :cards="cards"
      @close="handleClose"
      @sell="handleSell"
    />
    
    <Upgrade 
      v-else-if="isUpgradeCheck"
      :game="game"
      :name="name"
      :cards="cards"
      @close="handleClose"
      @upgrade="handleUpgrade"
    />
    
    <Destroy 
      v-else-if="isDestroyCheck"
      :game="game"
      :name="name"
      :cards="cards"
      @close="handleClose"
      @destroy="handleDestroy"
    />
    
    <div v-else-if="isTradeCheck">
      <Trade 
        v-if="tradeStatus === 1"
        :game="game"
        :name="name"
        :cards="cards"
        :money="money"
        :isTrading="isTrading"
        :freecard="freecard"
        :tradeStatus="tradeStatus"
        @close="handleCloseTrade"
        @trade="handleTrade"
      />
      
      <TradePartner
        v-else-if="tradeStatus === 2"
        :game="game"
        :cards="cards"
        :tradeStatus="tradeStatus"
        :tradeWindow="tradeWindow"
        @close="handleCloseFromTradePartner"
      />
    </div>
    
    <!-- Main content -->
    <div class="container-fluid">
      <div class="row">
        <!-- Left sidebar -->
        <div class="col-md-3">
          <div class="sidebar-container">
            <OnlinePlayers 
              :game="game"
              :isTradeCheck="isTradeCheck"
              @playername="handlePlayerNameSelect"
            />
            <Chat 
              @sendmsg="handleSendMessage" 
              :messages="messages"
            />
          </div>
        </div>
        
        <!-- Main content area -->
        <div class="col-md-9">
          <Login 
            v-if="status === 'connecting'"
            :skins="skins"
            :game="game"
            @login="handleLogin"
          />
          
          <div v-else-if="status === 'end'" class="end-game">
            <ul class="endRank">
              <li 
                class="d-flex endRankli" 
                v-for="(player, index) in game._pm._rankList" 
                :key="player"
              >
                {{index+1}}. - {{player}}
              </li>
            </ul>
            <button @click="status = 'endg'" class="btn btn-primary">Continue</button>
          </div>
          
          <Waiting 
            v-else-if="!ingame"
            :status="status"
          />
          
          <Table 
            v-else
            @dice="handleDice"
            @nextturn="handleNextTurn"
            @tripledouble="handleTripleDouble"
            @accept="handleBuyAccept"
            @usefreecard="handleUseFreeCard"
            @usefreejail="handleUseFreeJail"
            @sell="handleSellMode"
            @upgrade="handleUpgradeMode"
            @destroy="handleDestroyMode"
            @trade="handleTradeMode"
            @lose="handleLose"
            @changedoubledice="handleDoubleChange"
            :game="game"
            :isActive="isActive"
            :isBuying="isBuying"
            :jailtime="jailtime"
            :freecard="freecard"
            :money="money"
            :tradeStatus="tradeStatus"
            :doubleDice="doubleDice"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import socketService from './services/SocketService';
import Game from './models/Game';

// Components
import OnlinePlayers from './components/OnlinePlayers.vue';
import Login from './components/Login.vue';
import Chat from './components/Chat.vue';
import Waiting from './components/Waiting.vue';
import Table from './components/Table.vue';
import Inventory from './components/Inventory.vue';
import Sell from './components/Sell.vue';
import Upgrade from './components/Upgrade.vue';
import Destroy from './components/Destroy.vue';
import Trade from './components/Trade.vue';
import TradePartner from './components/TradePartner.vue';

export default {
  name: 'App',
  components: {
    OnlinePlayers,
    Login,
    Chat,
    Waiting,
    Table,
    Inventory,
    Sell,
    Upgrade,
    Destroy,
    Trade,
    TradePartner
  },
  
  data() {
    return {
      name: 'Anonymous',
      skin: null,
      status: 'connecting',
      ingame: false,
      isActive: false,
      isBuying: false,
      isInventoryCheck: false,
      isSellCheck: false,
      isUpgradeCheck: false,
      isDestroyCheck: false,
      isTradeCheck: false,
      tradeStatus: 0,
      isTrading: false,
      tradeWindow: null,
      inventoryCheckName: '',
      skins: [],
      cards: [],
      messages: [],
      jailtime: null,
      freecard: 0,
      money: 0,
      doubleDice: 0,
      game: new Game()
    };
  },
  
  created() {
    // Set up socket event listeners
    socketService.on('sendmessageFromSocket', (data) => {
      this.messages = data;
    });
    
    socketService.on('startGame', () => {
      this.ingame = true;
      this.inventoryCheckName = '';
      this.isInventoryCheck = false;
    });
    
    socketService.on('buy', () => {
      if (this.isActive) {
        this.isBuying = true;
      }
    });
    
    socketService.on('notBuying', () => {
      if (this.isActive) {
        this.isBuying = false;
      }
    });
    
    socketService.on('botmodeEnd', () => {
      this.status = 'end';
    });
    
    socketService.on('startBotGame', () => {
      this.ingame = true;
    });
    
    socketService.on('tradeNotify', (data) => {
      this.tradeWindow = data;
      this.tradeStatus = 2;
      this.isTradeCheck = true;
    });
    
    socketService.on('gamestarted', () => {
      this.ingame = true;
      this.status = 'ingame';
    });
    
    socketService.on('refresh', (data) => {
      this.game = data;
      
      // Update player information
      for (let i = 0; i < this.game._pm._players.length; i++) {
        if (this.name === this.game._pm._players[i]._name) {
          this.status = this.game._pm._players[i]._status;
          this.isActive = this.game._pm._players[i]._isActive;
          this.jailtime = this.game._pm._players[i]._jailtime;
          this.freecard = this.game._pm._players[i]._freecard;
          this.money = this.game._pm._players[i]._money;
        }
      }
      
      if (!this.isActive) {
        this.doubleDice = 0;
      }
    });
    
    // Set up window beforeunload event
    window.onbeforeunload = () => {
      socketService.emit('leaveSocket', this.name);
    };
  },
  
  mounted() {
    // Load images
    this.importAll(require.context('./assets/images/skins/Login', true, /\.png$/), this.skins);
    this.importAll(require.context('./assets/images/propcards', true, /\.png$/), this.cards);
  },
  
  methods: {
    // Image importer
    importAll(r, to) {
      r.keys().forEach(key => (to.push({ pathLong: r(key), pathShort: key })));
    },
    
    // Event handlers
    handleLogin(data) {
      this.name = data.name;
      this.skin = data.skin;
      this.status = "ready";
      socketService.emit('loginSocket', {name: this.name, skin: this.skin});
    },
    
    handleSendMessage(data) {
      socketService.emit('sendmessageSocket', {msg: data, sender: this.name});
    },
    
    handleDice() {
      socketService.emit('dice');
    },
    
    handleLose() {
      socketService.emit('lose', this.name);
    },
    
    handleDoubleChange(data) {
      this.doubleDice = data;
    },
    
    handleTrade(data) {
      this.isTrading = true;
      socketService.emit('mainTrade', data);
    },
    
    handleSellMode() {
      this.isSellCheck = true;
      this.isInventoryCheck = false;
      this.isUpgradeCheck = false;
      this.isDestroyCheck = false;
      this.inventoryCheckName = '';
    },
    
    handleUpgradeMode() {
      this.isUpgradeCheck = true;
      this.isSellCheck = false;
      this.isInventoryCheck = false;
      this.isDestroyCheck = false;
      this.inventoryCheckName = '';
    },
    
    handleDestroyMode() {
      this.isUpgradeCheck = false;
      this.isSellCheck = false;
      this.isInventoryCheck = false;
      this.isDestroyCheck = true;
      this.inventoryCheckName = '';
    },
    
    handleTradeMode() {
      this.isInventoryCheck = false;
      this.isUpgradeCheck = false;
      this.isDestroyCheck = false;
      this.tradeStatus = 1;
      this.isTradeCheck = true;
    },
    
    handleClose() {
      this.isInventoryCheck = false;
      this.isSellCheck = false;
      this.isUpgradeCheck = false;
      this.isDestroyCheck = false;
      this.inventoryCheckName = '';
    },
    
    handleSell(data) {
      socketService.emit('sell', data);
      this.handleClose();
    },
    
    handleUpgrade(data) {
      socketService.emit('upgrade', data);
      this.handleClose();
    },
    
    handleDestroy(data) {
      socketService.emit('destroy', data);
      this.handleClose();
    },
    
    handleNextTurn() {
      socketService.emit('nextturn');
    },
    
    handlePlayerNameSelect(data) {
      if (data !== this.inventoryCheckName) {
        this.inventoryCheckName = data;
        this.isInventoryCheck = true;
        this.isSellCheck = false;
        this.isUpgradeCheck = false;
        this.isDestroyCheck = false;
      } else {
        this.inventoryCheckName = '';
        this.isInventoryCheck = false;
      }
    },
    
    handleUseFreeCard() {
      socketService.emit('usefreecard');
    },
    
    handleUseFreeJail() {
      socketService.emit('usefreejail');
    },
    
    handleCloseTrade() {
      this.isTradeCheck = false;
      this.tradeStatus = 0;
    },
    
    handleCloseFromTradePartner(data) {
      if (data) {
        socketService.emit('tradeaccept');
      } else {
        socketService.emit('tradedecline');
      }
      
      this.isTradeCheck = false;
      this.tradeStatus = 0;
    },
    
    handleTripleDouble() {
      socketService.emit('tripleDouble');
    },
    
    handleBuyAccept() {
      this.isBuying = false;
      socketService.emit('buyAccept');
    }
  }
};
</script>

<style>
#app {
  font-family: 'Montserrat', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

.sidebar-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.sidebar-container > div:first-child {
  height: 50%;
}

.endRank {
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0px 0px 10px 2px black;
  border-radius: 5px;
  backdrop-filter: blur(6px);
  text-align: center;
  padding-inline-start: 0px;
  margin: 20px auto;
  max-width: 500px;
  list-style-type: none;
}

.endRank > :first-child {
  font-size: 70px;
}

.endRankli {
  padding: 10px;
  font-size: 30px;
  text-align: center;
  display: flex;
  justify-content: center;
}

.end-game {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.end-game button {
  margin-top: 20px;
  font-size: 1.2rem;
  padding: 0.5rem 2rem;
}
</style>
