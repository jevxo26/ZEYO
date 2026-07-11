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
