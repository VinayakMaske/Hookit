import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Hookit',
  description:
    'Learn about Hookit — a platform for discovering blogs, products, links and ideas shared by creators worldwide.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-20">

        <div className="mb-16">
          <p className="text-purple-600 font-medium mb-3">
            About Hookit
          </p>

          <h1 className="text-5xl font-bold text-neutral-900 mb-6">
            Discover What People Are Sharing
          </h1>

          <p className="text-xl text-neutral-600 leading-relaxed">
            Hookit is a discovery platform where creators, makers,
            writers and enthusiasts share blogs, products, useful links
            and ideas that deserve attention.
          </p>
        </div>

        <div className="space-y-12">

          <section>
            <h2 className="text-2xl font-bold mb-4">
              Our Mission
            </h2>

            <p className="text-neutral-600 leading-relaxed">
              The internet is full of valuable content, but finding it
              often depends on algorithms, ads or social media feeds.
              Hookit exists to make discovery easier by giving people a
              place to share useful things directly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              What Can You Find On Hookit?
            </h2>

            <ul className="space-y-3 text-neutral-600">
              <li>• Blog articles and guides</li>
              <li>• Products and recommendations</li>
              <li>• Useful websites and tools</li>
              <li>• News and interesting discoveries</li>
              <li>• Creative projects and resources</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              Built For Discovery
            </h2>

            <p className="text-neutral-600 leading-relaxed">
              Every Hook is designed to be searchable, shareable and easy
              to discover. Whether you're looking for inspiration,
              learning resources, products or interesting content,
              Hookit helps surface valuable information from people around
              the world.
            </p>
          </section>

          <section className="bg-neutral-50 rounded-3xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              Built in India
            </h2>

            <p className="text-neutral-600 leading-relaxed">
              Hookit is an independent project created in Pune, India
              with the goal of making high-quality content easier to
              discover and share.
            </p>
          </section>

        </div>

      </div>
    </div>
  )
}