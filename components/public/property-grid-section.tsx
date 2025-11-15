'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PropertyCard } from './property-card';
import { getPublicRooms } from '@/actions/public-room.actions';

const filterTabs = ['All', 'Single', 'Double', 'Suite', 'Deluxe', 'Presidential'];

interface PropertyGridSectionProps {
  rooms: Awaited<ReturnType<typeof getPublicRooms>>['data'];
}

export function PropertyGridSection({ rooms }: PropertyGridSectionProps) {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredRooms =
    activeFilter === 'All'
      ? rooms
      : rooms.filter((room) => room.type.toLowerCase() === activeFilter.toLowerCase());

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            Explore All Our Hotels
          </h2>
          <p className="mt-2 text-muted-foreground">
            Find the perfect accommodation for your next adventure
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {filterTabs.map((tab) => (
            <Button
              key={tab}
              variant={activeFilter === tab ? 'default' : 'outline'}
              onClick={() => setActiveFilter(tab)}
              className={
                activeFilter === tab
                  ? 'bg-teal-600 hover:bg-teal-700'
                  : ''
              }
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* Property Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <PropertyCard property={room} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No rooms available in this category
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
