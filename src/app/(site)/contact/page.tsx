// src/app/(site)/contact/page.tsx
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, HelpCircle, ArrowRight } from 'lucide-react'
import { FaInstagram, FaTwitter } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'

export const metadata = {
    title: 'Contact Us - Hookit',
    description: 'Get in touch with the Hookit team for support, partnerships, or general inquiries.',
}

const contactMethods = [
    {
        icon: Mail,
        title: 'Email Support',
        value: 'support@hookit.online',
        description: 'For general inquiries and seller support',
        action: 'mailto:support@hookit.online',
        actionLabel: 'Send Email',
        color: 'bg-blue-50 text-blue-600',
    },
    {
        icon: Phone,
        title: 'Phone',
        value: '+91 8459444524',
        description: 'Mon-Sat, 9 AM - 6 PM IST',
        action: 'tel:+918459444524',
        actionLabel: 'Call Now',
        color: 'bg-green-50 text-green-600',
    },
    {
        icon: MessageCircle,
        title: 'WhatsApp',
        value: '+91 8459444524',
        description: 'Fastest response for urgent queries',
        action: 'https://wa.me/918459444524',
        actionLabel: 'Chat on WhatsApp',
        color: 'bg-green-50 text-green-600',
    },
    {
        icon: MapPin,
        title: 'Office',
        value: 'Pune, Maharashtra, India',
        description: 'Our headquarters',
        action: null,
        actionLabel: null,
        color: 'bg-amber-50 text-amber-600',
    },
]

