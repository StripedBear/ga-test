# PowerShell script to parse HTML projects and create Hugo markdown files

$tempDir = "E:\GA-WEB\generalarcade-hugo-starter\temp_projects"
$contentDir = "E:\GA-WEB\generalarcade-hugo-starter\content\projects"

function Slugify-Text {
    param([string]$text)
    $text = $text.ToLower()
    $text = $text -replace '[^\w\s-]', ''
    $text = $text -replace '\s+', '-'
    $text = $text.Trim('-')
    return $text
}

function Extract-ProjectData {
    param([string]$html, [string]$url)
    
    # Extract title from <h1> or <title>
    $title = ""
    if ($html -match '<h1[^>]*class="[^"]*u-fs-huge[^"]*"[^>]*>(.*?)</h1>') {
        $title = $matches[1] -replace '<[^>]+>', '' -replace '&[^;]+;', '' | ForEach-Object { $_.Trim() }
    } elseif ($html -match '<title>(.*?)\s*\|\s*General Arcade</title>') {
        $title = $matches[1].Trim()
    }
    
    # Extract platforms
    $platforms = @()
    if ($html -match 'Platforms:</p>.*?<span[^>]*>(.*?)</span>') {
        $platformsText = $matches[1] -replace '<[^>]+>', ''
        $platforms = $platformsText -split ',' | ForEach-Object { $_.Trim() } | Where-Object { $_ }
    } elseif ($html -match 'Platforms:</p>.*?<a[^>]*>(.*?)</a>') {
        $platformMatches = [regex]::Matches($html, 'Platforms:</p>.*?<a[^>]*>([^<]+)</a>')
        foreach ($match in $platformMatches) {
            $platforms += $match.Groups[1].Value.Trim()
        }
    }
    
    # Extract client
    $client = ""
    if ($html -match 'Client:</p>.*?<span[^>]*>([^<]+)</span>') {
        $client = $matches[1].Trim()
    }
    
    # Extract developer
    $developer = ""
    if ($html -match 'Developer:</p>.*?<span[^>]*>([^<]+)</span>') {
        $developer = $matches[1].Trim()
    }
    
    # Extract publisher
    $publisher = ""
    if ($html -match 'Publisher:</p>.*?<span[^>]*>([^<]+)</span>') {
        $publisher = $matches[1].Trim()
    }
    
    # Extract website
    $website = ""
    if ($html -match '<a[^>]*class="[^"]*c-button[^"]*"[^>]*href="([^"]+)"[^>]*>Website</a>') {
        $website = $matches[1].Trim()
    }
    
    # Extract featured/thumbnail image
    $featuredImage = ""
    if ($html -match 'background-image:url\(([^)]+)\)') {
        $featuredImage = $matches[1] -replace '&amp;', '&'
    } elseif ($html -match '<img[^>]*src="(https://generalarcade.com/content/uploads/[^"]+)"[^>]*alt="[^"]*' + [regex]::Escape($title) + '[^"]*"') {
        $featuredImage = $matches[1]
    }
    
    # Extract main content - use multiline regex with [\s\S] for multiline matching
    $content = ""
    # Try to match the content section more flexibly
    if ($html -match '<div class="c-wp[^"]*text-white">([\s\S]*?)</div>\s*</div>\s*</div>\s*<div class="col-md-4') {
        $contentHtml = $matches[1]
        # Remove gallery divs (will be handled separately if needed)
        $contentHtml = $contentHtml -replace '<div[^>]*id=''gallery-[^>]*>.*?</div>', ''
        # Remove image divs with pb-5
        $contentHtml = $contentHtml -replace '<div[^>]*class="[^"]*pb-5[^"]*text-center[^"]*"[^>]*>.*?</div>', ''
        # Remove iframe (YouTube videos)
        $contentHtml = $contentHtml -replace '<iframe[^>]*>.*?</iframe>', ''
        # Remove data attributes
        $contentHtml = $contentHtml -replace '\s+data-[^=]+="[^"]*"', ''
        # Convert <p> to markdown (preserve content)
        $contentHtml = $contentHtml -replace '<p[^>]*>', "`n`n" -replace '</p>', ''
        # Convert <strong> to markdown
        $contentHtml = $contentHtml -replace '<strong[^>]*>', '**' -replace '</strong>', '**'
        # Convert <h3> to markdown
        $contentHtml = $contentHtml -replace '<h3[^>]*>', "`n### " -replace '</h3>', "`n"
        # Convert <h4> to markdown
        $contentHtml = $contentHtml -replace '<h4[^>]*>', "`n#### " -replace '</h4>', "`n"
        # Convert <ul><li> to markdown
        $contentHtml = $contentHtml -replace '<ul[^>]*>', "`n" -replace '</ul>', "`n"
        $contentHtml = $contentHtml -replace '<li[^>]*>', "- " -replace '</li>', "`n"
        # Convert <em> to markdown
        $contentHtml = $contentHtml -replace '<em[^>]*>', '_' -replace '</em>', '_'
        # Convert <br /> to newlines
        $contentHtml = $contentHtml -replace '<br\s*/?>', "`n"
        # Clean up HTML entities
        $contentHtml = $contentHtml -replace '&#8211;', '-' -replace '&#8217;', "'" -replace '&amp;', '&' -replace '&#8212;', '--'
        # Remove remaining HTML tags
        $content = $contentHtml -replace '<[^>]+>', '' -replace '&nbsp;', ' ' -replace '&hellip;', '...' -replace '&[^;]+;', ''
        # Clean up multiple newlines
        $content = $content -replace "`n`n`n+", "`n`n"
        $content = $content.Trim()
    }
    
    return @{
        Title = $title
        Platforms = $platforms
        Client = $client
        Developer = $developer
        Publisher = $publisher
        Website = $website
        FeaturedImage = $featuredImage
        Content = $content
    }
}

# Process all HTML files
Get-ChildItem -Path $tempDir -Filter "*.html" | Where-Object { $_.Name -ne "projects_index.html" } | ForEach-Object {
    Write-Host "Processing: $($_.Name)" -ForegroundColor Cyan
    
    $html = Get-Content $_.FullName -Raw -Encoding UTF8
    $url = "https://generalarcade.com/project/" + ($_.BaseName -replace '-$', '').Replace('-', '/')
    $data = Extract-ProjectData -html $html -url $url
    
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
            $imgUrl = $data.FeaturedImage
            $imgExt = [System.IO.Path]::GetExtension($imgUrl) -replace '\?.*', ''
            if (-not $imgExt) { $imgExt = ".jpg" }
            $featuredImageName = "featured$imgExt"
            $imgPath = Join-Path $postDir $featuredImageName
            Invoke-WebRequest -Uri $imgUrl -OutFile $imgPath -UseBasicParsing -ErrorAction Stop
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
    
    if ($data.Platforms.Count -gt 0) {
        $platformsStr = $data.Platforms -join '", "'
        $frontMatter += "`nplatforms: [`"$platformsStr`"]"
    }
    
    if ($data.Client) {
        $frontMatter += "`nclient: `"$($data.Client)`""
    }
    
    if ($data.Developer) {
        $frontMatter += "`ndeveloper: `"$($data.Developer)`""
    }
    
    if ($data.Publisher) {
        $frontMatter += "`npublisher: `"$($data.Publisher)`""
    }
    
    if ($data.Website) {
        $frontMatter += "`nwebsite: `"$($data.Website)`""
    }
    
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

