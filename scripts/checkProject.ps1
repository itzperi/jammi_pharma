$tokenData = Get-Content "scripts\fb-tokens.json" | ConvertFrom-Json
$accessToken = $tokenData.access_token
$project = "jammi-2684d"
$headers = @{ Authorization = "Bearer $accessToken" }

# Try the Firebase Storage default bucket creation via REST  
Write-Host "Attempting to add Firebase Storage to project..."

# First check what storage resources already exist in Firebase project
$projectUrl = "https://firebase.googleapis.com/v1beta1/projects/$project"
try {
    $proj = Invoke-RestMethod -Uri $projectUrl -Method Get -Headers $headers
    Write-Host "Firebase project: $($proj.displayName)"
    Write-Host "Resources: $($proj.resources | ConvertTo-Json)"
} catch {
    Write-Host "Error checking project: $($_.Exception.Message)"
}
