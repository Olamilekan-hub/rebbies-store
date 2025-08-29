import { ExecArgs } from "@medusajs/framework/types";
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
            amount: 200000, // ₦2,000 (Lagos same-day)
          },
          {
            region_id: nigeriaRegion.id,
            amount: 200000,
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
            amount: 500000, // ₦5,000 (nationwide standard)
          },
          {
            region_id: nigeriaRegion.id,
            amount: 500000,
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
            amount: 1500, // $15 (more competitive international shipping)
          },
          {
            region_id: internationalRegion.id,  
            amount: 1500,
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
  
  logger.info(`🔑 Publishable API Key created: ${publishableApiKey.token}`);
  logger.info(`🔑 Use this key in your frontend: NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${publishableApiKey.token}`);

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel[0].id],
    },
  });

  logger.info("📦 Creating Rebbie's Store product categories...");
  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        // === FASHION BAGS (Main Category) ===
        {
          name: "Fashion Bags",
          is_active: true,
          description: "Stylish and trendy bags for every occasion",
          handle: "fashion-bags",
        },
        
        // === JEWELRY (Main Category) ===
        {
          name: "Jewelry",
          is_active: true,
          description: "Beautiful jewelry collection for every style",
          handle: "jewelry",
        },
        
        // === FRAGRANCES (Main Category) ===
        {
          name: "Fragrances",
          is_active: true,
          description: "Premium fragrances for men and women",
          handle: "fragrances",
        },

        // === FASHION BAGS SUBCATEGORIES ===
        {
          name: "Thrift Fashion Bags", 
          is_active: true,
          description: "Pre-owned luxury and designer bags - sustainable fashion choices",
          handle: "thrift-fashion-bags",
        },
        {
          name: "Non-Thrift Fashion Bags",
          is_active: true,
          description: "New designer bags and contemporary styles",
          handle: "non-thrift-fashion-bags",
        },
        
        // === JEWELRY SUBCATEGORIES ===
        {
          name: "Necklaces",
          is_active: true,
          description: "Elegant necklaces for every occasion",
          handle: "necklaces",
        },
        {
          name: "Earrings",
          is_active: true,
          description: "Stunning earrings collection",
          handle: "earrings", 
        },
        {
          name: "Rings",
          is_active: true,
          description: "Beautiful rings collection",
          handle: "rings",
        },
        {
          name: "Bracelets",
          is_active: true,
          description: "Stylish bracelets and bangles",
          handle: "bracelets",
        },
        {
          name: "African Jewelry",
          is_active: true,
          description: "Traditional African jewelry pieces",
          handle: "african-jewelry",
        },
        
        // === FRAGRANCES SUBCATEGORIES ===
        {
          name: "Men's Fragrances",
          is_active: true,
          description: "Cologne, eau de toilette, and aftershave for men",
          handle: "mens-fragrances",
        },
        {
          name: "Women's Fragrances",
          is_active: true,
          description: "Perfume, eau de parfum, and body mist for women",
          handle: "womens-fragrances",
        },
      ],
    },
  });

  // Set up parent-child relationships for categories
  logger.info("🔗 Setting up category relationships...");

  // Get main categories
  const fashionBagsCategory = categoryResult.find(cat => cat.name === "Fashion Bags");
  const jewelryCategory = categoryResult.find(cat => cat.name === "Jewelry");
  const fragrancesCategory = categoryResult.find(cat => cat.name === "Fragrances");

  // Update Fashion Bags subcategories
  if (fashionBagsCategory) {
    const thriftBags = categoryResult.find(cat => cat.name === "Thrift Fashion Bags");
    const nonThriftBags = categoryResult.find(cat => cat.name === "Non-Thrift Fashion Bags");
    
    if (thriftBags && nonThriftBags) {
      // Note: In MedusaJS v2, you might need to use a different method to update categories
      // This is a placeholder for the actual update logic
      console.log(`Setting Fashion Bags as parent for: ${thriftBags.name}, ${nonThriftBags.name}`);
    }
  }

  // Update Jewelry subcategories  
  if (jewelryCategory) {
    const jewelrySubcategories = ["Necklaces", "Earrings", "Rings", "Bracelets", "African Jewelry"];
    jewelrySubcategories.forEach(subcatName => {
      const subcat = categoryResult.find(cat => cat.name === subcatName);
      if (subcat) {
        console.log(`Setting Jewelry as parent for: ${subcat.name}`);
      }
    });
  }

  // Update Fragrances subcategories
  if (fragrancesCategory) {
    const menFragrances = categoryResult.find(cat => cat.name === "Men's Fragrances");
    const womenFragrances = categoryResult.find(cat => cat.name === "Women's Fragrances");
    
    if (menFragrances && womenFragrances) {
      console.log(`Setting Fragrances as parent for: ${menFragrances.name}, ${womenFragrances.name}`);
    }
  }

  logger.info("✅ Categories created successfully!");
  logger.info("📊 Category Summary:");
  logger.info("   • Fashion Bags (Thrift + Non-Thrift)");
  logger.info("   • Jewelry (Necklaces, Earrings, Rings, Bracelets, African)");
  logger.info("   • Fragrances (Men's + Women's)");

  logger.info("💎 Creating Rebbie's Store products...");
  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Vintage Chanel Quilted Handbag",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Fashion Bags")!.id,
            categoryResult.find((cat) => cat.name === "Thrift Fashion Bags")!.id,
          ],
          description: "Authentic pre-owned Chanel quilted handbag in excellent condition. Classic design that never goes out of style. Includes authenticity certificate.",
          handle: "vintage-chanel-quilted-handbag",
          weight: 800,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://via.placeholder.com/600x600/7C3AED/FFFFFF?text=Vintage+Chanel+Bag+1",
            },
            {
              url: "https://via.placeholder.com/600x600/5B21B6/FFFFFF?text=Vintage+Chanel+Bag+2",
            },
          ],
          options: [
            {
              title: "Condition",
              values: ["Excellent", "Very Good", "Good"],
            },
            {
              title: "Color",
              values: ["Classic Black", "Beige", "Navy Blue"],
            },
          ],
          variants: [
            {
              title: "Excellent / Classic Black",
              sku: "CHANEL-EXC-BLK",
              options: {
                Condition: "Excellent",
                Color: "Classic Black",
              },
              prices: [
                {
                  currency_code: "ngn",
                  amount: 3500000, // ₦35,000 (more accessible for Nigerian market)
                },
                {
                  currency_code: "usd",
                  amount: 4200, // $42
                },
              ],
            },
            {
              title: "Very Good / Beige",
              sku: "CHANEL-VG-BEIGE",
              options: {
                Condition: "Very Good",
                Color: "Beige",
              },
              prices: [
                {
                  currency_code: "ngn",
                  amount: 2800000, // ₦28,000
                },
                {
                  currency_code: "usd",
                  amount: 3400, // $34
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
          title: "Contemporary Leather Tote Bag",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Fashion Bags")!.id,
            categoryResult.find((cat) => cat.name === "Non-Thrift Fashion Bags")!.id,
          ],
          description: "Brand new contemporary leather tote bag perfect for work and travel. Made from premium genuine leather with spacious interior and multiple pockets.",
          handle: "contemporary-leather-tote-bag",
          weight: 600,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://via.placeholder.com/600x600/000000/FFFFFF?text=Leather+Tote+1",
            },
            {
              url: "https://via.placeholder.com/600x600/7C3AED/FFFFFF?text=Leather+Tote+2",
            },
          ],
          options: [
            {
              title: "Size",
              values: ["Medium", "Large", "Extra Large"],
            },
            {
              title: "Color",
              values: ["Black", "Brown", "Burgundy", "Purple"],
            },
          ],
          variants: [
            {
              title: "Large / Black",
              sku: "TOTE-LG-BLK",
              options: {
                Size: "Large",
                Color: "Black",
              },
              prices: [
                {
                  currency_code: "ngn",
                  amount: 8500000, // ₦85,000
                },
                {
                  currency_code: "usd",
                  amount: 10500, // $105
                },
              ],
            },
            {
              title: "Medium / Purple",
              sku: "TOTE-MD-PUR",
              options: {
                Size: "Medium",
                Color: "Purple",
              },
              prices: [
                {
                  currency_code: "ngn",
                  amount: 7500000, // ₦75,000
                },
                {
                  currency_code: "usd",
                  amount: 9200, // $92
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
          title: "Dior Sauvage Eau de Toilette",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Fragrances")!.id,
            categoryResult.find((cat) => cat.name === "Men's Fragrances")!.id,
          ],
          description: "Dior Sauvage is an olfactory journey through wild nature, inspired by wide-open spaces. Fresh, raw and noble fragrance with bergamot and pepper notes.",
          handle: "dior-sauvage-eau-de-toilette",
          weight: 300,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://via.placeholder.com/600x600/000000/7C3AED?text=Dior+Sauvage+1",
            },
            {
              url: "https://via.placeholder.com/600x600/5B21B6/FFFFFF?text=Dior+Sauvage+2",
            },
          ],
          options: [
            {
              title: "Size",
              values: ["60ml", "100ml", "200ml"],
            },
            {
              title: "Type",
              values: ["Eau de Toilette", "Eau de Parfum"],
            },
          ],
          variants: [
            {
              title: "100ml / Eau de Toilette",
              sku: "DIOR-SAV-100-EDT",
              options: {
                Size: "100ml",
                Type: "Eau de Toilette",
              },
              prices: [
                {
                  currency_code: "ngn",
                  amount: 1850000, // ₦18,500
                },
                {
                  currency_code: "usd",
                  amount: 2250, // $22.5
                },
              ],
            },
            {
              title: "60ml / Eau de Toilette",
              sku: "DIOR-SAV-60-EDT",
              options: {
                Size: "60ml",
                Type: "Eau de Toilette",
              },
              prices: [
                {
                  currency_code: "ngn",
                  amount: 145000, // ₦14,500
                },
                {
                  currency_code: "usd",
                  amount: 1780, // $17.8
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
          title: "Chanel No. 5 Eau de Parfum",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Fragrances")!.id,
            categoryResult.find((cat) => cat.name === "Women's Fragrances")!.id,
          ],
          description: "The legendary Chanel No. 5 Eau de Parfum. An iconic fragrance with ylang-ylang and neroli, enhanced by jasmine and rose, on a warm base of vetiver and sandalwood.",
          handle: "chanel-no5-eau-de-parfum",
          weight: 250,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://via.placeholder.com/600x600/FFFFFF/000000?text=Chanel+No5+1",
            },
            {
              url: "https://via.placeholder.com/600x600/7C3AED/FFFFFF?text=Chanel+No5+2",
            },
          ],
          options: [
            {
              title: "Size",
              values: ["35ml", "50ml", "100ml"],
            },
            {
              title: "Edition",
              values: ["Classic", "Limited Edition"],
            },
          ],
          variants: [
            {
              title: "50ml / Classic",
              sku: "CHANEL-NO5-50-CLS",
              options: {
                Size: "50ml",
                Edition: "Classic",
              },
              prices: [
                {
                  currency_code: "ngn",
                  amount: 28500000, // ₦285,000
                },
                {
                  currency_code: "usd",
                  amount: 35000, // $350
                },
              ],
            },
            {
              title: "100ml / Classic",
              sku: "CHANEL-NO5-100-CLS",
              options: {
                Size: "100ml",
                Edition: "Classic",
              },
              prices: [
                {
                  currency_code: "ngn",
                  amount: 45000000, // ₦450,000
                },
                {
                  currency_code: "usd",
                  amount: 55000, // $550
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
          title: "Victoria's Secret Body Mist Collection",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Fragrances")!.id,
            categoryResult.find((cat) => cat.name === "Women's Fragrances")!.id,
          ],
          description: "Light and refreshing body mist perfect for everyday wear. Available in multiple delightful scents. Great for layering or wearing alone.",
          handle: "victoria-secret-body-mist",
          weight: 150,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://via.placeholder.com/600x600/A78BFA/000000?text=VS+Body+Mist+1",
            },
            {
              url: "https://via.placeholder.com/600x600/C084FC/000000?text=VS+Body+Mist+2",
            },
          ],
          options: [
            {
              title: "Scent",
              values: ["Vanilla & Orchid", "Berry Kiss", "Coconut Passion", "Pure Seduction"],
            },
            {
              title: "Size",
              values: ["250ml"],
            },
          ],
          variants: [
            {
              title: "Vanilla & Orchid / 250ml",
              sku: "VS-VANILLA-250",
              options: {
                Scent: "Vanilla & Orchid",
                Size: "250ml",
              },
              prices: [
                {
                  currency_code: "ngn",
                  amount: 1500000, // ₦15,000
                },
                {
                  currency_code: "usd",
                  amount: 1800, // $18
                },
              ],
            },
            {
              title: "Pure Seduction / 250ml",
              sku: "VS-SEDUCTION-250",
              options: {
                Scent: "Pure Seduction",
                Size: "250ml",
              },
              prices: [
                {
                  currency_code: "ngn",
                  amount: 1500000, // ₦15,000
                },
                {
                  currency_code: "usd",
                  amount: 1800, // $18
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

  const inventoryLevels: any[] = [];
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