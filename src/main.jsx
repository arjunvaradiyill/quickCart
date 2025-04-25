import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import 'flowbite'

// Disable any service worker alerts or popups
const disableServiceWorkerAlerts = () => {
  // Prevent any installation prompts
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    console.log('Install prompt prevented');
    return false;
  });
  
  // Prevent any PWA add to home screen prompts
  window.addEventListener('appinstalled', (e) => {
    console.log('App installed event prevented');
  });
};

// Register minimal service worker only for Razorpay functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    disableServiceWorkerAlerts();
    
    // Unregister any existing service workers first
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.unregister();
        console.log('Service worker unregistered');
      });
    }).then(() => {
      // Register our minimal service worker
      navigator.serviceWorker.register('/sw.js', { 
        scope: '/',
        updateViaCache: 'none'
      })
      .then(registration => {
        console.log('Minimal service worker registered:', registration.scope);
      })
      .catch(error => {
        console.error('Service worker registration failed:', error);
      });
    });
  });
} else {
  disableServiceWorkerAlerts();
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
