import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import crypto from "crypto";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash !== req.headers['x-paystack-signature']) {
    return res.status(400).send('Unauthorized');
  }

  const event = req.body as { event: string; data?: any };
  
  // Handle the webhook event
  switch (event.event) {
    case 'charge.success':
      // Payment was successful
      console.log('Payment successful:', event.data);
      break;
    case 'charge.failed':
      // Payment failed
      console.log('Payment failed:', event.data);
      break;
    default:
      console.log('Unhandled event type:', event.event);
  }

  res.status(200).send('OK');
}