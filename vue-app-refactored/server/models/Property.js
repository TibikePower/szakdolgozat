import Field from './Field.js';

/**
 * Property class extending Field with ownership functionality
 * @extends Field
 */
export default class Property extends Field {
  /**
   * Create a new property on the game board
   * @param {number} field - Field position index
   * @param {string} name - Field name
   * @param {number} price - Field purchase price
   * @param {number} group - Field group/category
   * @param {number} upgradeCost - Cost to upgrade the field
   * @param {number} payment - Base payment when landing on this field
   */
  constructor(field, name, price, group, upgradeCost, payment) {
    super(field, name, price, group, upgradeCost, payment);
    this._owner = '';
  }
  
  /**
   * @returns {string} Current property owner
   */
  get owner() {
    return this._owner;
  }
  
  /**
   * @param {string} o - Set property owner
   */
  set owner(o) {
    this._owner = o;
  }
}
