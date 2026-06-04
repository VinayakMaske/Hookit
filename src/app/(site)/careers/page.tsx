// src/app/(site)/careers/page.tsx
import { Rocket, Users, Heart, Zap, Globe, Coffee, ArrowRight, MapPin, Clock, Briefcase, CheckCircle, Mail } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata = {
    title: 'Careers - Hookit',
    description: 'Join the Hookit team. We are building the future of creator commerce in India.',
}

const values = [
    {
        icon: Rocket,
        title: 'Build for Impact',
        description: 'Every line of code and every design decision directly impacts thousands of creators and buyers.',
    },
    {
        icon: Users,
        title: 'Creator First',
        description: 'We exist to empower creators. Their success is our success. We obsess over their needs.',
    },
    {
        icon: Heart,
        title: 'Passion Over Pedigree',
        description: 'We care about what you can build, not where you studied. Show us your work, not your degree.',
    },
    {
        icon: Zap,
        title: 'Move Fast',
        description: 'Speed is our advantage. We ship daily, learn fast, and iterate based on real user feedback.',
    },
    {
        icon: Globe,
        title: 'Remote Friendly',
        description: 'Work from anywhere in India. We are a distributed team that trusts each other to deliver.',
    },
    {
        icon: Coffee,
        title: 'Work-Life Balance',
        description: 'No 996 culture. Sustainable pace, flexible hours, and unlimited PTO. We believe in rest.',
    },
]

const benefits = [
    'Competitive salary + ESOPs',
    'Health insurance for you + family',
    'Latest MacBook + equipment stipend',
    'Monthly learning budget (₹5,000)',
    'Annual team retreat',
    'Flexible work hours',
    'Unlimited PTO',
    'Gym/Wellness allowance',
]

