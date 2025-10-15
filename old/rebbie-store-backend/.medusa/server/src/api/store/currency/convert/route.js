"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
async function POST(req, res) {
    const { amount, from, to } = req.body;
    // Simple exchange rates (in production, use a live API)
    const exchangeRates = {
        'NGN_USD': 0.0012, // 1 NGN = 0.0012 USD
        'USD_NGN': 825, // 1 USD = 825 NGN (approximate)
        'NGN_EUR': 0.0011, // 1 NGN = 0.0011 EUR
        'EUR_NGN': 900 // 1 EUR = 900 NGN (approximate)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2N1cnJlbmN5L2NvbnZlcnQvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxvQkEwQkM7QUExQk0sS0FBSyxVQUFVLElBQUksQ0FBQyxHQUFrQixFQUFFLEdBQW1CO0lBQ2hFLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxHQUFHLEdBQUcsQ0FBQyxJQUFvRCxDQUFDO0lBRXRGLHdEQUF3RDtJQUN4RCxNQUFNLGFBQWEsR0FBRztRQUNwQixTQUFTLEVBQUUsTUFBTSxFQUFFLHFCQUFxQjtRQUN4QyxTQUFTLEVBQUUsR0FBRyxFQUFLLGdDQUFnQztRQUNuRCxTQUFTLEVBQUUsTUFBTSxFQUFFLHFCQUFxQjtRQUN4QyxTQUFTLEVBQUUsR0FBRyxDQUFLLGdDQUFnQztLQUNwRCxDQUFDO0lBRUYsTUFBTSxPQUFPLEdBQUcsR0FBRyxJQUFJLElBQUksRUFBRSxFQUFFLENBQUM7SUFDaEMsTUFBTSxJQUFJLEdBQUcsYUFBYSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN6QyxNQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQztJQUVsRCxHQUFHLENBQUMsSUFBSSxDQUFDO1FBQ1AsT0FBTyxFQUFFLElBQUk7UUFDYixJQUFJLEVBQUU7WUFDSixlQUFlLEVBQUUsTUFBTTtZQUN2QixnQkFBZ0IsRUFBRSxlQUFlO1lBQ2pDLGFBQWEsRUFBRSxJQUFJO1lBQ25CLFdBQVcsRUFBRSxFQUFFO1lBQ2YsYUFBYSxFQUFFLElBQUk7WUFDbkIsU0FBUyxFQUFFLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFO1NBQ3BDO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyJ9