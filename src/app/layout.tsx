// src/app/layout.tsx
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

const playfair = Playfair_Display({ 
    subsets: ['latin'],
    weight: ['700'],
    style: ['italic'],
    variable: '--font-playfair',
})

export const metadata: Metadata = {
    title: "Hookit - Find it. Love it. Hook it.",
    description: "A curated marketplace where creators sell and buyers discover unique products",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`${inter.className} ${playfair.variable}`}>
                {children}
            </body>
        </html>
    )
}