import { Providers } from "@/components/providers";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { routing } from '@/i18n/routing';
import { cn, constructMetadata } from "@/lib/utils";
import { SupportedLanguage } from "@/types/products";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { Almarai, Roboto } from "next/font/google";
import { notFound } from 'next/navigation';
import "./../globals.css";

const roboto = Roboto({
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

const almarai = Almarai({
  weight: "400",
  subsets: ["arabic"],
  display: "swap",
})

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  return constructMetadata({
    locale: locale as SupportedLanguage
  })
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <ClerkProvider
      appearance={{
        variables: {
          fontFamily: roboto.style.fontFamily,
          fontSize: "16px",
        },
      }}
    >
      <html
        lang={locale}
        suppressHydrationWarning
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        <body
          className={cn(
            "antialiased overflow-x-hidden scroll-smooth bg-muted/30",
            locale === "ar" ? almarai.className : roboto.className
          )}
          suppressHydrationWarning
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider>
              <Providers>
                {children}
              </Providers>
            </NextIntlClientProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}