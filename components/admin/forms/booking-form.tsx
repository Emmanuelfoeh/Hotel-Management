'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, SearchIcon, PlusIcon, Loader2Icon } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { createBooking } from '@/actions/booking.actions';
import { createCustomer } from '@/actions/customer.actions';
import { toast } from 'sonner';
import { RoomType } from '@/types';

const bookingFormSchema = z
  .object({
    customerId: z.string().min(1, 'Customer is required'),
    roomId: z.string().min(1, 'Room is required'),
    checkInDate: z.date({
      message: 'Check-in date is required',
    }),
    checkOutDate: z.date({
      message: 'Check-out date is required',
    }),
    numberOfGuests: z
      .number({
        message: 'Number of guests is required',
      })
      .int()
      .positive('Number of guests must be positive')
      .max(20, 'Number of guests cannot exceed 20'),
    specialRequests: z.string().optional(),
  })
  .refine((data) => data.checkOutDate > data.checkInDate, {
    message: 'Check-out date must be after check-in date',
    path: ['checkOutDate'],
  });

type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface Room {
  id: string;
  name: string;
  roomNumber: string;
  type: RoomType;
  price: any;
  capacity: number;
}

interface BookingFormProps {
  customers: Customer[];
  rooms: Room[];
}

export function BookingForm({ customers, rooms }: BookingFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState(customers);
  const [availableRooms, setAvailableRooms] = useState(rooms);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [totalAmount, setTotalAmount] = useState(0);

  // New customer form
  const [newCustomer, setNewCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      customerId: '',
      roomId: '',
      numberOfGuests: 1,
      specialRequests: '',
    },
  });

  const checkInDate = form.watch('checkInDate');
  const checkOutDate = form.watch('checkOutDate');
  const roomId = form.watch('roomId');

  // Filter customers based on search
  useEffect(() => {
    if (customerSearch) {
      const filtered = customers.filter(
        (customer) =>
          customer.firstName
            .toLowerCase()
            .includes(customerSearch.toLowerCase()) ||
          customer.lastName
            .toLowerCase()
            .includes(customerSearch.toLowerCase()) ||
          customer.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
          customer.phone.includes(customerSearch)
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [customerSearch, customers]);

  // Calculate total amount when dates or room changes
  useEffect(() => {
    if (checkInDate && checkOutDate && selectedRoom) {
      const nights = differenceInDays(checkOutDate, checkInDate);
      const amount = nights * Number(selectedRoom.price);
      setTotalAmount(amount);
    } else {
      setTotalAmount(0);
    }
  }, [checkInDate, checkOutDate, selectedRoom]);

  // Update selected room when roomId changes
  useEffect(() => {
    if (roomId) {
      const room = rooms.find((r) => r.id === roomId);
      setSelectedRoom(room || null);
    } else {
      setSelectedRoom(null);
    }
  }, [roomId, rooms]);

  const handleCreateNewCustomer = async () => {
    if (
      !newCustomer.firstName ||
      !newCustomer.lastName ||
      !newCustomer.email ||
      !newCustomer.phone
    ) {
      toast.error('Please fill in all customer fields');
      return;
    }

    const result = await createCustomer(newCustomer);
    if (result.success && result.data) {
      toast.success('Customer created successfully');
      form.setValue('customerId', result.data.id);
      setShowNewCustomerForm(false);
      setNewCustomer({ firstName: '', lastName: '', email: '', phone: '' });
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to create customer');
    }
  };

  const onSubmit = async (data: BookingFormValues) => {
    if (!selectedRoom) {
      toast.error('Please select a room');
      return;
    }

    setIsSubmitting(true);

    const bookingData = {
      customerId: data.customerId,
      roomId: data.roomId,
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
      numberOfGuests: data.numberOfGuests,
      totalAmount,
      specialRequests: data.specialRequests,
      source: 'MANUAL' as const,
    };

    const result = await createBooking(bookingData);

    if (result.success) {
      toast.success('Booking created successfully');
      router.push('/admin/bookings');
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to create booking');
    }

    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Customer Selection */}
        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Customer Information</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowNewCustomerForm(!showNewCustomerForm)}
            >
              <PlusIcon />
              {showNewCustomerForm ? 'Cancel' : 'New Customer'}
            </Button>
          </div>

          {showNewCustomerForm ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">First Name</label>
                  <Input
                    value={newCustomer.firstName}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        firstName: e.target.value,
                      })
                    }
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Last Name</label>
                  <Input
                    value={newCustomer.lastName}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        lastName: e.target.value,
                      })
                    }
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, email: e.target.value })
                  }
                  placeholder="john.doe@example.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={newCustomer.phone}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, phone: e.target.value })
                  }
                  placeholder="+234 800 000 0000"
                />
              </div>
              <Button
                type="button"
                onClick={handleCreateNewCustomer}
                className="w-full"
              >
                Create Customer
              </Button>
            </div>
          ) : (
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Customer</FormLabel>
                  <div className="space-y-2">
                    <div className="relative">
                      <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, email, or phone..."
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a customer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredCustomers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.firstName} {customer.lastName} -{' '}
                            {customer.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Booking Details */}
        <div className="space-y-4 rounded-lg border p-4">
          <h3 className="text-lg font-semibold">Booking Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="checkInDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Check-In Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto size-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="checkOutDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Check-Out Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto size-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date <= (checkInDate || new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="roomId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Room</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a room" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableRooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        {room.name} - Room {room.roomNumber} (₦
                        {Number(room.price).toLocaleString()}/night)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  {checkInDate && checkOutDate
                    ? 'Showing available rooms for selected dates'
                    : 'Select dates to see available rooms'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numberOfGuests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Guests</FormLabel>
                <FormControl>
                  <Input type="number" min={1} max={20} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="specialRequests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Requests (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any special requests or notes..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Price Summary */}
        {selectedRoom && checkInDate && checkOutDate && (
          <div className="rounded-lg border bg-muted/50 p-4">
            <h3 className="mb-4 text-lg font-semibold">Price Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  ₦{Number(selectedRoom.price).toLocaleString()} x{' '}
                  {differenceInDays(checkOutDate, checkInDate)} nights
                </span>
                <span className="font-medium">
                  ₦{totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span>₦{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2Icon className="animate-spin" />}
            Create Booking
          </Button>
        </div>
      </form>
    </Form>
  );
}
