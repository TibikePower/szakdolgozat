/**
 * Player model for client-side representation
 */

export default class Player {
  /**
   * Create a new player
   * @param {string} name - Player name
   * @param {string|number} skin - Player skin/avatar
   * @param {string} status - Player status
   */
  constructor(name = '', skin = '', status = '') {
    this._name = name;
    this._skin = skin;
    this._status = status;
    this._isActive = false;
    this._money = 0;
    this._field = null;
    this._jailtime = -1;
    this._freecard = 0;
    this._type = 'player';
  }
  
  /**
   * @returns {string} Player type ('player' or 'bot')
   */
  get type() {
    return this._type;
  }
  
  /**
   * @returns {string} Player name
   */
  get name() {
    return this._name;
  }
  
  /**
   * @returns {string|number} Player skin/avatar
   */
  get skin() {
    return this._skin;
  }
  
  /**
   * @returns {string} Player status
   */
  get status() {
    return this._status;
  }
  
  /**
   * @returns {boolean} Whether player is active
   */
  get isActive() {
    return this._isActive;
  }
  
  /**
   * @returns {number} Player money
   */
  get money() {
    return this._money;
  }
  
  /**
   * @returns {number|null} Player field position
   */
  get field() {
    return this._field;
  }
  
  /**
   * @returns {number} Jail time remaining
   */
  get jailtime() {
    return this._jailtime;
  }
  
  /**
   * @returns {number} Free cards count
   */
  get freecard() {
    return this._freecard;
  }
  
  /**
   * Update player data from server
   * @param {object} data - Player data from server
   */
  updateFromServer(data) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
