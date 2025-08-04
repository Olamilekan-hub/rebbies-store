import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { amount, from, to } = req.body as { amount: number; from: string; to: string };
  
  // Simple exchange rates (in production, use a live API)
  const exchangeRates = {
    'NGN_USD': 0.0012, // 1 NGN = 0.0012 USD
    'USD_NGN': 825,    // 1 USD = 825 NGN (approximate)
    'NGN_EUR': 0.0011, // 1 NGN = 0.0011 EUR
    'EUR_NGN': 900     // 1 EUR = 900 NGN (approximate)
  };
  
  const rateKey = `${from}_${to}`;
  const rate = exchangeRates[rateKey] || 1;
  const convertedAmount = Math.round(amount * rate);
  
  res.json({
    success: true,
    data: {
      original_amount: amount,
      converted_amount: convertedAmount,
      from_currency: from,
      to_currency: to,
      exchange_rate: rate,
      timestamp: new Date().toISOString()
    }
  });
}