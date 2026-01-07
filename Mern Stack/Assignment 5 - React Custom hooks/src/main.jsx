import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Rendering without StrictMode to avoid double-invoking effects (prevents flicker in this demo).
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
