'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { SearchBar } from './search-bar';
import { useState, useEffect, Suspense } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const heroImages = [
  {
    url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070',
    alt: 'Luxury hotel exterior',
  },
  {
    url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070',
    alt: 'Hotel lobby',
  },
  {
    url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2070',
    alt: 'Hotel room',
  },
  {
    url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070',
    alt: 'Hotel pool',
  },
];

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % heroImages.length);
  };

  return (
    <section className="relative h-[500px] sm:h-[600px] lg:h-[700px] w-full overflow-hidden bg-black">
      {/* Background Image Carousel with Overlay */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div
            className="h-full w-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${heroImages[currentIndex].url})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Carousel Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'w-8 bg-white'
                : 'w-2 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl lg:text-6xl leading-tight drop-shadow-lg">
              Your Dream Stay Awaits - Book the Perfect Hotel Today
            </h1>
            <p className="mt-4 text-base text-white sm:text-lg md:text-xl drop-shadow-lg">
              Experience luxury and comfort at our premium hotels with world-class amenities
            </p>

            {/* Search Bar */}
            <div className="mt-6 sm:mt-8">
              <Suspense fallback={<div className="h-20 bg-white/10 rounded-lg animate-pulse" />}>
                <SearchBar />
              </Suspense>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
