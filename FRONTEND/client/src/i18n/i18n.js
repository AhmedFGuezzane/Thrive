import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en/translation.json';
import fr from './locales/fr/translation.json';
import es from './locales/es/translation.json';
import ar from './locales/ar/translation.json';
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      es: { translation: es },
      ar: { translation: ar }
    },
    interpolation: {
      escapeValue: false, // react already does escaping
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
