'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/public/property-card';
import { StickySearchBar } from '@/components/public/sticky-search-bar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const filterTabs = ['All', 'Hotels', 'Resorts', 'Villas', 'Apartments'];

const allRooms = [
  {
    id: 1,
    name: 'Grand Plaza Hotel',
    location: 'Downtown, New York',
    price: 250,
    rating: 4.8,
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070',
    type: 'Hotels',
    capacity: 2,
  },
  {
    id: 2,
    name: 'Sunset Beach Resort',
    location: 'Miami Beach, Florida',
    price: 350,
    rating: 4.9,
    image:
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070',
    type: 'Resorts',
    capacity: 4,
  },
  {
    id: 3,
    name: 'Mountain View Villa',
    location: 'Aspen, Colorado',
    price: 500,
    rating: 5.0,
    image:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071',
    type: 'Villas',
    capacity: 6,
  },
  {
    id: 4,
    name: 'City Center Apartment',
    location: 'San Francisco, CA',
    price: 180,
    rating: 4.6,
    image:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070',
    type: 'Apartments',
    capacity: 2,
  },
  {
    id: 5,
    name: 'Luxury Boutique Hotel',
    location: 'Paris, France',
    price: 400,
    rating: 4.9,
    image:
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070',
    type: 'Hotels',
    capacity: 2,
  },
  {
    id: 6,
    name: 'Tropical Paradise Resort',
    location: 'Bali, Indonesia',
    price: 320,
    rating: 4.8,
    image:
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2080',
    type: 'Resorts',
    capacity: 4,
  },
  {
    id: 7,
    name: 'Countryside Villa',
    location: 'Tuscany, Italy',
    price: 450,
    rating: 4.9,
    image:
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070',
    type: 'Villas',
    capacity: 8,
  },
  {
    id: 8,
    name: 'Modern Loft Apartment',
    location: 'London, UK',
    price: 220,
    rating: 4.7,
    image:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080',
    type: 'Apartments',
    capacity: 3,
  },
  {
    id: 9,
    name: 'Oceanfront Hotel',
    location: 'Cancun, Mexico',
    price: 280,
    rating: 4.7,
    image:
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=2074',
    type: 'Hotels',
    capacity: 2,
  },
  {
    id: 10,
    name: 'Desert Oasis Resort',
    location: 'Dubai, UAE',
    price: 600,
    rating: 5.0,
    image:
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=2070',
    type: 'Resorts',
    capacity: 4,
  },
  {
    id: 11,
    name: 'Lake House Villa',
    location: 'Lake Como, Italy',
    price: 550,
    rating: 4.9,
    image:
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070',
    type: 'Villas',
    capacity: 6,
  },
  {
    id: 12,
    name: 'Downtown Studio',
    location: 'Tokyo, Japan',
    price: 150,
    rating: 4.5,
    image:
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?q=80&w=2070',
    type: 'Apartments',
    capacity: 1,
  },
];

function RoomsPageContent() {
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [capacity, setCapacity] = useState('any');
  const [filteredRooms, setFilteredRooms] = useState(allRooms);

  useEffect(() => {
    let filtered = allRooms;

    // Filter by type
    if (activeFilter !== 'All') {
      filtered = filtered.filter((room) => room.type === activeFilter);
    }

    // Filter by price range
    if (priceRange.min) {
      filtered = filtered.filter(
        (room) => room.price >= Number(priceRange.min)
      );
    }
    if (priceRange.max) {
      filtered = filtered.filter(
        (room) => room.price <= Number(priceRange.max)
      );
    }

    // Filter by capacity
    if (capacity && capacity !== 'any') {
      filtered = filtered.filter((room) => room.capacity >= Number(capacity));
    }

    setFilteredRooms(filtered);
  }, [activeFilter, priceRange, capacity]);

  return (
    <div>
      <StickySearchBar />

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold md:text-5xl">
            Find Your Perfect Stay
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Browse our collection of {filteredRooms.length} properties
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {filterTabs.map((tab) => (
            <Button
              key={tab}
              variant={activeFilter === tab ? 'default' : 'outline'}
              onClick={() => setActiveFilter(tab)}
              className={
                activeFilter === tab ? 'bg-teal-600 hover:bg-teal-700' : ''
              }
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* Advanced Filters */}
        <div className="mb-8 rounded-lg border bg-card p-4">
          <h3 className="mb-4 font-semibold">Filter Options</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Price Range</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, min: e.target.value })
                  }
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, max: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Minimum Capacity</Label>
              <Select value={capacity} onValueChange={setCapacity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select capacity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1">1+ Guests</SelectItem>
                  <SelectItem value="2">2+ Guests</SelectItem>
                  <SelectItem value="4">4+ Guests</SelectItem>
                  <SelectItem value="6">6+ Guests</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setActiveFilter('All');
                  setPriceRange({ min: '', max: '' });
                  setCapacity('any');
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        {filteredRooms.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg text-muted-foreground">
              No properties found matching your criteria.
            </p>
            <Button
              onClick={() => {
                setActiveFilter('All');
                setPriceRange({ min: '', max: '' });
                setCapacity('');
              }}
              className="mt-4"
            >
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {filteredRooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <PropertyCard property={room} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function RoomsPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-16 text-center">
          Loading...
        </div>
      }
    >
      <RoomsPageContent />
    </Suspense>
  );
}
