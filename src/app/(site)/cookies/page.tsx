
// src/app/(site)/cookies/page.tsx

import {
  Cookie,
  Settings,
  Shield,
  Eye,
} from 'lucide-react'

export const metadata = {
  title: 'Cookie Policy - Hookit',
  description:
    'Learn how Hookit uses cookies and similar technologies.',
}

export default function CookiePolicyPage() {
  const cookieTypes = [
    {
      type: 'Essential',
      required: true,
      description:
        'Required for Hookit to function properly. These cookies enable authentication, account security, and session management.',
      examples: [
        'auth_token',
        'session_id',
        'csrf_token',
      ],
    },
    {
      type: 'Functional',
      required: false,
      description:
        'Remember your preferences and improve your experience while using Hookit.',
      examples: [
        'theme_preference',
        'language',
        'recently_viewed',
      ],
    },
    {
      type: 'Analytics',
      required: false,
      description:
        'Help us understand how people discover, browse, and interact with content on Hookit.',
      examples: [
        'page_views',
        'search_activity',
        'click_tracking',
        'usage_metrics',
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-[#7C3AED]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Cookie className="w-8 h-8 text-[#7C3AED]" />
          </div>

          <h1 className="text-4xl font-bold text-neutral-900 mb-3">
            Cookie Policy
          </h1>

          <p className="text-neutral-500">
            Last updated: June 10, 2026
          </p>
        </div>

        <div className="prose prose-neutral max-w-none">

          {/* INTRODUCTION */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              What Are Cookies?
            </h2>

            <p className="text-neutral-600">
              Cookies are small text files stored on your device when
              you visit a website. They help websites remember
              information about your visit and improve your browsing
              experience.
            </p>

            <p className="text-neutral-600 mt-4">
              Hookit also uses similar technologies such as local
              storage, session storage, and analytics tools to
              provide platform functionality and understand how
              people use the platform.
            </p>
          </section>

          {/* COOKIE TYPES */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              How We Use Cookies
            </h2>

            <div className="space-y-4">

              {cookieTypes.map((cookie) => (
                <div
                  key={cookie.type}
                  className="bg-neutral-50 rounded-xl p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-[#7C3AED]" />

                      <h3 className="font-semibold text-neutral-900">
                        {cookie.type} Cookies
                      </h3>
                    </div>

                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        cookie.required
                          ? 'bg-neutral-900 text-white'
                          : 'bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      {cookie.required
                        ? 'Required'
                        : 'Optional'}
                    </span>
                  </div>

                  <p className="text-neutral-600 text-sm mb-3">
                    {cookie.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {cookie.examples.map((example) => (
                      <span
                        key={example}
                        className="text-xs bg-white px-2 py-1 rounded border border-neutral-200 text-neutral-500 font-mono"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

            </div>
          </section>

          {/* THIRD PARTY SERVICES */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              Third-Party Services
            </h2>

            <div className="bg-neutral-50 rounded-xl p-6">

              <p className="text-neutral-600 mb-4">
                Hookit relies on trusted third-party services that
                may use cookies or similar technologies as part of
                their functionality.
              </p>

              <div className="space-y-3">

                <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-neutral-200">
                  <div>
                    <p className="font-medium text-neutral-900">
                      Supabase
                    </p>
                    <p className="text-xs text-neutral-500">
                      Authentication and database services
                    </p>
                  </div>

                  <Shield className="w-4 h-4 text-neutral-400" />
                </div>

                <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-neutral-200">
                  <div>
                    <p className="font-medium text-neutral-900">
                      Cloudflare
                    </p>
                    <p className="text-xs text-neutral-500">
                      Content delivery and image storage
                    </p>
                  </div>

                  <Shield className="w-4 h-4 text-neutral-400" />
                </div>

                <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-neutral-200">
                  <div>
                    <p className="font-medium text-neutral-900">
                      Vercel
                    </p>
                    <p className="text-xs text-neutral-500">
                      Website hosting and performance
                    </p>
                  </div>

                  <Shield className="w-4 h-4 text-neutral-400" />
                </div>

                <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-neutral-200">
                  <div>
                    <p className="font-medium text-neutral-900">
                      Google Analytics
                    </p>
                    <p className="text-xs text-neutral-500">
                      Platform analytics and usage insights
                    </p>
                  </div>

                  <Eye className="w-4 h-4 text-neutral-400" />
                </div>

              </div>
            </div>
          </section>

          {/* WHY WE USE */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              Why We Use Cookies
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {[
                'Keep users signed in securely',
                'Protect accounts and prevent abuse',
                'Remember user preferences',
                'Improve platform performance',
                'Measure views and interactions',
                'Understand how users discover content',
                'Identify bugs and technical issues',
                'Improve search and recommendations',
              ].map((item) => (
                <div
                  key={item}
                  className="bg-neutral-50 rounded-xl p-4"
                >
                  <p className="text-neutral-700">
                    {item}
                  </p>
                </div>
              ))}

            </div>
          </section>

          {/* MANAGING */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              Managing Cookies
            </h2>

            <p className="text-neutral-600 mb-4">
              Most browsers allow you to control cookies through
              browser settings. You can remove or block cookies,
              although doing so may affect some functionality of
              Hookit.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

              <div className="bg-neutral-50 rounded-lg p-4 text-center">
                <p className="font-medium text-neutral-900">
                  Chrome
                </p>
                <p className="text-xs text-neutral-500">
                  Settings → Privacy → Cookies
                </p>
              </div>

              <div className="bg-neutral-50 rounded-lg p-4 text-center">
                <p className="font-medium text-neutral-900">
                  Firefox
                </p>
                <p className="text-xs text-neutral-500">
                  Preferences → Privacy → Cookies
                </p>
              </div>

              <div className="bg-neutral-50 rounded-lg p-4 text-center">
                <p className="font-medium text-neutral-900">
                  Safari
                </p>
                <p className="text-xs text-neutral-500">
                  Preferences → Privacy → Cookies
                </p>
              </div>

            </div>
          </section>

          {/* CONTACT */}
          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              Contact Us
            </h2>

            <p className="text-neutral-600">
              Questions about cookies or privacy?
              Contact us at{' '}
              <a
                href="mailto:privacy@hookit.online"
                className="text-[#7C3AED] hover:underline"
              >
                privacy@hookit.online
              </a>
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}

