/**
 * Field Manager for client-side state management
 */

export default class FieldManager {
  /**
   * Create a new field manager
   */
  constructor() {
    this._props = [];  // Properties will be populated from server
    this._b1Owner = '';
    this._b2Owner = '';
    this._b3Owner = '';
    this._b4Owner = '';
    this._eOwner = '';
    this._wOwner = '';
    this._crowns = 0;
    this._stars = 0;
  }

  /**
   * @returns {string} Business 1 owner
   */
  get b1Owner() {
    return this._b1Owner;
  }

  /**
   * @returns {string} Business 2 owner
   */
  get b2Owner() {
    return this._b2Owner;
  }

  /**
   * @returns {string} Business 3 owner
   */
  get b3Owner() {
    return this._b3Owner;
  }

  /**
   * @returns {string} Business 4 owner
   */
  get b4Owner() {
    return this._b4Owner;
  }

  /**
   * @returns {string} Electricity owner
   */
  get eOwner() {
    return this._eOwner;
  }

  /**
   * @returns {string} Water owner
   */
  get wOwner() {
    return this._wOwner;
  }

  /**
   * @returns {Array} Properties
   */
  get props() {
    return this._props;
  }

  /**
   * @returns {number} Crown upgrades
   */
  get crowns() {
    return this._crowns;
  }

  /**
   * @returns {number} Star upgrades
   */
  get stars() {
    return this._stars;
  }

  /**
   * @param {number} c - Set crowns
   */
  set crowns(c) {
    this._crowns = c;
  }

  /**
   * @param {number} s - Set stars
   */
  set stars(s) {
    this._stars = s;
  }

  /**
   * @param {string} o - Set business 1 owner
   */
  set b1Owner(o) {
    this._b1Owner = o;
  }

  /**
   * @param {string} o - Set business 2 owner
   */
  set b2Owner(o) {
    this._b2Owner = o;
  }

  /**
   * @param {string} o - Set business 3 owner
   */
  set b3Owner(o) {
    this._b3Owner = o;
  }

  /**
   * @param {string} o - Set business 4 owner
   */
  set b4Owner(o) {
    this._b4Owner = o;
  }

  /**
   * @param {string} o - Set electricity owner
   */
  set eOwner(o) {
    this._eOwner = o;
  }

  /**
   * @param {string} o - Set water owner
   */
  set wOwner(o) {
    this._wOwner = o;
  }

  /**
   * Choose a field by index
   * @param {number} field - Field index
   * @returns {object|null} Field if found
   */
  chooseField(field) {
    return this._props.find(prop => prop._field === field) || null;
  }

  /**
   * Update field manager data from server
   * @param {object} data - Field manager data from server
   */
  updateFromServer(data) {
    if (data) {
      if (data._props) this._props = data._props;
      if (data._b1Owner !== undefined) this._b1Owner = data._b1Owner;
      if (data._b2Owner !== undefined) this._b2Owner = data._b2Owner;
      if (data._b3Owner !== undefined) this._b3Owner = data._b3Owner;
      if (data._b4Owner !== undefined) this._b4Owner = data._b4Owner;
      if (data._eOwner !== undefined) this._eOwner = data._eOwner;
      if (data._wOwner !== undefined) this._wOwner = data._wOwner;
      if (data._crowns !== undefined) this._crowns = data._crowns;
      if (data._stars !== undefined) this._stars = data._stars;
    }
  }
}
