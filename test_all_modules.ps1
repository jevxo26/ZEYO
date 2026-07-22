$ErrorActionPreference = "Continue"
$pass = 0; $fail = 0; $skip = 0

function Test-Endpoint {
    param($label, $method, $url, $body, $headers, $expectCode)
    try {
        $params = @{ Uri=$url; Method=$method; TimeoutSec=30 }
        if ($headers) { $params.Headers = $headers }
        if ($body) { $params.Body = ($body | ConvertTo-Json -Depth 10); $params.ContentType = "application/json" }
        $resp = Invoke-RestMethod @params
        $code = 200
    } catch {
        $code = [int]($_.Exception.Response.StatusCode)
    }
    $expected = if ($expectCode) { $expectCode } else { 200 }
    if ($code -eq $expected) {
        Write-Host "  PASS  [$code] $label"
        $script:pass++
        return $resp
    } else {
        Write-Host "  FAIL  [$code] $label  (expected $expected)"
        $script:fail++
        return $null
    }
}

Write-Host "============================================================"
Write-Host "   ZEYO COMPREHENSIVE API TEST - PARTS 1-16 (Independent)"
Write-Host "============================================================"
Write-Host ""

# ─── STEP 1: Login ───────────────────────────────────────────────────────────
Write-Host "[PART 1] Auth Module"
$login = Test-Endpoint "POST /api/auth/login" POST "http://localhost:3000/api/auth/login" @{ email="testadmin@zeyo.com"; password="Test@12345" }
if (-not $login) { Write-Host "FATAL: Cannot proceed without auth token"; exit 1 }
$tok = $login.data.token
$h = @{ Authorization = "Bearer $tok" }
Write-Host ""

# ─── PART 2: User Module ─────────────────────────────────────────────────────
Write-Host "[PART 2] User & Profile Module"
Test-Endpoint "GET  /api/users"                             GET  "http://localhost:3000/api/users"           $null $h | Out-Null
Test-Endpoint "GET  /api/me/addresses"                      GET  "http://localhost:3000/api/me/addresses"    $null $h | Out-Null
Test-Endpoint "GET  /api/me/sessions"                       GET  "http://localhost:3000/api/me/sessions"     $null $h | Out-Null
Test-Endpoint "GET  /api/me/activity"                       GET  "http://localhost:3000/api/me/activity"     $null $h | Out-Null
Test-Endpoint "GET  /api/me/preferences"                    GET  "http://localhost:3000/api/me/preferences"  $null $h | Out-Null
Test-Endpoint "GET  /api/me/security"                       GET  "http://localhost:3000/api/me/security"     $null $h | Out-Null
Test-Endpoint "GET  /api/me/favorite-zones"                 GET  "http://localhost:3000/api/me/favorite-zones" $null $h | Out-Null
Write-Host ""

# ─── PART 3: RBAC Module ────────────────────────────────────────────────────
Write-Host "[PART 3] RBAC Module"
Test-Endpoint "GET  /api/rbac/roles"             GET "http://localhost:3000/api/rbac/roles"              $null $h | Out-Null
Test-Endpoint "GET  /api/rbac/modules"           GET "http://localhost:3000/api/rbac/modules"            $null $h | Out-Null
Test-Endpoint "GET  /api/rbac/permissions"       GET "http://localhost:3000/api/rbac/permissions"        $null $h | Out-Null
Test-Endpoint "GET  /api/rbac/role-permissions/1 (by roleId)" GET "http://localhost:3000/api/rbac/role-permissions/1" $null $h | Out-Null
Test-Endpoint "GET  /api/rbac/user-roles/1 (by userId)"       GET "http://localhost:3000/api/rbac/user-roles/1"       $null $h | Out-Null
Write-Host ""

# ─── PART 4: Customer Module ─────────────────────────────────────────────────
Write-Host "[PART 4] Customer Module"
Test-Endpoint "GET  /api/customers/profile/me"   GET "http://localhost:3000/api/customers/profile/me"    $null $h | Out-Null
Test-Endpoint "GET  /api/admin/customers"        GET "http://localhost:3000/api/admin/customers"          $null $h | Out-Null
Write-Host ""

# ─── PART 5: Vendor Module ───────────────────────────────────────────────────
Write-Host "[PART 5] Vendor Module"
Test-Endpoint "GET  /api/admin/vendors"                  GET "http://localhost:3000/api/admin/vendors"           $null $h | Out-Null
Test-Endpoint "GET  /api/admin/assignments"               GET "http://localhost:3000/api/admin/assignments"       $null $h | Out-Null
Write-Host ""

