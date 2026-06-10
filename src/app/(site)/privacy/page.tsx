
//src/app/(site)/privacy/page.tsx

import {
  Shield,
  Lock,
  Eye,
  Server,
  Mail,
  Phone,
  FileText,
} from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy - Hookit',
  description:
    'Learn how Hookit collects, uses, and protects your information.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-[#7C3AED]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-[#7C3AED]" />
          </div>

          <h1 className="text-4xl font-bold text-neutral-900 mb-3">
            Privacy Policy
          </h1>

          <p className="text-neutral-500">
            Last updated: June 10, 2026
          </p>
        </div>

        <div className="prose prose-neutral max-w-none">

          {/* INTRODUCTION */}
          <section className="mb-10">
            <p className="text-neutral-600 text-lg leading-relaxed">
              Hookit is a platform where creators share blogs, products,
              links, news, recommendations, and other useful content
              through Hooks. This Privacy Policy explains what information
              we collect, how we use it, and how we protect it.
            </p>
          </section>

          {/* INFORMATION WE COLLECT */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#7C3AED]" />
              1. Information We Collect
            </h2>

            <div className="space-y-4">

              <div className="bg-neutral-50 rounded-xl p-6">
                <h3 className="font-semibold text-neutral-900 mb-3">
                  Account Information
                </h3>

                <ul className="list-disc list-inside text-neutral-600 space-y-2">
                  <li>Email address</li>
                  <li>Username</li>
                  <li>Display name</li>
                  <li>Profile image</li>
                  <li>Creator profile information you choose to provide</li>
                </ul>
              </div>

              <div className="bg-neutral-50 rounded-xl p-6">
                <h3 className="font-semibold text-neutral-900 mb-3">
                  Content Information
                </h3>

                <ul className="list-disc list-inside text-neutral-600 space-y-2">
                  <li>Hooks you publish</li>
                  <li>Blog content</li>
                  <li>External links you share</li>
                  <li>Images uploaded to the platform</li>
                  <li>Categories, tags, and descriptions</li>
                </ul>
              </div>

              <div className="bg-neutral-50 rounded-xl p-6">
                <h3 className="font-semibold text-neutral-900 mb-3">
                  Usage Information
                </h3>

                <ul className="list-disc list-inside text-neutral-600 space-y-2">
                  <li>IP address</li>
                  <li>Device information</li>
                  <li>Browser information</li>
                  <li>Pages viewed</li>
                  <li>Search activity</li>
                  <li>View and click interactions</li>
                  <li>Platform performance and diagnostic data</li>
                </ul>
              </div>
            </div>
          </section>

          {/* HOW WE USE */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#7C3AED]" />
              2. How We Use Your Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {[
                {
                  title: 'Account Management',
                  desc: 'Create and manage user accounts and creator profiles.',
                },
                {
                  title: 'Content Publishing',
                  desc: 'Display and distribute hooks published by creators.',
                },
                {
                  title: 'Search & Discovery',
                  desc: 'Improve search, categories, recommendations, and discovery.',
                },
                {
                  title: 'Platform Analytics',
                  desc: 'Understand how users interact with Hookit.',
                },
                {
                  title: 'Security',
                  desc: 'Detect spam, abuse, fraud, and unauthorized activity.',
                },
                {
                  title: 'Communication',
                  desc: 'Send important platform updates and service notifications.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-neutral-50 rounded-xl p-5"
                >
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-sm text-neutral-600">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* STORAGE */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <Server className="w-5 h-5 text-[#7C3AED]" />
              3. Data Storage & Security
            </h2>

            <div className="bg-neutral-50 rounded-xl p-6 space-y-5">

              <p className="text-neutral-600">
                We use trusted cloud infrastructure providers to securely
                store and process data.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                <div className="bg-white border border-neutral-200 rounded-lg p-4 text-center">
                  <p className="font-semibold text-neutral-900">
                    Supabase
                  </p>
                  <p className="text-xs text-neutral-500">
                    Authentication & Database
                  </p>
                </div>

                <div className="bg-white border border-neutral-200 rounded-lg p-4 text-center">
                  <p className="font-semibold text-neutral-900">
                    Cloudflare R2
                  </p>
                  <p className="text-xs text-neutral-500">
                    Image Storage
                  </p>
                </div>

                <div className="bg-white border border-neutral-200 rounded-lg p-4 text-center">
                  <p className="font-semibold text-neutral-900">
                    Vercel
                  </p>
                  <p className="text-xs text-neutral-500">
                    Application Hosting
                  </p>
                </div>
              </div>

              <p className="text-neutral-600">
                We use industry-standard security measures to protect user
                information. However, no internet transmission or storage
                system can be guaranteed to be 100% secure.
              </p>
            </div>
          </section>

          {/* DATA SHARING */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              4. Data Sharing
            </h2>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">

              <p className="text-neutral-700 mb-4">
                We do not sell personal information.
              </p>

              <ul className="list-disc list-inside text-neutral-600 space-y-2">
                <li>Supabase for authentication and database services</li>
                <li>Cloudflare for image delivery and storage</li>
                <li>Vercel for website hosting</li>
                <li>Analytics providers used to improve the platform</li>
                <li>Government or legal authorities when required by law</li>
              </ul>
            </div>
          </section>

          {/* USER RIGHTS */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              5. Your Rights
            </h2>

            <div className="space-y-3">

              {[
                'Access your account information',
                'Update profile information',
                'Delete your account',
                'Request removal of content you published',
                'Opt out of non-essential communications',
                'Request information about your stored data',
              ].map((right, index) => (
                <div
                  key={right}
                  className="flex items-start gap-3 bg-neutral-50 rounded-lg p-4"
                >
                  <div className="w-6 h-6 rounded-full bg-[#7C3AED]/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-[#7C3AED]">
                      {index + 1}
                    </span>
                  </div>

                  <p className="text-neutral-700">
                    {right}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* CONTENT RESPONSIBILITY */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#7C3AED]" />
              6. User Content
            </h2>

            <div className="bg-neutral-50 rounded-xl p-6">
              <p className="text-neutral-600">
                Creators are responsible for the content they publish on
                Hookit, including blogs, product recommendations, links,
                images, and descriptions. Users should independently verify
                information before making decisions based on content found
                on the platform.
              </p>
            </div>
          </section>

          {/* COOKIES */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              7. Cookies & Tracking
            </h2>

            <p className="text-neutral-600">
              Hookit uses cookies and similar technologies to maintain
              sessions, improve functionality, analyze platform usage, and
              enhance user experience. Please review our{' '}
              <a
                href="/cookies"
                className="text-[#7C3AED] hover:underline"
              >
                Cookie Policy
              </a>{' '}
              for more information.
            </p>
          </section>

          {/* CONTACT */}
          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              8. Contact Us
            </h2>

            <div className="bg-neutral-50 rounded-xl p-6">
              <div className="flex flex-col gap-4">

                <a
                  href="mailto:privacy@hookit.online"
                  className="flex items-center gap-2 text-neutral-700 hover:text-[#7C3AED]"
                >
                  <Mail className="w-5 h-5" />
                  privacy@hookit.online
                </a>

                <a
                  href="tel:+918459444524"
                  className="flex items-center gap-2 text-neutral-700 hover:text-[#7C3AED]"
                >
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

