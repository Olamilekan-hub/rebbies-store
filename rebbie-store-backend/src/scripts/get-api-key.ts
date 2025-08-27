import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function getExistingApiKey({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  
  try {
    logger.info("🔍 Looking for existing API keys...");
    
    // Get database connection
    const manager = container.resolve("manager");
    
    // Query for existing publishable API keys
    const apiKeys = await manager.query(`
      SELECT * FROM publishable_api_key 
      WHERE revoked_at IS NULL 
      ORDER BY created_at DESC
    `);
    
    if (apiKeys.length > 0) {
      const apiKey = apiKeys[0];
      logger.info("🎉 Found existing API key!");
      logger.info(`🔑 Publishable API Key: ${apiKey.id}`);
      logger.info("=" .repeat(80));
      logger.info(`USE THIS KEY IN YOUR FRONTEND:`);
      logger.info(`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${apiKey.id}`);
      logger.info("=" .repeat(80));
      
      return { success: true, key: apiKey.id };
    } else {
      logger.warn("❌ No API keys found. Run the seed script first.");
      return { success: false, message: "No API keys found" };
    }
    
  } catch (error) {
    logger.error("❌ Error fetching API key:", error);
    throw error;
  }
}