# ─── PART 6: Event Module ────────────────────────────────────────────────────
Write-Host "[PART 6] Event Module"
Test-Endpoint "GET  /api/events"                 GET "http://localhost:3000/api/events"                 $null $h | Out-Null
Test-Endpoint "GET  /api/admin/events"           GET "http://localhost:3000/api/admin/events"           $null $h | Out-Null
Write-Host ""

# ─── PART 7: Location Module ─────────────────────────────────────────────────
Write-Host "[PART 7] Location & Zone Module"
Test-Endpoint "GET  /api/locations/countries"        GET "http://localhost:3000/api/locations/countries"        $null $h | Out-Null
Test-Endpoint "GET  /api/zones"                      GET "http://localhost:3000/api/zones"                      $null $h | Out-Null
Test-Endpoint "GET  /api/zones/1/analytics"          GET "http://localhost:3000/api/zones/1/analytics"          $null $h | Out-Null
Write-Host ""

# ─── PART 8: Package Module ──────────────────────────────────────────────────
Write-Host "[PART 8] Package Module"
Test-Endpoint "GET  /api/packages (public)"          GET "http://localhost:3000/api/packages"               $null $h | Out-Null
Test-Endpoint "GET  /api/packages/1"                 GET "http://localhost:3000/api/packages/1"             $null $h | Out-Null
Write-Host ""

# ─── PART 9: Service Module ──────────────────────────────────────────────────
Write-Host "[PART 9] Service Module"
Test-Endpoint "GET  /api/services"               GET "http://localhost:3000/api/services"               $null $h | Out-Null
Test-Endpoint "GET  /api/admin/services"         GET "http://localhost:3000/api/admin/services"         $null $h | Out-Null
Write-Host ""

# ─── PART 10: Smart Calculator ───────────────────────────────────────────────
Write-Host "[PART 10] Smart Calculator Module"
Test-Endpoint "GET  /api/calculator/settings"           GET "http://localhost:3000/api/calculator/settings"           $null $h | Out-Null
Test-Endpoint "GET  /api/calculator/saved/1 (estimates)" GET "http://localhost:3000/api/calculator/saved/1"             $null $h | Out-Null
Write-Host ""

# ─── PART 11: Booking Module ─────────────────────────────────────────────────
Write-Host "[PART 11] Booking Module"
Test-Endpoint "GET  /api/admin/bookings"         GET "http://localhost:3000/api/admin/bookings"         $null $h | Out-Null
Write-Host ""

# ─── PART 12: Payment Module ─────────────────────────────────────────────────
Write-Host "[PART 12] Payment & Billing Module"
Test-Endpoint "GET  /api/admin/payments"         GET "http://localhost:3000/api/admin/payments"         $null $h | Out-Null
Write-Host ""

# ─── PART 13: Review Module ──────────────────────────────────────────────────
Write-Host "[PART 13] Review & Feedback Module"
Test-Endpoint "GET  /api/reviews"                        GET "http://localhost:3000/api/reviews"                        $null $h | Out-Null
Test-Endpoint "GET  /api/reviews/stats"                  GET "http://localhost:3000/api/reviews/stats"                  $null $h | Out-Null
Test-Endpoint "GET  /api/reviews/feedback"               GET "http://localhost:3000/api/reviews/feedback"               $null $h | Out-Null
Test-Endpoint "GET  /api/reviews/surveys"                GET "http://localhost:3000/api/reviews/surveys"                $null $h | Out-Null
Test-Endpoint "GET  /api/reviews/nps/stats"              GET "http://localhost:3000/api/reviews/nps/stats"              $null $h | Out-Null
Test-Endpoint "GET  /api/reviews/settings"               GET "http://localhost:3000/api/reviews/settings"               $null $h | Out-Null
Test-Endpoint "GET  /api/reviews/testimonials/featured"  GET "http://localhost:3000/api/reviews/testimonials/featured"  $null $h | Out-Null
Write-Host ""

# ─── PART 14: Notification Module ────────────────────────────────────────────
Write-Host "[PART 14] Notification & Communication Module"
Test-Endpoint "GET  /api/notifications/in-app"          GET "http://localhost:3000/api/notifications/in-app"             $null $h | Out-Null
Test-Endpoint "GET  /api/communications/conversations"  GET "http://localhost:3000/api/communications/conversations"     $null $h | Out-Null
Test-Endpoint "GET  /api/admin/notifications/broadcasts (RBAC)" GET "http://localhost:3000/api/admin/notifications/broadcasts" $null $h 403 | Out-Null
Write-Host ""

