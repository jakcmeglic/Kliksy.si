import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Placeholder translations. For a production app, move these to JSON files.
const resources = {
  sl: {
    translation: {
      "hello": "Pozdravljeni"
    }
  },
  hr: {
    translation: {
      "hello": "Bok"
    }
  },
  pl: {
    translation: {
      "hello": "Cześć"
    }
  }
};

const getLanguageFromHostname = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname.includes('pl.getkliksy.com')) {
      return 'pl';
    }
    // Check if the current hostname includes 'hr.' or is exactly a croatian domain.
    if (hostname.includes('hr.getkliksy.com')) {
      return 'hr';
    }
  }
  return 'sl'; // Default to Slovenian
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getLanguageFromHostname(), 
    fallbackLng: 'sl',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
