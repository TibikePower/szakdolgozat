/**
 * Application Configuration
 * 
 * This file contains configuration settings for the client application.
 * Values can be overridden with environment variables.
 */

export const serverConfig = {
  // Socket.IO server URL with fallback to environment variable or localhost
  socketUrl: import.meta.env.VITE_SOCKET_URL || process.env.VUE_APP_SOCKET_URL || 'http://localhost:3000',
  
  // API base URL if needed
  apiUrl: import.meta.env.VITE_API_URL || process.env.VUE_APP_API_URL || 'http://localhost:3000/api',
  
  // Other configuration settings can be added here
  debugMode: import.meta.env.VITE_DEBUG_MODE === 'true' || process.env.VUE_APP_DEBUG_MODE === 'true' || false,
};

export const gameConfig = {
  // Game-specific configuration settings
  defaultMoney: 1500,
  maxPlayers: 8,
  // Add other game configuration as needed
};
