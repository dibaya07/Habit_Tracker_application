import type { MetadataRoute } from 'next';
import { SITE_DESCRIPTION } from '@/lib/utils/seo';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Habitora — Habit Tracker & Analytics',
    short_name: 'Habitora',
    description: SITE_DESCRIPTION,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#fafcf9',
    theme_color: '#183f2e',
    icons: [
      {
        src: '/pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
