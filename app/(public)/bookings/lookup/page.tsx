'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Search,
  Calendar,
  MapPin,
  Mail,
  Phone,
  User,
  XCircle,
  Download,
} from 'lucide-react';
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
import { cancelPublicBooking } from '@/actions/public-booking.actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const lookupSchema = z.object({
  bookingNumber: z.string().min(1, 'Booking number is required').toUpperCase(),
  email: z.string().email('Invalid email address'),
});

type LookupFormData = z.infer<typeof lookupSchema>;

export default function BookingLookupPage() {
  const [bookingData, setBookingData] = useState<any>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const bookingLookup = useBookingLookup();

  const form = useForm<LookupFormData>({
    resolver: zodResolver(lookupSchema),
    defaultValues: {
      bookingNumber: '',
      email: '',
    },
  });

  const handleDownloadPDF = () => {
    if (!bookingData) return;

    setIsGeneratingPDF(true);
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 15;
      let yPos = 20;

      // Header
      pdf.setFontSize(20);
      pdf.setTextColor(20, 184, 166); // Teal color
      pdf.text('Booking Confirmation', margin, yPos);

      yPos += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Booking Number: ${bookingData.bookingNumber}`, margin, yPos);

      yPos += 5;
      pdf.setFontSize(9);
      pdf.text(
        `Status: ${bookingData.bookingStatus.replace('_', ' ')}`,
        margin,
        yPos
      );

      yPos += 10;
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, yPos, pageWidth - margin, yPos);

      yPos += 10;

      // Room Information
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Room Information', margin, yPos);
      yPos += 8;

      autoTable(pdf, {
        startY: yPos,
        head: [],
        body: [
          ['Room Name', bookingData.room.name],
          ['Room Number', bookingData.room.roomNumber],
          ['Room Type', bookingData.room.type],
        ],
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 3 },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 50 },
          1: { cellWidth: 'auto' },
        },
        margin: { left: margin },
      });

      yPos = (pdf as any).lastAutoTable.finalY + 10;

      // Booking Details
      pdf.setFontSize(14);
      pdf.text('Booking Details', margin, yPos);
      yPos += 8;

      autoTable(pdf, {
        startY: yPos,
        head: [],
        body: [
          [
            'Check-in',
            new Date(bookingData.checkInDate).toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
          ],
          [
            'Check-out',
            new Date(bookingData.checkOutDate).toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
          ],
          ['Number of Guests', bookingData.numberOfGuests.toString()],
          ...(bookingData.specialRequests
            ? [['Special Requests', bookingData.specialRequests]]
            : []),
        ],
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 3 },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 50 },
          1: { cellWidth: 'auto' },
        },
        margin: { left: margin },
      });

      yPos = (pdf as any).lastAutoTable.finalY + 10;

      // Guest Information
      pdf.setFontSize(14);
      pdf.text('Guest Information', margin, yPos);
      yPos += 8;

      autoTable(pdf, {
        startY: yPos,
        head: [],
        body: [
          [
            'Name',
            `${bookingData.customer.firstName} ${bookingData.customer.lastName}`,
          ],
          ['Email', bookingData.customer.email],
          ['Phone', bookingData.customer.phone],
        ],
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 3 },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 50 },
          1: { cellWidth: 'auto' },
        },
        margin: { left: margin },
      });

      yPos = (pdf as any).lastAutoTable.finalY + 10;

      // Payment Information
      pdf.setFontSize(14);
      pdf.text('Payment Information', margin, yPos);
      yPos += 8;

      autoTable(pdf, {
        startY: yPos,
        head: [],
        body: [
          ['Total Amount', `$${Number(bookingData.totalAmount).toFixed(2)}`],
          ['Payment Status', bookingData.paymentStatus],
        ],
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 3 },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 50 },
          1: { cellWidth: 'auto' },
        },
        margin: { left: margin },
      });

      // Footer
      const finalY = (pdf as any).lastAutoTable.finalY + 20;
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(
        'Thank you for choosing our hotel. We look forward to welcoming you!',
        pageWidth / 2,
        finalY,
        { align: 'center' }
      );

      pdf.save(`booking-${bookingData.bookingNumber}.pdf`);

      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!bookingData) return;

    setIsCancelling(true);
    try {
      const result = await cancelPublicBooking(
        bookingData.bookingNumber,
        bookingData.customer.email
      );

      if (result.success) {
        toast.success('Booking cancelled successfully');
        // Refresh the booking data
        setBookingData({
          ...bookingData,
          bookingStatus: 'CANCELLED',
        });
      } else {
        toast.error(result.error || 'Failed to cancel booking');
      }
    } catch (error) {
      toast.error('An error occurred while cancelling the booking');
    } finally {
      setIsCancelling(false);
    }
  };

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
                <div className="flex flex-col gap-3">
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handleDownloadPDF}
                      disabled={isGeneratingPDF}
                      className="flex-1"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
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

                  {/* Cancel Booking Button - Only show if booking can be cancelled */}
                  {bookingData.bookingStatus === 'CONFIRMED' && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          className="w-full"
                          disabled={isCancelling}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Cancel Booking
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to cancel this booking? This
                            action cannot be undone. You will receive a
                            cancellation confirmation email.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            No, Keep Booking
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleCancelBooking}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Yes, Cancel Booking
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
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
