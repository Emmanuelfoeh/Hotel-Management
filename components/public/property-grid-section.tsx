'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PropertyCard } from './property-card';

const filterTabs = ['All', 'Hotels', 'Resorts', 'Villas', 'Apartments'];

const properties = [
  {
    id: 1,
    name: 'Grand Plaza Hotel',
    location: 'Downtown, New York',
    price: 250,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070',
    type: 'Hotels',
  },
  {
    id: 2,
    name: 'Sunset Beach Resort',
    location: 'Miami Beach, Florida',
    price: 350,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070',
    type: 'Resorts',
  },
  {
    id: 3,
    name: 'Mountain View Villa',
    location: 'Aspen, Colorado',
    price: 500,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071',
    type: 'Villas',
  },
  {
    id: 4,
    name: 'City Center Apartment',
    location: 'San Francisco, CA',
    price: 180,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070',
    type: 'Apartments',
  },
  {
    id: 5,
    name: 'Luxury Boutique Hotel',
    location: 'Paris, France',
    price: 400,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070',
    type: 'Hotels',
  },
  {
    id: 6,
    name: 'Tropical Paradise Resort',
    location: 'Bali, Indonesia',
    price: 320,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2080',
    type: 'Resorts',
  },
  {
    id: 7,
    name: 'Countryside Villa',
    location: 'Tuscany, Italy',
    price: 450,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070',
    type: 'Villas',
  },
  {
    id: 8,
    name: 'Modern Loft Apartment',
    location: 'London, UK',
    price: 220,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080',
    type: 'Apartments',
  },
];

export function PropertyGridSection() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredProperties =
    activeFilter === 'All'
      ? properties
      : properties.filter((p) => p.type === activeFilter);

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
          {filteredProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
            >
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
