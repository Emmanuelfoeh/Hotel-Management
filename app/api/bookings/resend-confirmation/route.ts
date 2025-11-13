import { NextRequest, NextResponse } from 'next/server';
import { resendBookingConfirmation } from '@/actions/public-booking.actions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingNumber } = body;

    if (!bookingNumber) {
      return NextResponse.json(
        { success: false, error: 'Booking number is required' },
        { status: 400 }
      );
    }

    const result = await resendBookingConfirmation(bookingNumber);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error resending confirmation:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
