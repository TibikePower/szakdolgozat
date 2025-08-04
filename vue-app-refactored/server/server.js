import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { SERVER_PORT, SERVER_HOST, DEBUG_MODE } from './config/server.js';

import Game from './models/Game.js';
import Log from './utils/Log.js';

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Express app and HTTP server
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Setup static file serving for Vue.js client
app.use(express.static(join(__dirname, '../client/dist')));

// Initialize game and logs
const game = new Game();
const log = new Log('SERVER');

// Enable logging if in debug mode
if (DEBUG_MODE) {
  log.activate();
  game.log.activate();
}

// Message storage
const messages = [];

/**
 * Roll dice for current player
 */
function dice() {
  game.useDice();
  game.checkField();
  
  if (game.isBuying) {
    io.emit('buy');
  }
  
  if (game.isLuckycard) {
    const smsg = {
      'msg': game.luckyCard(),
      'sender': 'Szerencsekártya'
    };
    messages.push(smsg);
  }
  
  io.emit('refresh', game);
  io.emit('sendmessageFromSocket', messages);
}

/**
 * Handle triple double dice roll
 */
function tripleDouble() {
  game.tripleDouble();
  
  // Find active bot player if any
  for (let i = 0; i < game.pm.players.length; i++) {
    if (game.pm.players[i].isActive === true) {
      if (game.pm.players[i].type === 'bot') {
        callBot(i);
        break;
      }
    }
  }
}

/**
 * Check if name belongs to a bot
 * @param {string} name - Player name to check
 * @returns {boolean} True if the player is a bot
 */
function isBotName(name) {
  for (let i = 0; i < game.pm.players.length; i++) {
    if (name === game.pm.players[i].name) {
      return game.pm.players[i].type === 'bot';
    }
  }
  return false;
}

/**
 * Get bot index by name
 * @param {string} name - Bot name
 * @returns {number} Bot index
 */
function botIndex(name) {
  for (let i = 0; i < game.pm.players.length; i++) {
    if (name === game.pm.players[i].name) {
      return i;
    }
  }
  return -1;
}

/**
 * Process player loss
 * @param {string} name - Player name
 */
function lose(name) {
  game.lose(name);
  
  if (game.losers === 2) {
    log.write("Game over");
    log.write("Rounds: " + game.rounds);
    game.gameEnd();
  }
  
  // Find next active bot player if any
  for (let i = 0; i < game.pm.players.length; i++) {
    if (game.pm.players[i].isActive === true) {
      if (game.pm.players[i].type === 'bot') {
        callBot(i);
        break;
      }
    }
  }
}

/**
 * Handle bot player turn
 * @param {number} index - Bot player index
 */
function callBot(index) {
  // Bot logic implementation
  log.write("========================");
  log.write(`[ BOT - ${index} ]: ${game.pm.players[index].name} is next.`);
  
  let exit = false;
  
  do {
    const bAction = game.pm.players[index].calcBotNextAction(game);
    
    if (bAction === 'dice') {
      dice();
      log.write(`[ BOT - ${index} ]: ${game.pm.players[index].name} rolled the dice. Results: ${game.dices[0]}+${game.dices[1]}`);
      
      if (game.dices[0] === game.dices[1]) {
        game.pm.players[index].doubleDice++;
      } else {
        game.pm.players[index].doubleDice = 0;
      }
      
      if (game.pm.players[index].doubleDice === 2) {
        game.pm.players[index].doubleDice = 0;
        game.pm.players[index].isUsedDice = false;
        bAction = 'tripleDouble';
      }
    } else if (bAction === 'useFreeCard') {
      game.pm.players[index].jailtime = 0;
      game.pm.players[index].freecard -= 1;
      log.write(`[ BOT - ${index} ]: ${game.pm.players[index].name} used a get-out-of-jail card. Remaining: ${game.pm.players[index].freecard}`);
    } else if (bAction === 'useFreeJail') {
      game.pm.players[index].jailtime = 0;
      game.pm.players[index].money -= 5000;
      game.log.write(`${game.pm.players[index].name} paid 5,000 JF bail.`);
      log.write(`[ BOT - ${index} ]: ${game.pm.players[index].name} paid bail. Remaining money: ${game.pm.players[index].money} JF`);
    } else if (bAction === 'buy') {
      game.buy();
    } else if (bAction === 'upgrade') {
      game.upgrade(game.fm.props[game.pm.players[index].upgradeIndex].field);
      game.pm.players[index].upgradeIndex = 0;
    } else if (bAction === 'destroy') {
      game.destroy(game.fm.props[game.pm.players[index].destroyIndex].field);
      game.pm.players[index].destroyIndex = 0;
    } else if (bAction === 'nextTurn' || bAction === 'lose' || bAction === 'tripleDouble') {
      exit = true;
    }
    
    // Additional bot actions would be implemented here
    
  } while (!exit);
  
  // Handle end of bot turn
  if (bAction === 'nextTurn') {
    game.pm.players[index].upgradeIndex = 0;
    game.pm.players[index].destroyIndex = 0;
    game.pm.players[index].tradeIndex = 0;
    game.pm.players[index].rejects = 0;
    next();
  } else if (bAction === 'lose') {
    log.write(`[ BOT - ${index} ]: ${game.pm.players[index].name} went bankrupt.`);
    lose(game.pm.players[index].name);
    
    // Find next active bot
    for (let i = 0; i < game.pm.players.length; i++) {
      if (game.pm.players[i].isActive === true) {
        if (game.pm.players[i].type === 'bot') {
          callBot(i);
          break;
        }
      }
    }
  } else if (bAction === 'tripleDouble') {
    tripleDouble();
  }
}

