import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function createAdmin({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  
  try {
    logger.info("🔧 Creating admin user...");
    
    // Get user service
    const userService = container.resolve("userService");
    
    const adminUser = {
      email: "admin@rebbies-store.com",
      first_name: "Admin",
      last_name: "User",
      role: "admin",
    };
    
    // Create user
    const user = await userService.create(adminUser, "supersecret123");
    
    logger.info("✅ Admin user created successfully!");
    logger.info(`📧 Email: admin@rebbies-store.com`);
    logger.info(`🔑 Password: supersecret123`);
    logger.info("=" .repeat(50));
    
    return { success: true, user };
    
  } catch (error) {
    if (error.message?.includes("already exists")) {
      logger.info("ℹ️ Admin user already exists!");
      logger.info(`📧 Email: admin@rebbies-store.com`);
      logger.info(`🔑 Password: supersecret123`);
      return { success: true, message: "User already exists" };
    }
    
    logger.error("❌ Error creating admin user:", error);
    throw error;
  }
}