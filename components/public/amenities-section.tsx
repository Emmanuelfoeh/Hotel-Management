'use client';

import { motion } from 'framer-motion';
import {
  Wifi,
  Car,
  Waves,
  Dumbbell,
  UtensilsCrossed,
  Coffee,
  Wind,
  Shield,
} from 'lucide-react';

const amenities = [
  { icon: Wifi, label: 'Free WiFi' },
  { icon: Car, label: 'Parking' },
  { icon: Waves, label: 'Swimming Pool' },
  { icon: Dumbbell, label: 'Fitness Center' },
  { icon: UtensilsCrossed, label: 'Restaurant' },
  { icon: Coffee, label: 'Cafe' },
  { icon: Wind, label: 'Air Conditioning' },
  { icon: Shield, label: '24/7 Security' },
];

export function AmenitiesSection() {
  return (
    <section className="py-12 sm:py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold md:text-4xl">
            Luxury & Comfort Choices
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            Experience world-class amenities designed for your comfort
          </p>
        </motion.div>

        <div className="mt-8 sm:mt-12 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 lg:gap-8">
          {amenities.map((amenity, index) => (
            <motion.div
              key={amenity.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col items-center gap-2 sm:gap-3 rounded-lg bg-card p-4 sm:p-6 text-center shadow-sm transition-shadow hover:shadow-md touch-manipulation"
            >
              <div className="rounded-full bg-teal-100 p-3 sm:p-4 dark:bg-teal-900/30">
                <amenity.icon className="h-6 w-6 sm:h-8 sm:w-8 text-teal-600 dark:text-teal-400" />
              </div>
              <span className="text-sm sm:text-base font-medium">{amenity.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
