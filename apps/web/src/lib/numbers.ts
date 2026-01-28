import { Locale } from "next-intl";

export function convertArabicToEnglishNumbers(str: string): string {
    if (!str) return ""

    const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    const englishNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    let result = str.toString()
    for (let i = 0; i < arabicNumbers.length; i++) {
        result = result.replace(new RegExp(arabicNumbers[i], "g"), englishNumbers[i])
    }
    return result
}

export function formatNumber(number: number, locale: Locale): string {
    return new Intl.NumberFormat(
        locale === 'ar' ? 'ar-EG' : 'en-US'
    ).format(number);
}


export function formatNumberWithConversion(amount: number, locale: string): string {
    const currencyConfig = {
        ar: { currency: "EGP", symbol: "ج.م" },
        "ar-EG": { currency: "EGP", symbol: "ج.م" },
        en: { currency: "EGP", symbol: "EGP" },
        "en-US": { currency: "EGP", symbol: "EGP" },
    };

    const config = currencyConfig[locale as keyof typeof currencyConfig] || currencyConfig["en"];

    const formatOptions: Intl.NumberFormatOptions = {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    };

    if (locale.startsWith("ar")) {
        formatOptions.numberingSystem = "arab";
    }

    const formattedNumber = new Intl.NumberFormat(locale, formatOptions).format(amount);

    if (locale.startsWith("ar")) {
        return `${formattedNumber} ${config.symbol}`;
    } else {
        return `${config.symbol} ${formattedNumber}`;
    }
}
