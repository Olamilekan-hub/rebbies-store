import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, amount, currency = 'NGN', reference, callback_url } = body;

    // Validate required fields
    if (!email || !amount) {
      return NextResponse.json(
        { error: 'Email and amount are required' },
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

    // Convert amount to kobo (Paystack expects amount in kobo)
    const amountInKobo = Math.round(amount * 100);

    // Generate reference if not provided
    const paymentReference = reference || `rebbie_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Prepare Paystack initialization data
    const paystackData = {
      email,
      amount: amountInKobo,
      currency,
      reference: paymentReference,
      callback_url: callback_url || `${process.env.NEXTAUTH_URL}/checkout/success`,
      metadata: {
        custom_fields: [
          {
            display_name: "Store Name",
            variable_name: "store_name",
            value: process.env.STORE_NAME || "Rebbie's Store"
          }
        ]
      }
    };

    // Initialize payment with Paystack
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackSecret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paystackData),
    });

    const paystackResponse = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Payment initialization failed', details: paystackResponse },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: paystackResponse.data,
      message: 'Payment initialized successfully'
    });

  } catch (error) {
    console.error('Paystack initialization error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}