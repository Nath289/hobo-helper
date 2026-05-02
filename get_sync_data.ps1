param(
    [string]$HoboId
)

$configFile = Join-Path $PSScriptRoot "conf\couchdb-local.json"

if (-not (Test-Path $configFile)) {
    Write-Host "Config file not found at $configFile." -ForegroundColor Red
    Write-Host "Please copy conf\couchdb.template.json to conf\couchdb-local.json and fill in your details." -ForegroundColor Yellow
    exit 1
}

$config = Get-Content $configFile | ConvertFrom-Json
$url = $config.url.TrimEnd('/')
$username = $config.username
$password = $config.password

if ([string]::IsNullOrWhiteSpace($HoboId)) {
    $HoboId = $config.hobo_id
}

if ([string]::IsNullOrWhiteSpace($HoboId)) {
    Write-Host "Hobo ID is not provided. Please pass it as a parameter or add 'hobo_id' to your couchdb-local.json config." -ForegroundColor Red
    exit 1
}

$docId = "hobo_sync_$HoboId"
$fullUrl = "$url/$docId"

$auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$($username):$($password)"))
$headers = @{
    Authorization = "Basic $auth"
    "Content-Type" = "application/json"
}

try {
    Write-Host "Attempting to retrieve document: $docId..." -ForegroundColor Cyan
    $response = Invoke-RestMethod -Uri $fullUrl -Method Get -Headers $headers
    $jsonOutput = $response | ConvertTo-Json -Depth 10
    Write-Host $jsonOutput
} catch {
    Write-Host "Error retrieving data: $_" -ForegroundColor Red
}

