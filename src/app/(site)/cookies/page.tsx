// src/app/(site)/cookies/page.tsx
import { Cookie, Settings, Shield, Eye } from 'lucide-react'

export const metadata = {
    title: 'Cookie Policy - Hookit',
    description: 'How Hookit uses cookies and similar technologies.',
}

export default function CookiePolicyPage() {
    const cookieTypes = [
        {
            type: 'Essential',
            required: true,
            description: 'Required for the platform to function. Includes authentication, security, and session management.',
            examples: ['auth_token', 'session_id', 'csrf_token'],
        },
        {
            type: 'Functional',
            required: false,
            description: 'Remember your preferences and settings for a better experience.',
            examples: ['theme_preference', 'language', 'recently_viewed'],
        },
        {
            type: 'Analytics',
            required: false,
            description: 'Help us understand how visitors interact with our platform to improve it.',
            examples: ['_ga', '_gid', 'page_views', 'click_tracking'],
        },
        {
            type: 'Marketing',
            required: false,
            description: 'Used to deliver relevant advertisements and measure campaign effectiveness.',
            examples: ['_fbp', 'ad_conversion', 'campaign_id'],
        },
    ]

    return (
        <div className="min-h-screen bg-white pt-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-[#7C3AED]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Cookie className="w-8 h-8 text-[#7C3AED]" />
                    </div>
                    <h1 className="text-4xl font-bold text-neutral-900 mb-3">Cookie Policy</h1>
                    <p className="text-neutral-500">Last updated: June 1, 2026</p>
                </div>

                <div className="prose prose-neutral max-w-none">
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">What Are Cookies?</h2>
                        <p className="text-neutral-600">
                            Cookies are small text files stored on your device when you visit websites. 
                            They help us provide, protect, and improve our platform. We also use similar 
                            technologies like local storage and pixel tags.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">How We Use Cookies</h2>
                        <div className="space-y-4">
                            {cookieTypes.map((cookie) => (
                                <div key={cookie.type} className="bg-neutral-50 rounded-xl p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <Settings className="w-5 h-5 text-[#7C3AED]" />
                                            <h3 className="font-semibold text-neutral-900">{cookie.type} Cookies</h3>
                                        </div>
                                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                                            cookie.required 
                                                ? 'bg-neutral-900 text-white' 
                                                : 'bg-neutral-200 text-neutral-600'
                                        }`}>
                                            {cookie.required ? 'Required' : 'Optional'}
                                        </span>
                                    </div>
                                    <p className="text-neutral-600 text-sm mb-3">{cookie.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {cookie.examples.map((ex) => (
                                            <span key={ex} className="text-xs bg-white px-2 py-1 rounded border border-neutral-200 text-neutral-500 font-mono">
                                                {ex}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">Third-Party Cookies</h2>
                        <div className="bg-neutral-50 rounded-xl p-6">
                            <p className="text-neutral-600 mb-4">
                                We use services from these providers that may set cookies:
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-neutral-200">
                                    <div>
                                        <p className="font-medium text-neutral-900">Google Analytics</p>
                                        <p className="text-xs text-neutral-500">Usage analytics and traffic measurement</p>
                                    </div>
                                    <Eye className="w-4 h-4 text-neutral-400" />
                                </div>
                                <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-neutral-200">
                                    <div>
                                        <p className="font-medium text-neutral-900">Razorpay</p>
                                        <p className="text-xs text-neutral-500">Secure payment processing</p>
                                    </div>
                                    <Shield className="w-4 h-4 text-neutral-400" />
                                </div>
                                <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-neutral-200">
                                    <div>
                                        <p className="font-medium text-neutral-900">Supabase</p>
                                        <p className="text-xs text-neutral-500">Authentication and database</p>
                                    </div>
                                    <Shield className="w-4 h-4 text-neutral-400" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">Managing Cookies</h2>
                        <p className="text-neutral-600 mb-4">
                            You can control cookies through your browser settings. Note that disabling 
                            essential cookies will prevent you from using the platform.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="bg-neutral-50 rounded-lg p-3 text-center">
                                <p className="font-medium text-neutral-900">Chrome</p>
                                <p className="text-xs text-neutral-500">Settings → Privacy → Cookies</p>
                            </div>
                            <div className="bg-neutral-50 rounded-lg p-3 text-center">
                                <p className="font-medium text-neutral-900">Firefox</p>
                                <p className="text-xs text-neutral-500">Preferences → Privacy → Cookies</p>
                            </div>
                            <div className="bg-neutral-50 rounded-lg p-3 text-center">
                                <p className="font-medium text-neutral-900">Safari</p>
                                <p className="text-xs text-neutral-500">Preferences → Privacy → Cookies</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">Contact</h2>
                        <p className="text-neutral-600">
                            Questions about cookies? Contact us at{' '}
                            <a href="mailto:privacy@hookit.online" className="text-[#7C3AED] hover:underline">
                                privacy@hookit.online
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}