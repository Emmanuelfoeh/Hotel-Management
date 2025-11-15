'use client';

import { use, useState, useEffect } from 'react';
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
import { getPublicRoomById } from '@/actions/public-room.actions';

// Default amenities mapping based on room amenities array
const amenityIcons: Record<string, any> = {
  WiFi: Wifi,
  Parking: Car,
  Pool: Waves,
  Gym: Dumbbell,
  Restaurant: UtensilsCrossed,
  'Air Conditioning': Wind,
};

export default function RoomDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDates, setSelectedDates] = useState<
    { from: Date; to: Date } | undefined
  >();

  useEffect(() => {
    async function fetchRoom() {
      setLoading(true);
      const result = await getPublicRoomById(id);
      if (result.success && result.data) {
        setRoom(result.data);
      }
      setLoading(false);
    }
    fetchRoom();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-lg text-muted-foreground">Loading room details...</p>
      </div>
    );
  }

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

  // Map amenities to icons
  const amenitiesWithIcons =
    room.amenities?.map((amenity: string) => ({
      icon: amenityIcons[amenity] || Wifi,
      label: amenity,
    })) || [];

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
                  <span>Room {room.roomNumber}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>Up to {room.capacity} guests</span>
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
                  {room.description ||
                    'A comfortable and well-appointed room with modern amenities.'}
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span>Up to {room.capacity} guests</span>
                  </div>
                  {room.floor && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Floor {room.floor}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            {amenitiesWithIcons.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {amenitiesWithIcons.map((amenity: any, index: number) => (
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
            )}
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

                <AvailabilityCalendar
                  onDateSelect={setSelectedDates}
                  bookings={room.bookings}
                />

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
