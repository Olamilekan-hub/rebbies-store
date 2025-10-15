import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-paystack-signature');

    // Validate environment variables
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
      return NextResponse.json(
        { error: 'Paystack configuration not found' },
        { status: 500 }
      );
    }

    // Verify webhook signature
    if (!signature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const hash = crypto
      .createHmac('sha512', paystackSecret)
      .update(body)
      .digest('hex');

    if (hash !== signature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Parse the webhook payload
    const event = JSON.parse(body);

    // Handle different webhook events
    switch (event.event) {
      case 'charge.success':
        await handleSuccessfulPayment(event.data);
        break;

      case 'charge.failed':
        await handleFailedPayment(event.data);
        break;

      case 'transfer.success':
        await handleSuccessfulTransfer(event.data);
        break;

      case 'transfer.failed':
        await handleFailedTransfer(event.data);
        break;

      default:
        console.log(`Unhandled webhook event: ${event.event}`);
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleSuccessfulPayment(data: any) {
  try {
    console.log('Payment successful:', {
      reference: data.reference,
      amount: data.amount / 100, // Convert from kobo to naira
      customer_email: data.customer.email,
      status: data.status
    });

    // TODO: Update order status in database
    // TODO: Send confirmation email to customer
    // TODO: Update inventory if applicable
    // TODO: Trigger any post-payment processes

  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
}

async function handleFailedPayment(data: any) {
  try {
    console.log('Payment failed:', {
      reference: data.reference,
      amount: data.amount / 100,
      customer_email: data.customer.email,
      status: data.status
    });

    // TODO: Update order status in database
    // TODO: Send failure notification if needed
    // TODO: Log failed payment for analysis

  } catch (error) {
    console.error('Error handling failed payment:', error);
  }
}

async function handleSuccessfulTransfer(data: any) {
  try {
    console.log('Transfer successful:', {
      reference: data.reference,
      amount: data.amount / 100,
      recipient: data.recipient.name
    });

    // TODO: Update transfer status in database
    // TODO: Send confirmation to recipient

  } catch (error) {
    console.error('Error handling successful transfer:', error);
  }
}

async function handleFailedTransfer(data: any) {
  try {
    console.log('Transfer failed:', {
      reference: data.reference,
      amount: data.amount / 100,
      recipient: data.recipient.name
    });

    // TODO: Update transfer status in database
    // TODO: Handle failed transfer logic

  } catch (error) {
    console.error('Error handling failed transfer:', error);
  }
}