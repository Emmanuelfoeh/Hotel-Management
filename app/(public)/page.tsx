import { HeroSection } from '@/components/public/hero-section';
import { AmenitiesSection } from '@/components/public/amenities-section';
import { PremiumStaysSection } from '@/components/public/premium-stays-section';
import { PropertyGridSection } from '@/components/public/property-grid-section';
import { StatisticsSection } from '@/components/public/statistics-section';
import { TestimonialsSection } from '@/components/public/testimonials-section';
import { NewsletterSection } from '@/components/public/newsletter-section';
import { getPublicRooms } from '@/actions/public-room.actions';
import { getPublicReviews } from '@/actions/public-review.actions';

export default async function Home() {
  const { data: rooms } = await getPublicRooms();
  const { data: reviews } = await getPublicReviews();

  return (
    <>
      <HeroSection />
      <AmenitiesSection />
      <PremiumStaysSection rooms={rooms} />
      <PropertyGridSection rooms={rooms} />
      <StatisticsSection />
      <TestimonialsSection reviews={reviews} />
      <NewsletterSection />
    </>
  );
}
