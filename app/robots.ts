import type { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/utils/seo';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl().origin;

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/create_tracker', '/analytics'],
        disallow: ['/api/', '/profile', '/dashboard'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
