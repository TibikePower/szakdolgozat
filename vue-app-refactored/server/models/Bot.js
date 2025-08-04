import Player from './Player.js';

/**
 * Bot class representing an AI player
 * @extends Player
 */
export default class Bot extends Player {
  /**
   * Create a new Bot player
   * @param {string} name - Bot name
   * @param {string|number} skin - Bot skin/avatar
   * @param {string} status - Bot status
   * @param {number} level - Bot difficulty level
   */
  constructor(name, skin, status, level) {
    super(name, skin, status);
    this._level = level;
    this._type = 'bot';
    
    // Bot action tracking properties
    this._isUsedDice = false;
    this._doubleDice = 0;
    this._jaillimit = 5000 + (this.level - 1) * 1500;
    this._upgradeIndex = 0;
    this._destroyIndex = 0;
    this._tradeIndex = 0;
    this._rejects = 0;
  }
  
  /**
   * @returns {number} Bot level/difficulty
   */
  get level() {
    return this._level;
  }
  
  /**
   * @returns {number} Jail money limit
   */
  get jaillimit() {
    return this._jaillimit;
  }
  
  /**
   * @returns {number} Double dice counter
   */
  get doubleDice() {
    return this._doubleDice;
  }
  
  /**
   * @param {number} d - Set double dice counter
   */
  set doubleDice(d) {
    this._doubleDice = d;
  }
  
  /**
   * @returns {boolean} Whether dice was used
   */
  get isUsedDice() {
    return this._isUsedDice;
  }
  
  /**
   * @param {boolean} d - Set dice used status
   */
  set isUsedDice(d) {
    this._isUsedDice = d;
  }
  
  /**
   * @returns {number} Upgrade index
   */
  get upgradeIndex() {
    return this._upgradeIndex;
  }
  
  /**
   * @param {number} idx - Set upgrade index
   */
  set upgradeIndex(idx) {
    this._upgradeIndex = idx;
  }
  
  /**
   * @returns {number} Destroy index
   */
  get destroyIndex() {
    return this._destroyIndex;
  }
  
  /**
   * @param {number} idx - Set destroy index
   */
  set destroyIndex(idx) {
    this._destroyIndex = idx;
  }
  
  /**
   * @returns {number} Trade index
   */
  get tradeIndex() {
    return this._tradeIndex;
  }
  
  /**
   * @param {number} idx - Set trade index
   */
  set tradeIndex(idx) {
    this._tradeIndex = idx;
  }
  
  /**
   * @returns {number} Rejection counter
   */
  get rejects() {
    return this._rejects;
  }
  
  /**
   * @param {number} r - Set rejection counter
   */
  set rejects(r) {
    this._rejects = r;
  }
  
  /**
   * Abstract method to calculate bot's next action
   * @param {Object} game - Game state
   * @returns {string} Action to take
   */
  calcBotNextAction(game) {
    throw new Error('Bot subclass must implement calcBotNextAction');
  }
  
  /**
   * Count property groups owned by bot
   * @param {Object} game - Game state
   * @returns {number} Group count
   */
  countGroup(game) {
    throw new Error('Bot subclass must implement countGroup');
  }
  
  /**
   * Check if bot accepts trade
   * @param {number} pay - Payment amount
   * @param {number} selectedFieldIndex - Field index for trade
   * @param {Object} game - Game state
   * @returns {boolean} Whether trade is accepted
   */
  isTradeAccept(pay, selectedFieldIndex, game) {
    throw new Error('Bot subclass must implement isTradeAccept');
  }
  
  /**
   * Set bot parameters
   * @param {Object} parameters - Bot parameters
   */
  parameters(parameters) {
    throw new Error('Bot subclass must implement parameters');
  }
}
