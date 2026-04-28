import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { WebAdapter } from './src/adapters/WebAdapter';
import { ElectronAdapter } from './src/adapters/ElectronAdapter';
import { FileSystemAdapter } from './src/types/adapter';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

let adapter: FileSystemAdapter;

// Check if running in Electron
// We exposed 'window.electron' in preload.js
if (window.electron) {
  adapter = new ElectronAdapter();
} else {
  adapter = new WebAdapter();
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App adapter={adapter} />
  </React.StrictMode>
);