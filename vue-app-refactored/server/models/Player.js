/**
 * Player class representing a game participant
 */
export default class Player {
  /**
   * Create a new player
   * @param {string} name - Player's name
   * @param {string|number} skin - Player's chosen skin/avatar
   * @param {string} status - Player's status
   */
  constructor(name, skin, status) {
    this._name = name;
    this._skin = skin;
    this._status = status;
    this._isActive = false;
    this._money = -999999;
    this._field = null;
    this._jailtime = -1;
    this._freecard = 0;
    this._type = 'player';
  }
  
  /**
   * @returns {string} Player type
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
   * @returns {number} Player's money
   */
  get money() {
    return this._money;
  }
  
  /**
   * @returns {number|null} Player's field position
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
   * @returns {number} Free cards
   */
  get freecard() {
    return this._freecard;
  }
  
  /**
   * @param {string} n - Set player name
   */
  set name(n) {
    this._name = n;
  }
  
  /**
   * @param {string|number} s - Set player skin
   */
  set skin(s) {
    this._skin = s;
  }
  
  /**
   * @param {string} s - Set player status
   */
  set status(s) {
    this._status = s;
  }
  
  /**
   * @param {boolean} a - Set player active state
   */
  set isActive(a) {
    this._isActive = a;
  }
  
  /**
   * @param {number} m - Set player money
   */
  set money(m) {
    this._money = m;
  }
  
  /**
   * @param {number} f - Set player field
   */
  set field(f) {
    this._field = f;
  }
  
  /**
   * @param {number} j - Set player jail time
   */
  set jailtime(j) {
    this._jailtime = j;
  }
  
  /**
   * @param {number} f - Set player free cards
   */
  set freecard(f) {
    this._freecard = f;
  }
}
