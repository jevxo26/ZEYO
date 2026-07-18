$ErrorActionPreference = "Stop"

Write-Host "Waking up NeonDB and Logging in..."
$maxRetries = 10
$success = $false
for ($i = 1; $i -le $maxRetries; $i++) {
    try {
        $login = Invoke-RestMethod "http://localhost:3000/api/auth/login" -Method POST -Body (@{ email="testadmin@zeyo.com"; password="Test@12345" } | ConvertTo-Json) -ContentType "application/json" -TimeoutSec 120
        $global:token = $login.data.token
        $success = $true
        Write-Host "DB is awake and Auth successful!"
        break
    } catch {
        Write-Host "Attempt $i failed: $($_.Exception.Message). Retrying in 15s..."
        Start-Sleep -Seconds 15
    }
}

if (-not $success) {
    Write-Host "Failed to wake DB after $maxRetries attempts."
    exit 1
}

$h = @{ Authorization = "Bearer $global:token"; "Content-Type" = "application/json" }

Write-Host "Warming up review service Prisma client..."
try { Invoke-RestMethod "http://localhost:3000/api/reviews/stats" -Headers $h -TimeoutSec 60 | Out-Null } catch {}
Start-Sleep -Seconds 2

$bId = 1; $cId = 6; $sId = 1; $pkgId = 1

Write-Host "--- PART 13: Review, Rating and Feedback ---"

# 1. Create Review
$rev = Invoke-RestMethod "http://localhost:3000/api/reviews" -Method POST -Headers $h -Body (@{ bookingId=$bId; customerId=$cId; overallRating=4.5; title="Amazing Event!"; review="Everything was perfect." } | ConvertTo-Json) -ContentType "application/json"
Write-Host "TEST 1:  POST /reviews                         -> id:$($rev.data.id)"; $rId = $rev.data.id

$rGet = Invoke-RestMethod "http://localhost:3000/api/reviews/$rId" -Headers $h
Write-Host "TEST 2:  GET  /reviews/:id                     -> rating:$($rGet.data.overallRating)"

$sr = Invoke-RestMethod "http://localhost:3000/api/reviews/$rId/services" -Method POST -Headers $h -Body (@{ serviceId=$sId; rating=5.0; reviewText="Photography outstanding!" } | ConvertTo-Json) -ContentType "application/json"
Write-Host "TEST 3:  POST /reviews/:id/services            -> id:$($sr.data.id)"

$pf = Invoke-RestMethod "http://localhost:3000/api/reviews/$rId/packages" -Method POST -Headers $h -Body (@{ packageId=$pkgId; rating=4.5; reviewText="Package well curated" } | ConvertTo-Json) -ContentType "application/json"
Write-Host "TEST 4:  POST /reviews/:id/packages            -> id:$($pf.data.id)"

$br = Invoke-RestMethod "http://localhost:3000/api/reviews/$rId/booking" -Method POST -Headers $h -Body (@{ bookingId=$bId; eventExperience="Event was flawless"; recommendation=$true } | ConvertTo-Json) -ContentType "application/json"
Write-Host "TEST 5:  POST /reviews/:id/booking             -> id:$($br.data.id)"

$cr = Invoke-RestMethod "http://localhost:3000/api/reviews/$rId/criteria" -Method POST -Headers $h -Body (@{ criteria=@(@{ criteriaName="quality"; rating=5.0 }; @{ criteriaName="professionalism"; rating=4.5 }; @{ criteriaName="timeliness"; rating=4.8 }) } | ConvertTo-Json -Depth 5) -ContentType "application/json"
Write-Host "TEST 6:  POST /reviews/:id/criteria            -> count:$($cr.data.count)"

$rat = Invoke-RestMethod "http://localhost:3000/api/reviews/$rId/rating" -Method POST -Headers $h -Body (@{ averageRating=4.77; totalRating=3 } | ConvertTo-Json) -ContentType "application/json"
Write-Host "TEST 7:  POST /reviews/:id/rating              -> avg:$($rat.data.averageRating)"

$med = Invoke-RestMethod "http://localhost:3000/api/reviews/$rId/media" -Method POST -Headers $h -Body (@{ fileType="image"; fileUrl="https://cdn.zeyo.com/reviews/photo.jpg"; thumbnail="https://cdn.zeyo.com/reviews/thumb.jpg" } | ConvertTo-Json) -ContentType "application/json"
Write-Host "TEST 8:  POST /reviews/:id/media               -> id:$($med.data.id)"

$react = Invoke-RestMethod "http://localhost:3000/api/reviews/$rId/react" -Method POST -Headers $h -Body (@{ customerId=$cId; reactionType="helpful" } | ConvertTo-Json) -ContentType "application/json"
Write-Host "TEST 9:  POST /reviews/:id/react               -> $($react.data.reactionType)"

$reply = Invoke-RestMethod "http://localhost:3000/api/reviews/$rId/reply" -Method POST -Headers $h -Body (@{ reply="Thank you for your feedback!" } | ConvertTo-Json) -ContentType "application/json"
Write-Host "TEST 10: POST /reviews/:id/reply               -> id:$($reply.data.id)"

