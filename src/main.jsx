import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { validateEnv } from './utils/envValidation'

try {
  validateEnv();

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
} catch (error) {
  console.error('Error during app initialization:', error);
  // You might want to render an error component here instead of the app
  ReactDOM.createRoot(document.getElementById('root')).render(
    <div>An error occurred during app initialization. Please check the console for more details.</div>
  )
}