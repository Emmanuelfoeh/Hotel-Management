import { HeroSection } from '@/components/public/hero-section';
import { AmenitiesSection } from '@/components/public/amenities-section';
import { PremiumStaysSection } from '@/components/public/premium-stays-section';
import { PropertyGridSection } from '@/components/public/property-grid-section';
import { StatisticsSection } from '@/components/public/statistics-section';
import { TestimonialsSection } from '@/components/public/testimonials-section';
import { NewsletterSection } from '@/components/public/newsletter-section';

export default function Home() {
  return (
    <>
      <HeroSection />
      <AmenitiesSection />
      <PremiumStaysSection />
      <PropertyGridSection />
      <StatisticsSection />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  );
}
