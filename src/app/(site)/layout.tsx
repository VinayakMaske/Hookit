// src/app/(site)/layout.tsx
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <Navbar />
      <main className="min-h-screen pt-16">
        {children}
      </main>
      <Footer />
    </div>
  )
}