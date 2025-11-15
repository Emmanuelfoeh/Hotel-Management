'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
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
import { getPublicRooms } from '@/actions/public-room.actions';
import { RoomType } from '@/types';

const filterTabs = [
  'All',
  'SINGLE',
  'DOUBLE',
  'SUITE',
  'DELUXE',
  'PRESIDENTIAL',
];

interface Room {
  id: string;
  name: string;
  type: RoomType;
  price: number;
  capacity: number;
  images: string[];
  description: string | null;
  roomNumber: string;
}

function RoomsPageContent() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [capacity, setCapacity] = useState('any');
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch rooms from API
  useEffect(() => {
    async function fetchRooms() {
      setLoading(true);
      const result = await getPublicRooms();
      if (result.success && result.data) {
        setAllRooms(result.data);
        setFilteredRooms(result.data);
      }
      setLoading(false);
    }
    fetchRooms();
  }, []);

  // Filter rooms based on selected criteria
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
  }, [activeFilter, priceRange, capacity, allRooms]);

  if (loading) {
    return (
      <div>
        <StickySearchBar />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-lg text-muted-foreground">Loading rooms...</p>
        </div>
      </div>
    );
  }

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
