import { Heart, Users, Globe, Zap } from 'lucide-react'

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
            description: 'Sell to anyone across PAN India'
        },
        {
            icon: Zap,
            title: 'Instant Setup',
            description: 'Create your store in under 5 minutes. No technical skills required, no lengthy verification process.'
        }
    ]

    return (
        <div className="min-h-screen bg-white pt-20">
            {/* Hero */}
            <div className="bg-neutral-900 text-white py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-6">About Hookit</h1>
                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                        We're building the most creator-friendly marketplace on the internet. 
                        No middlemen, no hidden fees, just pure connection between creators and buyers.
                    </p>
                </div>
            </div>

            {/* Values */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {values.map((value) => (
                        <div key={value.title} className="p-8 bg-neutral-50 rounded-2xl hover:bg-neutral-100 transition-colors">
                            <value.icon className="w-10 h-10 text-neutral-900 mb-4" />
                            <h3 className="text-xl font-bold text-neutral-900 mb-2">{value.title}</h3>
                            <p className="text-neutral-600 leading-relaxed">{value.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="bg-neutral-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <p className="text-4xl font-bold text-neutral-900 mb-2">Less</p>
                            <p className="text-neutral-500">Commission Fee</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-neutral-900 mb-2">5 min</p>
                            <p className="text-neutral-500">Store Setup</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-neutral-900 mb-2">100%</p>
                            <p className="text-neutral-500">Creator Owned</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-neutral-900 mb-2">24/7</p>
                            <p className="text-neutral-500">Support</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}