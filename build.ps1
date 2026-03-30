$headerContent = Get-Content -Path "src/header.js" -Raw
$versionMatch = $headerContent -match '@version\s+([\d.]+)'
$version = if ($versionMatch) { $matches[1] } else { "unknown" }

$outputFile = "output/hobo-helper-v${version}.user.js"

if (-not (Test-Path -Path "output")) {
    New-Item -ItemType Directory -Path "output" | Out-Null
}

$helpersContent = Get-Content -Path "src/helpers.js" -Raw

$modules = @(
    "DrinksData",
    "DrinksHelper",
    "StatRatioTracker",
    "WellnessClinicHelper",
    "BankHelper",
    "NorthernFenceHelper",
    "TattooParlorHelper",
    "MixerHelper",
    "LiquorStoreHelper"
)

$modulesContent = ""
for ($i = 0; $i -lt $modules.Length; $i++) {
    $moduleName = $modules[$i]
    $modulesContent += (Get-Content -Path "src/modules/${moduleName}.js" -Raw).TrimEnd()
    if ($i -lt ($modules.Length - 1)) {
        $modulesContent += ",`n`n"
    } else {
        $modulesContent += "`n"
    }
}

$initContent = Get-Content -Path "src/init.js" -Raw

$templateContent = Get-Content -Path "src/template.js" -Raw

$finalContent = $templateContent.Replace("// {{HEADER}}", $headerContent.TrimEnd())
$finalContent = $finalContent.Replace("// {{HELPERS}}", $helpersContent.TrimEnd())
$finalContent = $finalContent.Replace("// {{MODULES}}", $modulesContent.TrimEnd())
$finalContent = $finalContent.Replace("// {{INIT}}", $initContent.TrimEnd())

Set-Content -Path $outputFile -Value $finalContent
Write-Host "Build complete: $outputFile"
