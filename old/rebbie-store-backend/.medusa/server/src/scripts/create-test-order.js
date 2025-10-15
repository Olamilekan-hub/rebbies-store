"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createTestOrder;
const utils_1 = require("@medusajs/framework/utils");
async function createTestOrder({ container }) {
    const customerModuleService = container.resolve(utils_1.Modules.CUSTOMER);
    const cartModuleService = container.resolve(utils_1.Modules.CART);
    const productModuleService = container.resolve(utils_1.Modules.PRODUCT);
    const regionModuleService = container.resolve(utils_1.Modules.REGION);
    const salesChannelModuleService = container.resolve(utils_1.Modules.SALES_CHANNEL);
    console.log("🛍️ Creating test order...");
    try {
        // 1. Create test customer
        const customer = await customerModuleService.createCustomers({
            email: "testddc@rebbies-store.com",
            first_name: "Test",
            last_name: "Customer",
            phone: "+234-806-577-6378",
        });
        console.log("✅ Test customer created:", customer.id);
        // 2. Get Nigeria region
        const nigeriaRegion = (await regionModuleService.listRegions({
            name: "Nigeria",
        }))[0];
        console.log("🇳🇬 Using Nigeria region:", nigeriaRegion.id);
        // 3. Get sales channel
        const defaultSalesChannel = (await salesChannelModuleService.listSalesChannels())[0];
        console.log("🛒 Using sales channel:", defaultSalesChannel.id);
        // 4. Get product and variants with complete data
        console.log("📦 Getting product and variant details...");
        const products = await productModuleService.listProducts({
            title: "Brazilian Deep Wave Hair Bundle",
        });
        const targetProduct = products[0];
        if (!targetProduct) {
            console.error("❌ Product not found!");
            return;
        }
        console.log("✅ Found product:", targetProduct.title);
        // Get variants separately
        const variants = await productModuleService.listProductVariants({
            product_id: targetProduct.id,
        });
        if (!variants || variants.length === 0) {
            console.error("❌ No variants found!");
            return;
        }
        const variant = variants[0];
        console.log("✅ Using variant:", variant.title || variant.id);
        // 5. Prepare complete cart item data
        const price_amount = 4500000; // ₦45,000 in kobo
        console.log("💰 Using price: ₦", price_amount / 100);
        // Create cart with complete item information
        const cartData = {
            currency_code: "ngn",
            customer_id: customer.id,
            region_id: nigeriaRegion.id,
            sales_channel_id: defaultSalesChannel.id,
            items: [
                {
                    // Required fields
                    title: `${targetProduct.title} - ${variant.title || 'Default Variant'}`,
                    variant_id: variant.id,
                    quantity: 1,
                    unit_price: price_amount,
                    // Product information
                    product_id: targetProduct.id,
                    product_title: targetProduct.title,
                    product_description: targetProduct.description || "Premium hair extension",
                    product_handle: targetProduct.handle,
                    // Variant information  
                    variant_title: variant.title || "Default Variant",
                    variant_sku: variant.sku || `SKU-${variant.id}`,
                    // Additional properties
                    requires_shipping: true,
                    is_discountable: true,
                    is_giftcard: false,
                },
            ],
        };
        console.log("🛒 Creating cart with complete item data...");
        console.log("📋 Item details:");
        console.log("   Title:", cartData.items[0].title);
        console.log("   Product:", cartData.items[0].product_title);
        console.log("   Variant:", cartData.items[0].variant_title);
        console.log("   Price: ₦", cartData.items[0].unit_price / 100);
        const cart = await cartModuleService.createCarts(cartData);
        console.log("✅ Test cart created successfully!");
        console.log("🆔 Cart ID:", cart.id);
        console.log("💰 Cart total: ₦", (Number(cart.total) || Number(price_amount)) / 100);
        console.log("📧 Customer email:", customer.email);
        console.log("\n🎯 Next steps - Complete this order through:");
        console.log("   - Admin dashboard → Orders");
        console.log("   - Storefront checkout flow");
        console.log("   - API: POST /store/carts/:id/complete");
        console.log("\n📋 Complete Cart Details:");
        console.log("   Cart ID:", cart.id);
        console.log("   Customer:", `${customer.first_name} ${customer.last_name} (${customer.email})`);
        console.log("   Region:", nigeriaRegion.name, "(", nigeriaRegion.currency_code.toUpperCase(), ")");
        console.log("   Sales Channel:", defaultSalesChannel.name);
        console.log("   Product:", targetProduct.title);
        console.log("   Variant:", variant.title || variant.id);
        console.log("   Quantity: 1");
        console.log("   Unit Price: ₦", price_amount / 100);
        console.log("   Total: ₦", (Number(cart.total) || Number(price_amount)) / 100);
        // Show useful next steps
        console.log("\n🔧 Useful commands:");
        console.log(`   # Get cart details:`);
        console.log(`   curl http://localhost:9000/store/carts/${cart.id}`);
        console.log(`   # Complete order (in storefront):`);
        console.log(`   POST /store/carts/${cart.id}/complete`);
        return {
            cart,
            customer,
            product: targetProduct,
            variant,
            success: true
        };
    }
    catch (error) {
        console.error("❌ Error creating test order:", error.message);
        if (error.message.includes("required")) {
            console.log("\n💡 This is a validation error - missing required fields");
            console.log("🔧 The script provides all required fields now");
        }
        console.log("\n🔧 Troubleshooting tips:");
        console.log("1. Ensure seed data exists: npx medusa exec ./src/scripts/seed.ts");
        console.log("2. Check database connection and migrations");
        console.log("3. Verify products have proper variants");
        console.log("4. Check if cart service is properly configured");
        return { success: false, error: error.message };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLXRlc3Qtb3JkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc2NyaXB0cy9jcmVhdGUtdGVzdC1vcmRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLGtDQTJKQztBQTdKRCxxREFBb0Q7QUFFckMsS0FBSyxVQUFVLGVBQWUsQ0FBQyxFQUFFLFNBQVMsRUFBWTtJQUNuRSxNQUFNLHFCQUFxQixHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2xFLE1BQU0saUJBQWlCLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUQsTUFBTSxvQkFBb0IsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGVBQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNoRSxNQUFNLG1CQUFtQixHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzlELE1BQU0seUJBQXlCLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7SUFFM0UsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0lBRTFDLElBQUksQ0FBQztRQUNILDBCQUEwQjtRQUMxQixNQUFNLFFBQVEsR0FBRyxNQUFNLHFCQUFxQixDQUFDLGVBQWUsQ0FBQztZQUMzRCxLQUFLLEVBQUUsMkJBQTJCO1lBQ2xDLFVBQVUsRUFBRSxNQUFNO1lBQ2xCLFNBQVMsRUFBRSxVQUFVO1lBQ3JCLEtBQUssRUFBRSxtQkFBbUI7U0FDM0IsQ0FBQyxDQUFDO1FBRUgsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsRUFBRSxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFckQsd0JBQXdCO1FBQ3hCLE1BQU0sYUFBYSxHQUFHLENBQUMsTUFBTSxtQkFBbUIsQ0FBQyxXQUFXLENBQUM7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