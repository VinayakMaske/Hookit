// src/components/footer.tsx - COMPLETE UPDATED VERSION
import Link from 'next/link'
import { Mail, FileText, Shield, Cookie, HelpCircle, DollarSign, Rocket, Flame, Calculator, Tag, Newspaper, Briefcase, Phone } from 'lucide-react'
import { FaInstagram, FaTwitter } from 'react-icons/fa'
import Logo from '@/components/logo'

export default function Footer() {
    return (
        <footer className="bg-neutral-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="inline-block mb-4">
                            <Logo className="h-8 w-auto" />
                        </Link>
                        <p className="text-neutral-400 max-w-sm leading-relaxed mb-6">
                            Find it. Love it. Hook it. A curated marketplace where creators sell 
                            and buyers discover unique products they'll love.
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="p-2.5 bg-neutral-800 rounded-xl hover:bg-[#7C3AED] transition-colors">
                                <FaInstagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2.5 bg-neutral-800 rounded-xl hover:bg-[#7C3AED] transition-colors">
                                <FaTwitter className="w-5 h-5" />
                            </a>
                            <a href="mailto:hello@hookit.online" className="p-2.5 bg-neutral-800 rounded-xl hover:bg-[#7C3AED] transition-colors">
                                <Mail className="w-5 h-5" />
                            </a>
                            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-neutral-800 rounded-xl hover:bg-green-600 transition-colors">
                                <Phone className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Platform */}
                    <div>
                        <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-neutral-300">Platform</h4>
                        <ul className="space-y-3 text-neutral-400">
                            <li><Link href="/explore" className="hover:text-white transition-colors">Explore</Link></li>
                            <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                            <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                            <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                            <li><Link href="/signup" className="hover:text-white transition-colors">Become a Seller</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-neutral-300">Resources</h4>
                        <ul className="space-y-3 text-neutral-400">
                            <li>
                                <Link href="/help" className="hover:text-white transition-colors flex items-center gap-2">
                                    <HelpCircle className="w-3.5 h-3.5" /> Help Center
                                </Link>
                            </li>
                            <li>
                                <Link href="/seller-guide" className="hover:text-white transition-colors flex items-center gap-2">
                                    <Rocket className="w-3.5 h-3.5" /> Seller Guide
                                </Link>
                            </li>
                            <li>
                                <Link href="/seller-calculator" className="hover:text-white transition-colors flex items-center gap-2">
                                    <Calculator className="w-3.5 h-3.5" /> Earnings Calculator
                                </Link>
                            </li>
                            <li>
                                <Link href="/payouts" className="hover:text-white transition-colors flex items-center gap-2">
                                    <Tag className="w-3.5 h-3.5" /> Payout Schedule
                                </Link>
                            </li>
                            <li>
                                <Link href="/press" className="hover:text-white transition-colors flex items-center gap-2">
                                    <Newspaper className="w-3.5 h-3.5" /> Press & Media
                                </Link>
                            </li>
                            <li>
                                <Link href="/careers" className="hover:text-white transition-colors flex items-center gap-2">
                                    <Briefcase className="w-3.5 h-3.5" /> Careers
                                </Link>
                            </li>
                            <li>
    <Link href="/blog" className="hover:text-white transition-colors flex items-center gap-2">
        <FileText className="w-3.5 h-3.5" /> Blog
    </Link>
</li>
<li>
    <Link href="/trending" className="hover:text-white transition-colors flex items-center gap-2">
        <Flame className="w-3.5 h-3.5" /> Trending
    </Link>
</li>
                        </ul>
                    </div>

                    {/* Compare Hookit */}
<div>
    <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-neutral-300">Compare Hookit</h4>
    <ul className="space-y-3 text-neutral-400">
        <li>
            <Link href="/compare/etsy-vs-hookit" className="hover:text-white transition-colors flex items-center gap-2">
                Hookit vs Etsy
            </Link>
        </li>
        <li>
            <Link href="/compare/amazon-vs-hookit" className="hover:text-white transition-colors flex items-center gap-2">
                Hookit vs Amazon
            </Link>
        </li>
        <li>
            <Link href="/compare/meesho-vs-hookit" className="hover:text-white transition-colors flex items-center gap-2">
                Hookit vs Meesho
            </Link>
        </li>
    </ul>
</div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-neutral-300">Legal</h4>
                        <ul className="space-y-3 text-neutral-400">
                            <li>
                                <Link href="/privacy" className="hover:text-white transition-colors flex items-center gap-2">
                                    <Shield className="w-3.5 h-3.5" /> Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-white transition-colors flex items-center gap-2">
                                    <FileText className="w-3.5 h-3.5" /> Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="/cookies" className="hover:text-white transition-colors flex items-center gap-2">
                                    <Cookie className="w-3.5 h-3.5" /> Cookie Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/seller-agreement" className="hover:text-white transition-colors flex items-center gap-2">
                                    <FileText className="w-3.5 h-3.5" /> Seller Agreement
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-white transition-colors flex items-center gap-2">
                                    <Mail className="w-3.5 h-3.5" /> Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-neutral-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-neutral-500 text-sm">
                        © 2026 Hookit. All rights reserved.
                    </p>
                    <p className="text-neutral-500 text-sm">
                        Made for creators, by creators.
                    </p>
                </div>
            </div>
        </footer>
    )
}