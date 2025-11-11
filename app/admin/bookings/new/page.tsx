import { BookingForm } from '@/components/admin/forms/booking-form';
import { customerService } from '@/lib/services/customer.service';
import { roomService } from '@/lib/services/room.service';

async function getFormData() {
  const [customers, rooms] = await Promise.all([
    customerService.getCustomers(),
    roomService.getRooms({ status: 'AVAILABLE' }),
  ]);

  return { customers, rooms };
}

export default async function NewBookingPage() {
  const { customers, rooms } = await getFormData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Create New Booking
        </h1>
        <p className="text-muted-foreground">
          Create a manual booking for a customer
        </p>
      </div>

      {/* Booking Form */}
      <BookingForm customers={customers} rooms={rooms} />
    </div>
  );
}
