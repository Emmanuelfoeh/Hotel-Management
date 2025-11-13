'use client';

import { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { useCreateBooking } from '@/hooks/use-booking';
import { toast } from 'sonner';

const bookingSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().optional(),
  specialRequests: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const steps = [
  { id: 1, name: 'Guest Information' },
  { id: 2, name: 'Review & Payment' },
];

function BookingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const createBooking = useCreateBooking();

  const roomId = searchParams.get('roomId') || 'default-room-id';
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const guests = parseInt(searchParams.get('guests') || '2');

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      specialRequests: '',
    },
  });

  // Mock room data - TODO: Fetch from API
  const roomData = {
    name: 'Grand Plaza Hotel',
    price: 250,
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070',
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    return nights > 0 ? nights : 1;
  };

  const nights = calculateNights();
  const subtotal = roomData.price * nights;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleNext = async () => {
    if (currentStep === 1) {
      const isValid = await form.trigger();
      if (isValid) {
        setCurrentStep(2);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: BookingFormData) => {
    if (!checkIn || !checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    createBooking.mutate(
      {
        roomId,
        customerEmail: data.email,
        customerFirstName: data.firstName,
        customerLastName: data.lastName,
        customerPhone: data.phone,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        numberOfGuests: guests,
        totalAmount: total,
        specialRequests: data.specialRequests,
      },
      {
        onSuccess: (response) => {
          if (response.success && response.payment) {
            // Redirect to Paystack payment page
            window.location.href = response.payment.authorizationUrl;
          } else {
            toast.error(response.error || 'Failed to create booking');
          }
        },
        onError: (error: any) => {
          toast.error(error.message || 'Failed to create booking');
        },
      }
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                      currentStep >= step.id
                        ? 'border-teal-600 bg-teal-600 text-white'
                        : 'border-muted-foreground text-muted-foreground'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className="mt-2 text-sm font-medium">{step.name}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-4 h-0.5 w-24 ${
                      currentStep > step.id ? 'bg-teal-600' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle>Guest Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>First Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="John" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="lastName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Last Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Doe" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
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

                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input
                                    type="tel"
                                    placeholder="+1 (234) 567-8900"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Address (Optional)</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="123 Main St, City, State"
                                    {...field}
                                  />
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
                                <FormLabel>
                                  Special Requests (Optional)
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Any special requirements or requests..."
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle>Review & Payment</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div>
                            <h3 className="font-semibold mb-2">
                              Guest Details
                            </h3>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <p>
                                {form.getValues('firstName')}{' '}
                                {form.getValues('lastName')}
                              </p>
                              <p>{form.getValues('email')}</p>
                              <p>{form.getValues('phone')}</p>
                            </div>
                          </div>

                          <div className="rounded-lg border bg-muted/50 p-4">
                            <p className="text-sm text-muted-foreground mb-2">
                              Payment will be processed securely through
                              Paystack
                            </p>
                            <Button
                              type="submit"
                              disabled={createBooking.isPending}
                              className="w-full bg-teal-600 hover:bg-teal-700"
                              size="lg"
                            >
                              {createBooking.isPending
                                ? 'Processing...'
                                : 'Proceed to Payment'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="mt-6 flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>

                  {currentStep < steps.length && (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="bg-teal-600 hover:bg-teal-700"
                    >
                      Next
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>

          {/* Booking Summary Sidebar */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video w-full overflow-hidden rounded-lg">
                  <img
                    src={roomData.image}
                    alt={roomData.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <h3 className="font-semibold">{roomData.name}</h3>
                  {checkIn && checkOut && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(checkIn).toLocaleDateString()} -{' '}
                      {new Date(checkOut).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span>
                      ${roomData.price} x {nights} night{nights > 1 ? 's' : ''}
                    </span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxes & fees</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-16 text-center">
          Loading...
        </div>
      }
    >
      <BookingPageContent />
    </Suspense>
  );
}
