// src/app/(site)/seller-agreement/page.tsx
import { FileSignature, Handshake, DollarSign, Truck, Ban, Gavel } from 'lucide-react'

export const metadata = {
    title: 'Seller Agreement - Hookit',
    description: 'Agreement terms for sellers on the Hookit marketplace.',
}

export default function SellerAgreementPage() {
    return (
        <div className="min-h-screen bg-white pt-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-[#7C3AED]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FileSignature className="w-8 h-8 text-[#7C3AED]" />
                    </div>
                    <h1 className="text-4xl font-bold text-neutral-900 mb-3">Seller Agreement</h1>
                    <p className="text-neutral-500">Agreement between Hookit and Sellers</p>
                    <p className="text-sm text-neutral-400 mt-2">Last updated: June 1, 2026</p>
                </div>

                <div className="prose prose-neutral max-w-none">
                    <div className="bg-[#7C3AED]/5 border border-[#7C3AED]/20 rounded-xl p-6 mb-10">
                        <p className="text-neutral-700">
                            This Seller Agreement ("Agreement") is a legally binding contract between you 
                            ("Seller") and Hookit ("Platform"). By creating a store and listing products, 
                            you agree to all terms below.
                        </p>
                    </div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                            <Handshake className="w-5 h-5 text-[#7C3AED]" />
                            1. Platform Services
                        </h2>
                        <p className="text-neutral-600 mb-4">
                            Hookit provides an online marketplace where sellers can:
                        </p>
                        <ul className="list-disc list-inside text-neutral-600 space-y-1">
                            <li>Create and customize a store page</li>
                            <li>List products with images, descriptions, and pricing</li>
                            <li>Receive orders from buyers across India</li>
                            <li>Process payments securely through Razorpay</li>
                            <li>Receive payouts to bank account or UPI</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-[#7C3AED]" />
                            2. Fees & Commission Structure
                        </h2>
                        <div className="bg-neutral-50 rounded-xl p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                <div className="bg-white rounded-lg p-4 text-center border border-neutral-200">
                                    <p className="text-3xl font-bold text-[#7C3AED]">8%</p>
                                    <p className="text-sm text-neutral-500">Platform Commission</p>
                                </div>
                                <div className="bg-white rounded-lg p-4 text-center border border-neutral-200">
                                    <p className="text-3xl font-bold text-[#7C3AED]">1.5%</p>
                                    <p className="text-sm text-neutral-500">Payment Processing</p>
                                </div>
                                <div className="bg-white rounded-lg p-4 text-center border border-neutral-200">
                                    <p className="text-3xl font-bold text-[#7C3AED]">9.5%</p>
                                    <p className="text-sm text-neutral-500">Total Deduction</p>
                                </div>
                            </div>
                            <div className="space-y-3 text-sm text-neutral-600">
                                <p><strong>Example:</strong> For a ₹1,000 sale:</p>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Platform Commission: ₹80 (8%)</li>
                                    <li>Payment Processing: ₹15 (1.5%)</li>
                                    <li>Total Deduction: ₹95</li>
                                    <li><strong>Seller Receives: ₹905</strong></li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                            <Truck className="w-5 h-5 text-[#7C3AED]" />
                            3. Payout Schedule
                        </h2>
                        <div className="bg-neutral-50 rounded-xl p-6">
                            <p className="text-neutral-600 mb-4">
                                Sellers receive payouts according to the following schedule:
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-4 bg-white rounded-lg p-3 border border-neutral-200">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                        <span className="text-lg font-bold text-green-600">T+2</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-neutral-900">Standard Payout</p>
                                        <p className="text-sm text-neutral-500">2 days after order delivery/completion</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 bg-white rounded-lg p-3 border border-neutral-200">
                                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                                        <span className="text-lg font-bold text-amber-600">T+7</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-neutral-900">First Payout (New Sellers)</p>
                                        <p className="text-sm text-neutral-500">7 days after first order for account verification</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 bg-white rounded-lg p-3 border border-neutral-200">
                                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                        <span className="text-lg font-bold text-red-600">Min ₹500</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-neutral-900">Minimum Payout</p>
                                        <p className="text-sm text-neutral-500">Accumulated balance must exceed ₹500</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">4. Seller Responsibilities</h2>
                        <div className="space-y-3">
                            {[
                                'Maintain accurate product descriptions, pricing, and inventory',
                                'Ship orders within promised timeframe (max 7 days)',
                                'Provide valid tracking information for shipped orders',
                                'Respond to buyer inquiries within 24 hours',
                                'Handle returns and refunds according to stated policy',
                                'Pay all applicable taxes (GST, income tax) on earnings',
                                'Maintain product quality and authenticity standards',
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
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">5. Prohibited Activities</h2>
                        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {[
                                    'Directing buyers to complete transactions off-platform',
                                    'Selling counterfeit, replica, or unauthorized goods',
                                    'Listing prohibited items (weapons, drugs, adult content)',
                                    'Manipulating reviews or creating fake orders',
                                    'Using multiple seller accounts',
                                    'Sharing buyer personal data with third parties',
                                    'Misrepresenting product origin or materials',
                                    'Engaging in fraudulent or deceptive practices',
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <Ban className="w-4 h-4 text-red-500 shrink-0" />
                                        <span className="text-sm text-neutral-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <p className="text-sm text-neutral-500 mt-4">
                            Violation of these terms will result in account suspension, forfeiture of pending payouts, 
                            and potential legal action.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">6. Order Protection & Disputes</h2>
                        <div className="bg-neutral-50 rounded-xl p-6">
                            <p className="text-neutral-600 mb-4">
                                Hookit provides buyer protection for all on-platform transactions:
                            </p>
                            <ul className="list-disc list-inside text-neutral-600 space-y-2">
                                <li><strong>7-day dispute window:</strong> Buyers can raise issues within 7 days of delivery</li>
                                <li><strong>Mediation:</strong> Hookit will mediate disputes between buyers and sellers</li>
                                <li><strong>Refund authority:</strong> Hookit reserves the right to issue refunds for valid disputes</li>
                                <li><strong>Seller protection:</strong> Sellers are protected against fraudulent buyer claims</li>
                            </ul>
                        </div>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">7. Termination</h2>
                        <p className="text-neutral-600">
                            Either party may terminate this agreement with 30 days notice. Upon termination:
                        </p>
                        <ul className="list-disc list-inside text-neutral-600 mt-3 space-y-1">
                            <li>All active listings will be removed</li>
                            <li>Pending orders must be fulfilled or refunded</li>
                            <li>Final payout will be processed after all orders are resolved</li>
                            <li>Hookit may retain data as required by law</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                            <Gavel className="w-5 h-5 text-[#7C3AED]" />
                            8. Governing Law
                        </h2>
                        <p className="text-neutral-600">
                            This Agreement is governed by the laws of India. Disputes shall be resolved 
                            through arbitration in Pune, Maharashtra. By signing up as a seller, you 
                            acknowledge that you have read, understood, and agree to all terms in this Agreement.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}