"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// ─────────────────────────────────────────────────────────────────────────────
// Default System Roles
// ─────────────────────────────────────────────────────────────────────────────
const defaultRoles = [
    { name: 'Super Admin', code: 'SUPER_ADMIN', roleType: 'system', priority: 100, isSystem: true, description: 'Unrestricted access to the entire platform.' },
    { name: 'Admin', code: 'ADMIN', roleType: 'system', priority: 90, isSystem: true, description: 'Full administrative access across all modules.' },
    { name: 'Operations Manager', code: 'OPS_MANAGER', roleType: 'staff', priority: 80, isSystem: true, description: 'Manages day-to-day platform operations.' },
    { name: 'Finance Manager', code: 'FINANCE_MANAGER', roleType: 'staff', priority: 75, isSystem: true, description: 'Manages payments, refunds and financial reporting.' },
    { name: 'Vendor Manager', code: 'VENDOR_MANAGER', roleType: 'staff', priority: 72, isSystem: true, description: 'Onboards, approves and manages vendor accounts.' },
    { name: 'Customer Support', code: 'CUSTOMER_SUPPORT', roleType: 'staff', priority: 70, isSystem: true, description: 'Handles customer queries and support tickets.' },
    { name: 'Zone Manager', code: 'ZONE_MANAGER', roleType: 'staff', priority: 68, isSystem: true, description: 'Manages operations within an assigned geographic zone.' },
    { name: 'Booking Manager', code: 'BOOKING_MANAGER', roleType: 'staff', priority: 65, isSystem: true, description: 'Oversees booking lifecycle and vendor assignments.' },
    { name: 'Vendor', code: 'VENDOR', roleType: 'vendor', priority: 50, isSystem: true, description: 'Vendor account with access to their own services and bookings.' },
    { name: 'Vendor Employee', code: 'VENDOR_EMPLOYEE', roleType: 'vendor', priority: 40, isSystem: true, description: 'Employee of a vendor with limited operational access.' },
    { name: 'Customer', code: 'CUSTOMER', roleType: 'customer', priority: 10, isSystem: true, description: 'End-user customer with access to booking and profile features.' },
];
// ─────────────────────────────────────────────────────────────────────────────
// Default Modules
// ─────────────────────────────────────────────────────────────────────────────
const defaultModules = [
    { name: 'User Management', code: 'USER_MANAGEMENT', displayOrder: 1, icon: 'users', description: 'Create, view, update, delete and verify platform users.' },
    { name: 'Vendor Management', code: 'VENDOR_MANAGEMENT', displayOrder: 2, icon: 'store', description: 'Onboard, approve, suspend and manage vendor accounts.' },
    { name: 'Package Management', code: 'PACKAGE_MANAGEMENT', displayOrder: 3, icon: 'package', description: 'Create and manage service packages.' },
    { name: 'Service Management', code: 'SERVICE_MANAGEMENT', displayOrder: 4, icon: 'settings', description: 'Manage services, pricing and add-ons.' },
    { name: 'Booking Management', code: 'BOOKING_MANAGEMENT', displayOrder: 5, icon: 'calendar', description: 'View, assign, cancel and reschedule bookings.' },
    { name: 'Payment Management', code: 'PAYMENT_MANAGEMENT', displayOrder: 6, icon: 'credit-card', description: 'View transactions, approve refunds and release payouts.' },
    { name: 'CMS Management', code: 'CMS_MANAGEMENT', displayOrder: 7, icon: 'file-text', description: 'Manage banners, FAQs, blogs and legal content.' },
    { name: 'Analytics', code: 'ANALYTICS', displayOrder: 8, icon: 'bar-chart', description: 'View dashboards, reports and export analytics data.' },
];
// ─────────────────────────────────────────────────────────────────────────────
// Default Permissions (keyed by module code for lookup)
// ─────────────────────────────────────────────────────────────────────────────
const defaultPermissions = [
    // User Management
    { name: 'Create User', code: 'USER_CREATE', action: 'create', description: 'Create new user accounts.', moduleCode: 'USER_MANAGEMENT' },
    { name: 'View User', code: 'USER_READ', action: 'read', description: 'View user profiles and details.', moduleCode: 'USER_MANAGEMENT' },
    { name: 'Update User', code: 'USER_UPDATE', action: 'update', description: 'Edit user information.', moduleCode: 'USER_MANAGEMENT' },
    { name: 'Delete User', code: 'USER_DELETE', action: 'delete', description: 'Permanently delete user accounts.', moduleCode: 'USER_MANAGEMENT' },
    { name: 'Block User', code: 'USER_BLOCK', action: 'manage', description: 'Block or suspend user accounts.', moduleCode: 'USER_MANAGEMENT' },
    { name: 'Verify User', code: 'USER_VERIFY', action: 'approve', description: 'Verify user identity or email.', moduleCode: 'USER_MANAGEMENT' },
    // Vendor Management
    { name: 'Create Vendor', code: 'VENDOR_CREATE', action: 'create', description: 'Register new vendor accounts.', moduleCode: 'VENDOR_MANAGEMENT' },
    { name: 'Approve Vendor', code: 'VENDOR_APPROVE', action: 'approve', description: 'Approve vendor onboarding applications.', moduleCode: 'VENDOR_MANAGEMENT' },
    { name: 'Reject Vendor', code: 'VENDOR_REJECT', action: 'manage', description: 'Reject vendor onboarding applications.', moduleCode: 'VENDOR_MANAGEMENT' },
    { name: 'Suspend Vendor', code: 'VENDOR_SUSPEND', action: 'manage', description: 'Suspend active vendor accounts.', moduleCode: 'VENDOR_MANAGEMENT' },
    { name: 'Assign Vendor', code: 'VENDOR_ASSIGN', action: 'assign', description: 'Assign vendors to bookings or zones.', moduleCode: 'VENDOR_MANAGEMENT' },
    // Package Management
    { name: 'Create Package', code: 'PACKAGE_CREATE', action: 'create', description: 'Create new service packages.', moduleCode: 'PACKAGE_MANAGEMENT' },
    { name: 'Update Package', code: 'PACKAGE_UPDATE', action: 'update', description: 'Edit existing packages.', moduleCode: 'PACKAGE_MANAGEMENT' },
    { name: 'Delete Package', code: 'PACKAGE_DELETE', action: 'delete', description: 'Delete packages.', moduleCode: 'PACKAGE_MANAGEMENT' },
    { name: 'Publish Package', code: 'PACKAGE_PUBLISH', action: 'manage', description: 'Publish or unpublish packages.', moduleCode: 'PACKAGE_MANAGEMENT' },
    // Service Management
    { name: 'Create Service', code: 'SERVICE_CREATE', action: 'create', description: 'Create new services.', moduleCode: 'SERVICE_MANAGEMENT' },
    { name: 'Update Service', code: 'SERVICE_UPDATE', action: 'update', description: 'Edit existing services.', moduleCode: 'SERVICE_MANAGEMENT' },
    { name: 'Delete Service', code: 'SERVICE_DELETE', action: 'delete', description: 'Delete services.', moduleCode: 'SERVICE_MANAGEMENT' },
    { name: 'Manage Pricing', code: 'SERVICE_PRICING', action: 'manage', description: 'Set and update service pricing.', moduleCode: 'SERVICE_MANAGEMENT' },
    { name: 'Manage Add-ons', code: 'SERVICE_ADDONS', action: 'manage', description: 'Configure service add-ons.', moduleCode: 'SERVICE_MANAGEMENT' },
    // Booking Management
    { name: 'View Booking', code: 'BOOKING_READ', action: 'read', description: 'View booking details.', moduleCode: 'BOOKING_MANAGEMENT' },
    { name: 'Assign Vendor to Booking', code: 'BOOKING_ASSIGN_VENDOR', action: 'assign', description: 'Assign a vendor to a booking.', moduleCode: 'BOOKING_MANAGEMENT' },
    { name: 'Cancel Booking', code: 'BOOKING_CANCEL', action: 'manage', description: 'Cancel existing bookings.', moduleCode: 'BOOKING_MANAGEMENT' },
    { name: 'Reschedule Booking', code: 'BOOKING_RESCHEDULE', action: 'manage', description: 'Reschedule bookings.', moduleCode: 'BOOKING_MANAGEMENT' },
    { name: 'Approve Booking', code: 'BOOKING_APPROVE', action: 'approve', description: 'Approve pending bookings.', moduleCode: 'BOOKING_MANAGEMENT' },
    // Payment Management
    { name: 'View Payments', code: 'PAYMENT_READ', action: 'read', description: 'View payment records and transactions.', moduleCode: 'PAYMENT_MANAGEMENT' },
    { name: 'Approve Refund', code: 'PAYMENT_REFUND_APPROVE', action: 'approve', description: 'Approve customer refund requests.', moduleCode: 'PAYMENT_MANAGEMENT' },
    { name: 'Release Payout', code: 'PAYMENT_PAYOUT_RELEASE', action: 'manage', description: 'Release vendor payouts.', moduleCode: 'PAYMENT_MANAGEMENT' },
    { name: 'View Transactions', code: 'PAYMENT_TRANSACTIONS_READ', action: 'read', description: 'View detailed transaction logs.', moduleCode: 'PAYMENT_MANAGEMENT' },
    // CMS Management
    { name: 'Manage Banner', code: 'CMS_BANNER', action: 'manage', description: 'Create and edit promotional banners.', moduleCode: 'CMS_MANAGEMENT' },
    { name: 'Manage FAQ', code: 'CMS_FAQ', action: 'manage', description: 'Create and edit FAQ content.', moduleCode: 'CMS_MANAGEMENT' },
    { name: 'Manage Blog', code: 'CMS_BLOG', action: 'manage', description: 'Publish and manage blog posts.', moduleCode: 'CMS_MANAGEMENT' },
    { name: 'Manage Terms', code: 'CMS_TERMS', action: 'manage', description: 'Update Terms & Conditions content.', moduleCode: 'CMS_MANAGEMENT' },
    { name: 'Manage Privacy Policy', code: 'CMS_PRIVACY', action: 'manage', description: 'Update Privacy Policy content.', moduleCode: 'CMS_MANAGEMENT' },
    // Analytics
    { name: 'View Dashboard', code: 'ANALYTICS_DASHBOARD', action: 'read', description: 'View the analytics dashboard.', moduleCode: 'ANALYTICS' },
    { name: 'View Reports', code: 'ANALYTICS_REPORTS_READ', action: 'read', description: 'View generated reports.', moduleCode: 'ANALYTICS' },
    { name: 'Export Reports', code: 'ANALYTICS_REPORTS_EXPORT', action: 'export', description: 'Export reports as CSV / PDF.', moduleCode: 'ANALYTICS' },
];
// ─────────────────────────────────────────────────────────────────────────────
// Main Seed
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
    var _a, _b, _c, _d, _e, _f, _g;
    console.log('🌱 Seeding RBAC: Roles, Modules, Permissions...\n');
    // 1. Upsert Roles
    console.log('📌 Seeding roles...');
    const roleMap = {};
    for (const role of defaultRoles) {
        const created = await prisma.role.upsert({
            where: { code: role.code },
            update: {
                name: role.name,
                description: role.description,
                roleType: role.roleType,
                priority: role.priority,
                isSystem: role.isSystem,
                status: 'active',
            },
            create: {
                name: role.name,
                code: role.code,
                description: role.description,
                roleType: role.roleType,
                priority: role.priority,
                isSystem: role.isSystem,
                status: 'active',
            },
        });
        roleMap[role.code] = created.id;
        console.log(`   ✅ Role: ${role.name} (${role.code})`);
    }
    // 2. Upsert Modules
    console.log('\n📌 Seeding modules...');
    const moduleMap = {};
    for (const mod of defaultModules) {
        const created = await prisma.module.upsert({
            where: { code: mod.code },
            update: {
                name: mod.name,
                icon: mod.icon,
                displayOrder: mod.displayOrder,
                description: mod.description,
                status: 'active',
            },
            create: {
                name: mod.name,
                code: mod.code,
                icon: mod.icon,
                displayOrder: mod.displayOrder,
                description: mod.description,
                status: 'active',
            },
        });
        moduleMap[mod.code] = created.id;
        console.log(`   ✅ Module: ${mod.name} (${mod.code})`);
    }
    // 3. Upsert Permissions & link to Modules via ModulePermission
    console.log('\n📌 Seeding permissions...');
    for (const perm of defaultPermissions) {
        const moduleId = moduleMap[perm.moduleCode];
        if (!moduleId) {
            console.warn(`   ⚠️  Module not found for code: ${perm.moduleCode} — skipping ${perm.code}`);
            continue;
        }
        const created = await prisma.permission.upsert({
            where: { code: perm.code },
            update: {
                name: perm.name,
                description: perm.description,
                action: perm.action,
                moduleId,
                status: 'active',
            },
            create: {
                name: perm.name,
                code: perm.code,
                description: perm.description,
                action: perm.action,
                moduleId,
                status: 'active',
            },
        });
        // Ensure ModulePermission join record exists
        await prisma.modulePermission.upsert({
            where: { moduleId_permissionId: { moduleId, permissionId: created.id } },
            update: {},
            create: { moduleId, permissionId: created.id },
        });
        console.log(`   ✅ Permission: ${perm.name} (${perm.code}) → ${perm.moduleCode}`);
    }
    console.log('\n🎉 RBAC seed complete!');
    // ─────────────────────────────────────────────────────────────────────────────
    // Zone & Location Seed
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n🌍 Seeding Zone & Location data...\n');
    // 1. Country — Bangladesh
    const bangladesh = await prisma.country.upsert({
        where: { isoCode: 'BD' },
        update: { name: 'Bangladesh', currency: 'BDT', phoneCode: '+880', status: 'active' },
        create: { name: 'Bangladesh', isoCode: 'BD', currency: 'BDT', phoneCode: '+880', status: 'active' },
    });
    console.log(`   ✅ Country: ${bangladesh.name}`);
    // 2. Divisions
    const divisionData = [
        { name: 'Dhaka', code: 'DHK' },
        { name: 'Chattogram', code: 'CTG' },
        { name: 'Rajshahi', code: 'RJH' },
        { name: 'Khulna', code: 'KHU' },
        { name: 'Sylhet', code: 'SYL' },
        { name: 'Barishal', code: 'BAR' },
        { name: 'Rangpur', code: 'RNG' },
        { name: 'Mymensingh', code: 'MYM' },
    ];
    const divisionMap = {};
    for (const div of divisionData) {
        const d = await prisma.division.upsert({
            where: { id: (_b = (_a = (await prisma.division.findFirst({ where: { code: div.code, countryId: bangladesh.id } }))) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : 0 },
            update: { name: div.name, status: 'active' },
            create: { name: div.name, code: div.code, countryId: bangladesh.id, status: 'active' },
        });
        divisionMap[div.code] = d.id;
        console.log(`   ✅ Division: ${div.name}`);
    }
    // 3. Districts (Dhaka Division)
    const dhakaDistrictData = [
        { name: 'Dhaka', code: 'DH-DH' },
        { name: 'Narayanganj', code: 'DH-NG' },
        { name: 'Gazipur', code: 'DH-GZ' },
    ];
    const districtMap = {};
    for (const dist of dhakaDistrictData) {
        const existing = await prisma.district.findFirst({ where: { code: dist.code, divisionId: divisionMap['DHK'] } });
        const d = await prisma.district.upsert({
            where: { id: (_c = existing === null || existing === void 0 ? void 0 : existing.id) !== null && _c !== void 0 ? _c : 0 },
            update: { name: dist.name, status: 'active' },
            create: { name: dist.name, code: dist.code, divisionId: divisionMap['DHK'], status: 'active' },
        });
        districtMap[dist.code] = d.id;
        console.log(`   ✅ District: ${dist.name}`);
    }
    // Chattogram District
    const ctgDistExisting = await prisma.district.findFirst({ where: { code: 'CTG-CTG', divisionId: divisionMap['CTG'] } });
    const ctgDistrict = await prisma.district.upsert({
        where: { id: (_d = ctgDistExisting === null || ctgDistExisting === void 0 ? void 0 : ctgDistExisting.id) !== null && _d !== void 0 ? _d : 0 },
        update: { name: 'Chattogram', status: 'active' },
        create: { name: 'Chattogram', code: 'CTG-CTG', divisionId: divisionMap['CTG'], status: 'active' },
    });
    districtMap['CTG-CTG'] = ctgDistrict.id;
    console.log(`   ✅ District: Chattogram`);
    // Rajshahi District
    const rjhDistExisting = await prisma.district.findFirst({ where: { code: 'RJH-RJH', divisionId: divisionMap['RJH'] } });
    const rjhDistrict = await prisma.district.upsert({
        where: { id: (_e = rjhDistExisting === null || rjhDistExisting === void 0 ? void 0 : rjhDistExisting.id) !== null && _e !== void 0 ? _e : 0 },
        update: { name: 'Rajshahi', status: 'active' },
        create: { name: 'Rajshahi', code: 'RJH-RJH', divisionId: divisionMap['RJH'], status: 'active' },
    });
    districtMap['RJH-RJH'] = rjhDistrict.id;
    console.log(`   ✅ District: Rajshahi`);
    // 4. Cities
    const cityData = [
        { name: 'Dhaka North', code: 'DH-N', districtCode: 'DH-DH' },
        { name: 'Dhaka South', code: 'DH-S', districtCode: 'DH-DH' },
        { name: 'Narayanganj', code: 'NG-C', districtCode: 'DH-NG' },
        { name: 'Gazipur City', code: 'GZ-C', districtCode: 'DH-GZ' },
        { name: 'Chattogram City', code: 'CTG-C', districtCode: 'CTG-CTG' },
        { name: 'Rajshahi City', code: 'RJH-C', districtCode: 'RJH-RJH' },
    ];
    const cityMap = {};
    for (const city of cityData) {
        const districtId = districtMap[city.districtCode];
        const existing = await prisma.city.findFirst({ where: { code: city.code, districtId } });
        const c = await prisma.city.upsert({
            where: { id: (_f = existing === null || existing === void 0 ? void 0 : existing.id) !== null && _f !== void 0 ? _f : 0 },
            update: { name: city.name, status: 'active' },
            create: { name: city.name, code: city.code, districtId, status: 'active' },
        });
        cityMap[city.code] = c.id;
        console.log(`   ✅ City: ${city.name}`);
    }
    // 5. Areas (sample)
    const areaData = [
        { name: 'Gulshan', postalCode: '1212', cityCode: 'DH-N', lat: 23.7806, lng: 90.4193 },
        { name: 'Banani', postalCode: '1213', cityCode: 'DH-N', lat: 23.7937, lng: 90.4066 },
        { name: 'Uttara', postalCode: '1230', cityCode: 'DH-N', lat: 23.8759, lng: 90.3795 },
        { name: 'Dhanmondi', postalCode: '1209', cityCode: 'DH-S', lat: 23.7461, lng: 90.3742 },
        { name: 'Old Dhaka', postalCode: '1100', cityCode: 'DH-S', lat: 23.7239, lng: 90.4039 },
        { name: 'Nasirabad', postalCode: '4209', cityCode: 'CTG-C', lat: 22.3569, lng: 91.7832 },
    ];
    const areaMap = {};
    for (const area of areaData) {
        const cityId = cityMap[area.cityCode];
        const existing = await prisma.area.findFirst({ where: { name: area.name, cityId } });
        const a = await prisma.area.upsert({
            where: { id: (_g = existing === null || existing === void 0 ? void 0 : existing.id) !== null && _g !== void 0 ? _g : 0 },
            update: { postalCode: area.postalCode, latitude: area.lat, longitude: area.lng, status: 'active' },
            create: { name: area.name, postalCode: area.postalCode, cityId, latitude: area.lat, longitude: area.lng, status: 'active' },
        });
        areaMap[area.name] = a.id;
        console.log(`   ✅ Area: ${area.name}`);
    }
    // 6. ZoneGroups
    const zoneGroupData = [
        { name: 'Metro Cities', description: 'Major metropolitan areas with premium pricing' },
        { name: 'Divisional Cities', description: 'Divisional capitals with standard pricing' },
        { name: 'Outskirts', description: 'Peripheral and suburban zones' },
    ];
    const zoneGroupMap = {};
    for (const zg of zoneGroupData) {
        const existing = await prisma.zoneGroup.findFirst({ where: { name: zg.name } });
        const g = existing
            ? await prisma.zoneGroup.update({ where: { id: existing.id }, data: { description: zg.description, status: 'active' } })
            : await prisma.zoneGroup.create({ data: { name: zg.name, description: zg.description, status: 'active' } });
        zoneGroupMap[zg.name] = g.id;
        console.log(`   ✅ ZoneGroup: ${zg.name}`);
    }
    // 7. Zones
    const zoneData = [
        { name: 'Dhaka North', zoneCode: 'ZONE-DHK-N', cityCode: 'DH-N', divCode: 'DHK', distCode: 'DH-DH', group: 'Metro Cities', desc: 'North Dhaka including Gulshan, Banani, Uttara' },
        { name: 'Dhaka South', zoneCode: 'ZONE-DHK-S', cityCode: 'DH-S', divCode: 'DHK', distCode: 'DH-DH', group: 'Metro Cities', desc: 'South Dhaka including Dhanmondi, Old Dhaka' },
        { name: 'Chattogram City', zoneCode: 'ZONE-CTG', cityCode: 'CTG-C', divCode: 'CTG', distCode: 'CTG-CTG', group: 'Divisional Cities', desc: 'Chattogram city zone' },
        { name: 'Rajshahi City', zoneCode: 'ZONE-RJH', cityCode: 'RJH-C', divCode: 'RJH', distCode: 'RJH-RJH', group: 'Divisional Cities', desc: 'Rajshahi city zone' },
        { name: 'Gazipur', zoneCode: 'ZONE-GZP', cityCode: 'GZ-C', divCode: 'DHK', distCode: 'DH-GZ', group: 'Outskirts', desc: 'Gazipur industrial and residential zone' },
        { name: 'Narayanganj', zoneCode: 'ZONE-NRG', cityCode: 'NG-C', divCode: 'DHK', distCode: 'DH-NG', group: 'Outskirts', desc: 'Narayanganj city zone' },
    ];
    const zoneMap = {};
    for (const z of zoneData) {
        const existing = await prisma.zone.findFirst({ where: { zoneCode: z.zoneCode } });
        const zone = await prisma.zone.upsert({
            where: { zoneCode: z.zoneCode },
            update: { name: z.name, description: z.desc, status: 'active', zoneGroupId: zoneGroupMap[z.group] },
            create: {
                name: z.name,
                zoneCode: z.zoneCode,
                description: z.desc,
                countryId: bangladesh.id,
                divisionId: divisionMap[z.divCode],
                districtId: districtMap[z.distCode],
                cityId: cityMap[z.cityCode],
                status: 'active',
                zoneGroupId: zoneGroupMap[z.group],
            },
        });
        zoneMap[z.zoneCode] = zone.id;
        console.log(`   ✅ Zone: ${z.name} (${z.zoneCode})`);
        // 8. ZoneSetting for each zone
        await prisma.zoneSetting.upsert({
            where: { zoneId: zone.id },
            update: { allowBooking: true, allowCalculator: true, allowPackage: true, allowVendorAssignment: true, isActive: true },
            create: { zoneId: zone.id, allowBooking: true, allowCalculator: true, allowPackage: true, allowVendorAssignment: true, isActive: true },
        });
        // 9. ZoneAnalytics (initial zeros)
        const analyticsExists = await prisma.zoneAnalytics.findFirst({ where: { zoneId: zone.id } });
        if (!analyticsExists) {
            await prisma.zoneAnalytics.create({ data: { zoneId: zone.id } });
        }
        // 10. ZoneTax (VAT 5% for all zones)
        const taxExists = await prisma.zoneTax.findFirst({ where: { zoneId: zone.id, taxName: 'VAT' } });
        if (!taxExists) {
            await prisma.zoneTax.create({ data: { zoneId: zone.id, taxName: 'VAT', taxType: 'percentage', taxValue: 5, status: 'active' } });
        }
        // 11. ZoneDeliveryCharge
        const deliveryExists = await prisma.zoneDeliveryCharge.findFirst({ where: { zoneId: zone.id } });
        if (!deliveryExists) {
            await prisma.zoneDeliveryCharge.create({ data: { zoneId: zone.id, chargeType: 'flat', amount: 500, description: 'Standard transport charge' } });
        }
        // 12. ZoneCoverage
        const coverageExists = await prisma.zoneCoverage.findFirst({ where: { zoneId: zone.id } });
        if (!coverageExists) {
            await prisma.zoneCoverage.create({ data: { zoneId: zone.id, coverageType: 'radius', minimumDistance: 0, maximumDistance: 30, status: 'active' } });
        }
    }
    // 13. ZonePricing (Photography service in each zone — serviceId=1 as placeholder)
    const pricingByZone = {
        'ZONE-DHK-N': 18000,
        'ZONE-DHK-S': 16000,
        'ZONE-CTG': 14000,
        'ZONE-RJH': 12000,
        'ZONE-GZP': 11000,
        'ZONE-NRG': 10000,
    };
    for (const [code, basePrice] of Object.entries(pricingByZone)) {
        const zoneId = zoneMap[code];
        const exists = await prisma.zonePricing.findFirst({ where: { zoneId, serviceId: 1 } });
        if (!exists) {
            await prisma.zonePricing.create({
                data: { zoneId, serviceId: 1, basePrice, minimumPrice: basePrice * 0.8, maximumPrice: basePrice * 1.5, currency: 'BDT', status: 'active' },
            });
        }
        console.log(`   ✅ ZonePricing: Zone ${code} → Photography ৳${basePrice.toLocaleString()}`);
    }
    console.log('\n🎉 Zone & Location seed complete!');
    console.log(`   Countries: 1, Divisions: ${divisionData.length}, Districts: 5, Cities: ${cityData.length}`);
    console.log(`   Areas: ${areaData.length}, ZoneGroups: ${zoneGroupData.length}, Zones: ${zoneData.length}`);
    console.log('\n📦 Seeding Package Module data...\n');
    // 14. Event seeds (if none exist)
    const weddingEvent = await prisma.event.upsert({
        where: { name: 'Wedding' },
        update: {},
        create: { name: 'Wedding', slug: 'wedding', description: 'Wedding events', status: 'active', displayOrder: 1 },
    });
    const birthdayEvent = await prisma.event.upsert({
        where: { name: 'Birthday' },
        update: {},
        create: { name: 'Birthday', slug: 'birthday', description: 'Birthday parties', status: 'active', displayOrder: 2 },
    });
    const corporateEvent = await prisma.event.upsert({
        where: { name: 'Corporate' },
        update: {},
        create: { name: 'Corporate', slug: 'corporate', description: 'Corporate events', status: 'active', displayOrder: 3 },
    });
    // 15. Package Categories
    const weddingCat = await prisma.packageCategory.upsert({
        where: { slug: 'wedding' },
        update: { name: 'Wedding', status: 'active' },
        create: { name: 'Wedding', slug: 'wedding', description: 'Wedding packages', status: 'active' },
    });
    const birthdayCat = await prisma.packageCategory.upsert({
        where: { slug: 'birthday' },
        update: { name: 'Birthday', status: 'active' },
        create: { name: 'Birthday', slug: 'birthday', description: 'Birthday packages', status: 'active' },
    });
    const corporateCat = await prisma.packageCategory.upsert({
        where: { slug: 'corporate' },
        update: { name: 'Corporate', status: 'active' },
        create: { name: 'Corporate', slug: 'corporate', description: 'Corporate packages', status: 'active' },
    });
    // 16. Package SubCategories
    const weddingSub = await prisma.packageSubCategory.findFirst({ where: { name: 'Wedding Reception', packageCategoryId: weddingCat.id } })
        || await prisma.packageSubCategory.create({ data: { name: 'Wedding Reception', packageCategoryId: weddingCat.id, status: 'active' } });
    const birthdaySub = await prisma.packageSubCategory.findFirst({ where: { name: 'Kids Birthday', packageCategoryId: birthdayCat.id } })
        || await prisma.packageSubCategory.create({ data: { name: 'Kids Birthday', packageCategoryId: birthdayCat.id, status: 'active' } });
    const corporateSub = await prisma.packageSubCategory.findFirst({ where: { name: 'Corporate Seminar', packageCategoryId: corporateCat.id } })
        || await prisma.packageSubCategory.create({ data: { name: 'Corporate Seminar', packageCategoryId: corporateCat.id, status: 'active' } });
    // 17. Packages
    const weddingPremiumPkg = await prisma.package.upsert({
        where: { slug: 'wedding-premium' },
        update: { startingPrice: 320000, eventId: weddingEvent.id, packageCategoryId: weddingCat.id, packageSubCategoryId: weddingSub.id },
        create: {
            name: 'Wedding Premium',
            slug: 'wedding-premium',
            code: 'PKG-WED-PREM',
            description: 'Premium wedding package with photography, decor and catering.',
            startingPrice: 320000,
            eventId: weddingEvent.id,
            packageCategoryId: weddingCat.id,
            packageSubCategoryId: weddingSub.id,
            status: 'active',
        }
    });
    const birthdayBasicPkg = await prisma.package.upsert({
        where: { slug: 'birthday-basic' },
        update: { startingPrice: 50000, eventId: birthdayEvent.id, packageCategoryId: birthdayCat.id, packageSubCategoryId: birthdaySub.id },
        create: {
            name: 'Birthday Basic',
            slug: 'birthday-basic',
            code: 'PKG-BD-BASIC',
            description: 'Basic birthday celebration package.',
            startingPrice: 50000,
            eventId: birthdayEvent.id,
            packageCategoryId: birthdayCat.id,
            packageSubCategoryId: birthdaySub.id,
            status: 'active',
        }
    });
    const corporateStdPkg = await prisma.package.upsert({
        where: { slug: 'corporate-standard' },
        update: { startingPrice: 150000, eventId: corporateEvent.id, packageCategoryId: corporateCat.id, packageSubCategoryId: corporateSub.id },
        create: {
            name: 'Corporate Standard',
            slug: 'corporate-standard',
            code: 'PKG-CORP-STD',
            description: 'Standard corporate event package.',
            startingPrice: 150000,
            eventId: corporateEvent.id,
            packageCategoryId: corporateCat.id,
            packageSubCategoryId: corporateSub.id,
            status: 'active',
        }
    });
    // Clean up sub-records for the seeded packages to avoid duplication on re-run
    const seededPkgIds = [weddingPremiumPkg.id, birthdayBasicPkg.id, corporateStdPkg.id];
    await prisma.packagePricing.deleteMany({ where: { packageId: { in: seededPkgIds } } });
    await prisma.packageZonePricing.deleteMany({ where: { packageId: { in: seededPkgIds } } });
    await prisma.packageAvailability.deleteMany({ where: { packageId: { in: seededPkgIds } } });
    await prisma.packageGuestRange.deleteMany({ where: { packageId: { in: seededPkgIds } } });
    await prisma.packageCoverage.deleteMany({ where: { packageId: { in: seededPkgIds } } });
    await prisma.packageService.deleteMany({ where: { packageId: { in: seededPkgIds } } }); // Cascade will delete items
    await prisma.packageAddon.deleteMany({ where: { packageId: { in: seededPkgIds } } });
    await prisma.packageFeature.deleteMany({ where: { packageId: { in: seededPkgIds } } });
    await prisma.packageFAQ.deleteMany({ where: { packageId: { in: seededPkgIds } } });
    await prisma.packagePolicy.deleteMany({ where: { packageId: { in: seededPkgIds } } });
    await prisma.packageTerms.deleteMany({ where: { packageId: { in: seededPkgIds } } });
    await prisma.packageAnalytics.deleteMany({ where: { packageId: { in: seededPkgIds } } });
    // 18. Package Settings
    await prisma.packageSetting.upsert({
        where: { packageId: weddingPremiumPkg.id },
        update: {},
        create: { packageId: weddingPremiumPkg.id, allowCustomization: true, allowAddon: true, allowReschedule: true, allowCancellation: true, showOnHomepage: true, isFeatured: true }
    });
    await prisma.packageSetting.upsert({
        where: { packageId: birthdayBasicPkg.id },
        update: {},
        create: { packageId: birthdayBasicPkg.id, allowCustomization: true, allowAddon: true, allowReschedule: true, allowCancellation: true, showOnHomepage: false, isFeatured: false }
    });
    await prisma.packageSetting.upsert({
        where: { packageId: corporateStdPkg.id },
        update: {},
        create: { packageId: corporateStdPkg.id, allowCustomization: false, allowAddon: true, allowReschedule: true, allowCancellation: true, showOnHomepage: true, isFeatured: false }
    });
    // 19. Package Pricing (Generic baseline)
    await prisma.packagePricing.create({
        data: { packageId: weddingPremiumPkg.id, basePrice: 300000, taxAmount: 15000, finalPrice: 315000 }
    });
    await prisma.packagePricing.create({
        data: { packageId: birthdayBasicPkg.id, basePrice: 48000, taxAmount: 2000, finalPrice: 50000 }
    });
    await prisma.packagePricing.create({
        data: { packageId: corporateStdPkg.id, basePrice: 140000, taxAmount: 7000, finalPrice: 147000 }
    });
    // 20. Package Zone Pricing & Availabilities
    const zoneDhkN = await prisma.zone.findUnique({ where: { zoneCode: 'ZONE-DHK-N' } });
    const zoneDhkS = await prisma.zone.findUnique({ where: { zoneCode: 'ZONE-DHK-S' } });
    const zoneRjh = await prisma.zone.findUnique({ where: { zoneCode: 'ZONE-RJH' } });
    if (zoneDhkN && zoneRjh) {
        await prisma.packageZonePricing.create({
            data: { packageId: weddingPremiumPkg.id, zoneId: zoneDhkN.id, price: 320000, discount: 0 }
        });
        await prisma.packageZonePricing.create({
            data: { packageId: weddingPremiumPkg.id, zoneId: zoneRjh.id, price: 280000, discount: 0 }
        });
        await prisma.packageAvailability.create({
            data: { packageId: weddingPremiumPkg.id, zoneId: zoneDhkN.id, bookingLimit: 10, status: 'active' }
        });
        await prisma.packageAvailability.create({
            data: { packageId: weddingPremiumPkg.id, zoneId: zoneRjh.id, bookingLimit: 5, status: 'active' }
        });
    }
    // 21. Package Guest Range
    await prisma.packageGuestRange.create({
        data: { packageId: weddingPremiumPkg.id, minimumGuest: 100, maximumGuest: 500, recommendedGuest: 300 }
    });
    // 22. Package Coverage
    await prisma.packageCoverage.create({
        data: { packageId: weddingPremiumPkg.id, coverageType: 'days', duration: 2, unit: 'Day' }
    });
    // 23. Package Services & Items (Photography = serviceId 1, Videography = serviceId 2)
    const service1 = await prisma.packageService.create({
        data: { packageId: weddingPremiumPkg.id, serviceId: 1, isRequired: true, displayOrder: 1 }
    });
    const service2 = await prisma.packageService.create({
        data: { packageId: weddingPremiumPkg.id, serviceId: 2, isRequired: true, displayOrder: 2 }
    });
    await prisma.packageServiceItem.create({
        data: { packageServiceId: service1.id, serviceOptionId: 1, coverageId: 1, quantity: 2, duration: 2, remarks: '2 Photographers' }
    });
    await prisma.packageServiceItem.create({
        data: { packageServiceId: service2.id, serviceOptionId: 2, coverageId: 1, quantity: 1, duration: 2, remarks: '1 Videographer' }
    });
    // 24. Package Addons
    await prisma.packageAddon.create({
        data: { packageId: weddingPremiumPkg.id, serviceId: 4, name: 'Drone', price: 15000, pricingType: 'flat', status: 'active' }
    });
    await prisma.packageAddon.create({
        data: { packageId: weddingPremiumPkg.id, serviceId: 5, name: 'Live Streaming', price: 10000, pricingType: 'flat', status: 'active' }
    });
    // 25. Package Features
    await prisma.packageFeature.create({
        data: { packageId: weddingPremiumPkg.id, title: 'Free Consultation', description: '1-hour coordination call', displayOrder: 1 }
    });
    await prisma.packageFeature.create({
        data: { packageId: weddingPremiumPkg.id, title: 'Professional Team', description: 'Experienced service providers', displayOrder: 2 }
    });
    // 26. Package FAQs, Policies, Terms, and Analytics
    await prisma.packageFAQ.create({
        data: { packageId: weddingPremiumPkg.id, question: 'Can I customize the menu?', answer: 'Yes, custom menu changes are allowed.', displayOrder: 1 }
    });
    await prisma.packagePolicy.create({
        data: { packageId: weddingPremiumPkg.id, title: 'Cancellation', description: 'Cancellations must be made 30 days prior to the event.' }
    });
    await prisma.packageTerms.create({
        data: { packageId: weddingPremiumPkg.id, title: 'Standard Agreement', description: 'Prices are subject to tax and availability.' }
    });
    await prisma.packageAnalytics.create({
        data: { packageId: weddingPremiumPkg.id, totalBookings: 0, totalRevenue: 0.0, averageRating: 0.0, conversionRate: 0.0 }
    });
    console.log('🎉 Package Module seed complete!');
    console.log(`   Roles:       ${defaultRoles.length}`);
    console.log(`   Modules:     ${defaultModules.length}`);
    console.log(`   Permissions: ${defaultPermissions.length}`);
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (error) => {
    console.error('❌ Seed failed:', error);
    await prisma.$disconnect();
    process.exit(1);
});
