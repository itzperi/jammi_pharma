$tokenData = Get-Content "scripts\fb-tokens.json" | ConvertFrom-Json
$accessToken = $tokenData.access_token
$project = "jammi-2684d"
$bucketName = "jammi-2684d.appspot.com"
$headers = @{ Authorization = "Bearer $accessToken" }

Write-Host "Creating GCS bucket $bucketName in region us..."

$body = @{
    name = $bucketName
    location = "us"
    storageClass = "STANDARD"
} | ConvertTo-Json

try {
    $res = Invoke-RestMethod -Uri "https://storage.googleapis.com/storage/v1/b?project=$project" -Method Post -Headers $headers -ContentType "application/json" -Body $body
    Write-Host "Bucket created: $($res.name)"
} catch {
    $err = $_.Exception.Response
    if ($err) {
        $stream = $err.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $errBody = $reader.ReadToEnd()
        Write-Host "Error body: $errBody"
    }
    Write-Host "Error: $($_.Exception.Message)"
}
