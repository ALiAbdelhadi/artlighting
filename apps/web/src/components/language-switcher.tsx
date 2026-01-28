"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useTransition } from "react"

interface LanguageSwitcherProps {
    currentLocale: string
}

const languages = [
    {
        code: "ar",
        name: "العربية",
        label: "AR",
        dir: "rtl",
    },
    {
        code: "en",
        name: "English",
        label: "EN",
        dir: "ltr",
    },
]

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
    const router = useRouter()
    const pathname = usePathname()
    const [isPending, startTransition] = useTransition()

    const currentLanguage = languages.find((lang) => lang.code === currentLocale) || languages[0]

    const handleLanguageChange = (newLocale: string) => {
        if (newLocale === currentLocale) return

        startTransition(() => {
            const segments = pathname.split("/").filter(Boolean)
            if (segments[0] === currentLocale) {
                segments.shift()
            }
            const newPath = `/${newLocale}/${segments.join("/")}`
            router.push(newPath)

            document.documentElement.dir = languages.find((lang) => lang.code === newLocale)?.dir || "ltr"
            document.documentElement.lang = newLocale
        })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-3 gap-2 transition-all duration-200 bg-transparent"
                    disabled={isPending}
                >
                    <Globe className="h-4 w-4" />
                    <span className="font-medium text-sm">{currentLanguage.label}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                {languages.map((language) => (
                    <DropdownMenuItem
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        className={`cursor-pointer transition-colors ${currentLocale === language.code ? "bg-primary text-primary-foreground font-medium" : "hover:bg-accent"
                            }`}
                        disabled={currentLocale === language.code || isPending}
                    >
                        <div className="flex items-center justify-between w-full gap-3">
                            <span className="text-sm font-medium">{language.name}</span>
                            {currentLocale === language.code && <div className="w-2 h-2 rounded-full bg-current" />}
                        </div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
