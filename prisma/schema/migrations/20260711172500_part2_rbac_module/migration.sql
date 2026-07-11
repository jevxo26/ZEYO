-- ─────────────────────────────────────────────────────────────────────────────
-- Part 2: Role & Permission (RBAC) Migration
-- Upgrades the existing Role table and creates all 19 new RBAC entities.
-- ─────────────────────────────────────────────────────────────────────────────

-- AlterTable: Upgrade Role with full RBAC fields
ALTER TABLE "Role" ADD COLUMN     "code" TEXT;
ALTER TABLE "Role" ADD COLUMN     "roleType" TEXT NOT NULL DEFAULT 'custom';
ALTER TABLE "Role" ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Role" ADD COLUMN     "isSystem" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Role" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active';
ALTER TABLE "Role" ADD COLUMN     "createdBy" INTEGER;
ALTER TABLE "Role" ADD COLUMN     "updatedBy" INTEGER;
ALTER TABLE "Role" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- Backfill code from name for existing rows (uppercase, spaces to underscores)
UPDATE "Role" SET "code" = UPPER(REPLACE("name", ' ', '_')) WHERE "code" IS NULL;

-- Now make code NOT NULL and UNIQUE
ALTER TABLE "Role" ALTER COLUMN "code" SET NOT NULL;
CREATE UNIQUE INDEX "Role_code_key" ON "Role"("code");

-- CreateIndex on Role new columns
CREATE INDEX "Role_code_idx" ON "Role"("code");
CREATE INDEX "Role_roleType_idx" ON "Role"("roleType");
CREATE INDEX "Role_status_idx" ON "Role"("status");
CREATE INDEX "Role_deletedAt_idx" ON "Role"("deletedAt");

-- ─────────────────────────────────────────────────────────────────────────────
-- CreateTable: Module
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE "Module" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "icon" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Module_name_key" ON "Module"("name");
CREATE UNIQUE INDEX "Module_code_key" ON "Module"("code");
CREATE INDEX "Module_code_idx" ON "Module"("code");
CREATE INDEX "Module_status_idx" ON "Module"("status");
CREATE INDEX "Module_displayOrder_idx" ON "Module"("displayOrder");

-- ─────────────────────────────────────────────────────────────────────────────
-- CreateTable: Permission
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE "Permission" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "moduleId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");
CREATE UNIQUE INDEX "Permission_code_key" ON "Permission"("code");
CREATE INDEX "Permission_moduleId_idx" ON "Permission"("moduleId");
CREATE INDEX "Permission_code_idx" ON "Permission"("code");
CREATE INDEX "Permission_action_idx" ON "Permission"("action");
CREATE INDEX "Permission_status_idx" ON "Permission"("status");

