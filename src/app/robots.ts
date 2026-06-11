import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },

      // AI Crawlers
      {
        userAgent: 'GPTBot',
        allow: '/',
      },

      {
        userAgent: 'ChatGPT-User',
        allow: '/',
      },

      {
        userAgent: 'Google-Extended',
        allow: '/',
      },

      {
        userAgent: 'ClaudeBot',
        allow: '/',
      },

      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },

      {
        userAgent: 'CCBot',
        allow: '/',
      },
    ],

    sitemap: 'https://hookit.online/sitemap.xml',

    host: 'https://hookit.online',
  }
}