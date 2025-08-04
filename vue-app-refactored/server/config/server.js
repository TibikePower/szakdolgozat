/**
 * Server configuration
 */

export const SERVER_PORT = process.env.PORT || 3000;
export const SERVER_HOST = process.env.HOST || '0.0.0.0'; // Changed from hardcoded IP for better deployment options
export const DEBUG_MODE = process.env.DEBUG === 'true' || false;
