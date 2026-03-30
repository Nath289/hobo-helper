$templateContent = Get-Content -Path "src/template.js" -Raw
$versionMatch = $templateContent -match '@version\s+([\d.]+)'
$version = if ($versionMatch) { $matches[1] } else { "unknown" }

$outputFile = "output/hobo-helper-v${version}.user.js"

if (-not (Test-Path -Path "output")) {
    New-Item -ItemType Directory -Path "output" | Out-Null
}

$helpersContent = Get-Content -Path "src/helpers.js" -Raw

$moduleFiles = Get-ChildItem -Path "src/modules/*.js"

$modulesContent = ""
$moduleExportsContent = ""
for ($i = 0; $i -lt $moduleFiles.Count; $i++) {
    $file = $moduleFiles[$i]
    $moduleName = $file.BaseName

    $modulesContent += (Get-Content -Path $file.FullName -Raw).TrimEnd()
    $modulesContent += "`n`n"

    if ($i -lt ($moduleFiles.Count - 1)) {
        $moduleExportsContent += "        ${moduleName},`n"
    } else {
        $moduleExportsContent += "        ${moduleName}`n"
    }
}

$finalContent = $templateContent.Replace("// {{HELPERS}}", $helpersContent.TrimEnd())
$finalContent = $finalContent.Replace("// {{MODULES}}", $modulesContent.TrimEnd())
$finalContent = $finalContent.Replace("// {{MODULE_EXPORTS}}", $moduleExportsContent.TrimEnd())

Set-Content -Path $outputFile -Value $finalContent
Write-Host "Build complete: $outputFile"
