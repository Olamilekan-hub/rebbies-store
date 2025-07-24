import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function seedRebbieStoreData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);

  // Nigerian focus with international support
  const countries = ["ng", "us", "gb", "ca", "au", "gh", "za"];

  logger.info("🏪 Setting up Rebbie's Store data...");
  
  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Rebbie's Store Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [
          {
            name: "Rebbie's Store Sales Channel",
          },
        ],
      },
    });
    defaultSalesChannel = salesChannelResult;
  }

  // Update store with Nigerian Naira as primary currency
  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        supported_currencies: [
          {
            currency_code: "ngn", // Nigerian Naira as primary
            is_default: true,
          },
          {
            currency_code: "usd", // For diaspora customers
          },
          {
            currency_code: "eur", // European customers
          },
        ],
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  });

  logger.info("🇳🇬 Creating Nigerian regions...");
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Nigeria",
          currency_code: "ngn",
          countries: ["ng"],
          payment_providers: ["pp_system_default"], // Will add Paystack later
        },
        {
          name: "International",
          currency_code: "usd", 
          countries: ["us", "gb", "ca", "au", "gh", "za"],
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  });
  
  const nigeriaRegion = regionResult.find(r => r.name === "Nigeria")!;
  const internationalRegion = regionResult.find(r => r.name === "International")!;

  logger.info("📊 Setting up tax regions...");
  await createTaxRegionsWorkflow(container).run({
    input: countries.map((country_code) => ({
      country_code,
      provider_id: "tp_system"
    })),
  });

  logger.info("📍 Creating stock locations...");
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "Lagos Main Warehouse",
          address: {
            city: "Lagos",
            country_code: "NG",
            address_1: "Victoria Island",
            province: "Lagos State",
          },
        },
      ],
    },
  });
  const stockLocation = stockLocationResult[0];

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  logger.info("🚚 Setting up Nigerian shipping...");
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default"
  });
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;

  if (!shippingProfile) {
    const { result: shippingProfileResult } =
    await createShippingProfilesWorkflow(container).run({
      input: {
        data: [
          {
            name: "Rebbie's Store Shipping",
            type: "default",
          },
        ],
      },
    });
    shippingProfile = shippingProfileResult[0];
  }

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "Nigeria & International Delivery",
    type: "shipping",
    service_zones: [
      {
        name: "Lagos Zone",
        geo_zones: [
          {
            country_code: "ng",
            type: "country",
          },
        ],
      },
      {
        name: "International Zone",
        geo_zones: [
          {
            country_code: "us",
            type: "country",
          },
          {
            country_code: "gb",
            type: "country",
          },
          {
            country_code: "ca",
            type: "country",
          },
        ],
      },
    ],
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: fulfillmentSet.id,
    },
  });

  // Nigerian shipping options
  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Lagos Same Day Delivery",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Same Day",
          description: "Lagos same-day delivery (before 6pm)",
          code: "lagos-same-day",
        },
        prices: [
          {
            currency_code: "ngn",
            amount: 250000, // ₦2,500
          },
          {
            region_id: nigeriaRegion.id,
            amount: 250000,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
        ],
      },
      {
        name: "Nigeria Standard Delivery",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "2-5 business days nationwide",
          code: "nigeria-standard",
        },
        prices: [
          {
            currency_code: "ngn",
            amount: 150000, // ₦1,500
          },
          {
            region_id: nigeriaRegion.id,
            amount: 150000,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
        ],
      },
      {
        name: "International Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[1].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "International",
          description: "7-14 business days worldwide",
          code: "international",
        },
        prices: [
          {
            currency_code: "usd",
            amount: 2500, // $25
          },
          {
            region_id: internationalRegion.id,  
            amount: 2500,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
        ],
      },
    ],
  });

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel[0].id],
    },
  });

  logger.info("🔑 Setting up API keys...");
  const { result: publishableApiKeyResult } = await createApiKeysWorkflow(
    container
  ).run({
    input: {
      api_keys: [
        {
          title: "Rebbie's Store Webshop",
          type: "publishable",
          created_by: "",
        },
      ],
    },
  });
  const publishableApiKey = publishableApiKeyResult[0];

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel[0].id],
    },
  });

  logger.info("📦 Creating hair & jewelry product categories...");
  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        {
          name: "Hair Extensions",
          is_active: true,
          description: "Premium quality human hair extensions",
        },
        {
          name: "Brazilian Hair", 
          is_active: true,
          description: "100% Brazilian human hair",
          parent_category_id: null, // Will be set after creation
        },
        {
          name: "Peruvian Hair",
          is_active: true,
          description: "Premium Peruvian hair extensions",
        },
        {
          name: "Indian Hair",
          is_active: true,
          description: "Soft Indian Remy hair",
        },
        {
          name: "Jewelry",
          is_active: true,
          description: "Beautiful jewelry collection",
        },
        {
          name: "Necklaces",
          is_active: true,
          description: "Elegant necklaces for every occasion",
        },
        {
          name: "Earrings",
          is_active: true,
          description: "Stunning earrings collection",
        },
        {
          name: "Rings",
          is_active: true,
          description: "Beautiful rings collection",
        },
        {
          name: "African Jewelry",
          is_active: true,
          description: "Traditional African jewelry pieces",
        },
      ],
    },
  });

  logger.info("💎 Creating Rebbie's Store products...");
  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Brazilian Deep Wave Hair Bundle",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Hair Extensions")!.id,
            categoryResult.find((cat) => cat.name === "Brazilian Hair")!.id,
          ],
          description: "100% virgin Brazilian human hair with deep wave texture. Perfect for creating voluminous, bouncy curls. Can be colored, straightened, and styled to your preference. Lasts 12+ months with proper care.",
          handle: "brazilian-deep-wave-hair-bundle",
          weight: 100,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://via.placeholder.com/600x600/000000/FFFFFF?text=Brazilian+Deep+Wave+1",
            },
            {
              url: "https://via.placeholder.com/600x600/333333/FFFFFF?text=Brazilian+Deep+Wave+2",
            },
          ],
          options: [
            {
              title: "Length",
              values: ["12 inches", "14 inches", "16 inches", "18 inches", "20 inches", "22 inches", "24 inches"],
            },
            {
              title: "Color",
              values: ["Natural Black", "Dark Brown", "Medium Brown", "Light Brown"],
            },
          ],
          variants: [
            {
              title: "16 inches / Natural Black",
              sku: "BDW-16-NB",
              options: {
                Length: "16 inches",
                Color: "Natural Black",
              },
              prices: [
                {
                  currency_code: "ngn",
                  amount: 4500000, // ₦45,000
                },
                {
                  currency_code: "usd",
                  amount: 5500, // $55
                },
              ],
            },
            {
              title: "18 inches / Natural Black",
              sku: "BDW-18-NB",
              options: {
                Length: "18 inches",
                Color: "Natural Black",
              },
              prices: [
                {
                  currency_code: "ngn", 
                  amount: 5500000, // ₦55,000
                },
                {
                  currency_code: "usd",
                  amount: 6800, // $68
                },
              ],
            },
            {
              title: "20 inches / Natural Black",
              sku: "BDW-20-NB",
              options: {
                Length: "20 inches",
                Color: "Natural Black",
              },
              prices: [
                {
                  currency_code: "ngn",
                  amount: 6500000, // ₦65,000
                },
                {
                  currency_code: "usd",
                  amount: 8000, // $80
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel[0].id,
            },
          ],
        },
        {
          title: "Peruvian Straight Hair Bundle",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Hair Extensions")!.id,
            categoryResult.find((cat) => cat.name === "Peruvian Hair")!.id,
          ],
          description: "Premium Peruvian straight hair that's naturally soft and silky. Perfect for sleek hairstyles. Can be curled, waved, or maintained straight. Tangle-free and long-lasting.",
          handle: "peruvian-straight-hair-bundle",
          weight: 100,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://via.placeholder.com/600x600/444444/FFFFFF?text=Peruvian+Straight+1",
            },
            {
              url: "https://via.placeholder.com/600x600/666666/FFFFFF?text=Peruvian+Straight+2",
            },
          ],
          options: [
            {
              title: "Length",
              values: ["14 inches", "16 inches", "18 inches", "20 inches", "22 inches"],
            },
            {
              title: "Color",
              values: ["Natural Black", "Dark Brown"],
            },
          ],
          variants: [
            {
              title: "16 inches / Natural Black",
              sku: "PS-16-NB",
              options: {
                Length: "16 inches",
                Color: "Natural Black",
              },
              prices: [
                {
                  currency_code: "ngn",
                  amount: 4200000, // ₦42,000
                },
                {
                  currency_code: "usd",
                  amount: 5200, // $52
                },
              ],
            },
            {
              title: "18 inches / Natural Black",
              sku: "PS-18-NB",
              options: {
                Length: "18 inches",
                Color: "Natural Black",
              },
              prices: [
                {
                  currency_code: "ngn",
                  amount: 5200000, // ₦52,000
                },
                {
                  currency_code: "usd",
                  amount: 6400, // $64
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel[0].id,
            },
          ],
        },
        {
          title: "Gold Plated Chain Necklace",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Jewelry")!.id,
            categoryResult.find((cat) => cat.name === "Necklaces")!.id,
          ],
          description: "Elegant 18k gold plated chain necklace. Hypoallergenic and water-resistant. Perfect for everyday wear or special occasions. Complements both traditional and modern styles.",
          handle: "gold-plated-chain-necklace",
          weight: 50,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://via.placeholder.com/600x600/FFD700/000000?text=Gold+Chain+1",
            },
            {
              url: "https://via.placeholder.com/600x600/FFA500/000000?text=Gold+Chain+2", 
            },
          ],
          options: [
            {
              title: "Length",
              values: ["16 inches", "18 inches", "20 inches", "22 inches"],
            },
            {
              title: "Style",
              values: ["Cuban Link", "Rope Chain", "Box Chain", "Snake Chain"],
            },
          ],
          variants: [
            {
              title: "18 inches / Cuban Link",
              sku: "GPC-18-CL",
              options: {
                Length: "18 inches",
                Style: "Cuban Link",
              },
              prices: [
                {
                  currency_code: "ngn",
                  amount: 2800000, // ₦28,000
                },
                {
                  currency_code: "usd",
                  amount: 3500, // $35
                },
              ],
            },
            {
              title: "20 inches / Rope Chain",
              sku: "GPC-20-RC",
              options: {
                Length: "20 inches",
                Style: "Rope Chain",
              },
              prices: [
                {
                  currency_code: "ngn",
                  amount: 3200000, // ₦32,000
                },
                {
                  currency_code: "usd",
                  amount: 4000, // $40
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel[0].id,
            },
          ],
        },
        {
          title: "African Beaded Earrings",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Jewelry")!.id,
            categoryResult.find((cat) => cat.name === "Earrings")!.id,
            categoryResult.find((cat) => cat.name === "African Jewelry")!.id,
          ],
          description: "Handcrafted African beaded earrings featuring traditional patterns and vibrant colors. Perfect for cultural events and adding an authentic African touch to any outfit.",
          handle: "african-beaded-earrings",
          weight: 20,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://via.placeholder.com/600x600/8B4513/FFFFFF?text=African+Earrings+1",
            },
            {
              url: "https://via.placeholder.com/600x600/A0522D/FFFFFF?text=African+Earrings+2",
            },
          ],
          options: [
            {
              title: "Color Pattern",
              values: ["Red & Gold", "Blue & White", "Green & Yellow", "Multi-color"],
            },
            {
              title: "Size",
              values: ["Small", "Medium", "Large"],
            },
          ],
          variants: [
            {
              title: "Red & Gold / Medium",
              sku: "ABE-RG-M",
              options: {
                "Color Pattern": "Red & Gold",
                Size: "Medium",
              },
              prices: [
                {
                  currency_code: "ngn",
                  amount: 1200000, // ₦12,000
                },
                {
                  currency_code: "usd",
                  amount: 1500, // $15
                },
              ],
            },
            {
              title: "Multi-color / Large",
              sku: "ABE-MC-L",
              options: {
                "Color Pattern": "Multi-color",
                Size: "Large",
              },
              prices: [
                {
                  currency_code: "ngn",
                  amount: 1800000, // ₦18,000
                },
                {
                  currency_code: "usd",
                  amount: 2200, // $22
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel[0].id,
            },
          ],
        },
        {
          title: "Sterling Silver Ring Set",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Jewelry")!.id,
            categoryResult.find((cat) => cat.name === "Rings")!.id,
          ],
          description: "Set of 3 sterling silver rings - one plain band, one with crystals, and one with African-inspired patterns. Adjustable sizing fits most fingers.",
          handle: "sterling-silver-ring-set",
          weight: 30,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://via.placeholder.com/600x600/C0C0C0/000000?text=Silver+Ring+Set+1",
            },
            {
              url: "https://via.placeholder.com/600x600/DCDCDC/000000?text=Silver+Ring+Set+2",
            },
          ],
          options: [
            {
              title: "Set Type",
              values: ["Classic Set", "Crystal Set", "African Pattern Set"],
            },
          ],
          variants: [
            {
              title: "Classic Set",
              sku: "SSR-CS",
              options: {
                "Set Type": "Classic Set",
              },
              prices: [
                {
                  currency_code: "ngn",
                  amount: 2400000, // ₦24,000
                },
                {
                  currency_code: "usd",
                  amount: 3000, // $30
                },
              ],
            },
            {
              title: "Crystal Set",
              sku: "SSR-CRS",
              options: {
                "Set Type": "Crystal Set",
              },
              prices: [
                {
                  currency_code: "ngn",
                  amount: 3200000, // ₦32,000
                },
                {
                  currency_code: "usd",
                  amount: 4000, // $40
                },
              ],
            },
            {
              title: "African Pattern Set",
              sku: "SSR-APS",
              options: {
                "Set Type": "African Pattern Set",
              },
              prices: [
                {
                  currency_code: "ngn",
                  amount: 3600000, // ₦36,000
                },
                {
                  currency_code: "usd",
                  amount: 4500, // $45
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel[0].id,
            },
          ],
        },
      ],
    },
  });

  logger.info("📊 Setting up inventory levels...");
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  const inventoryLevels: CreateInventoryLevelInput[] = [];
  for (const inventoryItem of inventoryItems) {
    const inventoryLevel = {
      location_id: stockLocation.id,
      stocked_quantity: 50, 
      inventory_item_id: inventoryItem.id,
    };
    inventoryLevels.push(inventoryLevel);
  }

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryLevels,
    },
  });

  logger.info("🎉 Rebbie's Store data seeding completed!");
  logger.info("💡 Next steps:");
  logger.info("   1. Add Paystack & Flutterwave payment methods");
  logger.info("   2. Update product images with real hair & jewelry photos");
  logger.info("   3. Configure frontend to display new products");
  logger.info("   4. Test Nigerian payment flows");
}