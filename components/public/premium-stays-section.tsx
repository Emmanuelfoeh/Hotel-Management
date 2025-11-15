'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { getPublicRooms } from '@/actions/public-room.actions';

interface PremiumStaysSectionProps {
  rooms: Awaited<ReturnType<typeof getPublicRooms>>['data'];
}

export function PremiumStaysSection({ rooms }: PremiumStaysSectionProps) {
  // Filter for premium rooms (SUITE, DELUXE, PRESIDENTIAL) and limit to 3
  const premiumRooms = rooms
    .filter((room) => ['SUITE', 'DELUXE', 'PRESIDENTIAL'].includes(room.type))
    .slice(0, 3);
  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold md:text-4xl">
              Check Out Premium Stays
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Discover our handpicked selection of luxury accommodations
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="hidden md:flex touch-manipulation"
          >
            <Link href="/rooms">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          {premiumRooms.length > 0 ? (
            premiumRooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative min-w-[280px] sm:min-w-[300px] flex-shrink-0 overflow-hidden rounded-lg md:min-w-[400px] touch-manipulation"
              >
                <Link href={`/rooms/${room.id}`}>
                  <div className="relative h-[250px] sm:h-[300px] w-full">
                    <div
                      className="h-full w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                      style={{
                        backgroundImage: `url(${
                          room.images?.[0] ||
                          'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2074'
                        })`,
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4 sm:p-6 text-white">
                      <h3 className="text-xl sm:text-2xl font-bold">
                        {room.name}
                      </h3>
                      <p className="mt-1 text-sm sm:text-base text-white/90">
                        {room.type.replace('_', ' ')} • ${room.price}/night
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="w-full text-center py-8 text-muted-foreground">
              No premium rooms available at the moment
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center md:hidden">
          <Button asChild variant="outline" className="touch-manipulation">
            <Link href="/rooms">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
