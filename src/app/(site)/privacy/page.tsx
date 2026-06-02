// src/app/(site)/privacy/page.tsx
import { Shield, Lock, Eye, Server, Mail, Phone } from 'lucide-react'

export const metadata = {
    title: 'Privacy Policy - Hookit',
    description: 'Learn how Hookit protects your personal data and privacy.',
}

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-white pt-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-[#7C3AED]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-8 h-8 text-[#7C3AED]" />
                    </div>
                    <h1 className="text-4xl font-bold text-neutral-900 mb-3">Privacy Policy</h1>
                    <p className="text-neutral-500">Last updated: June 1, 2026</p>
                </div>

                <div className="prose prose-neutral max-w-none">
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                            <Eye className="w-5 h-5 text-[#7C3AED]" />
                            1. Information We Collect
                        </h2>
                        <div className="bg-neutral-50 rounded-xl p-6 space-y-4">
                            <div>
                                <h3 className="font-semibold text-neutral-900 mb-2">Personal Information</h3>
                                <ul className="list-disc list-inside text-neutral-600 space-y-1">
                                    <li>Name, email address, phone number</li>
                                    <li>Shipping and billing addresses</li>
                                    <li>Government ID (for seller verification only)</li>
                                    <li>Payment information (processed securely via Razorpay)</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-neutral-900 mb-2">Store Information (Sellers)</h3>
                                <ul className="list-disc list-inside text-neutral-600 space-y-1">
                                    <li>Store name, description, logo, banner</li>
                                    <li>Bank account details, UPI ID for payouts</li>
                                    <li>GST number (if applicable)</li>
                                    <li>WhatsApp number for order notifications</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-neutral-900 mb-2">Usage Data</h3>
                                <ul className="list-disc list-inside text-neutral-600 space-y-1">
                                    <li>IP address, browser type, device information</li>
                                    <li>Pages visited, time spent, click patterns</li>
                                    <li>Search queries and product interactions</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-[#7C3AED]" />
                            2. How We Use Your Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { title: 'Order Processing', desc: 'To process purchases, payments, and deliveries between buyers and sellers.' },
                                { title: 'Seller Payouts', desc: 'To transfer earnings to seller bank accounts and UPI IDs.' },
                                { title: 'Communication', desc: 'Order updates, promotional offers, and platform notifications.' },
                                { title: 'Fraud Prevention', desc: 'To detect and prevent fraudulent transactions and account abuse.' },
                                { title: 'Platform Improvement', desc: 'Analytics to improve user experience and feature development.' },
                                { title: 'Legal Compliance', desc: 'To comply with Indian laws, tax regulations, and legal requests.' },
                            ].map((item) => (
                                <div key={item.title} className="bg-neutral-50 rounded-xl p-4">
                                    <h3 className="font-semibold text-neutral-900 mb-1">{item.title}</h3>
                                    <p className="text-sm text-neutral-600">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                            <Server className="w-5 h-5 text-[#7C3AED]" />
                            3. Data Storage & Security
                        </h2>
                        <div className="bg-neutral-50 rounded-xl p-6 space-y-4">
                            <p className="text-neutral-600">
                                We use <strong>Supabase</strong> for secure cloud data storage. All data is encrypted 
                                in transit (TLS 1.3) and at rest. Payment information is never stored on our servers — 
                                all payments are processed securely through <strong>Razorpay</strong>, which is PCI-DSS compliant.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="bg-white rounded-lg p-3 text-center border border-neutral-200">
                                    <p className="font-semibold text-neutral-900">TLS 1.3</p>
                                    <p className="text-xs text-neutral-500">Encrypted transmission</p>
                                </div>
                                <div className="bg-white rounded-lg p-3 text-center border border-neutral-200">
                                    <p className="font-semibold text-neutral-900">AES-256</p>
                                    <p className="text-xs text-neutral-500">Data at rest encryption</p>
                                </div>
                                <div className="bg-white rounded-lg p-3 text-center border border-neutral-200">
                                    <p className="font-semibold text-neutral-900">PCI-DSS</p>
                                    <p className="text-xs text-neutral-500">Payment security standard</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">4. Data Sharing</h2>
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                            <p className="text-neutral-700 mb-4">
                                We <strong>never sell</strong> your personal data. We only share data with:
                            </p>
                            <ul className="list-disc list-inside text-neutral-600 space-y-2">
                                <li><strong>Sellers</strong> — Buyer name, phone, and shipping address (only for order fulfillment)</li>
                                <li><strong>Razorpay</strong> — Payment processing (encrypted, tokenized)</li>
                                <li><strong>Supabase</strong> — Secure database hosting</li>
                                <li><strong>Legal authorities</strong> — Only when required by Indian law</li>
                            </ul>
                        </div>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">5. Your Rights</h2>
                        <div className="space-y-3">
                            {[
                                'Access your personal data anytime from your account settings',
                                'Request data deletion (30-day processing time)',
                                'Opt-out of marketing emails',
                                'Download your data in portable format',
                                'Update or correct inaccurate information',
                            ].map((right, i) => (
                                <div key={i} className="flex items-start gap-3 bg-neutral-50 rounded-lg p-3">
                                    <div className="w-6 h-6 rounded-full bg-[#7C3AED]/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-[#7C3AED]">{i + 1}</span>
                                    </div>
                                    <p className="text-neutral-700">{right}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">6. Cookies & Tracking</h2>
                        <p className="text-neutral-600 mb-4">
                            We use essential cookies for authentication and functional cookies for analytics. 
                            See our <a href="/cookies" className="text-[#7C3AED] hover:underline">Cookie Policy</a> for details.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">7. Contact Us</h2>
                        <div className="bg-neutral-50 rounded-xl p-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <a href="mailto:privacy@hookit.online" className="flex items-center gap-2 text-neutral-700 hover:text-[#7C3AED]">
                                    <Mail className="w-5 h-5" />
                                    privacy@hookit.online
                                </a>
                                <a href="tel:+919876543210" className="flex items-center gap-2 text-neutral-700 hover:text-[#7C3AED]">
                                    <Phone className="w-5 h-5" />
                                    +91 8459444524
                                </a>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}