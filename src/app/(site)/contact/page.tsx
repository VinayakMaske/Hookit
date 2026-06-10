import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Hookit',
  description:
    'Get in touch with the Hookit team.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-20">

        <div className="mb-16">
          <p className="text-purple-600 font-medium mb-3">
            Contact
          </p>

          <h1 className="text-5xl font-bold text-neutral-900 mb-6">
            Get In Touch
          </h1>

          <p className="text-xl text-neutral-600">
            We'd love to hear from you.
          </p>
        </div>

        <div className="space-y-8">

          <div className="bg-neutral-50 rounded-2xl p-6">
            <h2 className="font-semibold text-lg mb-2">
              General Inquiries
            </h2>

            <a
              href="mailto:hello@hookit.online"
              className="text-purple-600 hover:underline"
            >
              hello@hookit.online
            </a>
          </div>

          <div className="bg-neutral-50 rounded-2xl p-6">
            <h2 className="font-semibold text-lg mb-2">
              Privacy & Legal
            </h2>

            <a
              href="mailto:privacy@hookit.online"
              className="text-purple-600 hover:underline"
            >
              privacy@hookit.online
            </a>
          </div>

          <div className="bg-neutral-50 rounded-2xl p-6">
            <h2 className="font-semibold text-lg mb-2">
              Location
            </h2>

            <p className="text-neutral-600">
              Pune, Maharashtra, India
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-3xl p-8">
            <h2 className="text-2xl font-bold mb-3">
              Have Something Worth Sharing?
            </h2>

            <p className="opacity-90 mb-5">
              Create a Hook and help others discover useful content.
            </p>

            <a
              href="/hook/new"
              className="inline-flex items-center px-5 py-3 rounded-xl bg-white text-purple-700 font-semibold"
            >
              Create Hook
            </a>
          </div>

        </div>

      </div>
    </div>
  )
}