import { notFound } from 'next/navigation';
import { roomService } from '@/lib/services';
import { RoomForm } from '@/components/admin/forms/room-form';

interface EditRoomPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditRoomPage({ params }: EditRoomPageProps) {
  const { id } = await params;
  const room = await roomService.getRoomById(id);

  if (!room) {
    notFound();
  }

  // Convert Decimal to number for client component
  const roomData = {
    ...room,
    price: Number(room.price),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Room</h1>
        <p className="text-muted-foreground">
          Update room information and settings
        </p>
      </div>

      <RoomForm mode="edit" room={roomData} />
    </div>
  );
}
