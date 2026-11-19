import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Caveat, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { HabitTrackerProvider } from '../lib/context/HabitTrackerContext';
import { Navbar } from '../components/navbar/Navbar';
import BrandLogo from '../components/navbar/components/BrandLogo';
import MobileBottomNav from '../components/navbar/MobileBottomNav';
import { Footer } from '../components/Footer';
import GlobalModals from '../components/modals/GlobalModals';
import ServiceWorkerRegister from '../components/pwa/ServiceWorkerRegister';
import {
  SITE_DESCRIPTION,
  SITE_TITLE,
  getBaseUrl,
  // getWebApplicationJsonLd,
} from '../lib/utils/seo';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

const siteUrl = getBaseUrl();

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: 'Habitora',
  title: {
    default: SITE_TITLE,
    template: '%s | Habitora',
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'habit tracker',
    'daily habit tracker',
    'printable habit tracker',
    'habit analytics',
    '30 day habit challenge',
    'A4 A5 habit sheet PDF',
    'productivity tracker',
  ],
  authors: [{ name: 'Habitora' }],
  creator: 'Habitora',
  publisher: 'Habitora',
  category: 'productivity',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    siteName: 'Habitora',
    locale: 'en_US',
    url: '/',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  formatDetection: {
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Habitora',
  },
  icons: {
    icon: '/icon',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#071912' },
    { media: '(prefers-color-scheme: light)', color: '#fafcf9' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // const webAppJsonLd = getWebApplicationJsonLd(siteUrl.origin);

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${caveat.variable} ${jakarta.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body
        className="min-h-[100dvh] flex flex-col overflow-x-clip bg-[#fafcf9] dark:bg-[#071912] text-[#123524] dark:text-slate-100 antialiased selection:bg-[#2d6a4f]/20 selection:text-[#123524] transition-colors duration-200"
        suppressHydrationWarning
      >
        {/* <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
        /> */}
        <HabitTrackerProvider>
          <ServiceWorkerRegister />
          <Navbar brandLogo={<BrandLogo />} />
          <div className="flex-1 flex flex-col pb-16 md:pb-0">
            {children}
          </div>
          <Footer />
          <MobileBottomNav />
          <GlobalModals />
        </HabitTrackerProvider>
      </body>
    </html>
  );
}
