import type { Metadata } from 'next';
import SignedInHomeRedirect from '@/components/SignedInHomeRedirect';
import { HeroSection } from '@/components/(hero_section)/HeroSection';
import { ShowcaseSection } from '@/components/ShowcaseSection';
import { FeaturesGridSection } from '@/components/FeaturesGridSection';
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { TestimonialsSection } from '@/components/testimonials/TestimonialsSection';
import { FAQSection } from '@/components/faq/FAQSection';
import { SupportDonationSection } from '@/components/support/SupportDonationSection';
import {
  SITE_DESCRIPTION,
  SITE_TITLE,
  // getFaqJsonLd,
} from '@/lib/utils/seo';

export const metadata: Metadata = {
  title: {
    absolute: SITE_TITLE,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function Home() {
  // const faqJsonLd = getFaqJsonLd();

  return (
    <>
      {/* <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      /> */}
      <SignedInHomeRedirect />
      <main className="flex-1 bg-[#fafcf9] dark:bg-[#071912] text-[#123524] dark:text-slate-100 transition-colors duration-200">
        <HeroSection />
        <ShowcaseSection />
        <FeaturesGridSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <FAQSection />
        <SupportDonationSection />
      </main>
    </>
  );
}
