import { NextRequest, NextResponse } from 'next/server';
import { createPublicBooking } from '@/actions/public-booking.actions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await createPublicBooking(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
