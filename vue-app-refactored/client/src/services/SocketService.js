/**
 * SocketService - A service for handling Socket.IO communications
 * 
 * This service encapsulates Socket.IO functionality to provide a cleaner API
 * for the Vue components to interact with the server.
 */

import { io } from 'socket.io-client';
import { serverConfig } from '../config/config';

class SocketService {
  constructor() {
    this.socket = null;
    this.callbacks = {};
  }

  /**
   * Connect to the socket server
   * @returns {object} The socket instance
   */
  connect() {
    if (!this.socket) {
      this.socket = io(serverConfig.socketUrl);
    }
    return this.socket;
  }

  /**
   * Disconnect from the socket server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Register an event listener
   * @param {string} event - Event name to listen for
   * @param {function} callback - Function to call when event occurs
   */
  on(event, callback) {
    if (!this.socket) {
      this.connect();
    }
    this.socket.on(event, callback);
    
    // Store callback for cleanup
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }

  /**
   * Remove an event listener
   * @param {string} event - Event name to remove listener for
   * @param {function} callback - Function to remove (optional, removes all if not provided)
   */
  off(event, callback) {
    if (!this.socket) return;
    
    if (callback) {
      this.socket.off(event, callback);
      
      // Remove specific callback from stored callbacks
      if (this.callbacks[event]) {
        this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
      }
    } else {
      this.socket.off(event);
      this.callbacks[event] = [];
    }
  }

  /**
   * Remove all event listeners
   */
  removeAllListeners() {
    if (!this.socket) return;
    
    Object.keys(this.callbacks).forEach(event => {
      this.socket.off(event);
    });
    this.callbacks = {};
  }

  /**
   * Emit an event to the server
   * @param {string} event - Event name to emit
   * @param {*} data - Data to send with the event
   * @param {function} callback - Optional callback for acknowledgement
   */
  emit(event, data, callback) {
    if (!this.socket) {
      this.connect();
    }
    if (callback) {
      this.socket.emit(event, data, callback);
    } else {
      this.socket.emit(event, data);
    }
  }

  /**
   * Get the raw socket instance (use sparingly)
   * @returns {object} The socket.io instance
   */
  getSocket() {
    if (!this.socket) {
      this.connect();
    }
    return this.socket;
  }
}

// Create a singleton instance
export default new SocketService();
