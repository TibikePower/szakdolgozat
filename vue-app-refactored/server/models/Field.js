/**
 * Field class representing a board position
 */
export default class Field {
  /**
   * Create a new field on the game board
   * @param {number} field - Field position index
   * @param {string} name - Field name
   * @param {number} price - Field purchase price
   * @param {number} group - Field group/category
   * @param {number} upgradeCost - Cost to upgrade the field
   * @param {number} payment - Base payment when landing on this field
   */
  constructor(field, name, price, group, upgradeCost, payment) {
    this._field = field;
    this._name = name;
    this._price = price;
    this._group = group;
    this._upgradeCost = upgradeCost;
    this._upgrades = 0;
    this._payment = payment;
  }
  
  /**
   * @returns {number} Field index
   */
  get field() {
    return this._field;
  }
  
  /**
   * @returns {string} Field name
   */
  get name() {
    return this._name;
  }
  
  /**
   * @returns {number} Field price
   */
  get price() {
    return this._price;
  }
  
  /**
   * @returns {number} Field group/category
   */
  get group() {
    return this._group;
  }
  
  /**
   * @returns {number} Cost to upgrade
   */
  get upgradeCost() {
    return this._upgradeCost;
  }
  
  /**
   * @returns {number} Current upgrade level
   */
  get upgrades() {
    return this._upgrades;
  }
  
  /**
   * @returns {number} Payment when landing on field
   */
  get payment() {
    return this._payment;
  }
  
  /**
   * @param {number} u - Set upgrade level
   */
  set upgrades(u) {
    this._upgrades = u;
  }
}
