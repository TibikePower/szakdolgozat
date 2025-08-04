/**
 * Trade class representing a trading proposal between players
 */
export default class Trade {
  /**
   * Create a new trade proposal
   * @param {string} p1name - Player 1 name
   * @param {string} p2name - Player 2 name
   * @param {number} p1money - Player 1 money offer
   * @param {number} p2money - Player 2 money offer
   * @param {Array} p1fields - Player 1 offered fields
   * @param {Array} p2fields - Player 2 offered fields
   * @param {number} p1freecard - Player 1 offered free cards
   * @param {number} p2freecard - Player 2 offered free cards
   */
  constructor(p1name, p2name, p1money, p2money, p1fields, p2fields, p1freecard, p2freecard) {
    this._p1name = p1name;
    this._p1money = p1money;
    this._p1fields = p1fields;
    this._p1freecard = p1freecard;
    this._p2name = p2name;
    this._p2money = p2money;
    this._p2fields = p2fields;
    this._p2freecard = p2freecard;
    this._p1accept = true; // Initiator automatically accepts
    this._p2accept = false;
  }
  
  /**
   * @returns {string} Player 1 name
   */
  get p1name() {
    return this._p1name;
  }
  
  /**
   * @returns {number} Player 1 money offer
   */
  get p1money() {
    return this._p1money;
  }
  
  /**
   * @returns {Array} Player 1 offered fields
   */
  get p1fields() {
    return this._p1fields;
  }
  
  /**
   * @returns {number} Player 1 offered free cards
   */
  get p1freecard() {
    return this._p1freecard;
  }
  
  /**
   * @returns {boolean} Player 1 acceptance status
   */
  get p1accept() {
    return this._p1accept;
  }
  
  /**
   * @returns {string} Player 2 name
   */
  get p2name() {
    return this._p2name;
  }
  
  /**
   * @returns {number} Player 2 money offer
   */
  get p2money() {
    return this._p2money;
  }
  
  /**
   * @returns {Array} Player 2 offered fields
   */
  get p2fields() {
    return this._p2fields;
  }
  
  /**
   * @returns {number} Player 2 offered free cards
   */
  get p2freecard() {
    return this._p2freecard;
  }
  
  /**
   * @returns {boolean} Player 2 acceptance status
   */
  get p2accept() {
    return this._p2accept;
  }
  
  /**
   * @param {boolean} p - Set player 2 acceptance status
   */
  set p2accept(p) {
    this._p2accept = p;
  }
  
  /**
   * @param {boolean} p - Set player 1 acceptance status
   */
  set p1accept(p) {
    this._p1accept = p;
  }
}
