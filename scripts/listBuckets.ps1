$tokenData = Get-Content "scripts\fb-tokens.json" | ConvertFrom-Json
$accessToken = $tokenData.access_token
$project = "jammi-2684d"
$headers = @{ Authorization = "Bearer $accessToken" }

Write-Host "Listing all GCS buckets..."
$res = Invoke-RestMethod -Uri "https://storage.googleapis.com/storage/v1/b?project=$project&maxResults=50" -Method Get -Headers $headers
if ($res.items) {
    $res.items | ForEach-Object { Write-Host $_.name }
} else {
    Write-Host "(no buckets found)"
}

# Also check the Firebase project resources for storage bucket name
Write-Host "`nChecking Firebase project resources..."
$proj = Invoke-RestMethod -Uri "https://firebase.googleapis.com/v1beta1/projects/$project" -Method Get -Headers $headers
$proj.resources | ConvertTo-Json -Depth 5
