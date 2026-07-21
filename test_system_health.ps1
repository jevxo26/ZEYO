$ErrorActionPreference = "Continue"

Write-Host "=============================================="
Write-Host "    ZEYO SYSTEM HEALTH CHECK (PARTS 1-16)   "
Write-Host "=============================================="
Write-Host ""

# 1. Authentication
Write-Host "[1/13] Authenticating..."
try {
    $login = Invoke-RestMethod "http://localhost:3000/api/auth/login" -Method POST -Body (@{ email="testadmin@zeyo.com"; password="Test@12345" } | ConvertTo-Json) -ContentType "application/json" -TimeoutSec 30
    $token = $login.data.token
    $h = @{ Authorization = "Bearer $token"; "Content-Type" = "application/json" }
    Write-Host "  ✅ Auth Module: SUCCESS (Token Acquired)"
} catch {
    Write-Host "  ❌ Auth Module: FAILED ($($_.Exception.Message))"
    exit 1
}

$endpoints = @(
    @{ name="User & Profile Module"; url="http://localhost:3000/api/users" },
    @{ name="RBAC Module"; url="http://localhost:3000/api/rbac/roles" },
    @{ name="Customer Module"; url="http://localhost:3000/api/customers" },
    @{ name="Vendor Module"; url="http://localhost:3000/api/admin/vendors" },
    @{ name="Event Module"; url="http://localhost:3000/api/events" },
    @{ name="Location & Zone Module"; url="http://localhost:3000/api/locations/countries" },
    @{ name="Package Module"; url="http://localhost:3000/api/packages" },
    @{ name="Service Module"; url="http://localhost:3000/api/services" },
    @{ name="Smart Calculator Module"; url="http://localhost:3000/api/calculator/settings" },
    @{ name="Booking Module"; url="http://localhost:3000/api/bookings" },
    @{ name="Payment & Billing Module"; url="http://localhost:3000/api/admin/payments" },
    @{ name="Review & Feedback Module"; url="http://localhost:3000/api/reviews" },
    @{ name="Notification Module"; url="http://localhost:3000/api/notifications/in-app" },
    @{ name="Communication Module"; url="http://localhost:3000/api/communications/conversations" },
    @{ name="Admin Notification Module"; url="http://localhost:3000/api/admin/notifications/broadcasts" },
    @{ name="CMS Module"; url="http://localhost:3000/api/admin/cms/banners" },
    @{ name="Config Module"; url="http://localhost:3000/api/admin/config/settings" },
    @{ name="Dashboard Module"; url="http://localhost:3000/api/admin/dashboards/" },
    @{ name="Analytics Module"; url="http://localhost:3000/api/admin/analytics/dashboards" }
)

$i = 2
foreach ($ep in $endpoints) {
    try {
        $res = Invoke-RestMethod $ep.url -Headers $h -TimeoutSec 30
        Write-Host "[$i/13] $($ep.name): ✅ SUCCESS (HTTP 200)"
    } catch {
        Write-Host "[$i/13] $($ep.name): ❌ FAILED ($($_.Exception.Message))"
    }
    $i++
}

Write-Host ""
Write-Host "=============================================="
Write-Host "             HEALTH CHECK COMPLETE            "
Write-Host "=============================================="