/**
 * Move to next player's turn
 */
function next() {
  game.nextTurn();
  
  // Handle bot player if active
  for (let i = 0; i < game.pm.players.length; i++) {
    if (game.pm.players[i].isActive === true) {
      if (game.pm.players[i].type === 'bot') {
        callBot(i);
        break;
      }
    }
  }
}

// Socket.io connection handling
io.on('connection', (socket) => {
  log.write('A user connected');
  
  // Send initial game state
  socket.emit('refresh', game);
  socket.emit('sendmessageFromSocket', messages);
  
  // Handle player login
  socket.on('loginSocket', (data) => {
    log.write(`Login: ${data.name}`);
    game.pm.addPlayer(data, 'p');
    
    // Send updated game state
    io.emit('refresh', game);
    
    // Add welcome message
    const smsg = {
      'msg': `${data.name} joined the game!`,
      'sender': 'Server'
    };
    messages.push(smsg);
    io.emit('sendmessageFromSocket', messages);
  });
  
  // Handle chat messages
  socket.on('sendmessageSocket', (data) => {
    messages.push(data);
    io.emit('sendmessageFromSocket', messages);
  });
  
  // Handle game start
  socket.on('startGame', () => {
    game.start();
    io.emit('startGame');
    io.emit('refresh', game);
  });
  
  // Handle bot game start
  socket.on('startBotGame', (data) => {
    game = new Game();
    
    // Add human player
    game.pm.addPlayer({ name: data.name, skin: data.skin }, 'p');
    
    // Add bot players
    game.pm.addPlayer({ name: 'Bot 1', skin: 1 }, data.diff);
    game.pm.addPlayer({ name: 'Bot 2', skin: 2 }, data.diff);
    game.pm.addPlayer({ name: 'Bot 3', skin: 3 }, data.diff);
    
    game.start();
    io.emit('startBotGame');
    io.emit('refresh', game);
  });
  
  // Handle player leaving
  socket.on('leaveSocket', (name) => {
    if (name) {
      log.write(`${name} left the game`);
      game.pm.deletePlayer(name);
      
      // Add leave message
      const smsg = {
        'msg': `${name} left the game!`,
        'sender': 'Server'
      };
      messages.push(smsg);
      io.emit('sendmessageFromSocket', messages);
      io.emit('refresh', game);
    }
  });
  
  // Game action handlers
  socket.on('dice', dice);
  socket.on('tripleDouble', () => {
    tripleDouble();
    io.emit('notBuying');
  });
  socket.on('buyAccept', () => {
    game.buy();
    io.emit('refresh', game);
  });
  socket.on('sell', (field) => {
    game.sell(field);
    io.emit('refresh', game);
  });
  socket.on('destroy', (field) => {
    game.destroy(field);
    io.emit('refresh', game);
  });
  socket.on('upgrade', (field) => {
    game.upgrade(field);
    io.emit('refresh', game);
  });
  socket.on('nextTurn', next);
  socket.on('lose', (name) => {
    lose(name);
    io.emit('refresh', game);
  });
  socket.on('useFreeCard', () => {
    // Free card implementation
    io.emit('refresh', game);
  });
  socket.on('useFreeJail', () => {
    // Free jail implementation
    io.emit('refresh', game);
  });
  
  // Disconnect handler
  socket.on('disconnect', () => {
    log.write('A user disconnected');
  });
});

// Start the server
httpServer.listen(SERVER_PORT, SERVER_HOST, () => {
  log.write(`Server running at http://${SERVER_HOST}:${SERVER_PORT}`);
});
