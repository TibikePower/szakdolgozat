import Player from './Player.js';
import BotEasy from './BotEasy.js';
import BotMedium from './BotMedium.js';
import BotHard from './BotHard.js';
import Log from '../utils/Log.js';

/**
 * PlayerManager class managing players in the game
 */
export default class PlayerManager {
  /**
   * Create a new player manager
   */
  constructor() {
    /**
     * Array of players
     * @type {Array<Player|Bot>}
     */
    this._players = [];
    
    /**
     * Host player name
     * @type {string}
     */
    this._hostName = '';
    
    /**
     * Whether a host exists
     * @type {boolean}
     */
    this._isHaveHost = false;
    
    /**
     * Ranking list of players
     * @type {Array<string>}
     */
    this._rankList = [];
    
    /**
     * Logger
     * @type {Log}
     */
    this._log = new Log('PLAYER_MANAGER');
  }
  
  /**
   * @returns {Log} Logger
   */
  get log() {
    return this._log;
  }
  
  /**
   * @returns {Array<Player|Bot>} Players array
   */
  get players() {
    return this._players;
  }
  
  /**
   * @returns {string} Host player name
   */
  get hostName() {
    return this._hostName;
  }
  
  /**
   * @returns {boolean} Whether a host exists
   */
  get isHaveHost() {
    return this._isHaveHost;
  }
  
  /**
   * @returns {Array<string>} Player ranking list
   */
  get rankList() {
    return this._rankList;
  }
  
  /**
   * @param {Array<string>} r - Set ranking list
   */
  set rankList(r) {
    this._rankList = r;
  }
  
  /**
   * @param {Array<Player|Bot>} p - Set players array
   */
  set players(p) {
    this._players = p;
  }
  
  /**
   * Add player to ranking list
   * @param {string} name - Player name
   */
  addRankList(name) {
    this._rankList.push(name);
  }
  
  /**
   * Find player index by name
   * @param {string} name - Player name
   * @returns {number} Player index
   */
  playerIndex(name) {
    for (let i = 0; i < this.players.length; i++) {
      if (name === this.players[i].name) {
        return i;
      }
    }
    return -1;
  }
  
  /**
   * Add a player to the game
   * @param {Object} player - Player data
   * @param {string} type - Player type ('p' for human, 'e'/'m'/'h' for bot difficulty)
   */
  addPlayer(player, type) {
    let p;
    
    if (type === 'p') {
      p = new Player(player.name, player.skin, '');
      
      // Make first player the host
      if (!this._isHaveHost) {
        this._hostName = p.name;
        this._isHaveHost = true;
      }
    } else if (type === 'e') {
      p = new BotEasy(player.name, player.skin, '');
    } else if (type === 'm') {
      p = new BotMedium(player.name, player.skin, '');
    } else if (type === 'h') {
      p = new BotHard(player.name, player.skin, '');
    }
    
    this.players.push(p);
    this._log.write(`Player added: ${p.name} (${type})`);
  }
  
  /**
   * Delete a player
   * @param {string} playerName - Player name
   */
  deletePlayer(playerName) {
    const index = this.playerIndex(playerName);
    
    if (index !== -1) {
      // Check if the player is the host
      if (this._hostName === playerName) {
        this._isHaveHost = false;
        
        // Find new host if there are players left
        if (this._players.length > 1) {
          for (let i = 0; i < this._players.length; i++) {
            if (i !== index && this._players[i].type === 'player') {
              this._hostName = this._players[i].name;
              this._isHaveHost = true;
              break;
            }
          }
        }
      }
      
      this._players.splice(index, 1);
      this._log.write(`Player removed: ${playerName}`);
    }
  }
  
  /**
   * Set a player as active
   * @param {number} id - Player index
   */
  activePlayer(id) {
    for (let i = 0; i < this._players.length; i++) {
      this._players[i].isActive = (i === id);
    }
  }
}
