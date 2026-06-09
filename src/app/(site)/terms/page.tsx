// src/app/(site)/terms/page.tsx
import { Scale, Gavel, FileText, AlertTriangle, CheckCircle, Link2, BookOpen, ExternalLink, Eye, MousePointerClick } from 'lucide-react'

export const metadata = {
    title: 'Terms of Service - Hookit',
    description: 'Terms and conditions for using the Hookit content sharing and discovery platform.',
}

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-white pt-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-[#7C3AED]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Scale className="w-8 h-8 text-[#7C3AED]" />
                    </div>
                    <h1 className="text-4xl font-bold text-neutral-900 mb-3">Terms of Service</h1>
                    <p className="text-neutral-500">Last updated: June 9, 2026</p>
                </div>

                <div className="prose prose-neutral max-w-none">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-10">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                            <p className="text-sm text-amber-800">
                                <strong>Important:</strong> By accessing or using Hookit, you agree to be bound by these terms. 
                                If you disagree with any part, you may not access the platform.
                            </p>
                        </div>
                    </div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-[#7C3AED]" />
                            1. Definitions
                        </h2>
                        <div className="bg-neutral-50 rounded-xl p-6 space-y-3">
                            <p className="text-neutral-600"><strong>"Platform"</strong> — The Hookit website and all associated services.</p>
                            <p className="text-neutral-600"><strong>"Creator"</strong> — Any user who creates and shares hooks on the platform.</p>
                            <p className="text-neutral-600"><strong>"Visitor"</strong> — Any person who browses, views, or clicks hooks on the platform.</p>
                            <p className="text-neutral-600"><strong>"Hook"</strong> — Any link, blog showcase, or product showcase created and shared on the platform.</p>
                            <p className="text-neutral-600"><strong>"Redirect URL"</strong> — The external website URL that a hook directs visitors to when clicked.</p>
                        </div>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">2. Platform Services</h2>
                        <div className="space-y-4">
                            <div className="bg-neutral-50 rounded-xl p-5">
                                <h3 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                                    <Link2 className="w-4 h-4 text-[#7C3AED]" />
                                    2.1 Hook Creation
                                </h3>
                                <ul className="list-disc list-inside text-neutral-600 space-y-1">
                                    <li>Create hooks without requiring an account, login, or password</li>
                                    <li>Three hook types: Link, Blog, and Product Showcase</li>
                                    <li>Each hook must include a valid redirect URL</li>
                                    <li>Hooks are publicly visible once created unless deleted by the creator</li>
                                    <li>Creators receive a passkey to edit or delete their hooks later</li>
                                </ul>
                            </div>

                            <div className="bg-neutral-50 rounded-xl p-5">
                                <h3 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                                    <Eye className="w-4 h-4 text-[#7C3AED]" />
                                    2.2 Discovery & Browsing
                                </h3>
                                <ul className="list-disc list-inside text-neutral-600 space-y-1">
                                    <li>Browse hooks by category, trending, or search</li>
                                    <li>View creator profiles and their published hooks</li>
                                    <li>No account required to browse, share, or click through hooks</li>
                                    <li>All hooks redirect to external URLs provided by creators</li>
                                </ul>
                            </div>

                            <div className="bg-neutral-50 rounded-xl p-5">
                                <h3 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                                    <MousePointerClick className="w-4 h-4 text-[#7C3AED]" />
                                    2.3 Analytics
                                </h3>
                                <ul className="list-disc list-inside text-neutral-600 space-y-1">
                                    <li>View counts are tracked for every hook page visit</li>
                                    <li>Click counts are tracked for every redirect URL click</li>
                                    <li>Analytics are displayed publicly on each hook page</li>
                                    <li>Creators can see aggregated stats on their profile page</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">3. Creator Responsibilities</h2>
                        <div className="space-y-3">
                            {[
                                'Provide accurate titles, descriptions, and redirect URLs',
                                'Ensure redirect URLs are safe, functional, and not malicious',
                                'Only upload images you own or have rights to use',
                                'Categorize hooks accurately for proper discovery',
                                'Do not create hooks that redirect to harmful, illegal, or deceptive content',
                                'Respect intellectual property rights of others',
                                'Use appropriate tags and categories — do not spam or mislead',
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3 bg-neutral-50 rounded-lg p-3">
                                    <div className="w-6 h-6 rounded-full bg-[#7C3AED]/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-[#7C3AED]">{i + 1}</span>
                                    </div>
                                    <p className="text-neutral-700">{item}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">4. Prohibited Content</h2>
                        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                            <p className="text-neutral-700 mb-4">The following will result in immediate hook removal and potential IP ban:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {[
                                    'Malware, phishing, or fraudulent redirect URLs',
                                    'Adult content, pornography, or sexually explicit material',
                                    'Hate speech, harassment, or content promoting violence',
                                    'Illegal drugs, weapons, or counterfeit goods',
                                    'Copyright infringement or pirated content',
                                    'Spam, misleading redirects, or clickbait',
                                    'Personal data harvesting or unauthorized data collection',
                                    'Impersonation of individuals, brands, or organizations',
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                                        <span className="text-sm text-neutral-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">5. No E-Commerce or Transactions</h2>
                        <div className="bg-neutral-50 rounded-xl p-6">
                            <p className="text-neutral-600 mb-4">
                                <strong>Hookit is a content sharing and discovery platform only.</strong> We do not:
                            </p>
                            <ul className="list-disc list-inside text-neutral-600 space-y-2">
                                <li>Process payments or handle transactions of any kind</li>
                                <li>Store payment information or financial data</li>
                                <li>Facilitate product sales, shipping, or fulfillment</li>
                                <li>Act as an intermediary between buyers and sellers</li>
                                <li>Guarantee, verify, or endorse any products or services linked through hooks</li>
                            </ul>
                            <p className="text-sm text-neutral-500 mt-4">
                                All product showcase hooks redirect to external websites where any transactions occur. 
                                Hookit is not responsible for transactions, quality, or disputes on external sites.
                            </p>
                        </div>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">6. Intellectual Property</h2>
                        <div className="space-y-4">
                            <div className="bg-neutral-50 rounded-xl p-5">
                                <h3 className="font-semibold text-neutral-900 mb-3">6.1 Creator Content</h3>
                                <p className="text-neutral-600">
                                    Creators retain ownership of their content. By creating a hook, you grant Hookit 
                                    a non-exclusive license to display, promote, and distribute your hook on our platform 
                                    and through our discovery features.
                                </p>
                            </div>
                            <div className="bg-neutral-50 rounded-xl p-5">
                                <h3 className="font-semibold text-neutral-900 mb-3">6.2 Platform Content</h3>
                                <p className="text-neutral-600">
                                    Hookit owns all platform branding, code, design elements, and trademarks. 
                                    You may not copy, modify, or redistribute platform assets without written permission.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">7. Data & Privacy</h2>
                        <p className="text-neutral-600">
                            Hookit collects minimal data: hook content, view/click analytics, and optional creator email 
                            (for passkey recovery). We do not sell personal data. See our 
                            <a href="/privacy" className="text-[#7C3AED] hover:underline"> Privacy Policy</a> for details.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">8. Limitation of Liability</h2>
                        <div className="bg-neutral-50 rounded-xl p-6">
                            <p className="text-neutral-600">
                                Hookit acts as a platform connecting creators with visitors through shared links. We are not responsible for:
                            </p>
                            <ul className="list-disc list-inside text-neutral-600 mt-3 space-y-1">
                                <li>Content accuracy, safety, or legality on external redirect URLs</li>
                                <li>Availability or functionality of third-party websites</li>
                                <li>Any transactions, purchases, or agreements made on external sites</li>
                                <li>Direct, indirect, or consequential damages from platform use</li>
                                <li>Loss of passkeys or inability to edit hooks due to lost credentials</li>
                            </ul>
                            <p className="text-sm text-neutral-500 mt-4">
                                Maximum liability is limited to the direct operational cost of maintaining the disputed hook on our platform.
                            </p>
                        </div>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">9. Termination</h2>
                        <p className="text-neutral-600">
                            Hookit reserves the right to remove any hook or ban any IP address that violates these terms. 
                            Creators may delete their own hooks at any time using their email and passkey. 
                            Deleted hooks are removed immediately but may remain in cached or archived form for up to 30 days.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">10. Changes to Terms</h2>
                        <p className="text-neutral-600">
                            We may update these terms at any time. Continued use of the platform after changes 
                            constitutes acceptance. Major changes will be posted on this page with an updated date.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">11. Governing Law</h2>
                        <p className="text-neutral-600">
                            These terms are governed by the laws of India. Any legal action shall be brought 
                            in the courts of Pune, Maharashtra.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                            <Gavel className="w-5 h-5 text-[#7C3AED]" />
                            12. Contact
                        </h2>
                        <div className="bg-neutral-50 rounded-xl p-6">
                            <p className="text-neutral-600">
                                For legal inquiries: <a href="mailto:legal@hookit.online" className="text-[#7C3AED] hover:underline">legal@hookit.online</a>
                            </p>
                            <p className="text-neutral-600 mt-2">
                                For support: <a href="mailto:support@hookit.online" className="text-[#7C3AED] hover:underline">support@hookit.online</a>
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}