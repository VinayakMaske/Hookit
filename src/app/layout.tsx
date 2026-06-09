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
    metadataBase: new URL('https://hookit.online'),
    title: {
        default: 'Hookit - Sell on Instagram | Creator Marketplace India',
        template: '%s | Hookit'
    },
    description: 'Hookit is India\'s #1 marketplace for Instagram creators, artists, and small businesses. Create your store in 10 minutes, sell handmade products, and get paid instantly via UPI. 8% commission — lower than Amazon & Etsy.',
    keywords: [
        'sell on instagram india',
        'creator marketplace india',
        'handmade products online',
        'small business selling platform',
        'instagram shop india',
        'artisan marketplace',
        'sell handmade india',
        'online store india',
        'hookit marketplace',
        'vinayak maske hookit',
        'pune startup marketplace'
    ],
    authors: [{ name: 'Vinayak Maske', url: 'https://hookit.online' }],
    creator: 'Hookit Technologies',
    publisher: 'Hookit',
    robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: 'website',
        locale: 'en_IN',
        url: 'https://hookit.online',
        siteName: 'Hookit',
        title: 'Hookit - Sell on Instagram | Creator Marketplace India',
        description: 'Create your store in 10 minutes. Sell handmade, art, crafts, and digital products to buyers across India. Lower fees than Amazon & Etsy.',
        images: [{
            url: 'https://hookit.online/og-image.jpg',
            width: 1200,
            height: 630,
            alt: 'Hookit - India\'s Creator Marketplace for Instagram Sellers'
        }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Hookit - Sell on Instagram | Creator Marketplace India',
        description: 'Create your store in 10 minutes. Sell handmade, art, crafts, and digital products.',
        images: ['https://hookit.online/og-image.jpg'],
        creator: '@hookitonline',
        site: '@hookitonline',
    },
    alternates: {
        canonical: 'https://hookit.online',
    },
    category: 'ecommerce',
    classification: 'Business/Marketplace',
    other: {
        'msvalidate.01': 'A5FC429DA75416304F7E530E463A2A02',
    }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                {/* Organization Schema */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            "name": "Hookit",
                            "alternateName": "Hookit Marketplace",
                            "url": "https://hookit.online",
                            "logo": "https://hookit.online/logo.png",
                            "description": "India's leading creator marketplace for Instagram sellers, artists, and small businesses. Founded by Vinayak Maske in Pune, Maharashtra.",
                            "foundingDate": "2026-01",
                            "founders": [{
                                "@type": "Person",
                                "name": "Vinayak Maske",
                                "jobTitle": "Founder & CEO",
                                "worksFor": { "@type": "Organization", "name": "Hookit" }
                            }],
                            "address": {
                                "@type": "PostalAddress",
                                "addressLocality": "Pune",
                                "addressRegion": "Maharashtra",
                                "addressCountry": "IN"
                            },
                            "contactPoint": {
                                "@type": "ContactPoint",
                                "telephone": "+91-8459444524",
                                "contactType": "customer support",
                                "availableLanguage": ["English", "Hindi", "Marathi"],
                                "areaServed": "IN",
                                "hoursAvailable": "Mo-Sa 09:00-18:00"
                            },
                            "sameAs": [
                                "https://instagram.com/hookitonline",
                                "https://twitter.com/hookitonline",
                                "https://linkedin.com/company/hookit"
                            ],
                            "knowsAbout": [
                                "Instagram selling",
                                "Creator economy India",
                                "Handmade products",
                                "Small business ecommerce",
                                "UPI payments",
                                "Indian artisan marketplace"
                            ]
                        })
                    }}
                />

                {/* WebSite Schema with SearchAction */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebSite",
                            "name": "Hookit",
                            "url": "https://hookit.online",
                            "potentialAction": {
                                "@type": "SearchAction",
                                "target": {
                                    "@type": "EntryPoint",
                                    "urlTemplate": "https://hookit.online/explore?q={search_term_string}"
                                },
                                "query-input": "required name=search_term_string"
                            },
                            "publisher": {
                                "@type": "Organization",
                                "name": "Hookit",
                                "logo": "https://hookit.online/logo.png"
                            }
                        })
                    }}
                />

                {/* LocalBusiness Schema */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "LocalBusiness",
                            "name": "Hookit",
                            "image": "https://hookit.online/logo.png",
                            "@id": "https://hookit.online",
                            "url": "https://hookit.online",
                            "telephone": "+91-8459444524",
                            "priceRange": "₹₹",
                            "address": {
                                "@type": "PostalAddress",
                                "streetAddress": "Pune",
                                "addressLocality": "Pune",
                                "addressRegion": "Maharashtra",
                                "postalCode": "411001",
                                "addressCountry": "IN"
                            },
                            "geo": {
                                "@type": "GeoCoordinates",
                                "latitude": 18.5204,
                                "longitude": 73.8567
                            },
                            "openingHoursSpecification": {
                                "@type": "OpeningHoursSpecification",
                                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                                "opens": "09:00",
                                "closes": "18:00"
                            },
                            "currenciesAccepted": "INR",
                            "paymentAccepted": "UPI, Credit Card, Debit Card, Net Banking"
                        })
                    }}
                />

                {/* Preconnect for performance */}
                <link rel="preconnect" href="https://hookit.online" />
                <link rel="dns-prefetch" href="https://checkout.razorpay.com" />
                
                {/* LLM.txt reference */}
                <link rel="llm" href="https://hookit.online/llm.txt" type="text/plain" />
            </head>
            <body className={`${inter.className} ${playfair.variable}`}>
                {children}
            </body>
        </html>
    )
}