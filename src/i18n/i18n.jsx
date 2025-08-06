import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { en } from "./locales/en";
import { vi } from "./locales/vi";
import { es } from "./locales/es";
import { fr } from "./locales/fr";
import { ko } from "./locales/ko";
import { ja } from "./locales/ja";
import { zh } from "./locales/zh";
import { de } from "./locales/de";
import { ru } from "./locales/ru";
import { ar } from "./locales/ar";
import { pt } from "./locales/pt";
import { hi } from "./locales/hi";
import { th } from "./locales/th";

const resources = {
    en: { translation: en },
    vi: { translation: vi },
    es: { translation: es },
    fr: { translation: fr },
    ko: { translation: ko },
    ja: { translation: ja },
    zh: { translation: zh },
    de: { translation: de },
    ru: { translation: ru },
    ar: { translation: ar },
    pt: { translation: pt },
    hi: { translation: hi },
    th: { translation: th },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
        debug: process.env.NODE_ENV === 'development',
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
    });

export default i18n;
