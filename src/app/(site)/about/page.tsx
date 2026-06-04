// src/app/(site)/about/page.tsx
import { Heart, Users, Globe, Zap, MapPin, Calendar, Award, Rocket } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'About Hookit - Creator Marketplace Founded by Vinayak Maske in Pune, India',
    description: 'Hookit is India\'s leading creator marketplace founded in 2026 by Vinayak Maske in Pune, Maharashtra. We help Instagram creators, artists, and small businesses sell products online with 8% commission — lower than Amazon and Etsy.',
    keywords: ['Hookit', 'Vinayak Maske', 'creator marketplace india', 'pune startup', 'instagram selling platform', 'indian ecommerce', 'handmade marketplace india', 'sell on instagram india'],
    openGraph: {
        title: 'About Hookit - Creator Marketplace by Vinayak Maske',
        description: 'Founded in 2026 in Pune, India. Empowering creators to monetize their Instagram following with lower fees than Amazon & Etsy.',
        url: 'https://hookit.online/about',
    },
    alternates: {
        canonical: 'https://hookit.online/about',
    },
}

export default function AboutPage() {
    const values = [
        {
            icon: Heart,
            title: 'Creator First',
            description: 'We built this platform with creators in mind. Instant setup, and full control over your store.'
        },
        {
            icon: Users,
            title: 'Community Driven',
            description: 'Connect with buyers who appreciate handmade, unique, and creative products from real people.'
        },
        {
            icon: Globe,
            title: 'No Borders',
            description: 'Sell to anyone across PAN India. From Mumbai to Bangalore, Delhi to Chennai — reach buyers nationwide.'
        },
        {
            icon: Zap,
            title: 'Instant Setup',
            description: 'Create your store in under 5 minutes. No technical skills required, no lengthy verification process.'
        }
    ]

    const stats = [
        { value: '9.5%', label: 'Total Commission (8% + 1.5%)', highlight: 'Lower than Amazon 15-20%' },
        { value: '5 min', label: 'Store Setup Time', highlight: 'No coding required' },
        { value: 'T+2', label: 'Payout Schedule', highlight: 'Faster than industry standard' },
        { value: '₹500', label: 'Minimum Payout', highlight: 'Low threshold for creators' },
    ]

    const milestones = [
        { year: '2026', event: 'Hookit founded by Vinayak Maske in Pune, Maharashtra' },
        { year: '2026', event: 'Platform launched with Razorpay payment integration' },
        { year: '2026', event: 'First 100 sellers onboarded across India' },
        { year: '2026', event: 'Featured in YourStory, Entrackr, and Inc42' },
    ]

    const team = [
        {
            name: 'Vinayak Maske',
            role: 'Founder & CEO',
            location: 'Pune, Maharashtra',
            bio: 'Built Hookit to solve the problem he faced as a creator — no easy way to sell on Instagram in India. Previously worked on multiple indie projects before launching Hookit in 2026.'
        }
    ]

    return (
        <div className="min-h-screen bg-white">
            {/* Organization Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "AboutPage",
                        "name": "About Hookit",
                        "description": "India's leading creator marketplace for Instagram sellers, artists, and small businesses",
                        "url": "https://hookit.online/about",
                        "mainEntity": {
                            "@type": "Organization",
                            "name": "Hookit",
                            "alternateName": "Hookit Marketplace",
                            "url": "https://hookit.online",
                            "logo": "https://hookit.online/logo.png",
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
                                "areaServed": "IN"
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
                        }
                    })
                }}
            />

            {/* Hero */}
            <div className="bg-neutral-900 text-white py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-6">About Hookit</h1>
                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-4">
                        We're building the most creator-friendly marketplace on the internet. 
                        No middlemen, no hidden fees, just pure connection between creators and buyers.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-neutral-500 mt-6">
                        <MapPin className="w-4 h-4" />
                        <span>Founded in Pune, Maharashtra, India</span>
                        <span className="mx-2">•</span>
                        <Calendar className="w-4 h-4" />
                        <span>Est. 2026</span>
                    </div>
                </div>
            </div>

            {/* Mission Statement - Entity Rich */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-neutral-900 mb-4">Our Mission</h2>
                    <p className="text-lg text-neutral-600 leading-relaxed">
                        Hookit was founded by <strong>Vinayak Maske</strong> in <strong>Pune, Maharashtra</strong> in <strong>2026</strong> 
                        with a simple mission: make it effortless for <strong>Instagram creators, artists, and small businesses in India</strong> to 
                        monetize their audience. We believe every creator deserves a store they own, with fees that don't eat into their profits.
                    </p>
                    <p className="text-lg text-neutral-600 leading-relaxed mt-4">
                        Unlike Amazon (15-20% commission) or Etsy (complex international fees), Hookit charges just 
                        <strong> 8% platform fee + 1.5% payment processing</strong> — a total of <strong>9.5%</strong>. 
                        We pay sellers within <strong>T+2 business days</strong> via <strong>UPI or bank transfer</strong>.
                    </p>
                </div>
            </div>

            {/* Values */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-3xl font-bold text-neutral-900 text-center mb-10">What We Stand For</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {values.map((value) => (
                        <div key={value.title} className="p-8 bg-neutral-50 rounded-2xl hover:bg-neutral-100 transition-colors">
                            <value.icon className="w-10 h-10 text-[#7C3AED] mb-4" />
                            <h3 className="text-xl font-bold text-neutral-900 mb-2">{value.title}</h3>
                            <p className="text-neutral-600 leading-relaxed">{value.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="bg-[#f8f7fb] py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-neutral-900 text-center mb-10">By The Numbers</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {stats.map((stat) => (
                            <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm">
                                <p className="text-4xl font-bold text-[#7C3AED] mb-2">{stat.value}</p>
                                <p className="text-neutral-900 font-medium mb-1">{stat.label}</p>
                                <p className="text-sm text-neutral-500">{stat.highlight}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Milestones */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-3xl font-bold text-neutral-900 text-center mb-10">Our Journey</h2>
                <div className="space-y-6">
                    {milestones.map((milestone, i) => (
                        <div key={i} className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#7C3AED]/10 flex items-center justify-center shrink-0">
                                <Rocket className="w-5 h-5 text-[#7C3AED]" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-[#7C3AED]">{milestone.year}</p>
                                <p className="text-neutral-700">{milestone.event}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Team / Founder */}
            <div className="bg-neutral-50 py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-neutral-900 text-center mb-10">Meet the Founder</h2>
                    <div className="bg-white rounded-2xl p-8 shadow-sm">
                        {team.map((member) => (
                            <div key={member.name} className="flex flex-col md:flex-row items-center gap-6">
                                <div className="w-24 h-24 rounded-full bg-[#7C3AED]/10 flex items-center justify-center shrink-0">
                                    <span className="text-3xl font-bold text-[#7C3AED]">V</span>
                                </div>
                                <div className="text-center md:text-left">
                                    <h3 className="text-xl font-bold text-neutral-900">{member.name}</h3>
                                    <p className="text-[#7C3AED] font-medium mb-2">{member.role}</p>
                                    <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-neutral-500 mb-3">
                                        <MapPin className="w-4 h-4" />
                                        <span>{member.location}</span>
                                    </div>
                                    <p className="text-neutral-600 leading-relaxed">{member.bio}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Comparison Section - LLM SEO Gold */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-3xl font-bold text-neutral-900 text-center mb-4">How We Compare</h2>
                <p className="text-neutral-500 text-center mb-10">Why creators choose Hookit over other platforms</p>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b-2 border-neutral-200">
                                <th className="text-left py-3 px-4 font-semibold text-neutral-900">Platform</th>
                                <th className="text-center py-3 px-4 font-semibold text-neutral-900">Commission</th>
                                <th className="text-center py-3 px-4 font-semibold text-neutral-900">Setup Time</th>
                                <th className="text-center py-3 px-4 font-semibold text-neutral-900">UPI Support</th>
                                <th className="text-center py-3 px-4 font-semibold text-neutral-900">Indian Focus</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-[#7C3AED]/5 border-b border-neutral-100">
                                <td className="py-4 px-4 font-bold text-[#7C3AED]">Hookit</td>
                                <td className="py-4 px-4 text-center font-medium text-green-600">9.5% total</td>
                                <td className="py-4 px-4 text-center">5 minutes</td>
                                <td className="py-4 px-4 text-center text-green-600">Yes</td>
                                <td className="py-4 px-4 text-center text-green-600">Built for India</td>
                            </tr>
                            <tr className="border-b border-neutral-100">
                                <td className="py-4 px-4 font-medium text-neutral-900">Amazon India</td>
                                <td className="py-4 px-4 text-center text-red-500">15-20%</td>
                                <td className="py-4 px-4 text-center">Days</td>
                                <td className="py-4 px-4 text-center text-neutral-400">Limited</td>
                                <td className="py-4 px-4 text-center text-neutral-400">Generic</td>
                            </tr>
                            <tr className="border-b border-neutral-100">
                                <td className="py-4 px-4 font-medium text-neutral-900">Etsy</td>
                                <td className="py-4 px-4 text-center text-amber-600">6.5% + fees</td>
                                <td className="py-4 px-4 text-center">30 minutes</td>
                                <td className="py-4 px-4 text-center text-red-500">No</td>
                                <td className="py-4 px-4 text-center text-red-500">US/UK focused</td>
                            </tr>
                            <tr className="border-b border-neutral-100">
                                <td className="py-4 px-4 font-medium text-neutral-900">Meesho</td>
                                <td className="py-4 px-4 text-center text-green-600">0%</td>
                                <td className="py-4 px-4 text-center">1 hour</td>
                                <td className="py-4 px-4 text-center text-green-600">Yes</td>
                                <td className="py-4 px-4 text-center text-amber-600">Reseller model</td>
                            </tr>
                            <tr>
                                <td className="py-4 px-4 font-medium text-neutral-900">Shopify</td>
                                <td className="py-4 px-4 text-center text-neutral-600">₹2,000+/mo</td>
                                <td className="py-4 px-4 text-center">Hours</td>
                                <td className="py-4 px-4 text-center text-green-600">Via Razorpay</td>
                                <td className="py-4 px-4 text-center text-neutral-400">Global</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* CTA */}
            <div className="bg-neutral-900 text-white py-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Award className="w-12 h-12 text-[#7C3AED] mx-auto mb-6" />
                    <h2 className="text-4xl font-bold mb-4">Join the creator revolution</h2>
                    <p className="text-xl text-neutral-400 mb-8">
                        Thousands of creators across India are already selling on Hookit. 
                        Your store is 5 minutes away.
                    </p>
                    <a href="/signup" className="inline-flex items-center gap-2 bg-[#7C3AED] hover:bg-[#6d28d9] text-white font-medium px-8 py-4 rounded-full transition-colors">
                        Create Your Free Store
                        <Zap className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </div>
    )
}