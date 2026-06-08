// src/app/(site)/layout.tsx
'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const hideFooter = pathname === '/hook/new'

  return (
    <div>
      <Navbar />
      <main className="min-h-screen pt-16">
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  )
}