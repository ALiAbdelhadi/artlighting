import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";
import { Roboto } from "next/font/google";
import { constructMetadata } from '../lib/utils';
import Providers from "./components/Providers";
import "./globals.css";
const roboto = Roboto({
    weight: ["400", "500"],
    subsets: ["latin"],
    display: "swap",
});
export const metadata = constructMetadata()
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider
            appearance={{
                variables: {
                    colorPrimary: '#f6a100',
                    colorBackground: '',
                    colorInputBackground: '#d8c9a8',
                    colorInputText: '#211c17',
                    colorSuccess: '#f6a100',
                    fontFamily: roboto.style.fontFamily,
                    fontSize: "16px"
                },
            }}
        >
            <html lang="en">
                <body className={`${roboto.className} antialiased overflow-x-hidden`}>
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                        <Providers>
                            {children}
                        </Providers>
                    </ThemeProvider>
                    <Toaster />
                </body>
            </html>
        </ClerkProvider>
    );
}