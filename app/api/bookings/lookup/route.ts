import { NextRequest, NextResponse } from 'next/server';
import { getBookingByNumberAndEmail } from '@/actions/public-booking.actions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingNumber, email } = body;

    if (!bookingNumber || !email) {
      return NextResponse.json(
        { success: false, error: 'Booking number and email are required' },
        { status: 400 }
      );
    }

    const result = await getBookingByNumberAndEmail(bookingNumber, email);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 404 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error looking up booking:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
