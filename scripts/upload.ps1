$ErrorActionPreference = "Stop"

$TokenFile = "scripts\fb-tokens.json"
$Bucket = "jammi-2684d.appspot.com"
$Project = "jammi-2684d"
$PublicDir = "public\images"
$LogFile = "scripts\upload-log.txt"

$ProductMap = @{
    "triphala-churna" = "TriphalaChurna_2.png"
    "yummunity-kids" = "Yummunity Bottle.png"
    "trip-caps" = "Tripcaps_1.png"
    "zeer-alka-syrup" = "ZeerAlka_1.png"
    "widari-forte-granules" = "WidariForte_2.png"
    "thyrogard" = "Thyro_1.png"
    "suventris" = "Suventris_1.png"
    "redema" = "Redema_2.png"
    "pyril-ds" = "PyrilDS_2.png"
    "orthoraksha-oil" = "OrthorakshaOil_1.png"
    "mahanarayana-tailam" = "MahanarayanaTaila_1.png"
    "nilomit-tablets" = "Nilomit_2.png"
    "daily-dew-moisturizer" = "Daily Dew.png"
    "madhuchari-churna" = "MadhumehariChurna_2.png"
    "laksha-capsules" = "Laksha_1.png"
    "hepableen-syrup" = "HAPABLEEN 3.jpg"
    "hepableen-tablets" = "Hepableen Tablets.png"
    "livercure-complex-forte" = "Livercure_2.png"
    "combifore" = "Combifore_2.png"
    "gtp-mental-fitness" = "GTP_1.png"
    "aa-caps" = "AAcaps_1.png"
    "d-tabs" = "Dtabs_2.png"
    "cyst-evit" = "Cyst_1.png"
    "bff-balm" = "BFF_1.png"
    "uvsafe-spf50" = "UVSafe.png"
    "timeless-anti-ageing-cream" = "Timeless.png"
    "softlips" = "SoftLips_1.png"
    "kumkumadi-serum" = "Kumkumadi Serum.jpeg"
    "keshpro-oil" = "KeshPro.png"
    "glow-complexion-cream" = "Glow.png"
    "flawless-pack" = "Flawless.png"
    "crush-n-brush" = "CrushNBrush_2.png"
    "clear-marks" = "Clear Marks.jpeg"
}

# 1. Refresh Token
Write-Host "Refreshing access token..."
$tokenDataRaw = Get-Content $TokenFile | ConvertFrom-Json
$refreshToken = $tokenDataRaw.refresh_token

$clientId = "563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com"
$clientSecret = "j9iVZfS8kkCEFUPaAeJV0sAi"

$body = "grant_type=refresh_token&client_id=" + $clientId + "&client_secret=" + $clientSecret + "&refresh_token=" + $refreshToken
$res = Invoke-RestMethod -Uri "https://oauth2.googleapis.com/token" -Method Post -Body $body -ContentType "application/x-www-form-urlencoded"

$accessToken = $res.access_token
$tokenDataRaw.access_token = $accessToken
$tokenDataRaw | ConvertTo-Json | Set-Content $TokenFile
Write-Host "Access token refreshed."

# 2. Process Map
$results = @()

foreach ($productId in $ProductMap.Keys) {
    $filename = $ProductMap[$productId]
    $localPath = Join-Path $PublicDir $filename
    
    if (-not (Test-Path $localPath)) {
        $msg = "SKIP: " + $productId + " (" + $filename + " not found)"
        Write-Host $msg -ForegroundColor Yellow
        $results += $msg
        continue
    }

    $ext = [System.IO.Path]::GetExtension($filename).ToLower()
    $contentType = if ($ext -eq ".jpg" -or $ext -eq ".jpeg") { "image/jpeg" } else { "image/png" }

    try {
        # Upload
        $encodedName = [uri]::EscapeDataString("products/" + $filename)
        $url = "https://storage.googleapis.com/upload/storage/v1/b/" + $Bucket + "/o?uploadType=media&name=" + $encodedName
        
        $headers = @{ Authorization = "Bearer " + $accessToken }
        Invoke-RestMethod -Uri $url -Method Post -Headers $headers -ContentType $contentType -InFile $localPath | Out-Null
        $publicUrl = "https://storage.googleapis.com/" + $Bucket + "/products/" + $encodedName
        Write-Host ("  Uploaded " + $productId)

        # Make Public
        $aclUrl = "https://storage.googleapis.com/storage/v1/b/" + $Bucket + "/o/" + $encodedName + "/acl"
        $aclBody = '{"entity":"allUsers","role":"READER"}'
        try {
            Invoke-RestMethod -Uri $aclUrl -Method Post -Headers $headers -ContentType "application/json" -Body $aclBody | Out-Null
        } catch {
            if ($_.Exception.Response.StatusCode -ne 409) { throw $_ }
        }
        Write-Host ("  Made public " + $productId)

        # Update Firestore
        $firestoreUrl = "https://firestore.googleapis.com/v1/projects/" + $Project + "/databases/(default)/documents/products/" + $productId + "?updateMask.fieldPaths=image"
        $fsBody = '{"fields":{"image":{"stringValue":"' + $publicUrl + '"}}}'
        Invoke-RestMethod -Uri $firestoreUrl -Method Patch -Headers $headers -ContentType "application/json" -Body $fsBody | Out-Null
        
        $msg = "OK: " + $productId + " -> " + $publicUrl
        Write-Host $msg -ForegroundColor Green
        $results += $msg
    } catch {
        $errMsg = $_.Exception.Message
        $msg = "ERROR " + $productId + ": " + $errMsg
        Write-Host $msg -ForegroundColor Red
        $results += $msg
    }
}

$results | Set-Content $LogFile
Write-Host "`nDone! See $LogFile"
