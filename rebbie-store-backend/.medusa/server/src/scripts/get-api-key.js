"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getExistingApiKey;
const utils_1 = require("@medusajs/framework/utils");
async function getExistingApiKey({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
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
            logger.info("=".repeat(80));
            logger.info(`USE THIS KEY IN YOUR FRONTEND:`);
            logger.info(`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${apiKey.id}`);
            logger.info("=".repeat(80));
            return { success: true, key: apiKey.id };
        }
        else {
            logger.warn("❌ No API keys found. Run the seed script first.");
            return { success: false, message: "No API keys found" };
        }
    }
    catch (error) {
        logger.error("❌ Error fetching API key:", error);
        throw error;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LWFwaS1rZXkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc2NyaXB0cy9nZXQtYXBpLWtleS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLG9DQW1DQztBQXJDRCxxREFBc0U7QUFFdkQsS0FBSyxVQUFVLGlCQUFpQixDQUFDLEVBQUUsU0FBUyxFQUFZO0lBQ3JFLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFbkUsSUFBSSxDQUFDO1FBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1FBRW5ELDBCQUEwQjtRQUMxQixNQUFNLE9BQU8sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBUSxDQUFDO1FBRXBELDBDQUEwQztRQUMxQyxNQUFNLE9BQU8sR0FBRyxNQUFNLE9BQU8sQ0FBQyxLQUFLLENBQUM7Ozs7S0FJbkMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQ3ZCLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLDRCQUE0QixDQUFDLENBQUM7WUFDMUMsTUFBTSxDQUFDLElBQUksQ0FBQywyQkFBMkIsTUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDcEQsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDN0IsTUFBTSxDQUFDLElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO1lBQzlDLE1BQU0sQ0FBQyxJQUFJLENBQUMsc0NBQXNDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQy9ELE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBRTdCLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDM0MsQ0FBQzthQUFNLENBQUM7WUFDTixNQUFNLENBQUMsSUFBSSxDQUFDLGlEQUFpRCxDQUFDLENBQUM7WUFDL0QsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLENBQUM7UUFDMUQsQ0FBQztJQUVILENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsTUFBTSxDQUFDLEtBQUssQ0FBQywyQkFBMkIsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNqRCxNQUFNLEtBQUssQ0FBQztJQUNkLENBQUM7QUFDSCxDQUFDIn0=