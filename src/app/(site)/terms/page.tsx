// src/app/(site)/terms/page.tsx
import { Scale, Gavel, FileText, AlertTriangle, CheckCircle } from 'lucide-react'

export const metadata = {
    title: 'Terms of Service - Hookit',
    description: 'Terms and conditions for using the Hookit marketplace platform.',
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
                    <p className="text-neutral-500">Last updated: June 1, 2026</p>
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
                            <p className="text-neutral-600"><strong>"Seller"</strong> — Any user who creates a store and lists products for sale.</p>
                            <p className="text-neutral-600"><strong>"Buyer"</strong> — Any user who purchases products through the platform.</p>
                            <p className="text-neutral-600"><strong>"Product"</strong> — Any item, digital good, or service listed on the platform.</p>
                            <p className="text-neutral-600"><strong>"Commission"</strong> — The fee charged by Hookit on each sale (8% + 1.5% payment processing).</p>
                        </div>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">2. Seller Terms</h2>
                        <div className="space-y-4">
                            <div className="bg-neutral-50 rounded-xl p-5">
                                <h3 className="font-semibold text-neutral-900 mb-3">2.1 Eligibility</h3>
                                <ul className="list-disc list-inside text-neutral-600 space-y-1">
                                    <li>Must be 18 years or older</li>
                                    <li>Must provide valid government ID for verification</li>
                                    <li>Must have valid bank account or UPI for payouts</li>
                                    <li>Must comply with all Indian laws and regulations</li>
                                </ul>
                            </div>

                            <div className="bg-neutral-50 rounded-xl p-5">
                                <h3 className="font-semibold text-neutral-900 mb-3">2.2 Product Listings</h3>
                                <ul className="list-disc list-inside text-neutral-600 space-y-1">
                                    <li>All products must be accurately described</li>
                                    <li>Prohibited items: counterfeit goods, illegal substances, weapons, adult content</li>
                                    <li>Images must be original or properly licensed</li>
                                    <li>Prices must be in Indian Rupees (INR)</li>
                                    <li>Sellers are responsible for product quality and authenticity</li>
                                </ul>
                            </div>

                            <div className="bg-neutral-50 rounded-xl p-5">
                                <h3 className="font-semibold text-neutral-900 mb-3">2.3 Fees & Commission</h3>
                                <div className="bg-white rounded-lg p-4 border border-neutral-200">
                                    <div className="grid grid-cols-2 gap-4 text-center">
                                        <div>
                                            <p className="text-2xl font-bold text-[#7C3AED]">8%</p>
                                            <p className="text-sm text-neutral-500">Platform Commission</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-[#7C3AED]">1.5%</p>
                                            <p className="text-sm text-neutral-500">Payment Processing</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-neutral-500 text-center mt-3">
                                        Total fee: 9.5% of each transaction
                                    </p>
                                </div>
                                <p className="text-sm text-neutral-500 mt-3">
                                    Commission is automatically deducted from each sale. Payouts are processed 
                                    within T+2 days (2 days after order completion).
                                </p>
                            </div>

                            <div className="bg-neutral-50 rounded-xl p-5">
                                <h3 className="font-semibold text-neutral-900 mb-3">2.4 Payout Schedule</h3>
                                <p className="text-neutral-600">
                                    Sellers receive payouts after order completion + 2-day holding period. 
                                    This allows time for dispute resolution and buyer protection.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">3. Buyer Terms</h2>
                        <div className="space-y-4">
                            <div className="bg-neutral-50 rounded-xl p-5">
                                <h3 className="font-semibold text-neutral-900 mb-3">3.1 Orders & Payments</h3>
                                <ul className="list-disc list-inside text-neutral-600 space-y-1">
                                    <li>All payments are processed securely via Razorpay</li>
                                    <li>Prices shown include all applicable fees and taxes</li>
                                    <li>Orders cannot be cancelled once payment is confirmed</li>
                                    <li>Buyers must provide accurate shipping information</li>
                                </ul>
                            </div>

                            <div className="bg-neutral-50 rounded-xl p-5">
                                <h3 className="font-semibold text-neutral-900 mb-3">3.2 Returns & Refunds</h3>
                                <p className="text-neutral-600 mb-3">
                                    Return policies are set by individual sellers. Check the store's specific 
                                    policy before purchasing. Hookit provides a standard 7-day return window 
                                    for defective or misrepresented products.
                                </p>
                                <div className="bg-white rounded-lg p-3 border border-neutral-200">
                                    <p className="text-sm text-neutral-600">
                                        <strong>Standard Protection:</strong> If a product is not as described, 
                                        buyers can raise a dispute within 7 days of delivery.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">4. Prohibited Activities</h2>
                        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                            <p className="text-neutral-700 mb-4">The following will result in immediate account suspension:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {[
                                    'Taking transactions off-platform',
                                    'Selling counterfeit or illegal goods',
                                    'Harassment or abusive behavior',
                                    'Fake reviews or review manipulation',
                                    'Multiple accounts for same seller',
                                    'Sharing buyer contact information externally',
                                    'Misrepresenting product details',
                                    'Money laundering or fraudulent activities',
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
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">5. Intellectual Property</h2>
                        <p className="text-neutral-600">
                            Sellers retain ownership of their products and content. By listing on Hookit, 
                            sellers grant us a license to display and promote their products. Hookit owns 
                            all platform branding, code, and design elements.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">6. Limitation of Liability</h2>
                        <div className="bg-neutral-50 rounded-xl p-6">
                            <p className="text-neutral-600">
                                Hookit acts as a marketplace connecting buyers and sellers. We are not responsible 
                                for:
                            </p>
                            <ul className="list-disc list-inside text-neutral-600 mt-3 space-y-1">
                                <li>Product quality, safety, or legality</li>
                                <li>Seller's ability to fulfill orders</li>
                                <li>Buyer's accuracy of shipping information</li>
                                <li>Direct, indirect, or consequential damages from platform use</li>
                            </ul>
                            <p className="text-sm text-neutral-500 mt-4">
                                Maximum liability is limited to the commission fee earned on the disputed transaction.
                            </p>
                        </div>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">7. Dispute Resolution</h2>
                        <p className="text-neutral-600">
                            All disputes shall be resolved through arbitration in Pune, Maharashtra, India, 
                            under the Arbitration and Conciliation Act, 1996. The language of arbitration shall be English.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">8. Governing Law</h2>
                        <p className="text-neutral-600">
                            These terms are governed by the laws of India. Any legal action shall be brought 
                            in the courts of Pune, Maharashtra.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">9. Changes to Terms</h2>
                        <p className="text-neutral-600">
                            We may update these terms at any time. Continued use of the platform after changes 
                            constitutes acceptance. Major changes will be notified via email.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">10. Contact</h2>
                        <div className="bg-neutral-50 rounded-xl p-6">
                            <p className="text-neutral-600">
                                For legal inquiries: <a href="mailto:legal@hookit.online" className="text-[#7C3AED] hover:underline">legal@hookit.online</a>
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}