$rpt = Invoke-RestMethod "http://localhost:3000/api/reviews/$rId/report" -Method POST -Headers $h -Body (@{ reason="Test report" } | ConvertTo-Json) -ContentType "application/json"
Write-Host "TEST 11: POST /reviews/:id/report              -> id:$($rpt.data.id)"; $rptId = $rpt.data.id

$rptRes = Invoke-RestMethod "http://localhost:3000/api/reviews/reports/$rptId/resolve" -Method PUT -Headers $h -Body (@{ status="dismissed" } | ConvertTo-Json) -ContentType "application/json"
Write-Host "TEST 12: PUT  /reviews/reports/:id/resolve     -> $($rptRes.data.status)"

$mod = Invoke-RestMethod "http://localhost:3000/api/reviews/$rId/moderate" -Method POST -Headers $h -Body (@{ action="approved"; remarks="Meets guidelines" } | ConvertTo-Json) -ContentType "application/json"
Write-Host "TEST 13: POST /reviews/:id/moderate            -> $($mod.data.action)"

$ver = Invoke-RestMethod "http://localhost:3000/api/reviews/$rId/verify" -Method POST -Headers $h
Write-Host "TEST 14: POST /reviews/:id/verify              -> isVerifiedBooking:$($ver.data.isVerifiedBooking)"

$testim = Invoke-RestMethod "http://localhost:3000/api/reviews/$rId/feature" -Method POST -Headers $h -Body (@{ title="Stunning Wedding Experience"; displayOrder=1 } | ConvertTo-Json) -ContentType "application/json"
Write-Host "TEST 15: POST /reviews/:id/feature             -> isFeatured:$($testim.data.isFeatured)"

$feat = Invoke-RestMethod "http://localhost:3000/api/reviews/testimonials/featured" -Headers $h
Write-Host "TEST 16: GET  /reviews/testimonials/featured   -> count:$($feat.data.Count)"

$stUp = Invoke-RestMethod "http://localhost:3000/api/reviews/$rId/status" -Method PUT -Headers $h -Body (@{ status="approved" } | ConvertTo-Json) -ContentType "application/json"
Write-Host "TEST 17: PUT  /reviews/:id/status              -> $($stUp.data.status)"

$all = Invoke-RestMethod "http://localhost:3000/api/reviews" -Headers $h
Write-Host "TEST 18: GET  /reviews                         -> total:$($all.data.total)"

$stats = Invoke-RestMethod "http://localhost:3000/api/reviews/stats" -Headers $h
Write-Host "TEST 19: GET  /reviews/stats                   -> total:$($stats.data.total) avg:$($stats.data.averageRating)"

$fb = Invoke-RestMethod "http://localhost:3000/api/reviews/feedback" -Method POST -Headers $h -Body (@{ customerId=$cId; bookingId=$bId; feedbackType="appreciation"; subject="Great service!"; message="EVENTO made our wedding perfect!" } | ConvertTo-Json) -ContentType "application/json"
Write-Host "TEST 20: POST /reviews/feedback                -> id:$($fb.data.id)"; $fbId = $fb.data.id

$fbs = Invoke-RestMethod "http://localhost:3000/api/reviews/feedback" -Headers $h
Write-Host "TEST 21: GET  /reviews/feedback                -> count:$($fbs.data.Count)"

$fbUp = Invoke-RestMethod "http://localhost:3000/api/reviews/feedback/$fbId/status" -Method PUT -Headers $h -Body (@{ status="resolved" } | ConvertTo-Json) -ContentType "application/json"
Write-Host "TEST 22: PUT  /reviews/feedback/:id/status     -> $($fbUp.data.status)"

$survey = Invoke-RestMethod "http://localhost:3000/api/reviews/surveys" -Method POST -Headers $h -Body (@{ bookingId=$bId; customerId=$cId; overallExperience=9; serviceQuality=10; supportExperience=8; wouldRecommend="yes"; npsScore=9 } | ConvertTo-Json) -ContentType "application/json"
Write-Host "TEST 23: POST /reviews/surveys                 -> id:$($survey.data.id)"

$surveys = Invoke-RestMethod "http://localhost:3000/api/reviews/surveys" -Headers $h
Write-Host "TEST 24: GET  /reviews/surveys                 -> count:$($surveys.data.Count)"

$nps = Invoke-RestMethod "http://localhost:3000/api/reviews/nps/stats" -Headers $h
Write-Host "TEST 25: GET  /reviews/nps/stats               -> npsScore:$($nps.data.npsScore) promoters:$($nps.data.promoters)"

$setData = Invoke-RestMethod "http://localhost:3000/api/reviews/settings" -Method POST -Headers $h -Body (@{ allowReview=$true; allowPhotoUpload=$true; allowVideoUpload=$true; requireBookingVerification=$true } | ConvertTo-Json) -ContentType "application/json"
Write-Host "TEST 26: POST /reviews/settings                -> id:$($setData.data.id)"

$getSet = Invoke-RestMethod "http://localhost:3000/api/reviews/settings" -Headers $h
Write-Host "TEST 27: GET  /reviews/settings                -> allowReview:$($getSet.data.allowReview)"

Write-Host "PART 13: ALL 27 TESTS PASSED!"
