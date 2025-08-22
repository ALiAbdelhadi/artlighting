export const i18n = {
    defaultLocale: 'ar',
    locales: ['ar', 'en'],
} as const;

export type Locale = (typeof i18n)['locales'][number];

export const languageConfig = {
    ar: {
        name: 'العربية',
        nativeName: 'العربية',
        direction: 'rtl' as const,
        currency: 'EGP',
        currencySymbol: 'ج.م',
        dateFormat: 'DD/MM/YYYY',
        numberFormat: 'ar-EG',
    },
    en: {
        name: 'English',
        nativeName: 'English',
        direction: 'ltr' as const,
        currency: 'EGP',
        currencySymbol: 'EGP',
        dateFormat: 'MM/DD/YYYY',
        numberFormat: 'en-US',
    },
} as const;