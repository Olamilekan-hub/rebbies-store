import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
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