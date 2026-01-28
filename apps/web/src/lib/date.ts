import { addDays, format } from "date-fns"
import { enUS } from "date-fns/locale"

const arabicMonths = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
]


export function formatDate(date: Date, locale: string): string {
    if (locale === "ar") {
        const day = date.getDate()
        const month = arabicMonths[date.getMonth()]
        const year = date.getFullYear()
        return `${day} ${month}، ${year}`
    }

    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(date)
}

export function calculateEstimatedDeliveryDate(locale: "ar" | "en") {
    const currentDate = new Date();
    const estimatedDeliveryDate = addDays(currentDate, 4);

    if (locale === "ar") {
        return new Intl.DateTimeFormat("ar-EG", {
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(estimatedDeliveryDate);
    }

    return format(estimatedDeliveryDate, "dd MMM, yyyy", { locale: enUS });
}