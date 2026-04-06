param (
    [switch]$Release
)

if (-not (Test-Path -Path "output")) {
    New-Item -ItemType Directory -Path "output" | Out-Null
}

$lines = Get-Content "CHANGELOG.md"
$changes = @()
$currentRelease = $null

foreach ($line in $lines) {
    if ($line -match '^## \[([\d\.]+)\] - (\d{4}-\d{2}-\d{2})') {
        if ($changes.Count -ge 5) { break }
        if ($currentRelease -ne $null) { $changes += $currentRelease }
        $currentRelease = @{
            version = $matches[1]
            date = $matches[2]
            type = $null
            notes = @()
        }
    } elseif ($line -match '^### (.*)') {
        if ($currentRelease -ne $null -and $currentRelease.type -eq $null) {
            $currentRelease.type = $matches[1].Trim()
        }
    } elseif ($line -match '^- (.*)') {
        if ($currentRelease -ne $null) {
            $note = $matches[1].Replace('\', '\\').Replace('"', '\"')
            $currentRelease.notes += $note
        }
    }
}
if ($currentRelease -ne $null -and $changes.Count -lt 5) { $changes += $currentRelease }

$jsChanges = @()
foreach ($c in $changes) {
    $ctype = if ($c.type) { $c.type } else { "Changed" }
    if ($c.notes.Count -gt 0) {
        $notesStr = ($c.notes | ForEach-Object { "`"$_`"" }) -join ",`n                "
    } else {
        $notesStr = ""
    }
    $jsChanges += @"
        {
            version: "$($c.version)",
            date: "$($c.date)",
            type: "$ctype",
            notes: [
                $notesStr
            ]
        }
"@
}
$changesArrStr = $jsChanges -join ",`n"
$changelogDataScript = @"
const ChangelogData = {
    changes: [
$changesArrStr
    ]
};
"@

$baseVersion = "1.0"
if ($changes.Count -gt 0) {
    $baseVersion = $changes[0].version
}

if ($Release) {
    $version = $baseVersion
    $outputFile = "output/hobo-helper-latest.user.js"
    $scriptName = "HoboWars Helper Toolkit"
    Write-Host "Building RELEASE version: $version"
} else {
    $timestamp = (Get-Date).ToString("yyyyMMdd.HHmm")
    $version = "$baseVersion.$timestamp"
    $outputFile = "output/hobo-helper-dev.user.js"
    $scriptName = "HoboWars Helper Toolkit (Dev)"
    Write-Host "Building DEV version: $version"
}

$templateContent = Get-Content -Path "src/template.js" -Raw
$helpersContent = Get-Content -Path "src/utils.js" -Raw

$moduleFiles = Get-ChildItem -Path "src/modules/*.js"

$modulesContent = ""
$moduleExportsContent = ""
for ($i = 0; $i -lt $moduleFiles.Count; $i++) {
    $file = $moduleFiles[$i]
    $moduleName = $file.BaseName

    $modulesContent += (Get-Content -Path $file.FullName -Raw).TrimEnd()
    $modulesContent += "`n`n"

    $moduleExportsContent += "        ${moduleName},`n"
}

$modulesContent += $changelogDataScript.TrimEnd() + "`n`n"
$moduleExportsContent += "        ChangelogData`n"

$finalContent = $templateContent.Replace("// {{HELPERS}}", $helpersContent.TrimEnd())
$finalContent = $finalContent.Replace("// {{MODULES}}", $modulesContent.TrimEnd())
$finalContent = $finalContent.Replace("// {{MODULE_EXPORTS}}", $moduleExportsContent.TrimEnd())
$finalContent = $finalContent.Replace("{{NAME}}", $scriptName)
$finalContent = $finalContent.Replace("{{VERSION}}", $version)

Set-Content -Path $outputFile -Value $finalContent
Write-Host "Build complete: $outputFile"

