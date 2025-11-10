# PowerShell script to download projects from generalarcade.com

$baseUrl = "https://generalarcade.com"
$outputDir = "E:\GA-WEB\generalarcade-hugo-starter\temp_projects"

# Create output directory
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

# Download projects index page
Write-Host "Downloading projects index page..."
$indexUrl = "https://generalarcade.com/projects/"
$indexPath = Join-Path $outputDir "projects_index.html"
try {
    Invoke-WebRequest -Uri $indexUrl -OutFile $indexPath -UseBasicParsing -ErrorAction Stop
    Write-Host "Saved to: $indexPath" -ForegroundColor Green
} catch {
    Write-Host "Error downloading index: $_" -ForegroundColor Red
    exit
}

# Extract project URLs from index
$indexContent = Get-Content $indexPath -Raw
$projectUrls = @()

# Find all project links (both /project/ and full URLs)
$matches = [regex]::Matches($indexContent, 'href="(https://generalarcade.com/project/[^"]+)"')
foreach ($match in $matches) {
    $fullUrl = $match.Groups[1].Value
    if ($fullUrl -notin $projectUrls) {
        $projectUrls += $fullUrl
    }
}

Write-Host "Found $($projectUrls.Count) projects" -ForegroundColor Cyan

# Download each project page
foreach ($url in $projectUrls) {
    $fileName = $url -replace "https://generalarcade.com/project/", "" -replace "/", "-"
    $filePath = Join-Path $outputDir "$fileName.html"
    
    Write-Host "Downloading: $url"
    try {
        Invoke-WebRequest -Uri $url -OutFile $filePath -UseBasicParsing -ErrorAction Stop
        Write-Host "Saved to: $filePath" -ForegroundColor Green
    } catch {
        Write-Host "Error downloading $url : $_" -ForegroundColor Red
    }
}

Write-Host "`nDownload complete! Files saved to: $outputDir"

