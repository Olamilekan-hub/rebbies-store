import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json(
        { error: 'Payment reference is required' },
        { status: 400 }
      );
    }

    // Validate environment variables
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
      return NextResponse.json(
        { error: 'Paystack configuration not found' },
        { status: 500 }
      );
    }

    // Verify payment with Paystack
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${paystackSecret}`,
        'Content-Type': 'application/json',
      },
    });

    const paystackResponse = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Payment verification failed', details: paystackResponse },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: paystackResponse.data,
      message: 'Payment verified successfully'
    });

  } catch (error) {
    console.error('Paystack verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reference } = body;

    if (!reference) {
      return NextResponse.json(
        { error: 'Payment reference is required' },
        { status: 400 }
      );
    }

    // Validate environment variables
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
      return NextResponse.json(
        { error: 'Paystack configuration not found' },
        { status: 500 }
      );
    }

    // Verify payment with Paystack
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${paystackSecret}`,
        'Content-Type': 'application/json',
      },
    });

    const paystackResponse = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Payment verification failed', details: paystackResponse },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: paystackResponse.data,
      message: 'Payment verified successfully'
    });

  } catch (error) {
    console.error('Paystack verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}