import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Optimized Service Worker Registration
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Tactical Offline Mode: Active'))
      .catch(err => console.error('Offline Sync Failed:', err));
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)