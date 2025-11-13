'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Search, Calendar, MapPin, Mail, Phone, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useBookingLookup } from '@/hooks/use-booking';
import { toast } from 'sonner';

const lookupSchema = z.object({
  bookingNumber: z.string().min(1, 'Booking number is required').toUpperCase(),
  email: z.string().email('Invalid email address'),
});

type LookupFormData = z.infer<typeof lookupSchema>;

export default function BookingLookupPage() {
  const [bookingData, setBookingData] = useState<any>(null);
  const bookingLookup = useBookingLookup();

  const form = useForm<LookupFormData>({
    resolver: zodResolver(lookupSchema),
    defaultValues: {
      bookingNumber: '',
      email: '',
    },
  });

  const onSubmit = async (data: LookupFormData) => {
    bookingLookup.mutate(data, {
      onSuccess: (response) => {
        if (response.success && response.booking) {
          setBookingData(response.booking);
          toast.success('Booking found!');
        } else {
          setBookingData(null);
          toast.error(
            response.error || 'Booking not found or email does not match'
          );
        }
      },
      onError: (error: any) => {
        setBookingData(null);
        toast.error(error.message || 'Failed to lookup booking');
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-4xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold md:text-4xl">Find Your Booking</h1>
          <p className="mt-2 text-muted-foreground">
            Enter your booking number and email to view your reservation details
          </p>
        </div>

        {/* Lookup Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Booking Lookup</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="bookingNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Booking Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="BK20240101001"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john.doe@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700"
                  disabled={bookingLookup.isPending}
                >
                  <Search className="mr-2 h-4 w-4" />
                  {bookingLookup.isPending ? 'Searching...' : 'Find Booking'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Booking Details */}
        {bookingData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Booking Details</CardTitle>
                  <div
                    className={`rounded-full px-4 py-2 text-sm font-medium ${
                      bookingData.bookingStatus === 'CONFIRMED'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : bookingData.bookingStatus === 'CHECKED_IN'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : bookingData.bookingStatus === 'CHECKED_OUT'
                            ? 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}
                  >
                    {bookingData.bookingStatus.replace('_', ' ')}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Booking Number */}
                <div>
                  <p className="text-sm text-muted-foreground">
                    Booking Number
                  </p>
                  <p className="text-2xl font-bold">
                    {bookingData.bookingNumber}
                  </p>
                </div>

                {/* Room Details */}
                <div className="rounded-lg bg-muted/50 p-4">
                  <h3 className="font-semibold mb-2">Room Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {bookingData.room.name}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Room Number: {bookingData.room.roomNumber}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Type: {bookingData.room.type}
                    </p>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-lg bg-muted/50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Check-in</p>
                    </div>
                    <p className="font-medium">
                      {new Date(bookingData.checkInDate).toLocaleDateString(
                        'en-US',
                        {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }
                      )}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Check-out</p>
                    </div>
                    <p className="font-medium">
                      {new Date(bookingData.checkOutDate).toLocaleDateString(
                        'en-US',
                        {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }
                      )}
                    </p>
                  </div>
                </div>

                {/* Guest Information */}
                <div className="rounded-lg bg-muted/50 p-4">
                  <h3 className="font-semibold mb-2">Guest Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {bookingData.customer.firstName}{' '}
                        {bookingData.customer.lastName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{bookingData.customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{bookingData.customer.phone}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Number of Guests: {bookingData.numberOfGuests}
                    </p>
                  </div>
                </div>

                {/* Special Requests */}
                {bookingData.specialRequests && (
                  <div className="rounded-lg bg-muted/50 p-4">
                    <h3 className="font-semibold mb-2">Special Requests</h3>
                    <p className="text-sm">{bookingData.specialRequests}</p>
                  </div>
                )}

                {/* Payment Information */}
                <div className="rounded-lg border-2 border-teal-600/20 bg-teal-50 dark:bg-teal-900/10 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Amount
                      </p>
                      <p className="text-2xl font-bold text-teal-600">
                        ${Number(bookingData.totalAmount).toFixed(2)}
                      </p>
                    </div>
                    <div
                      className={`rounded-full px-4 py-2 text-sm font-medium ${
                        bookingData.paymentStatus === 'PAID'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}
                    >
                      {bookingData.paymentStatus}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => window.print()}
                    className="flex-1"
                  >
                    Print Details
                  </Button>
                  <Button
                    onClick={() => {
                      setBookingData(null);
                      form.reset();
                    }}
                    className="flex-1 bg-teal-600 hover:bg-teal-700"
                  >
                    New Search
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 rounded-lg bg-muted/50 p-6"
        >
          <h3 className="font-semibold mb-2">Need Help?</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <div className="mt-1 h-1.5 w-1.5 rounded-full bg-teal-600 flex-shrink-0" />
              <span>
                Your booking number can be found in the confirmation email sent
                to you after booking.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1 h-1.5 w-1.5 rounded-full bg-teal-600 flex-shrink-0" />
              <span>
                Make sure to use the same email address you used when making the
                booking.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1 h-1.5 w-1.5 rounded-full bg-teal-600 flex-shrink-0" />
              <span>
                If you can&apos;t find your booking, please contact us at
                info@hotel.com or +1 (234) 567-890.
              </span>
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
}
