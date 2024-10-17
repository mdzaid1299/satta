import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(

  <Auth0Provider
    domain="dev-knpbai43o23nybkc.us.auth0.com"
    clientId="oKGfyum8MM67dIVnXzXRsfIqb1UwLeq7"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <App />
    </Auth0Provider>
 
);

