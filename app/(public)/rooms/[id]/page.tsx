'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Users,
  Wifi,
  Car,
  Waves,
  Dumbbell,
  UtensilsCrossed,
  Wind,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RoomImageCarousel } from '@/components/public/room-image-carousel';
import { AvailabilityCalendar } from '@/components/public/availability-calendar';

// Mock data - in real app, this would come from API/database
const roomData: Record<string, any> = {
  '1': {
    id: 1,
    name: 'Grand Plaza Hotel',
    location: 'Downtown, New York',
    price: 250,
    rating: 4.8,
    reviews: 124,
    capacity: 2,
    type: 'Deluxe Room',
    description:
      'Experience luxury in the heart of downtown New York. Our Grand Plaza Hotel offers stunning city views, modern amenities, and exceptional service. Perfect for business travelers and tourists alike.',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2070',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070',
    ],
    amenities: [
      { icon: Wifi, label: 'Free WiFi' },
      { icon: Car, label: 'Free Parking' },
      { icon: Waves, label: 'Pool Access' },
      { icon: Dumbbell, label: 'Fitness Center' },
      { icon: UtensilsCrossed, label: 'Restaurant' },
      { icon: Wind, label: 'Air Conditioning' },
    ],
    features: [
      'King-size bed',
      'City view',
      'Work desk',
      'Mini bar',
      'Coffee maker',
      'Safe',
      'Flat-screen TV',
      'Bathroom with shower',
    ],
  },
};

export default function RoomDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const room = roomData[params.id];
  const [selectedDates, setSelectedDates] = useState<
    { from: Date; to: Date } | undefined
  >();

  if (!room) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Room not found</h1>
        <Button onClick={() => router.push('/rooms')} className="mt-4">
          Back to Rooms
        </Button>
      </div>
    );
  }

  const handleBookNow = () => {
    const params = new URLSearchParams();
    params.set('roomId', room.id);
    if (selectedDates) {
      params.set('checkIn', selectedDates.from.toISOString());
      params.set('checkOut', selectedDates.to.toISOString());
    }
    router.push(`/booking?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold md:text-4xl">{room.name}</h1>
              <div className="mt-2 flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{room.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>
                    {room.rating} ({room.reviews} reviews)
                  </span>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="text-lg">
              {room.type}
            </Badge>
          </div>
        </div>

        {/* Image Carousel */}
        <RoomImageCarousel images={room.images} roomName={room.name} />

        {/* Content Grid */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">About This Room</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {room.description}
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span>Up to {room.capacity} guests</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {room.amenities.map((amenity: any, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="rounded-full bg-teal-100 p-2 dark:bg-teal-900/30">
                        <amenity.icon className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                      </div>
                      <span className="text-sm">{amenity.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Room Features</h2>
                <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {room.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="text-3xl font-bold">${room.price}</div>
                  <div className="text-sm text-muted-foreground">per night</div>
                </div>

                <AvailabilityCalendar onDateSelect={setSelectedDates} />

                <Button
                  onClick={handleBookNow}
                  className="mt-4 w-full bg-teal-600 hover:bg-teal-700"
                  size="lg"
                >
                  Book Now
                </Button>

                <p className="mt-4 text-center text-xs text-muted-foreground">
                  You won&apos;t be charged yet
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
