import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import mr from './locales/mr.json';

// Language resources
const resources = {
  en: { translation: en },
  mr: { translation: mr },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en', // fallback language if translation is missing
    compatibilityJSON: 'v4', // for React Native compatibility
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    react: {
      useSuspense: false, // important for React Native
    },
  });

export default i18n;

// Language options for the language selector
export const LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
];

