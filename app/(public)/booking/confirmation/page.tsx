'use client';

import { useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Download, Mail, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

function BookingConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  useEffect(() => {
    if (!bookingId) {
      router.push('/');
    }
  }, [bookingId, router]);

  // Mock booking data - using useMemo to avoid impure function calls during render
  const bookingData = {
    bookingNumber: bookingId?.toUpperCase() || 'BOOKING123',
    roomName: 'Grand Plaza Hotel',
    location: 'Downtown, New York',
    checkIn: new Date(new Date().getTime() + 86400000 * 7).toLocaleDateString(),
    checkOut: new Date(
      new Date().getTime() + 86400000 * 10
    ).toLocaleDateString(),
    guests: 2,
    total: 825.0,
    guestName: 'John Doe',
    email: 'john.doe@example.com',
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl text-center"
      >
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-6 flex justify-center"
        >
          <div className="rounded-full bg-green-100 p-6 dark:bg-green-900/30">
            <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold md:text-4xl"
        >
          Booking Confirmed!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-lg text-muted-foreground"
        >
          Thank you for your booking. We&apos;ve sent a confirmation email to{' '}
          <span className="font-medium text-foreground">
            {bookingData.email}
          </span>
        </motion.p>

        {/* Booking Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card>
            <CardContent className="p-6 text-left">
              <div className="mb-6 flex items-center justify-between border-b pb-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Booking Number
                  </p>
                  <p className="text-2xl font-bold">
                    {bookingData.bookingNumber}
                  </p>
                </div>
                <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  Confirmed
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {bookingData.roomName}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{bookingData.location}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/50 p-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Check-in</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">{bookingData.checkIn}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Check-out</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">
                        {bookingData.checkOut}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t pt-4">
                  <span className="text-lg font-semibold">Total Paid</span>
                  <span className="text-2xl font-bold text-teal-600">
                    ${bookingData.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.print()}
            className="gap-2"
          >
            <Download className="h-5 w-5" />
            Download Receipt
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push('/')}
            className="gap-2"
          >
            <Mail className="h-5 w-5" />
            Resend Email
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <Button
            onClick={() => router.push('/')}
            className="bg-teal-600 hover:bg-teal-700"
            size="lg"
          >
            Back to Home
          </Button>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 rounded-lg bg-muted/50 p-6 text-left"
        >
          <h3 className="font-semibold mb-2">What&apos;s Next?</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <div className="mt-1 h-1.5 w-1.5 rounded-full bg-teal-600 flex-shrink-0" />
              <span>
                You&apos;ll receive a confirmation email with your booking
                details and check-in instructions.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1 h-1.5 w-1.5 rounded-full bg-teal-600 flex-shrink-0" />
              <span>
                Check-in time is 3:00 PM. Early check-in may be available upon
                request.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1 h-1.5 w-1.5 rounded-full bg-teal-600 flex-shrink-0" />
              <span>
                If you have any questions, feel free to contact us at
                info@hotel.com or +1 (234) 567-890.
              </span>
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-16 text-center">
          Loading...
        </div>
      }
    >
      <BookingConfirmationContent />
    </Suspense>
  );
}
