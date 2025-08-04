/**
 * Table class handling game board positions
 */
export default class Table {
  /**
   * Create a new game table
   */
  constructor() {
    /**
     * Field positions on the game board
     * @type {Array<Array<number>>}
     */
    this.fieldPos = [
      [522, 542],
      [476, 542],
      [428, 542],
      [382, 542],
      [336, 542],
      [290, 542],
      [246, 542],
      [199, 542],
      [153, 542],
      [105, 542],
      [30, 542],   // Corner
      [30, 470],
      [30, 423],
      [30, 377],
      [30, 330],
      [30, 285],
      [30, 240],
      [30, 193],
      [30, 146],
      [30, 99],
      [30, 30],    // Corner
      [105, 30],
      [152, 30],
      [199, 30],
      [246, 30],
      [290, 30],
      [336, 30],
      [382, 30],
      [428, 30],
      [475, 30],
      [545, 30],   // Corner
      [545, 99],
      [545, 146],
      [545, 193],
      [545, 240],
      [545, 285],
      [545, 330],
      [545, 377],
      [545, 423],
      [545, 470]
    ];
    
    /**
     * Player positions on the board
     * @type {Array<Array<number>>}
     */
    this._playerPosition = [
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0]
    ];
    
    /**
     * Currently active field
     * @type {string}
     */
    this._activeField = 'start';
  }
  
  /**
   * Get player positions
   * @returns {Array<Array<number>>} Array of player positions
   */
  get playerPosition() {
    return this._playerPosition;
  }
  
  /**
   * Get active field
   * @returns {string} Active field name
   */
  get activeField() {
    return this._activeField;
  }
  
  /**
   * Set player positions
   * @param {Array<Array<number>>} p - New player positions
   */
  set playerPosition(p) {
    this._playerPosition = p;
  }
  
  /**
   * Set active field
   * @param {string} a - New active field
   */
  set activeField(a) {
    this._activeField = a;
  }
}
