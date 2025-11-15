import { notFound } from 'next/navigation';
import { roomService } from '@/lib/services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EditIcon } from 'lucide-react';
import Link from 'next/link';
import { RoomStatus, RoomType } from '@/types';

export const dynamic = 'force-dynamic';

interface RoomDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RoomDetailsPage({
  params,
}: RoomDetailsPageProps) {
  const { id } = await params;
  const room = await roomService.getRoomById(id);

  if (!room) {
    notFound();
  }

  const getStatusBadge = (status: RoomStatus) => {
    const variants: Record<
      RoomStatus,
      'default' | 'secondary' | 'destructive'
    > = {
      AVAILABLE: 'default',
      OCCUPIED: 'secondary',
      MAINTENANCE: 'destructive',
    };

    const labels: Record<RoomStatus, string> = {
      AVAILABLE: 'Available',
      OCCUPIED: 'Occupied',
      MAINTENANCE: 'Maintenance',
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const getRoomTypeLabel = (type: RoomType) => {
    const labels: Record<RoomType, string> = {
      SINGLE: 'Single',
      DOUBLE: 'Double',
      SUITE: 'Suite',
      DELUXE: 'Deluxe',
      PRESIDENTIAL: 'Presidential',
    };
    return labels[type];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {room.name} - Room {room.roomNumber}
          </h1>
          <p className="text-muted-foreground">
            View room details and bookings
          </p>
        </div>
        <Button asChild>
          <Link href={`/admin/rooms/${room.id}/edit`}>
            <EditIcon />
            Edit Room
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Room Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Room Number</p>
                <p className="font-medium">{room.roomNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-medium">{getRoomTypeLabel(room.type)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Floor</p>
                <p className="font-medium">{room.floor ?? 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Capacity</p>
                <p className="font-medium">{room.capacity} guests</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Price per Night</p>
                <p className="font-medium">
                  ₦{Number(room.price).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <div>{getStatusBadge(room.status)}</div>
              </div>
            </div>

            {room.description && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Description
                </p>
                <p className="text-sm">{room.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            {room.amenities.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {room.amenities.map((amenity) => (
                  <Badge key={amenity} variant="secondary">
                    {amenity}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No amenities listed
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {room.images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Room Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {room.images.map((image, index) => (
                <div
                  key={index}
                  className="aspect-video overflow-hidden rounded-lg border"
                >
                  <img
                    src={image}
                    alt={`${room.name} - Image ${index + 1}`}
                    className="size-full object-cover"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {room.bookings && room.bookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {room.bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">
                      Booking #{booking.bookingNumber}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(booking.checkInDate).toLocaleDateString()} -{' '}
                      {new Date(booking.checkOutDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    variant={
                      booking.bookingStatus === 'CONFIRMED'
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {booking.bookingStatus}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
