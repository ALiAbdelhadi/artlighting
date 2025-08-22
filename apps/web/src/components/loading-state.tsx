"use client"

import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

const LoadingState = () => {
    const t = useTranslations("loading")

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
                <div>
                    <h2 className="text-xl font-semibold">{t("title")}</h2>
                    <p className="text-muted-foreground">{t("description")}</p>
                </div>
            </div>
        </div>
    )
}

export default LoadingState
