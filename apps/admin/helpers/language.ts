const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur', 'ku', 'az'] as const

export function getCurrentLanguage(): string {
    if (typeof window !== 'undefined') {
        const htmlLang = document.documentElement.lang
        if (htmlLang) return htmlLang

        const browserLang = navigator.language || navigator.languages?.[0]
        if (browserLang) return browserLang
    }

    return 'en'
}

export function getLanguageCode(locale?: string): string {
    const lang = locale || getCurrentLanguage()
    return lang.split('-')[0].toLowerCase()
}

export function isRTLLanguage(locale?: string): boolean {
    const langCode = getLanguageCode(locale)
    return RTL_LANGUAGES.includes(langCode as any)
}
export function getTextDirection(locale?: string): 'rtl' | 'ltr' {
    return isRTLLanguage(locale) ? 'rtl' : 'ltr'
}

export function isArabic(locale?: string): boolean {
    return getLanguageCode(locale) === 'ar'
}

import { useMemo } from 'react'

export function useTextDirection(locale?: string) {
    return useMemo(() => ({
        direction: getTextDirection(locale),
        isRTL: isRTLLanguage(locale),
        isArabic: isArabic(locale),
        languageCode: getLanguageCode(locale),
    }), [locale])
}

export function getDirectionalClass(
    ltrClass: string,
    rtlClass: string,
    locale?: string
): string {
    return isRTLLanguage(locale) ? rtlClass : ltrClass
}

export function getDirectionalValue<T>(
    ltrValue: T,
    rtlValue: T,
    locale?: string
): T {
    return isRTLLanguage(locale) ? rtlValue : ltrValue
}

