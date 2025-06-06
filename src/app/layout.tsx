import Providers from "@/components/Providers";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { Roboto } from "next/font/google";
import { constructMetadata } from "../lib/utils";
import "./globals.css";
const roboto = Roboto({
   weight: ["400", "500"],
   subsets: ["latin"],
   display: "swap",
});
export const metadata = constructMetadata();
export default function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <ClerkProvider
         appearance={{
            variables: {
               colorPrimary: "#f6a100",
               colorBackground: "",
               colorInputText: "#211c17",
               colorSuccess: "#f6a100",
               fontFamily: roboto.style.fontFamily,
               fontSize: "16px",
            },
         }}
      >
         <html lang="en" suppressHydrationWarning>
            <body
               className={`${roboto.className} antialiased overflow-x-hidden scroll-smooth`}
               suppressHydrationWarning
            >
               <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                  enableColorScheme
               >
                  <Providers>
                     {children}
                     <Analytics />
                  </Providers>
               </ThemeProvider>
               <Toaster />
            </body>
         </html>
      </ClerkProvider>
   );
}