// src/app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/seller/', '/admin/', '/api/', '/checkout', '/_next/'],
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/seller/', '/admin/', '/api/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/seller/', '/admin/', '/api/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
      },
    ],
    sitemap: 'https://hookit.online/sitemap.xml',
    host: 'https://hookit.online',
  }
}