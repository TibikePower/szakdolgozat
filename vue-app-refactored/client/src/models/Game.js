/**
 * Game model for client-side state management
 */

import Player from './Player';
import FieldManager from './FieldManager';
import Table from './Table';

export default class Game {
  /**
   * Create a new game instance
   */
  constructor() {
    this._pm = null;          // PlayerManager (will be set by server)
    this._fm = null;          // FieldManager (will be set by server)
    this._table = new Table();
    this._dices = [1, 1];
    this._isStarted = false;
    this._isBuying = false;
    this._isLuckycard = false;
    this._losers = 0;
    this._rounds = 0;
    this._firstIndex = 0;
  }
  
  /**
   * @returns {number} Number of losers
   */
  get losers() {
    return this._losers;
  }
  
  /**
   * @returns {number} First player index
   */
  get firstIndex() {
    return this._firstIndex;
  }
  
  /**
   * @returns {number} Number of rounds played
   */
  get rounds() {
    return this._rounds;
  }
  
  /**
   * @returns {object} Player manager
   */
  get pm() {
    return this._pm;
  }
  
  /**
   * @returns {object} Field manager
   */
  get fm() {
    return this._fm;
  }
  
  /**
   * @returns {Array<number>} Dice values
   */
  get dices() {
    return this._dices;
  }
  
  /**
   * @returns {object} Game table
   */
  get table() {
    return this._table;
  }
  
  /**
   * @returns {boolean} Whether the game has started
   */
  get isStarted() {
    return this._isStarted;
  }
  
  /**
   * @returns {boolean} Whether the player can buy
   */
  get isBuying() {
    return this._isBuying;
  }
  
  /**
   * @returns {boolean} Whether the player landed on a lucky card
   */
  get isLuckycard() {
    return this._isLuckycard;
  }
  
  /**
   * Update the game state from server data
   * @param {object} data - Game state from server
   */
  updateFromServer(data) {
    // Copy all properties from server data
    Object.assign(this, data);
  }
}
