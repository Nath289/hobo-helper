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

$utilsContent = Get-Content -Path "src/utils.js" -Raw

$dataModules = Get-ChildItem -Path "src/modules/data" -Filter "*.js" -Recurse -File -ErrorAction SilentlyContinue
$globalModules = Get-ChildItem -Path "src/modules/global" -Filter "*.js" -Recurse -File -ErrorAction SilentlyContinue
$pageModules = Get-ChildItem -Path "src/modules/page" -Filter "*.js" -Recurse -File -ErrorAction SilentlyContinue

# Data modules are always included in every build
$dataModulesContent = ""
$dataModuleExportsContent = ""
if ($dataModules) {
    foreach ($file in $dataModules) {
        $moduleName = $file.BaseName
        $dataModulesContent += (Get-Content -Path $file.FullName -Raw).TrimEnd() + "`n`n"
        $dataModuleExportsContent += "        ${moduleName},`n"
    }
}
$dataModulesContent += $changelogDataScript.TrimEnd() + "`n`n"
$dataModuleExportsContent += "        ChangelogData`n"

# Categorise global and page modules by staff flag
$nonStaffGlobalContent = ""
$nonStaffGlobalExports = ""
$staffGlobalContent = ""
$staffGlobalExports = ""

if ($globalModules) {
    foreach ($file in $globalModules) {
        $moduleName = $file.BaseName
        $fileContent = Get-Content -Path $file.FullName -Raw
        $trimmed = $fileContent.TrimEnd()
        if ($fileContent -match 'staff:\s*true') {
            $staffGlobalContent += $trimmed + "`n`n"
            $staffGlobalExports += "        ${moduleName},`n"
        } else {
            $nonStaffGlobalContent += $trimmed + "`n`n"
            $nonStaffGlobalExports += "        ${moduleName},`n"
        }
    }
}

$nonStaffPageContent = ""
$nonStaffPageExports = ""
$staffPageContent = ""
$staffPageExports = ""

if ($pageModules) {
    foreach ($file in $pageModules) {
        $moduleName = $file.BaseName
        $fileContent = Get-Content -Path $file.FullName -Raw
        $trimmed = $fileContent.TrimEnd()
        if ($fileContent -match 'staff:\s*true') {
            $staffPageContent += $trimmed + "`n`n"
            $staffPageExports += "        ${moduleName},`n"
        } else {
            $nonStaffPageContent += $trimmed + "`n`n"
            $nonStaffPageExports += "        ${moduleName},`n"
        }
    }
}

# Helper function: apply all standard substitutions to a template
function Build-Output {
    param(
        [string]$Template,
        [string]$Name,
        [string]$Version,
        [string]$ModulesContent,
        [string]$GlobalExports,
        [string]$PageExports
    )

    $out = $Template.Replace("// {{UTILS}}", $utilsContent.TrimEnd())
    $out = $out.Replace("// {{MODULES}}", ($dataModulesContent + $ModulesContent).TrimEnd())
    $out = $out.Replace("// {{DATA_MODULE_EXPORTS}}", $dataModuleExportsContent.TrimEnd())
    $out = $out.Replace("// {{GLOBAL_MODULE_EXPORTS}}", $GlobalExports.TrimEnd())
    $out = $out.Replace("// {{PAGE_MODULE_EXPORTS}}", $PageExports.TrimEnd())
    $out = $out.Replace("{{NAME}}", $Name)
    $out = $out.Replace("{{VERSION}}", $Version)
    return $out
}

if ($Release) {
    $version = $baseVersion
    Write-Host "Building RELEASE version: $version"

    $templateRegular = Get-Content -Path "src/template.js" -Raw
    $templateStaff   = Get-Content -Path "src/template-staff.js" -Raw
    $templateAll     = Get-Content -Path "src/template-all.js" -Raw

    # Build 1: non-staff modules only
    $regularContent = Build-Output `
        -Template $templateRegular `
        -Name "HoboWars Helper Toolkit" `
        -Version $version `
        -ModulesContent ($nonStaffGlobalContent + $nonStaffPageContent) `
        -GlobalExports $nonStaffGlobalExports `
        -PageExports $nonStaffPageExports
    Set-Content -Path "output/hobo-helper-member-latest.user.js" -Value $regularContent
    Write-Host "Build complete: output/hobo-helper-member-latest.user.js"

    # Build 2: staff modules only
    $staffContent = Build-Output `
        -Template $templateStaff `
        -Name "HoboWars Helper Toolkit (Staff)" `
        -Version $version `
        -ModulesContent ($staffGlobalContent + $staffPageContent) `
        -GlobalExports $staffGlobalExports `
        -PageExports $staffPageExports
    Set-Content -Path "output/hobo-helper-staff-latest.user.js" -Value $staffContent
    Write-Host "Build complete: output/hobo-helper-staff-latest.user.js"

    # Build 3: all modules
    $allGlobalContent = $nonStaffGlobalContent + $staffGlobalContent
    $allGlobalExports = $nonStaffGlobalExports + $staffGlobalExports
    $allPageContent   = $nonStaffPageContent + $staffPageContent
    $allPageExports   = $nonStaffPageExports + $staffPageExports
    $allContent = Build-Output `
        -Template $templateAll `
        -Name "HoboWars Helper Toolkit (All)" `
        -Version $version `
        -ModulesContent ($allGlobalContent + $allPageContent) `
        -GlobalExports $allGlobalExports `
        -PageExports $allPageExports
    Set-Content -Path "output/hobo-helper-latest.user.js" -Value $allContent
    Write-Host "Build complete: output/hobo-helper-latest.user.js"

} else {
    $timestamp = (Get-Date).ToString("yyyyMMdd.HHmm")
    $version = "$baseVersion.$timestamp"
    Write-Host "Building DEV version: $version"

    $templateContent = Get-Content -Path "src/template-all.js" -Raw

    # Dev build includes all modules for testing
    $allGlobalContent = $nonStaffGlobalContent + $staffGlobalContent
    $allGlobalExports = $nonStaffGlobalExports + $staffGlobalExports
    $allPageContent   = $nonStaffPageContent + $staffPageContent
    $allPageExports   = $nonStaffPageExports + $staffPageExports
    $devContent = Build-Output `
        -Template $templateContent `
        -Name "HoboWars Helper Toolkit (Dev)" `
        -Version $version `
        -ModulesContent ($allGlobalContent + $allPageContent) `
        -GlobalExports $allGlobalExports `
        -PageExports $allPageExports
    Set-Content -Path "output/hobo-helper-dev.user.js" -Value $devContent
    Write-Host "Build complete: output/hobo-helper-dev.user.js"
}
