import { Suspense } from 'react';
import { roomService } from '@/lib/services';
import { RoomsTable } from '@/components/admin/tables/rooms-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { RoomSearchFilters } from '@/lib/services/room.service';

interface RoomsPageProps {
  searchParams: Promise<{
    query?: string;
    type?: string;
    status?: string;
  }>;
}

export default async function RoomsPage({ searchParams }: RoomsPageProps) {
  const params = await searchParams;

  const filters: RoomSearchFilters = {
    query: params.query,
    type: params.type as any,
    status: params.status as any,
  };

  const rooms = await roomService.getRooms(filters);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Rooms Management</h1>
          <p className="text-muted-foreground">
            Manage hotel rooms, availability, and pricing
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/rooms/new">
            <PlusIcon />
            Add New Room
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Rooms</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading...</div>}>
            <RoomsTable rooms={rooms} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
