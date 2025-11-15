'use client';

import { useEffect, Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  CheckCircle,
  Download,
  Mail,
  Calendar,
  MapPin,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  useBookingByReference,
  useResendConfirmation,
  BookingByReferenceResponse,
  ResendConfirmationResponse,
} from '@/hooks/use-booking';
import { verifyPaymentAction } from '@/actions/payment.actions';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function BookingConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');
  const resendConfirmation = useResendConfirmation();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const { data, isLoading, error } = useBookingByReference(reference) as {
    data: BookingByReferenceResponse | undefined;
    isLoading: boolean;
    error: any;
  };

  useEffect(() => {
    if (!reference) {
      router.push('/');
      return;
    }

    // Verify payment when page loads
    const verifyPayment = async () => {
      const result = await verifyPaymentAction(reference);
      if (!result.success) {
        console.error('Payment verification failed:', result.error);
      }
    };

    verifyPayment();
  }, [reference, router]);

  const handleDownloadReceipt = () => {
    if (!data?.booking) return;

    setIsGeneratingPDF(true);
    try {
      const booking = data.booking;
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
      pdf.setTextColor(20, 184, 166);
      pdf.text('Payment Receipt', margin, yPos);

      yPos += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Booking Number: ${booking.bookingNumber}`, margin, yPos);

      yPos += 5;
      pdf.setFontSize(9);
      pdf.text(`Payment Status: PAID`, margin, yPos);

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
          ['Room Name', booking.room.name],
          ['Room Number', booking.room.roomNumber],
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
            new Date(booking.checkInDate).toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
          ],
          [
            'Check-out',
            new Date(booking.checkOutDate).toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
          ],
          ['Number of Guests', booking.numberOfGuests.toString()],
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
            `${booking.customer.firstName} ${booking.customer.lastName}`,
          ],
          ['Email', booking.customer.email],
          ['Phone', booking.customer.phone],
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

      // Payment Summary
      pdf.setFontSize(14);
      pdf.text('Payment Summary', margin, yPos);
      yPos += 8;

      autoTable(pdf, {
        startY: yPos,
        head: [],
        body: [
          ['Total Amount', `$${Number(booking.totalAmount).toFixed(2)}`],
          ['Payment Status', 'PAID'],
          [
            'Payment Date',
            data.payment?.paidAt
              ? new Date(data.payment.paidAt).toLocaleDateString()
              : 'N/A',
          ],
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
        'Thank you for your payment. This is your official receipt.',
        pageWidth / 2,
        finalY,
        { align: 'center' }
      );

      pdf.save(`receipt-${booking.bookingNumber}.pdf`);

      toast.success('Receipt downloaded successfully');
    } catch (error) {
      console.error('Error generating receipt:', error);
      toast.error('Failed to generate receipt. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleResendEmail = async () => {
    if (!data?.booking?.bookingNumber) return;

    resendConfirmation.mutate(data.booking.bookingNumber, {
      onSuccess: (response: ResendConfirmationResponse) => {
        if (response.success) {
          toast.success('Confirmation email sent successfully!');
        } else {
          toast.error(response.error || 'Failed to send email');
        }
      },
      onError: () => {
        toast.error('Failed to send confirmation email');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-teal-600" />
        <p className="mt-4 text-muted-foreground">Loading booking details...</p>
      </div>
    );
  }

  if (error || !data?.success || !data?.booking) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6">
            <div className="text-red-600 mb-4">
              <CheckCircle className="h-16 w-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Booking Not Found</h2>
            <p className="text-muted-foreground mb-4">
              We couldn't find your booking. Please check your email for the
              confirmation link.
            </p>
            <Button onClick={() => router.push('/')}>Go to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const booking = data.booking;
  const payment = data.payment;

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
            {booking.customer.email}
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
                  <p className="text-2xl font-bold">{booking.bookingNumber}</p>
                </div>
                <div
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    payment?.paymentStatus === 'PAID'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}
                >
                  {payment?.paymentStatus === 'PAID' ? 'Paid' : 'Pending'}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{booking.room.name}</h3>
                  <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Room {booking.room.roomNumber}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/50 p-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Check-in</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">
                        {new Date(booking.checkInDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Check-out</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">
                        {new Date(booking.checkOutDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">Guests</p>
                  <p className="font-medium">{booking.numberOfGuests} guests</p>
                </div>

                {booking.specialRequests && (
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground">
                      Special Requests
                    </p>
                    <p className="font-medium">{booking.specialRequests}</p>
                  </div>
                )}

                <div className="flex items-center justify-between border-t pt-4">
                  <span className="text-lg font-semibold">Total Paid</span>
                  <span className="text-2xl font-bold text-teal-600">
                    ${Number(booking.totalAmount).toFixed(2)}
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
            onClick={handleDownloadReceipt}
            disabled={isGeneratingPDF}
            className="gap-2"
          >
            <Download className="h-5 w-5" />
            {isGeneratingPDF ? 'Generating...' : 'Download Receipt'}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleResendEmail}
            disabled={resendConfirmation.isPending}
            className="gap-2"
          >
            <Mail className="h-5 w-5" />
            {resendConfirmation.isPending ? 'Sending...' : 'Resend Email'}
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
            <li className="flex items-start gap-2">
              <div className="mt-1 h-1.5 w-1.5 rounded-full bg-teal-600 flex-shrink-0" />
              <span>
                You can view your booking anytime using your booking number:{' '}
                <strong>{booking.bookingNumber}</strong>
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
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-teal-600" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <BookingConfirmationContent />
    </Suspense>
  );
}
