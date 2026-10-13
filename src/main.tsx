import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';
import { seedIfEmpty, runBilingualMigration } from './lib/storage.js';

// Initialize localStorage with default data and run bilingual migration if needed
seedIfEmpty();
runBilingualMigration();

// Register PWA service worker for 100% offline support
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('[PWA] New content available');
  },
  onOfflineReady() {
    console.log('[PWA] BakeLearn MM is ready for offline use');
  },
});

createRoot(document.getElementById('root')!).render(<App />);
