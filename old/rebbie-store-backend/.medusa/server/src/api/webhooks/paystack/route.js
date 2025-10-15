"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const crypto_1 = __importDefault(require("crypto"));
async function POST(req, res) {
    const hash = crypto_1.default
        .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
        .update(JSON.stringify(req.body))
        .digest('hex');
    if (hash !== req.headers['x-paystack-signature']) {
        return res.status(400).send('Unauthorized');
    }
    const event = req.body;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3dlYmhvb2tzL3BheXN0YWNrL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBR0Esb0JBMkJDO0FBN0JELG9EQUE0QjtBQUVyQixLQUFLLFVBQVUsSUFBSSxDQUFDLEdBQWtCLEVBQUUsR0FBbUI7SUFDaEUsTUFBTSxJQUFJLEdBQUcsZ0JBQU07U0FDaEIsVUFBVSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFvQixDQUFDO1NBQ3RELE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNoQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFakIsSUFBSSxJQUFJLEtBQUssR0FBRyxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxFQUFFLENBQUM7UUFDakQsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLElBQXFDLENBQUM7SUFFeEQsMkJBQTJCO0lBQzNCLFFBQVEsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3BCLEtBQUssZ0JBQWdCO1lBQ25CLHlCQUF5QjtZQUN6QixPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMvQyxNQUFNO1FBQ1IsS0FBSyxlQUFlO1lBQ2xCLGlCQUFpQjtZQUNqQixPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMzQyxNQUFNO1FBQ1I7WUFDRSxPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDN0IsQ0FBQyJ9