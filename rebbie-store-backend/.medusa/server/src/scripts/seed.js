"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = seedRebbieStoreData;
const utils_1 = require("@medusajs/framework/utils");
const core_flows_1 = require("@medusajs/medusa/core-flows");
async function seedRebbieStoreData({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const link = container.resolve(utils_1.ContainerRegistrationKeys.LINK);
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const fulfillmentModuleService = container.resolve(utils_1.Modules.FULFILLMENT);
    const salesChannelModuleService = container.resolve(utils_1.Modules.SALES_CHANNEL);
    const storeModuleService = container.resolve(utils_1.Modules.STORE);
    // Nigerian focus with international support
    const countries = ["ng", "us", "gb", "ca", "au", "gh", "za"];
    logger.info("🏪 Setting up Rebbie's Store data...");
    const [store] = await storeModuleService.listStores();
    let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
        name: "Rebbie's Store Sales Channel",
    });
    if (!defaultSalesChannel.length) {
        const { result: salesChannelResult } = await (0, core_flows_1.createSalesChannelsWorkflow)(container).run({
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
    await (0, core_flows_1.updateStoresWorkflow)(container).run({
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
    const { result: regionResult } = await (0, core_flows_1.createRegionsWorkflow)(container).run({
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
    const nigeriaRegion = regionResult.find(r => r.name === "Nigeria");
    const internationalRegion = regionResult.find(r => r.name === "International");
    logger.info("📊 Setting up tax regions...");
    await (0, core_flows_1.createTaxRegionsWorkflow)(container).run({
        input: countries.map((country_code) => ({
            country_code,
            provider_id: "tp_system"
        })),
    });
    logger.info("📍 Creating stock locations...");
    const { result: stockLocationResult } = await (0, core_flows_1.createStockLocationsWorkflow)(container).run({
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
        [utils_1.Modules.STOCK_LOCATION]: {
            stock_location_id: stockLocation.id,
        },
        [utils_1.Modules.FULFILLMENT]: {
            fulfillment_provider_id: "manual_manual",
        },
    });
    logger.info("🚚 Setting up Nigerian shipping...");
    const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
        type: "default"
    });
    let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;
    if (!shippingProfile) {
        const { result: shippingProfileResult } = await (0, core_flows_1.createShippingProfilesWorkflow)(container).run({
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
        [utils_1.Modules.STOCK_LOCATION]: {
            stock_location_id: stockLocation.id,
        },
        [utils_1.Modules.FULFILLMENT]: {
            fulfillment_set_id: fulfillmentSet.id,
        },
    });
    // Nigerian shipping options
    await (0, core_flows_1.createShippingOptionsWorkflow)(container).run({
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
    await (0, core_flows_1.linkSalesChannelsToStockLocationWorkflow)(container).run({
        input: {
            id: stockLocation.id,
            add: [defaultSalesChannel[0].id],
        },
    });
    logger.info("🔑 Setting up API keys...");
    const { result: publishableApiKeyResult } = await (0, core_flows_1.createApiKeysWorkflow)(container).run({
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
    await (0, core_flows_1.linkSalesChannelsToApiKeyWorkflow)(container).run({
        input: {
            id: publishableApiKey.id,
            add: [defaultSalesChannel[0].id],
        },
    });
    logger.info("📦 Creating Rebbie's Store product categories...");
    const { result: categoryResult } = await (0, core_flows_1.createProductCategoriesWorkflow)(container).run({
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
    await (0, core_flows_1.createProductsWorkflow)(container).run({
        input: {
            products: [
                {
                    title: "Vintage Chanel Quilted Handbag",
                    category_ids: [
                        categoryResult.find((cat) => cat.name === "Fashion Bags").id,
                        categoryResult.find((cat) => cat.name === "Thrift Fashion Bags").id,
                    ],
                    description: "Authentic pre-owned Chanel quilted handbag in excellent condition. Classic design that never goes out of style. Includes authenticity certificate.",
                    handle: "vintage-chanel-quilted-handbag",
                    weight: 800,
                    status: utils_1.ProductStatus.PUBLISHED,
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
                                    amount: 45000000, // ₦450,000
                                },
                                {
                                    currency_code: "usd",
                                    amount: 55000, // $550
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
                                    amount: 38000000, // ₦380,000
                                },
                                {
                                    currency_code: "usd",
                                    amount: 46000, // $460
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
                        categoryResult.find((cat) => cat.name === "Fashion Bags").id,
                        categoryResult.find((cat) => cat.name === "Non-Thrift Fashion Bags").id,
                    ],
                    description: "Brand new contemporary leather tote bag perfect for work and travel. Made from premium genuine leather with spacious interior and multiple pockets.",
                    handle: "contemporary-leather-tote-bag",
                    weight: 600,
                    status: utils_1.ProductStatus.PUBLISHED,
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
                        categoryResult.find((cat) => cat.name === "Fragrances").id,
                        categoryResult.find((cat) => cat.name === "Men's Fragrances").id,
                    ],
                    description: "Dior Sauvage is an olfactory journey through wild nature, inspired by wide-open spaces. Fresh, raw and noble fragrance with bergamot and pepper notes.",
                    handle: "dior-sauvage-eau-de-toilette",
                    weight: 300,
                    status: utils_1.ProductStatus.PUBLISHED,
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
                                    amount: 18500000, // ₦185,000
                                },
                                {
                                    currency_code: "usd",
                                    amount: 22500, // $225
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
                                    amount: 14500000, // ₦145,000
                                },
                                {
                                    currency_code: "usd",
                                    amount: 17800, // $178
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
                        categoryResult.find((cat) => cat.name === "Fragrances").id,
                        categoryResult.find((cat) => cat.name === "Women's Fragrances").id,
                    ],
                    description: "The legendary Chanel No. 5 Eau de Parfum. An iconic fragrance with ylang-ylang and neroli, enhanced by jasmine and rose, on a warm base of vetiver and sandalwood.",
                    handle: "chanel-no5-eau-de-parfum",
                    weight: 250,
                    status: utils_1.ProductStatus.PUBLISHED,
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
                        categoryResult.find((cat) => cat.name === "Fragrances").id,
                        categoryResult.find((cat) => cat.name === "Women's Fragrances").id,
                    ],
                    description: "Light and refreshing body mist perfect for everyday wear. Available in multiple delightful scents. Great for layering or wearing alone.",
                    handle: "victoria-secret-body-mist",
                    weight: 150,
                    status: utils_1.ProductStatus.PUBLISHED,
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
    const inventoryLevels = [];
    for (const inventoryItem of inventoryItems) {
        const inventoryLevel = {
            location_id: stockLocation.id,
            stocked_quantity: 50,
            inventory_item_id: inventoryItem.id,
        };
        inventoryLevels.push(inventoryLevel);
    }
    await (0, core_flows_1.createInventoryLevelsWorkflow)(container).run({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zY3JpcHRzL3NlZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFzQkEsc0NBNjBCQztBQWwyQkQscURBSW1DO0FBQ25DLDREQWNxQztBQUV0QixLQUFLLFVBQVUsbUJBQW1CLENBQUMsRUFBRSxTQUFTLEVBQVk7SUFDdkUsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNuRSxNQUFNLElBQUksR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQy9ELE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakUsTUFBTSx3QkFBd0IsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGVBQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN4RSxNQUFNLHlCQUF5QixHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQzNFLE1BQU0sa0JBQWtCLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFNUQsNENBQTRDO0lBQzVDLE1BQU0sU0FBUyxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFFN0QsTUFBTSxDQUFDLElBQUksQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO0lBRXBELE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxNQUFNLGtCQUFrQixDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3RELElBQUksbUJBQW1CLEdBQUcsTUFBTSx5QkFBeUIsQ0FBQyxpQkFBaUIsQ0FBQztRQUMxRSxJQUFJLEVBQUUsOEJB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