# ─── PART 15: Admin CMS & Config ─────────────────────────────────────────────
Write-Host "[PART 15] Admin, CMS & System Configuration Module"
Test-Endpoint "GET  /api/admin/cms/banners      (RBAC)"  GET "http://localhost:3000/api/admin/cms/banners"        $null $h 403 | Out-Null
Test-Endpoint "GET  /api/admin/cms/faqs         (RBAC)"  GET "http://localhost:3000/api/admin/cms/faqs"           $null $h 403 | Out-Null
Test-Endpoint "GET  /api/admin/cms/blogs        (RBAC)"  GET "http://localhost:3000/api/admin/cms/blogs"          $null $h 403 | Out-Null
Test-Endpoint "GET  /api/admin/cms/pages        (RBAC)"  GET "http://localhost:3000/api/admin/cms/pages"          $null $h 403 | Out-Null
Test-Endpoint "GET  /api/admin/config/settings  (RBAC)"  GET "http://localhost:3000/api/admin/config/settings"    $null $h 403 | Out-Null
Test-Endpoint "GET  /api/admin/config/features  (RBAC)"  GET "http://localhost:3000/api/admin/config/features"    $null $h 403 | Out-Null
Test-Endpoint "GET  /api/admin/config/logs/audit (RBAC)" GET "http://localhost:3000/api/admin/config/logs/audit"  $null $h 403 | Out-Null
Test-Endpoint "GET  /api/admin/config/logs/system (RBAC)" GET "http://localhost:3000/api/admin/config/logs/system" $null $h 403 | Out-Null
Test-Endpoint "GET  /api/admin/dashboards       (RBAC)"  GET "http://localhost:3000/api/admin/dashboards"         $null $h 403 | Out-Null
Write-Host ""

# ─── PART 16: Analytics & Reporting ─────────────────────────────────────────
Write-Host "[PART 16] Analytics & Reporting Module"
Test-Endpoint "GET  /api/admin/analytics/dashboards (RBAC)" GET "http://localhost:3000/api/admin/analytics/dashboards"  $null $h 403 | Out-Null
Test-Endpoint "GET  /api/admin/analytics/bookings   (RBAC)" GET "http://localhost:3000/api/admin/analytics/bookings"    $null $h 403 | Out-Null
Test-Endpoint "GET  /api/admin/analytics/revenue    (RBAC)" GET "http://localhost:3000/api/admin/analytics/revenue"     $null $h 403 | Out-Null
Test-Endpoint "GET  /api/admin/analytics/reports    (RBAC)" GET "http://localhost:3000/api/admin/analytics/reports"     $null $h 403 | Out-Null
Test-Endpoint "GET  /api/admin/analytics/kpis       (RBAC)" GET "http://localhost:3000/api/admin/analytics/kpis"        $null $h 403 | Out-Null
Write-Host ""

# ─── PART 17: MongoDB Collections ────────────────────────────────────────────
Write-Host "[PART 17] MongoDB - Logs, Events, Cache and Real-time"
Test-Endpoint "GET  /api/mongo/logs/activity  (RBAC)" GET "http://localhost:3000/api/mongo/logs/activity"       $null $h 403 | Out-Null
Test-Endpoint "GET  /api/mongo/logs/audit     (RBAC)" GET "http://localhost:3000/api/mongo/logs/audit"          $null $h 403 | Out-Null
Test-Endpoint "GET  /api/mongo/logs/errors    (RBAC)" GET "http://localhost:3000/api/mongo/logs/errors"         $null $h 403 | Out-Null
Test-Endpoint "GET  /api/mongo/events         (RBAC)" GET "http://localhost:3000/api/mongo/events"              $null $h 403 | Out-Null
Test-Endpoint "GET  /api/mongo/dashboard/cache (RBAC)" GET "http://localhost:3000/api/mongo/dashboard/cache"   $null $h 403 | Out-Null
Test-Endpoint "GET  /api/mongo/queue/pending  (RBAC)" GET "http://localhost:3000/api/mongo/queue/pending"       $null $h 403 | Out-Null
Test-Endpoint "GET  /api/mongo/chat/1/messages"        GET "http://localhost:3000/api/mongo/chat/1/messages"    $null $h | Out-Null
Test-Endpoint "GET  /api/mongo/search/history/1"       GET "http://localhost:3000/api/mongo/search/history/1"   $null $h | Out-Null
Write-Host ""

# ─── SUMMARY ─────────────────────────────────────────────────────────────────
$total = $pass + $fail
Write-Host "============================================================"
Write-Host "   FINAL RESULTS: $pass PASSED, $fail FAILED, $total TOTAL"
Write-Host "============================================================"
if ($fail -eq 0) { Write-Host "   ALL TESTS PASSED!" }
else { Write-Host "   $fail TESTS FAILED - review above output" }
