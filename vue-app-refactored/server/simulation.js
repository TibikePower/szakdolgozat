import Game from './models/Game.js';
import Log from './utils/Log.js';
import BotEasy from './models/BotEasy.js';
import BotMedium from './models/BotMedium.js';
import BotHard from './models/BotHard.js';

// Initialize game and logs
const game = new Game();
const log = new Log('SIMULATION');

// Enable logging
log.activate();

// Simulation configuration
const TURNS = 1000;
const FITNESS_COUNT = 10;
const ROUND_LIMIT = 200;

// Statistical tracking
let full_turns = 0;
let avg_rounds = 0;
let ranks = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
];
let firstStart = [0, 0, 0, 0];

/**
 * Roll dice for current player
 */
function dice() {
  game.useDice();
  game.checkField();
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
 * Fix player status if needed
 */
function correction() {
  for (let i = 0; i < game.pm.players.length; i++) {
    if (game.pm.players[i].isActive === true) {
      if (game.pm.players[i].status === 'lose') {
        let j = i + 1;
        let ok = false;
        
        while (!ok) {
          if (j >= game.pm.players.length) {
            j = 0;
          }
          
          if (game.pm.players[j].status !== 'lose') {
            game.pm.players[i].isActive = false;
            game.pm.players[j].isActive = true;
            ok = true;
          } else {
            j++;
          }
        }
      }
    }
  }
}

/**
 * Check for active player errors
 * @returns {boolean} True if there's an error
 */
function error() {
  // Count active players
  let activeCount = 0;
  for (let i = 0; i < game.pm.players.length; i++) {
    if (game.pm.players[i].isActive) {
      activeCount++;
    }
  }
  
  return activeCount !== 1;
}

/**
 * Move to next player's turn
 */
function next() {
  game.nextTurn();
  
  if (game.rounds === ROUND_LIMIT) {
    game.losers = 2;
    lose();
  }
  
  correction();
  
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

/**
 * Start a bot-only game simulation
 */
function botGame() {
  game = new Game();
  game.botStart();
  callBot(game.firstIndex);
}

/**
 * Find property owner in a group
 * @param {string} name - Player name
 * @param {number} group - Property group
 * @returns {string} Owner name or 'none'
 */
function selectOwner(name, group) {
  for (let i = 0; i < game.fm.props.length; i++) {
    if (game.fm.props[i].group === group && game.fm.props[i].owner !== name) {
      if (game.fm.props[i].owner === '') {
        return 'none';
      } else {
        return game.fm.props[i].owner;
      }
    }
  }
  return 'none';
}

/**
 * Find field index in a group
 * @param {string} name - Player name
 * @param {number} group - Property group
 * @returns {number} Field index
 */
function selectField(name, group) {
  for (let i = 0; i < game.fm.props.length; i++) {
    if (game.fm.props[i].group === group && game.fm.props[i].owner !== name) {
      return i;
    }
  }
  return -1;
}

/**
 * Handle bot player turn
 * @param {number} index - Bot player index
 */
function callBot(index) {
  // Bot turn handling implementation
  log.write("========================");
  log.write(`[ BOT - ${index} ]: ${game.pm.players[index].name} is next.`);
  
  let exit = false;
  let eAction = '';
  
  do {
    const bAction = game.pm.players[index].calcBotNextAction(game);
    eAction = bAction;
    
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
        eAction = 'tripleDouble';
      }
    } else if (bAction === 'nextTurn' || bAction === 'lose' || bAction === 'tripleDouble') {
      exit = true;
    }
    
    // Handle other actions
    // This is a simplified version - full implementation would include all action types
    
  } while (!exit);
  
  // Handle end of bot turn
  if (eAction === 'nextTurn') {
    game.pm.players[index].upgradeIndex = 0;
    game.pm.players[index].destroyIndex = 0;
    game.pm.players[index].tradeIndex = 0;
    game.pm.players[index].rejects = 0;
    next();
  } else if (eAction === 'lose') {
    log.write(`[ BOT - ${index} ]: ${game.pm.players[index].name} went bankrupt.`);
    lose(game.pm.players[index].name);
  } else if (eAction === 'tripleDouble') {
    tripleDouble();
  }
}

/**
 * Update ranking statistics
 */
function changeRanks() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < game.pm.players.length; j++) {
      if (game.pm.players[j].name === game.pm.rankList[i]) {
        ranks[i][j]++;
      }
    }
  }
}

/**
 * Write ranking statistics
 */
function writeRanks() {
  console.log("========================");
  console.log(`\t${game.pm.players[0].name}\t${game.pm.players[1].name}\t${game.pm.players[2].name}\t${game.pm.players[3].name}`);
  
  for (let i = 0; i < 4; i++) {
    console.log(`${i + 1}\t${ranks[i][0]}\t${ranks[i][1]}\t${ranks[i][2]}\t${ranks[i][3]}`);
  }
}

/**
 * Update first player statistics
 */
function changeFirstData() {
  firstStart[game.firstIndex]++;
}

/**
 * Write first player statistics
 */
function writeFirstData() {
  console.log("========================");
  console.log("1.\t2.\t3.\t4.");
  console.log(`${firstStart[0]}\t${firstStart[1]}\t${firstStart[2]}\t${firstStart[3]}`);
}

/**
 * Calculate fitness score
 * @returns {number} Fitness score
 */
function fitness() {
  return ranks[0][0] * 4 + ranks[1][0] * 1 + ranks[2][0] * 0.25 + ranks[3][0] * 0.125;
}

/**
 * Run simulation with parameter variations
 */
function runSimulation() {
  let fMax = 0;
  let fMaxNum = 0;
  
  // Test different trade rate parameters
  for (let c = 1.0; c <= 2.0; c += 0.1) {
    let fValue = 0;
    
    // Run multiple fitness evaluations
    for (let l = 0; l < FITNESS_COUNT; l++) {
      // Run many games
      for (let g = 0; g < TURNS; g++) {
        botGame();
        
        // Set parameters for the first bot
        const p1_parameters = {
          name: 'First',
          tradeRate: c, // Parameter being tested
          tradeIncrement: 0.2,
          maxRejectCount: 5,
          maxUpgradeCount: 5,
          minMoneyAfterTrade: 0,
          minMoneyAfterBuy: 0,
          stayInJailRound: 10,
          needBusiness: false,
          needService: false
        };
        
        game.pm.players[0].parameters(p1_parameters);
        
        if (game.rounds < ROUND_LIMIT) {
          full_turns++;
          avg_rounds += game.rounds;
          changeRanks();
          changeFirstData();
        }
      }
      
      // Calculate fitness for this run
      fValue += fitness();
      
      // Reset ranks for next fitness evaluation
      ranks = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
    }
    
    // Report results for this parameter value
    const avgFitness = fValue / FITNESS_COUNT;
    console.log(`Parameter ${c.toFixed(1)} result: ${avgFitness.toFixed(2)}`);
    
    // Track best parameter value
    if (avgFitness > fMax) {
      fMax = avgFitness;
      fMaxNum = c;
    }
  }
  
  // Report overall results
  console.log(`Best result: ${fMax.toFixed(2)} with parameter ${fMaxNum.toFixed(1)}`);
  console.log(`Total games: ${full_turns}`);
  console.log(`Average game length: ${(avg_rounds / full_turns).toFixed(2)} rounds`);
}

// Start the simulation
runSimulation();
