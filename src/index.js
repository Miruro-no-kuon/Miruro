import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

//* Function to disable right click on website
/* window.addEventListener(
  'contextmenu',
  function (e) {
    e.preventDefault();
  },
  false
); */

// register the service worker
serviceWorkerRegistration.register();
