# PowerShell script to download projects from generalarcade.com
# Uses AJAX endpoint to get all projects, not just the first page

$baseUrl = "https://generalarcade.com"
$ajaxUrl = "https://generalarcade.com/wp/wp-admin/admin-ajax.php"
$outputDir = "E:\GA-WEB\generalarcade-hugo-starter\temp_projects"

# Create output directory
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

# Download projects index page (for initial projects and order)
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

# Extract project URLs from index (initial projects)
$indexContent = Get-Content $indexPath -Raw
$projectUrls = @()

# Find all project links from initial page
$matches = [regex]::Matches($indexContent, 'href="(https://generalarcade.com/project/[^"]+)"')
foreach ($match in $matches) {
    $fullUrl = $match.Groups[1].Value
    if ($fullUrl -notin $projectUrls) {
        $projectUrls += $fullUrl
    }
}

Write-Host "Found $($projectUrls.Count) projects on initial page" -ForegroundColor Cyan

# Load more projects via AJAX
Write-Host "`nLoading additional projects via AJAX..." -ForegroundColor Cyan
$offset = $projectUrls.Count
$maxAttempts = 50  # Safety limit
$attempt = 0

while ($attempt -lt $maxAttempts) {
    $attempt++
    Write-Host "  Attempt $attempt, offset: $offset" -ForegroundColor Gray
    
    try {
        # Format body as form data (application/x-www-form-urlencoded)
        $body = "action=load_more_projects&platform_id=&type_id=&offset=$offset"
        
        $response = Invoke-WebRequest -Uri $ajaxUrl -Method POST -Body $body -ContentType "application/x-www-form-urlencoded" -UseBasicParsing -ErrorAction Stop
        $responseText = $response.Content
        
        # Response is JSON-encoded string, need to parse it
        try {
            $htmlContent = $responseText | ConvertFrom-Json
        } catch {
            # If not JSON, use as-is
            $htmlContent = $responseText
        }
        
        # Check if we got any projects
        if ([string]::IsNullOrWhiteSpace($htmlContent) -or $htmlContent -match '^\s*$') {
            Write-Host "  No more projects found" -ForegroundColor Yellow
            break
        }
        
        # Extract project URLs from AJAX response
        $newMatches = [regex]::Matches($htmlContent, 'href="(https://generalarcade.com/project/[^"]+)"')
        $newCount = 0
        foreach ($match in $newMatches) {
            $fullUrl = $match.Groups[1].Value
            if ($fullUrl -notin $projectUrls) {
                $projectUrls += $fullUrl
                $newCount++
            }
        }
        
        if ($newCount -eq 0) {
            Write-Host "  No new projects found, stopping" -ForegroundColor Yellow
            break
        }
        
        Write-Host "  Found $newCount new projects (total: $($projectUrls.Count))" -ForegroundColor Green
        $offset = $projectUrls.Count
        
        # Small delay to avoid overwhelming the server
        Start-Sleep -Milliseconds 500
        
    } catch {
        Write-Host "  Error loading more projects: $_" -ForegroundColor Red
        break
    }
}

Write-Host "`nTotal projects found: $($projectUrls.Count)" -ForegroundColor Cyan

# Download each project page
Write-Host "`nDownloading project pages..." -ForegroundColor Cyan
$counter = 0
foreach ($url in $projectUrls) {
    $counter++
    $fileName = $url -replace "https://generalarcade.com/project/", "" -replace "/", "-"
    $filePath = Join-Path $outputDir "$fileName.html"
    
    Write-Host "[$counter/$($projectUrls.Count)] Downloading: $url" -ForegroundColor Gray
    try {
        Invoke-WebRequest -Uri $url -OutFile $filePath -UseBasicParsing -ErrorAction Stop
        Start-Sleep -Milliseconds 200  # Small delay between requests
    } catch {
        Write-Host "  Error downloading $url : $_" -ForegroundColor Red
    }
}

Write-Host "`nDownload complete! Files saved to: $outputDir" -ForegroundColor Green

