import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n';

window.addEventListener('error', (event) => {
  const root = document.getElementById('root');
  if (root && root.innerHTML === '') {
    root.innerHTML = `<div style="padding: 40px; font-family: sans-serif; color: #990000; word-break: break-all;">
      <h2 style="font-weight: bold; margin-bottom: 10px;">Zaznali smo napako pri nalaganju aplikacije</h2>
      <p style="margin-bottom: 20px;">Predlagamo, da osvežite stran ali počistite predpomnilnik (cache).</p>
      <code>${event.message}</code>
      <br/><br/>
      <button style="padding: 10px 20px; background: #000; color: #fff; border-radius: 8px; border: none; cursor: pointer;" onclick="localStorage.clear(); sessionStorage.clear(); window.location.reload();">
        Počisti predpomnilnik in osveži
      </button>
    </div>`;
  }
});

window.addEventListener('unhandledrejection', (event) => {
  const root = document.getElementById('root');
  if (root && root.innerHTML === '') {
    root.innerHTML = `<div style="padding: 40px; font-family: sans-serif; color: #990000; word-break: break-all;">
      <h2 style="font-weight: bold; margin-bottom: 10px;">Zaznali smo napako pri nalaganju aplikacije (Promise)</h2>
      <p style="margin-bottom: 20px;">Predlagamo, da osvežite stran ali počistite predpomnilnik (cache).</p>
      <code>${event.reason}</code>
      <br/><br/>
      <button style="padding: 10px 20px; background: #000; color: #fff; border-radius: 8px; border: none; cursor: pointer;" onclick="localStorage.clear(); sessionStorage.clear(); window.location.reload();">
        Počisti predpomnilnik in osveži
      </button>
    </div>`;
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
