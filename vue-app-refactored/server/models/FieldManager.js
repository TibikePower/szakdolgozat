import Property from './Property.js';

/**
 * FieldManager class managing the game board fields
 */
export default class FieldManager {
  /**
   * Create a new field manager
   */
  constructor() {
    /**
     * Array of property objects
     * @type {Array<Property>}
     */
    this._props = [
      // Field, Name, Price, Group, Upgrade cost, Payments
      new Property(1, "Uhu", 6000, 0, 5000, [200, 1000, 3000, 9000, 16000, 25000]),
      new Property(3, "Hóbagoly", 6000, 0, 5000, [400, 2000, 6000, 18000, 32000, 45000]),
      new Property(6, "Jegesmedve", 10000, 1, 5000, [600, 3000, 9000, 27000, 40000, 55000]),
      new Property(8, "Pingvin", 10000, 1, 5000, [600, 3000, 9000, 27000, 40000, 55000]),
      new Property(9, "Fóka", 12000, 1, 5000, [800, 4000, 10000, 30000, 45000, 60000]),
      new Property(11, "Szurikáta", 14000, 2, 10000, [1000, 5000, 15000, 45000, 62500, 75000]),
      new Property(13, "Sivatagi róka", 14000, 2, 10000, [1000, 5000, 15000, 45000, 62500, 75000]),
      new Property(14, "Teve", 16000, 2, 10000, [1200, 6000, 18000, 50000, 70000, 90000]),
      new Property(16, "Oroszlán", 18000, 3, 10000, [1400, 7000, 20000, 55000, 75000, 95000]),
      new Property(18, "Tigris", 18000, 3, 10000, [1400, 7000, 20000, 55000, 75000, 95000]),
      new Property(19, "Jaguár", 20000, 3, 10000, [1600, 8000, 22000, 60000, 80000, 100000]),
      new Property(21, "Alpaka", 22000, 4, 15000, [1800, 9000, 25000, 70000, 87500, 105000]),
      new Property(23, "Zebra", 22000, 4, 15000, [1800, 9000, 25000, 70000, 87500, 105000]),
      new Property(24, "Láma", 24000, 4, 15000, [2000, 10000, 30000, 75000, 92500, 110000]),
      new Property(26, "Pávián", 26000, 5, 15000, [2200, 11000, 33000, 80000, 97500, 115000]),
      new Property(27, "Gorilla", 26000, 5, 15000, [2200, 11000, 33000, 80000, 97500, 115000]),
      new Property(29, "Csimpánz", 28000, 5, 15000, [2400, 12000, 36000, 85000, 102500, 120000]),
      new Property(31, "Piton", 30000, 6, 20000, [2600, 13000, 39000, 90000, 110000, 127500]),
      new Property(32, "Vipera", 30000, 6, 20000, [2600, 13000, 39000, 90000, 110000, 127500]),
      new Property(34, "Királysikló", 32000, 6, 20000, [2800, 15000, 45000, 100000, 120000, 140000]),
      new Property(37, "Elefánt", 35000, 7, 20000, [3500, 17500, 50000, 110000, 130000, 150000]),
      new Property(39, "Krokodil", 40000, 7, 20000, [5000, 20000, 60000, 140000, 170000, 200000])
    ];
    
    /**
     * Track special field owners
     */
    this._eOwner = "";
    this._wOwner = "";
    this._b1Owner = "";
    this._b2Owner = "";
    this._b3Owner = "";
    this._b4Owner = "";
    
    /**
     * Upgrade materials
     */
    this._stars = 32;
    this._crowns = 12;
    
    /**
     * Currently active property index
     * @type {number}
     */
    this._activePropertyIndex = -1;
    
    /**
     * Buy price for the active property
     * @type {number}
     */
    this._buyPrice = 0;
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
   * @returns {string} Electric company owner
   */
  get eOwner() {
    return this._eOwner;
  }
  
  /**
   * @returns {string} Water company owner
   */
  get wOwner() {
    return this._wOwner;
  }
  
  /**
   * @returns {Array<Property>} Properties array
   */
  get props() {
    return this._props;
  }
  
  /**
   * @returns {number} Crowns count
   */
  get crowns() {
    return this._crowns;
  }
  
  /**
   * @returns {number} Stars count
   */
  get stars() {
    return this._stars;
  }
  
  /**
   * @returns {number} Currently active property index
   */
  get activePropertyIndex() {
    return this._activePropertyIndex;
  }
  
  /**
   * @returns {number} Buy price for active property
   */
  get buyPrice() {
    return this._buyPrice;
  }
  
  /**
   * @param {number} c - Set crowns count
   */
  set crowns(c) {
    this._crowns = c;
  }
  
  /**
   * @param {number} s - Set stars count
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
   * @param {string} o - Set electric company owner
   */
  set eOwner(o) {
    this._eOwner = o;
  }
  
  /**
   * @param {string} o - Set water company owner
   */
  set wOwner(o) {
    this._wOwner = o;
  }
  
  /**
   * @param {number} idx - Set active property index
   */
  set activePropertyIndex(idx) {
    this._activePropertyIndex = idx;
  }
  
  /**
   * @param {number} price - Set buy price
   */
  set buyPrice(price) {
    this._buyPrice = price;
  }
  
  /**
   * Choose a field by position
   * @param {number} field - Field position
   * @returns {number} Index of the property or -1 if not found
   */
  chooseField(field) {
    for (let i = 0; i < this._props.length; i++) {
      if (this._props[i].field === field) {
        return i;
      }
    }
    return -1;
  }
}
