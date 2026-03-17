$tokenData = Get-Content "scripts\fb-tokens.json" | ConvertFrom-Json
$accessToken = $tokenData.access_token
$project = "jammi-2684d"
$headers = @{ Authorization = "Bearer $accessToken" }

# Try each possible bucket name
$buckets = @("jammi-2684d.appspot.com", "jammi-2684d.firebasestorage.app", "jammi-2684d")
foreach ($b in $buckets) {
    try {
        $r = Invoke-RestMethod -Uri "https://storage.googleapis.com/storage/v1/b/$b" -Method Get -Headers $headers
        Write-Host "FOUND: $($r.name) (location: $($r.location))"
    } catch {
        Write-Host "NOT FOUND: $b"
    }
}
