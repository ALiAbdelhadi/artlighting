import { ClerkProvider } from "@clerk/nextjs";
import { Roboto } from "next/font/google";
import { ThemeProvider } from "@/components/ui/theme-provider";
import "./globals.css";
import { constructMetadata } from '../lib/utils';
import Providers from "./components/Providers";
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
                    colorPrimary: '#f59e0b',
                    colorBackground: '',
                    // colorText: 'hsl(var(--foreground))',
                    // colorInputBackground: 'hsl(var(--input))',
                    // colorInputText: 'hsl(var(--foreground))',
                    // colorSuccess: 'hsl(var(--primary))',
                    fontFamily: roboto.style.fontFamily,
                    fontSize: "15px"
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
                </body>
            </html>
        </ClerkProvider>
    );
}