// src/components/footer.tsx
import Link from 'next/link'
import { Mail } from 'lucide-react'
import { FaInstagram, FaTwitter } from 'react-icons/fa'
import Logo from '@/components/logo'

export default function Footer() {
    return (
        <footer className="bg-neutral-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
                    <div className="md:col-span-2">
                        <Link href="/" className="inline-block mb-4">
                            <Logo className="h-8 w-auto" />
                        </Link>
                        <p className="text-neutral-400 max-w-sm leading-relaxed">
                            Find it. Love it. Hook it. A curated marketplace where creators sell 
                            and buyers discover unique products they'll love.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-neutral-300">Platform</h4>
                        <ul className="space-y-3 text-neutral-400">
                            <li><Link href="/explore" className="hover:text-white transition-colors">Explore</Link></li>
                            <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                            <li><Link href="/signup" className="hover:text-white transition-colors">Become a Seller</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-neutral-300">Connect</h4>
                        <div className="flex gap-3">
                            <a href="#" className="p-2.5 bg-neutral-800 rounded-xl hover:bg-[#7C3AED] transition-colors">
                                <FaInstagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2.5 bg-neutral-800 rounded-xl hover:bg-[#7C3AED] transition-colors">
                                <FaTwitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2.5 bg-neutral-800 rounded-xl hover:bg-[#7C3AED] transition-colors">
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
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