const supportCategories = [
    {
        icon: HelpCircle,
        title: 'Buyer Support',
        items: ['Order tracking', 'Return requests', 'Payment issues', 'Product inquiries'],
    },
    {
        icon: MessageCircle,
        title: 'Seller Support',
        items: ['Store setup', 'Payout questions', 'Product listing', 'Order management'],
    },
    {
        icon: Mail,
        title: 'Business Inquiries',
        items: ['Partnerships', 'Media & press', 'Investor relations', 'API access'],
    },
]

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <div className="bg-[#f8f7fb] py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="w-16 h-16 bg-[#7C3AED]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Send className="w-8 h-8 text-[#7C3AED]" />
                    </div>
                    <h1 className="text-4xl font-bold text-neutral-900 mb-4">Get in touch</h1>
                    <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
                        Have a question, feedback, or need help? We're here for you. Reach out and we'll respond within 24 hours.
                    </p>
                </div>
            </div>

            {/* Contact Methods */}
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactMethods.map((method) => (
                            <Card key={method.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-6 text-center">
                                    <div className={`w-14 h-14 rounded-2xl ${method.color} flex items-center justify-center mx-auto mb-4`}>
                                        <method.icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="font-semibold text-neutral-900 mb-1">{method.title}</h3>
                                    <p className="text-sm font-medium text-neutral-900 mb-1">{method.value}</p>
                                    <p className="text-xs text-neutral-500 mb-4">{method.description}</p>
                                    {method.action && (
                                        <a href={method.action} target={method.action.startsWith('http') ? '_blank' : undefined} rel={method.action.startsWith('http') ? 'noopener noreferrer' : undefined}>
                                            <Button variant="outline" size="sm" className="w-full gap-2">
                                                {method.actionLabel}
                                                <ArrowRight className="w-3 h-3" />
                                            </Button>
                                        </a>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Contact Form + Support Categories */}
            <div className="py-16 bg-[#f8f7fb]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                        {/* Form */}
                        <div className="lg:col-span-3">
                            <Card className="border-0 shadow-lg">
                                <CardContent className="p-8">
                                    <h2 className="text-2xl font-bold text-neutral-900 mb-6">Send us a message</h2>
                                    <form className="space-y-6" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Full Name *</Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    placeholder="John Doe"
                                                    required
                                                    className="h-12"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email Address *</Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="john@example.com"
                                                    required
                                                    className="h-12"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Phone Number</Label>
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    type="tel"
                                                    placeholder="+91 98765 43210"
                                                    className="h-12"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="category">Category *</Label>
                                                <select
                                                    id="category"
                                                    name="category"
                                                    required
                                                    className="h-12 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                                                >
                                                    <option value="">Select a category</option>
                                                    <option value="buyer">Buyer Support</option>
                                                    <option value="seller">Seller Support</option>
                                                    <option value="partnership">Partnership</option>
                                                    <option value="press">Media & Press</option>
                                                    <option value="bug">Report a Bug</option>
                                                    <option value="feature">Feature Request</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="subject">Subject *</Label>
                                            <Input
                                                id="subject"
                                                name="subject"
                                                placeholder="How do I verify my store?"
                                                required
                                                className="h-12"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message">Message *</Label>
                                            <Textarea
                                                id="message"
                                                name="message"
                                                placeholder="Describe your issue or question in detail..."
                                                rows={5}
                                                required
                                            />
                                        </div>

                                        <Button type="submit" className="w-full h-12 gap-2 bg-[#7C3AED] hover:bg-[#6d28d9]">
                                            <Send className="w-4 h-4" />
                                            Send Message
                                        </Button>

                                        <p className="text-xs text-neutral-500 text-center">
                                            By submitting, you agree to our{' '}
                                            <a href="/privacy" className="text-[#7C3AED] hover:underline">Privacy Policy</a>
                                            . We typically respond within 24 hours.
                                        </p>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Support Categories */}
                        <div className="lg:col-span-2 space-y-6">
                            <h2 className="text-2xl font-bold text-neutral-900 mb-6">What we can help with</h2>
                            {supportCategories.map((cat) => (
                                <Card key={cat.title} className="border-0 shadow-sm">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center">
                                                <cat.icon className="w-5 h-5 text-[#7C3AED]" />
                                            </div>
                                            <h3 className="font-semibold text-neutral-900">{cat.title}</h3>
                                        </div>
                                        <div className="space-y-2">
                                            {cat.items.map((item) => (
                                                <div key={item} className="flex items-center gap-2 text-sm text-neutral-600">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {/* Response Time Card */}
                            <Card className="border-0 shadow-sm bg-neutral-900 text-white">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Clock className="w-5 h-5 text-[#7C3AED]" />
                                        <h3 className="font-semibold">Response Times</h3>
                                    </div>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-neutral-400">WhatsApp</span>
                                            <span className="text-green-400">Under 2 hours</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-neutral-400">Email</span>
                                            <span className="text-amber-400">Within 24 hours</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-neutral-400">Phone</span>
                                            <span className="text-neutral-300">Mon-Sat, 9AM-6PM</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Social Links */}
            <div className="py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-6">Follow us</h2>
                    <div className="flex justify-center gap-4">
                        <a href="#" className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center hover:bg-[#7C3AED] hover:text-white transition-all text-neutral-600">
                            <FaInstagram className="w-6 h-6" />
                        </a>
                        <a href="#" className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center hover:bg-[#7C3AED] hover:text-white transition-all text-neutral-600">
                            <FaTwitter className="w-6 h-6" />
                        </a>
                        <a href="https://wa.me/918459444524" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all text-neutral-600">
                            <MessageCircle className="w-6 h-6" />
                        </a>
                        <a href="mailto:support@hookit.online" className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all text-neutral-600">
                            <Mail className="w-6 h-6" />
                        </a>
                    </div>
                </div>
            </div>

            {/* FAQ Redirect */}
            <div className="py-12 bg-[#f8f7fb]">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <HelpCircle className="w-10 h-10 text-[#7C3AED] mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-neutral-900 mb-3">Prefer to find answers yourself?</h2>
                    <p className="text-neutral-500 mb-6">
                        Our Help Center has detailed guides and answers to the most common questions.
                    </p>
                    <a href="/help">
                        <Button variant="outline" className="h-12 px-8 gap-2 border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white">
                            Visit Help Center
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </a>
                </div>
            </div>
        </div>
    )
}