-- ─────────────────────────────────────────────────────────────────────────────
-- CreateTable: ModulePermission
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE "ModulePermission" (
    "id" SERIAL NOT NULL,
    "moduleId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModulePermission_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ModulePermission_moduleId_permissionId_key" ON "ModulePermission"("moduleId", "permissionId");
CREATE INDEX "ModulePermission_moduleId_idx" ON "ModulePermission"("moduleId");
CREATE INDEX "ModulePermission_permissionId_idx" ON "ModulePermission"("permissionId");

-- ─────────────────────────────────────────────────────────────────────────────
-- CreateTable: RolePermission
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE "RolePermission" (
    "id" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,
    "canCreate" BOOLEAN NOT NULL DEFAULT false,
    "canRead" BOOLEAN NOT NULL DEFAULT false,
    "canUpdate" BOOLEAN NOT NULL DEFAULT false,
    "canDelete" BOOLEAN NOT NULL DEFAULT false,
    "canApprove" BOOLEAN NOT NULL DEFAULT false,
    "canAssign" BOOLEAN NOT NULL DEFAULT false,
    "canExport" BOOLEAN NOT NULL DEFAULT false,
    "canImport" BOOLEAN NOT NULL DEFAULT false,
    "canManage" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "RolePermission_roleId_permissionId_key" ON "RolePermission"("roleId", "permissionId");
CREATE INDEX "RolePermission_roleId_idx" ON "RolePermission"("roleId");
CREATE INDEX "RolePermission_permissionId_idx" ON "RolePermission"("permissionId");

-- ─────────────────────────────────────────────────────────────────────────────
-- CreateTable: UserRole
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE "UserRole" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "assignedBy" INTEGER,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "UserRole_userId_idx" ON "UserRole"("userId");
CREATE INDEX "UserRole_roleId_idx" ON "UserRole"("roleId");
CREATE INDEX "UserRole_status_idx" ON "UserRole"("status");
CREATE INDEX "UserRole_expiresAt_idx" ON "UserRole"("expiresAt");

-- ─────────────────────────────────────────────────────────────────────────────
-- CreateTable: AdminRole
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE "AdminRole" (
    "id" SERIAL NOT NULL,
    "adminId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "assignedBy" INTEGER,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminRole_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AdminRole_adminId_idx" ON "AdminRole"("adminId");
CREATE INDEX "AdminRole_roleId_idx" ON "AdminRole"("roleId");
CREATE INDEX "AdminRole_status_idx" ON "AdminRole"("status");

-- ─────────────────────────────────────────────────────────────────────────────
-- CreateTable: VendorRole
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE "VendorRole" (
    "id" SERIAL NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "assignedBy" INTEGER,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorRole_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "VendorRole_vendorId_idx" ON "VendorRole"("vendorId");
CREATE INDEX "VendorRole_roleId_idx" ON "VendorRole"("roleId");
CREATE INDEX "VendorRole_status_idx" ON "VendorRole"("status");

-- ─────────────────────────────────────────────────────────────────────────────
-- CreateTable: EmployeeRole
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE "EmployeeRole" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "assignedBy" INTEGER,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeRole_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "EmployeeRole_employeeId_idx" ON "EmployeeRole"("employeeId");
CREATE INDEX "EmployeeRole_vendorId_idx" ON "EmployeeRole"("vendorId");
CREATE INDEX "EmployeeRole_roleId_idx" ON "EmployeeRole"("roleId");
CREATE INDEX "EmployeeRole_status_idx" ON "EmployeeRole"("status");

-- ─────────────────────────────────────────────────────────────────────────────
-- CreateTable: RoleHierarchy
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE "RoleHierarchy" (
    "id" SERIAL NOT NULL,
    "parentRoleId" INTEGER NOT NULL,
    "childRoleId" INTEGER NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoleHierarchy_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "RoleHierarchy_parentRoleId_childRoleId_key" ON "RoleHierarchy"("parentRoleId", "childRoleId");
CREATE INDEX "RoleHierarchy_parentRoleId_idx" ON "RoleHierarchy"("parentRoleId");
CREATE INDEX "RoleHierarchy_childRoleId_idx" ON "RoleHierarchy"("childRoleId");

-- ─────────────────────────────────────────────────────────────────────────────
-- CreateTable: RoleScope
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE "RoleScope" (
    "id" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "scopeType" TEXT NOT NULL,
    "scopeValue" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoleScope_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "RoleScope_roleId_idx" ON "RoleScope"("roleId");
CREATE INDEX "RoleScope_scopeType_idx" ON "RoleScope"("scopeType");
CREATE INDEX "RoleScope_scopeValue_idx" ON "RoleScope"("scopeValue");

-- ─────────────────────────────────────────────────────────────────────────────
-- CreateTable: PermissionGroup
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE "PermissionGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PermissionGroup_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PermissionGroup_name_key" ON "PermissionGroup"("name");
CREATE UNIQUE INDEX "PermissionGroup_code_key" ON "PermissionGroup"("code");
CREATE INDEX "PermissionGroup_code_idx" ON "PermissionGroup"("code");
CREATE INDEX "PermissionGroup_status_idx" ON "PermissionGroup"("status");
CREATE INDEX "PermissionGroup_displayOrder_idx" ON "PermissionGroup"("displayOrder");

-- ─────────────────────────────────────────────────────────────────────────────
-- CreateTable: PermissionCondition
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE "PermissionCondition" (
    "id" SERIAL NOT NULL,
    "permissionId" INTEGER NOT NULL,
    "conditionType" TEXT NOT NULL,
    "conditionValue" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PermissionCondition_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PermissionCondition_permissionId_idx" ON "PermissionCondition"("permissionId");
CREATE INDEX "PermissionCondition_conditionType_idx" ON "PermissionCondition"("conditionType");

-- ─────────────────────────────────────────────────────────────────────────────
-- CreateTable: RoleAssignmentHistory
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE "RoleAssignmentHistory" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "assignedBy" INTEGER,
    "previousRole" TEXT,
    "newRole" TEXT NOT NULL,
    "reason" TEXT,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoleAssignmentHistory_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "RoleAssignmentHistory_userId_idx" ON "RoleAssignmentHistory"("userId");
CREATE INDEX "RoleAssignmentHistory_roleId_idx" ON "RoleAssignmentHistory"("roleId");
CREATE INDEX "RoleAssignmentHistory_assignedBy_idx" ON "RoleAssignmentHistory"("assignedBy");
CREATE INDEX "RoleAssignmentHistory_assignedAt_idx" ON "RoleAssignmentHistory"("assignedAt");

-- ─────────────────────────────────────────────────────────────────────────────
-- CreateTable: AccessPolicy
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE "AccessPolicy" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "policyType" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccessPolicy_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AccessPolicy_name_key" ON "AccessPolicy"("name");
CREATE INDEX "AccessPolicy_policyType_idx" ON "AccessPolicy"("policyType");
CREATE INDEX "AccessPolicy_status_idx" ON "AccessPolicy"("status");

-- ─────────────────────────────────────────────────────────────────────────────
-- CreateTable: ResourcePermission
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE "ResourcePermission" (
    "id" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "permissionLevel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResourcePermission_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ResourcePermission_roleId_idx" ON "ResourcePermission"("roleId");
CREATE INDEX "ResourcePermission_resourceType_idx" ON "ResourcePermission"("resourceType");
CREATE INDEX "ResourcePermission_resourceId_idx" ON "ResourcePermission"("resourceId");

-- ─────────────────────────────────────────────────────────────────────────────
-- CreateTable: DataPermission
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE "DataPermission" (
    "id" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "dataType" TEXT NOT NULL,
    "filterType" TEXT NOT NULL,
    "filterValue" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataPermission_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "DataPermission_roleId_idx" ON "DataPermission"("roleId");
CREATE INDEX "DataPermission_dataType_idx" ON "DataPermission"("dataType");
CREATE INDEX "DataPermission_filterType_idx" ON "DataPermission"("filterType");

-- ─────────────────────────────────────────────────────────────────────────────
-- CreateTable: ApiPermission
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE "ApiPermission" (
    "id" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "apiName" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "isAllowed" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiPermission_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ApiPermission_roleId_idx" ON "ApiPermission"("roleId");
CREATE INDEX "ApiPermission_method_idx" ON "ApiPermission"("method");
CREATE INDEX "ApiPermission_isAllowed_idx" ON "ApiPermission"("isAllowed");

-- ─────────────────────────────────────────────────────────────────────────────
-- CreateTable: FeaturePermission
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE "FeaturePermission" (
    "id" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "featureName" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeaturePermission_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "FeaturePermission_roleId_featureName_key" ON "FeaturePermission"("roleId", "featureName");
CREATE INDEX "FeaturePermission_roleId_idx" ON "FeaturePermission"("roleId");
CREATE INDEX "FeaturePermission_featureName_idx" ON "FeaturePermission"("featureName");
CREATE INDEX "FeaturePermission_isEnabled_idx" ON "FeaturePermission"("isEnabled");

-- ─────────────────────────────────────────────────────────────────────────────
-- CreateTable: PermissionAudit
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE "PermissionAudit" (
    "id" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "performedBy" INTEGER,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PermissionAudit_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PermissionAudit_roleId_idx" ON "PermissionAudit"("roleId");
CREATE INDEX "PermissionAudit_permissionId_idx" ON "PermissionAudit"("permissionId");
CREATE INDEX "PermissionAudit_performedBy_idx" ON "PermissionAudit"("performedBy");
CREATE INDEX "PermissionAudit_action_idx" ON "PermissionAudit"("action");
CREATE INDEX "PermissionAudit_createdAt_idx" ON "PermissionAudit"("createdAt");

-- ─────────────────────────────────────────────────────────────────────────────
-- AddForeignKey: Permission → Module
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: ModulePermission → Module
ALTER TABLE "ModulePermission" ADD CONSTRAINT "ModulePermission_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: ModulePermission → Permission
ALTER TABLE "ModulePermission" ADD CONSTRAINT "ModulePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: RolePermission → Role
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: RolePermission → Permission
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: UserRole → Role
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: AdminRole → Role
ALTER TABLE "AdminRole" ADD CONSTRAINT "AdminRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: VendorRole → Role
ALTER TABLE "VendorRole" ADD CONSTRAINT "VendorRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: EmployeeRole → Role
ALTER TABLE "EmployeeRole" ADD CONSTRAINT "EmployeeRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: RoleHierarchy → Role (parent)
ALTER TABLE "RoleHierarchy" ADD CONSTRAINT "RoleHierarchy_parentRoleId_fkey" FOREIGN KEY ("parentRoleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: RoleHierarchy → Role (child)
ALTER TABLE "RoleHierarchy" ADD CONSTRAINT "RoleHierarchy_childRoleId_fkey" FOREIGN KEY ("childRoleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: RoleScope → Role
ALTER TABLE "RoleScope" ADD CONSTRAINT "RoleScope_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: PermissionCondition → Permission
ALTER TABLE "PermissionCondition" ADD CONSTRAINT "PermissionCondition_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: RoleAssignmentHistory → Role
ALTER TABLE "RoleAssignmentHistory" ADD CONSTRAINT "RoleAssignmentHistory_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: ResourcePermission → Role
ALTER TABLE "ResourcePermission" ADD CONSTRAINT "ResourcePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: DataPermission → Role
ALTER TABLE "DataPermission" ADD CONSTRAINT "DataPermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: ApiPermission → Role
ALTER TABLE "ApiPermission" ADD CONSTRAINT "ApiPermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: FeaturePermission → Role
ALTER TABLE "FeaturePermission" ADD CONSTRAINT "FeaturePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: PermissionAudit → Role
ALTER TABLE "PermissionAudit" ADD CONSTRAINT "PermissionAudit_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: PermissionAudit → Permission
ALTER TABLE "PermissionAudit" ADD CONSTRAINT "PermissionAudit_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
