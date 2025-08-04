/**
 * Log utility class for server logging
 */
export default class Log {
  /**
   * @param {string} name - Logger name
   */
  constructor(name) {
    this._name = name;
    this._isActive = false;
  }
  
  /**
   * @returns {string} Logger name
   */
  get name() {
    return this._name;
  }
  
  /**
   * @returns {boolean} Whether logging is active
   */
  get isActive() {
    return this._isActive;
  }
  
  /**
   * Activate the logger
   */
  activate() {
    this._isActive = true;
  }
  
  /**
   * Deactivate the logger
   */
  deactivate() {
    this._isActive = false;
  }
  
  /**
   * Write a log message if the logger is active
   * @param {string} text - Message to log
   */
  write(text) {
    if (this.isActive) {
      const [hour, minute, second] = new Date().toLocaleTimeString("en-US").split(/:| /);
      console.log(`[ ${hour}:${minute}:${second} ][ ${this.name} ]: ${text}`);
    }
  }
}
