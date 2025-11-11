'use client';

import { motion } from 'framer-motion';
import { SearchBar } from './search-bar';

export function HeroSection() {
  return (
    <section className="relative h-[500px] sm:h-[600px] lg:h-[700px] w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070)',
          }}
        />
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
            <h1 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
              Your Dream Stay Awaits - Book the Perfect Hotel Today
            </h1>
            <p className="mt-4 text-base text-white/90 sm:text-lg md:text-xl">
              Experience luxury and comfort at our premium hotels with world-class amenities
            </p>

            {/* Search Bar */}
            <div className="mt-6 sm:mt-8">
              <SearchBar />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
