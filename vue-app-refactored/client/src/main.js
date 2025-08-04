/**
 * Main application entry point
 * 
 * This file initializes the Vue application and mounts it to the DOM.
 */

import { createApp } from 'vue';
import App from './App.vue';
import './assets/css/main.css';

// Create and mount the Vue application
const app = createApp(App);

// Add any global properties, directives or plugins here
// app.config.globalProperties.$filters = filters;

// Mount the app to the DOM
app.mount('#app');
