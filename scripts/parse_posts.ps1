# PowerShell script to parse HTML blog posts and create Hugo markdown files

$tempDir = "E:\GA-WEB\generalarcade-hugo-starter\temp_posts"
$contentDir = "E:\GA-WEB\generalarcade-hugo-starter\content\blog"

function Slugify-Text {
    param([string]$text)
    $text = $text.ToLower()
    $text = $text -replace '[^\w\s-]', ''
    $text = $text -replace '\s+', '-'
    $text = $text.Trim('-')
    return $text
}

function Extract-Content {
    param([string]$html)
    
    # Extract title from <h1> or <title>
    $title = ""
    if ($html -match '<h1[^>]*>(.*?)</h1>') {
        $title = $matches[1] -replace '<[^>]+>', '' -replace '&[^;]+;', '' | ForEach-Object { $_.Trim() }
    } elseif ($html -match '<title>(.*?)\s*\|\s*General Arcade</title>') {
        $title = $matches[1].Trim()
    }
    
    # Extract date
    $date = ""
    if ($html -match 'datetime="([^"]+)"') {
        $dateStr = $matches[1]
        try {
            $dateObj = [DateTime]::Parse($dateStr)
            $date = $dateObj.ToString("yyyy-MM-dd")
        } catch {
            # Try to parse from text like "23 May 2025"
            if ($html -match '(\d{1,2})\s+(\w+)\s+(\d{4})') {
                $day = $matches[1]
                $month = $matches[2]
                $year = $matches[3]
                $monthMap = @{
                    "January" = "01"; "February" = "02"; "March" = "03"; "April" = "04"
                    "May" = "05"; "June" = "06"; "July" = "07"; "August" = "08"
                    "September" = "09"; "October" = "10"; "November" = "11"; "December" = "12"
                }
                if ($monthMap.ContainsKey($month)) {
                    $date = "$year-$($monthMap[$month])-$day"
                }
            }
        }
    }
    
    # Extract categories
    $categories = @()
    if ($html -match 'Categories:</p>.*?<a[^>]*>([^<]+)</a>') {
        $categories += $matches[1].Trim()
    }
    if ($categories.Count -eq 0) {
        $categories = @("Blog")
    }
    
    # Extract description from og:description
    $description = ""
    if ($html -match 'property="og:description"\s+content="([^"]+)"') {
        $description = $matches[1] -replace '\[&hellip;\]', '...' -replace '&[^;]+;', ''
    }
    
    # Extract featured image
    $featuredImage = ""
    if ($html -match 'property="og:image"\s+content="([^"]+)"') {
        $featuredImage = $matches[1]
    } elseif ($html -match '<img[^>]*src="(https://generalarcade.com/content/uploads/[^"]+)"[^>]*alt="[^"]*' + [regex]::Escape($title) + '[^"]*"') {
        $featuredImage = $matches[1]
    }
    
    # Extract main content
    $content = ""
    if ($html -match '<div class="c-wp[^"]*">(.*?)</div>\s*</div>\s*</div>\s*<div class="col-md-4') {
        $contentHtml = $matches[1]
        # Remove featured image div
        $contentHtml = $contentHtml -replace '<div[^>]*class="[^"]*text-center[^"]*"[^>]*>.*?</div>', ''
        # Convert <p> to markdown
        $contentHtml = $contentHtml -replace '<p>', "`n`n" -replace '</p>', ''
        # Convert <a> to markdown
        $contentHtml = $contentHtml -replace '<a[^>]*href="([^"]+)"[^>]*>([^<]+)</a>', '[$2]($1)'
        # Remove HTML tags
        $content = $contentHtml -replace '<[^>]+>', '' -replace '&nbsp;', ' ' -replace '&hellip;', '...' -replace '&[^;]+;', ''
        $content = $content.Trim()
    }
    
    return @{
        Title = $title
        Date = $date
        Categories = $categories
        Description = $description
        FeaturedImage = $featuredImage
        Content = $content
    }
}

# Process all HTML files
Get-ChildItem -Path $tempDir -Filter "*.html" | ForEach-Object {
    Write-Host "Processing: $($_.Name)" -ForegroundColor Cyan
    
    $html = Get-Content $_.FullName -Raw -Encoding UTF8
    $data = Extract-Content -html $html
    
    if (-not $data.Title) {
        Write-Host "  Skipping: No title found" -ForegroundColor Yellow
        return
    }
    
    $slug = Slugify-Text -text $data.Title
    $postDir = Join-Path $contentDir $slug
    
    if (Test-Path $postDir) {
        Write-Host "  Skipping: Already exists" -ForegroundColor Yellow
        return
    }
    
    New-Item -ItemType Directory -Path $postDir | Out-Null
    
    # Download featured image
    $featuredImageName = ""
    if ($data.FeaturedImage) {
        try {
            $imgExt = [System.IO.Path]::GetExtension($data.FeaturedImage) -replace '\?.*', ''
            if (-not $imgExt) { $imgExt = ".jpg" }
            $featuredImageName = "featured$imgExt"
            $imgPath = Join-Path $postDir $featuredImageName
            Invoke-WebRequest -Uri $data.FeaturedImage -OutFile $imgPath -UseBasicParsing -ErrorAction Stop
            Write-Host "  Downloaded image: $featuredImageName" -ForegroundColor Green
        } catch {
            Write-Host "  Warning: Could not download image: $_" -ForegroundColor Yellow
            $featuredImageName = ""
        }
    }
    
    # Create markdown file
    $frontMatter = @"
---
title: "$($data.Title)"
"@
    
    if ($data.Date) {
        $frontMatter += "`ndate: $($data.Date)"
    }
    
    if ($data.Description) {
        $frontMatter += "`ndescription: `"$($data.Description)`""
    }
    
    $categoriesStr = $data.Categories -join '", "'
    $frontMatter += "`ncategories: [`"$categoriesStr`"]"
    
    if ($featuredImageName) {
        $frontMatter += "`nfeatured_image: `"$featuredImageName`""
    }
    
    $frontMatter += "`ndraft: false`n---`n`n"
    
    $markdown = $frontMatter + $data.Content
    
    $mdPath = Join-Path $postDir "index.md"
    [System.IO.File]::WriteAllText($mdPath, $markdown, [System.Text.Encoding]::UTF8)
    
    Write-Host "  Created: $slug" -ForegroundColor Green
}

Write-Host "`nDone!" -ForegroundColor Cyan


