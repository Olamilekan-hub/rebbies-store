"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
async function GET(req, res) {
    const nigerianPaymentMethods = {
        paystack: {
            name: "Paystack",
            description: "Pay with your debit card, bank transfer, or USSD",
            channels: ["card", "bank", "ussd", "bank_transfer", "mobile_money"],
            supported_banks: [
                "Access Bank", "GTBank", "Zenith Bank", "UBA", "First Bank",
                "FCMB", "Polaris Bank", "Wema Bank", "Ecobank", "Union Bank",
                "Keystone Bank", "OPay", "Kuda Bank"
            ],
            ussd_codes: {
                "GTBank": "*737#",
                "Zenith Bank": "*966#",
                "UBA": "*919#",
                "Access Bank": "*901#",
                "First Bank": "*894#",
                "Opay": "*955#",
                "Kuda Bank": "*7111#"
            }
        },
        manual: {
            name: "Bank Transfer / Cash on Delivery",
            description: "Pay via bank transfer or cash on delivery",
            bank_details: {
                account_name: "Rebbie's Store",
                account_number: "9037139941",
                bank_name: "Opay Bank",
                sort_code: "058152036"
            },
            instructions: [
                "Make transfer to the account above",
                "Send payment confirmation to +234-806-577-6378",
                "Your order will be processed within 24 hours"
            ]
        }
    };
    res.json({
        success: true,
        data: nigerianPaymentMethods
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL3BheW1lbnQtbWV0aG9kcy9uaWdlcmlhL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0JBMENDO0FBMUNNLEtBQUssVUFBVSxHQUFHLENBQUMsR0FBa0IsRUFBRSxHQUFtQjtJQUMvRCxNQUFNLHNCQUFzQixHQUFHO1FBQzdCLFFBQVEsRUFBRTtZQUNSLElBQUksRUFBRSxVQUFVO1lBQ2hCLFdBQVcsRUFBRSxrREFBa0Q7WUFDL0QsUUFBUSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsZUFBZSxFQUFFLGNBQWMsQ0FBQztZQUNuRSxlQUFlLEVBQUU7Z0JBQ2YsYUFBYSxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLFlBQVk7Z0JBQzNELE1BQU0sRUFBRSxjQUFjLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxZQUFZO2dCQUM1RCxlQUFlLEVBQUUsTUFBTSxFQUFFLFdBQVc7YUFDckM7WUFDRCxVQUFVLEVBQUU7Z0JBQ1YsUUFBUSxFQUFFLE9BQU87Z0JBQ2pCLGFBQWEsRUFBRSxPQUFPO2dCQUN0QixLQUFLLEVBQUUsT0FBTztnQkFDZCxhQUFhLEVBQUUsT0FBTztnQkFDdEIsWUFBWSxFQUFFLE9BQU87Z0JBQ3JCLE1BQU0sRUFBRSxPQUFPO2dCQUNmLFdBQVcsRUFBRSxRQUFRO2FBQ3RCO1NBQ0Y7UUFDRCxNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUsa0NBQWtDO1lBQ3hDLFdBQVcsRUFBRSwyQ0FBMkM7WUFDeEQsWUFBWSxFQUFFO2dCQUNaLFlBQVksRUFBRSxnQkFBZ0I7Z0JBQzlCLGNBQWMsRUFBRSxZQUFZO2dCQUM1QixTQUFTLEVBQUUsV0FBVztnQkFDdEIsU0FBUyxFQUFFLFdBQVc7YUFDdkI7WUFDRCxZQUFZLEVBQUU7Z0JBQ1osb0NBQW9DO2dCQUNwQyxnREFBZ0Q7Z0JBQ2hELDhDQUE4QzthQUMvQztTQUNGO0tBQ0YsQ0FBQztJQUVGLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFDUCxPQUFPLEVBQUUsSUFBSTtRQUNiLElBQUksRUFBRSxzQkFBc0I7S0FDN0IsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyJ9