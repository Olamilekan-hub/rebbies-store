import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  res.json({
    message: "Admin custom endpoint working!",
    store: "Rebbie's Store"
  })
}
