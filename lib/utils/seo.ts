import { SITE_CONFIG } from '@/lib/data/site-config';

export const SITE_TITLE = 'Habitora — Habit Tracker & Analytics';
export const SITE_DESCRIPTION =
  'Build better habits one day at a time. Track daily habits, view analytics insights, and download printable A4/A5 habit sheets.';

export function getBaseUrl(): URL {
  const candidates = [process.env.APP_URL, process.env.NEXT_PUBLIC_APP_URL];

  for (const raw of candidates) {
    if (!raw) continue;
    const trimmed = raw.trim();
    if (!trimmed || trimmed === 'MY_APP_URL') continue;

    const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    try {
      return new URL(normalized);
    } catch {
      // Try next candidate
    }
  }

  return new URL(
    process.env.NODE_ENV === 'production' ? 'https://habitora.app' : 'http://localhost:3000'
  );
}

export function getWebApplicationJsonLd(baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: SITE_CONFIG.name,
    url: baseUrl,
    description: SITE_DESCRIPTION,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Web',
    browserRequirements: 'Requires JavaScript. Supports modern desktop and mobile browsers.',
  };
}

export function getFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: SITE_CONFIG.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
