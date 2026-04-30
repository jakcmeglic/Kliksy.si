/// <reference types="vite/client" />

interface Window {
  fbq: (type: string, eventName: string, parameters?: object) => void;
  _fbq: any;
}
