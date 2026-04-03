$version = "7.61"
$templateContent = Get-Content -Path "src/template.js" -Raw

$outputFile = "output/hobo-helper-v${version}.user.js"

if (-not (Test-Path -Path "output")) {
    New-Item -ItemType Directory -Path "output" | Out-Null
}

$helpersContent = Get-Content -Path "src/utils.js" -Raw

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
$finalContent = $finalContent.Replace("{{VERSION}}", $version)

Set-Content -Path $outputFile -Value $finalContent
Write-Host "Build complete: $outputFile"

$latestFile = "output/hobo-helper-latest.user.js"
Copy-Item -Path $outputFile -Destination $latestFile -Force
Write-Host "Copied to: $latestFile"

# Cleanup old builds: keep only the 5 most recently created versioned files
$versionedFiles = Get-ChildItem -Path "output/hobo-helper-v*.user.js" | Sort-Object LastWriteTime -Descending
if ($versionedFiles.Count -gt 5) {
    $filesToDelete = $versionedFiles | Select-Object -Skip 5
    foreach ($f in $filesToDelete) {
        Remove-Item -Path $f.FullName -Force
        Write-Host "Removed old build: $($f.Name)"
    }
}
