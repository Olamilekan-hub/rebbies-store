import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

export default async function createTestOrder({ container }: ExecArgs) {
  const customerModuleService = container.resolve(Modules.CUSTOMER);
  const cartModuleService = container.resolve(Modules.CART);
  const productModuleService = container.resolve(Modules.PRODUCT);
  const regionModuleService = container.resolve(Modules.REGION);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);

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
    console.log("   Total: ₦", (cart.total || price_amount) / 100);

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

  } catch (error) {
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