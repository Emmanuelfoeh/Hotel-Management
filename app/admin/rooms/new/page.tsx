import { RoomForm } from '@/components/admin/forms/room-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewRoomPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Room</h1>
        <p className="text-muted-foreground">
          Create a new room in the hotel inventory
        </p>
      </div>

      <RoomForm mode="create" />
    </div>
  );
}