const openPositions = [
    {
        title: 'Senior Full-Stack Engineer',
        department: 'Engineering',
        location: 'Remote (India)',
        type: 'Full-time',
        experience: '3+ years',
        skills: ['Next.js', 'TypeScript', 'PostgreSQL', 'AWS/Vercel'],
        description: 'Own core marketplace features. Build scalable systems serving 100K+ users.',
        active: true,
    },
    {
        title: 'Product Designer',
        department: 'Design',
        location: 'Remote (India)',
        type: 'Full-time',
        experience: '2+ years',
        skills: ['Figma', 'UI/UX', 'Design Systems', 'Prototyping'],
        description: 'Design delightful experiences for creators and buyers. Shape our visual identity.',
        active: true,
    },
    {
        title: 'Growth Marketing Lead',
        department: 'Marketing',
        location: 'Pune / Remote',
        type: 'Full-time',
        experience: '3+ years',
        skills: ['SEO', 'Content Marketing', 'Paid Ads', 'Analytics'],
        description: 'Drive organic and paid growth. Scale from hundreds to thousands of sellers.',
        active: true,
    },
    {
        title: 'Customer Success Manager',
        department: 'Operations',
        location: 'Pune / Remote',
        type: 'Full-time',
        experience: '2+ years',
        skills: ['Communication', 'CRM', 'Problem Solving', 'Hindi + English'],
        description: 'Help sellers succeed. Onboard, train, and support our creator community.',
        active: true,
    },
    {
        title: 'DevOps Engineer',
        department: 'Engineering',
        location: 'Remote (India)',
        type: 'Full-time',
        experience: '2+ years',
        skills: ['AWS', 'Docker', 'CI/CD', 'Terraform', 'Monitoring'],
        description: 'Build reliable infrastructure. Ensure 99.9% uptime for our marketplace.',
        active: false,
    },
]

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <div className="bg-[#f8f7fb] py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="w-16 h-16 bg-[#7C3AED]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Rocket className="w-8 h-8 text-[#7C3AED]" />
                    </div>
                    <h1 className="text-5xl font-bold text-neutral-900 mb-4">
                        Join the mission
                    </h1>
                    <p className="text-xl text-neutral-500 max-w-2xl mx-auto mb-8">
                        We're building India's most creator-friendly marketplace. 
                        If you're passionate about empowering small businesses and creators, we want you.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm text-neutral-500">
                        <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                            <MapPin className="w-4 h-4" /> Remote First
                        </span>
                        <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                            <Users className="w-4 h-4" /> 12 People
                        </span>
                        <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                            <Globe className="w-4 h-4" /> PAN India
                        </span>
                        <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                            <Briefcase className="w-4 h-4" /> {openPositions.filter(p => p.active).length} Open Roles
                        </span>
                    </div>
                </div>
            </div>

            {/* Values */}
            <div className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-neutral-900 mb-3">How we work</h2>
                        <p className="text-neutral-500">The principles that guide everything we do</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {values.map((value) => (
                            <Card key={value.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center mb-4">
                                        <value.icon className="w-6 h-6 text-[#7C3AED]" />
                                    </div>
                                    <h3 className="font-semibold text-neutral-900 mb-2">{value.title}</h3>
                                    <p className="text-sm text-neutral-600 leading-relaxed">{value.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Benefits */}
            <div className="py-20 bg-[#f8f7fb]">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-neutral-900 mb-3">Perks & Benefits</h2>
                        <p className="text-neutral-500">We take care of our team so they can focus on building</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {benefits.map((benefit) => (
                            <div key={benefit} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                <span className="text-sm font-medium text-neutral-700">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Open Positions */}
            <div className="py-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-neutral-900 mb-3">Open positions</h2>
                        <p className="text-neutral-500">Find a role that matches your skills and passion</p>
                    </div>
                    <div className="space-y-4">
                        {openPositions.filter(p => p.active).map((position) => (
                            <Card key={position.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <h3 className="text-lg font-semibold text-neutral-900">{position.title}</h3>
                                                <Badge className="bg-[#7C3AED]/10 text-[#7C3AED] border-0">{position.department}</Badge>
                                            </div>
                                            <p className="text-sm text-neutral-600 mb-3">{position.description}</p>
                                            <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500 mb-3">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3.5 h-3.5" /> {position.location}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5" /> {position.type}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Briefcase className="w-3.5 h-3.5" /> {position.experience}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {position.skills.map((skill) => (
                                                    <span key={skill} className="text-xs bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-full">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <a href={`mailto:careers@hookit.online?subject=Application: ${encodeURIComponent(position.title)}`}>
                                            <Button className="bg-[#7C3AED] hover:bg-[#6d28d9] gap-2 shrink-0">
                                                Comming Soon
                                                <ArrowRight className="w-4 h-4" />
                                            </Button>
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {openPositions.filter(p => !p.active).length > 0 && (
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Coming Soon</h3>
                            <div className="space-y-3 opacity-60">
                                {openPositions.filter(p => !p.active).map((position) => (
                                    <Card key={position.title} className="border-0 shadow-sm">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-medium text-neutral-900">{position.title}</h4>
                                                    <p className="text-sm text-neutral-500">{position.department} • {position.location}</p>
                                                </div>
                                                <Badge variant="secondary">Opening Q3 2026</Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Culture Section */}
            <div className="py-20 bg-neutral-900 text-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Life at Hookit</h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-[#7C3AED]/20 flex items-center justify-center shrink-0">
                                        <Zap className="w-5 h-5 text-[#7C3AED]" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">No Meetings Wednesdays</h3>
                                        <p className="text-sm text-neutral-400">Deep work day. No standups, no syncs. Just building.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-[#7C3AED]/20 flex items-center justify-center shrink-0">
                                        <Users className="w-5 h-5 text-[#7C3AED]" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Weekly Creator Calls</h3>
                                        <p className="text-sm text-neutral-400">Every Friday, we talk to real sellers and buyers. No assumptions.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-[#7C3AED]/20 flex items-center justify-center shrink-0">
                                        <Coffee className="w-5 h-5 text-[#7C3AED]" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Quarterly Retreats</h3>
                                        <p className="text-sm text-neutral-400">Meet the team in person. Last quarter: Goa. Next: Manali.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-neutral-800 rounded-2xl p-8">
                            <blockquote className="text-lg italic text-neutral-300 mb-4">
                                "I joined Hookit because I believe in the mission. Every day, I see real creators earning real money because of what we built. That's the most satisfying feeling."
                            </blockquote>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-[#7C3AED]/20 flex items-center justify-center">
                                    <span className="text-lg font-bold text-[#7C3AED]">V</span>
                                </div>
                                <div>
                                    <p className="font-medium">Vinayak M.</p>
                                    <p className="text-sm text-neutral-500">Founder & CEO</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* General Application */}
            <div className="py-20">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Mail className="w-12 h-12 text-[#7C3AED] mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-neutral-900 mb-4">Don't see a perfect fit?</h2>
                    <p className="text-neutral-500 mb-8">
                        We're always looking for exceptional talent. Send us your portfolio and tell us why you'd be a great addition.
                    </p>
                    <a href="mailto:careers@hookit.online?subject=General Application">
                        <Button size="lg" variant="outline" className="h-14 px-8 gap-2 border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white">
                            Send General Application
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    </a>
                    <p className="text-sm text-neutral-400 mt-4">
                        Include: Resume, portfolio/GitHub, and a note on what you'd build at Hookit
                    </p>
                </div>
            </div>
        </div>
    )
}