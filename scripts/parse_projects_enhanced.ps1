# Enhanced PowerShell script to parse HTML projects and create Hugo markdown files
# Preserves order of images, videos, and text content

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
    
    # Extract platforms - handle both <span> and <a> tags
    $platforms = @()
    # Try to find platforms section
    if ($html -match 'Platforms:</p>[\s\S]*?</li>') {
        $platformSection = $matches[0]
        # Extract all <a> tags with platform names
        $platformMatches = [regex]::Matches($platformSection, '<a[^>]*href="[^"]*"[^>]*>([^<]+)</a>')
        foreach ($match in $platformMatches) {
            $platform = $match.Groups[1].Value.Trim()
            if ($platform -and $platform -notin $platforms) {
                $platforms += $platform
            }
        }
        # If no <a> tags found, try <span>
        if ($platforms.Count -eq 0) {
            if ($platformSection -match '<span[^>]*>(.*?)</span>') {
                $platformsText = $matches[1] -replace '<[^>]+>', ''
                $platforms = $platformsText -split ',' | ForEach-Object { $_.Trim() } | Where-Object { $_ }
            }
        }
    }
    
    # Extract client
    $client = ""
    if ($html -match 'Client:</p>[\s\S]*?<span[^>]*>([^<]+)</span>') {
        $client = $matches[1].Trim()
    }
    
    # Extract developer
    $developer = ""
    if ($html -match 'Developer:</p>[\s\S]*?<span[^>]*>([^<]+)</span>') {
        $developer = $matches[1].Trim()
    }
    
    # Extract publisher
    $publisher = ""
    if ($html -match 'Publisher:</p>[\s\S]*?<span[^>]*>([^<]+)</span>') {
        $publisher = $matches[1].Trim()
    }
    
    # Extract website
    $website = ""
    if ($html -match '<a[^>]*class="[^"]*c-button[^"]*"[^>]*href="([^"]+)"[^>]*target="_blank"[^>]*>Website</a>') {
        $website = $matches[1].Trim()
    } elseif ($html -match '<a[^>]*href="([^"]+)"[^>]*class="[^"]*c-button[^"]*"[^>]*>Website</a>') {
        $website = $matches[1].Trim()
    }
    
    # Extract featured/thumbnail image (the large image at the bottom)
    $featuredImage = ""
    if ($html -match '<div[^>]*class="[^"]*pb-5[^"]*text-center[^"]*"[^>]*>[\s\S]*?<img[^>]*src="([^"]+)"[^>]*alt="[^"]*' + [regex]::Escape($title) + '[^"]*"') {
        $featuredImage = $matches[1] -replace '&amp;', '&'
    } elseif ($html -match '<img[^>]*src="(https://generalarcade.com/content/uploads/[^"]+)"[^>]*alt="[^"]*' + [regex]::Escape($title) + '[^"]*"') {
        $featuredImage = $matches[1] -replace '&amp;', '&'
    }
    
    # Extract content section with preserved order
    $contentElements = @()
    if ($html -match '<div class="c-wp[^"]*text-white">([\s\S]*?)</div>\s*</div>\s*</div>\s*<div class="col-md-4') {
        $contentHtml = $matches[1]
        
        # Process content preserving order: text blocks, images, videos
        # Split by significant elements while preserving order
        $parts = @()
        
        # Extract all iframes (videos) first with their positions
        $videoMatches = [regex]::Matches($contentHtml, '<iframe([^>]*>.*?</iframe>)', [System.Text.RegularExpressions.RegexOptions]::Singleline)
        foreach ($videoMatch in $videoMatches) {
            $parts += @{
                Type = "video"
                Content = $videoMatch.Value
                Position = $videoMatch.Index
                Length = $videoMatch.Length
            }
        }
        
        # Extract gallery images (full-size URLs from href in gallery div)
        $galleryDivMatches = [regex]::Matches($contentHtml, '<div[^>]*id=''gallery-[^>]*>([\s\S]*?)</div>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
        foreach ($galleryDivMatch in $galleryDivMatches) {
            $galleryContent = $galleryDivMatch.Groups[1].Value
            $galleryImgMatches = [regex]::Matches($galleryContent, '<a[^>]*href=''([^'']+)''[^>]*>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
            foreach ($galleryImgMatch in $galleryImgMatches) {
                $parts += @{
                    Type = "image"
                    Url = $galleryImgMatch.Groups[1].Value -replace '&amp;', '&'
                    Position = $galleryDivMatch.Index + $galleryImgMatch.Index
                    Length = $galleryImgMatch.Length
                }
            }
        }
        
        # Extract standalone images (not in gallery)
        $imgMatches = [regex]::Matches($contentHtml, '<img[^>]*src="(https://generalarcade.com/content/uploads/[^"]+)"[^>]*>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
        foreach ($imgMatch in $imgMatches) {
            # Skip if already in gallery
            $isInGallery = $false
            foreach ($galleryDivMatch in $galleryDivMatches) {
                if ($imgMatch.Index -ge $galleryDivMatch.Index -and $imgMatch.Index -le ($galleryDivMatch.Index + $galleryDivMatch.Length)) {
                    $isInGallery = $true
                    break
                }
            }
            if (-not $isInGallery) {
                $parts += @{
                    Type = "image"
                    Url = $imgMatch.Groups[1].Value -replace '&amp;', '&'
                    Position = $imgMatch.Index
                    Length = $imgMatch.Length
                }
            }
        }
        
        # Sort by position
        $parts = $parts | Sort-Object Position
        
        # Now extract text blocks between elements
        $lastPos = 0
        $processedContent = ""
        
        foreach ($part in $parts) {
            # Get text before this element
            if ($part.Position -gt $lastPos) {
                $textBefore = $contentHtml.Substring($lastPos, $part.Position - $lastPos)
                # Remove HTML tags but preserve structure
                $textBefore = $textBefore -replace '<div[^>]*id=''gallery-[^>]*>.*?</div>', '' -replace '<div[^>]*class="[^"]*pb-5[^"]*text-center[^"]*"[^>]*>.*?</div>', '' -replace '<iframe[^>]*>.*?</iframe>', ''
                # Remove data attributes
                $textBefore = $textBefore -replace '\s+data-[^=]+="[^"]*"', ''
                # Convert HTML to markdown
                $textBefore = $textBefore -replace '<p[^>]*>', "`n`n" -replace '</p>', ''
                $textBefore = $textBefore -replace '<strong[^>]*>', '**' -replace '</strong>', '**'
                $textBefore = $textBefore -replace '<h3[^>]*>', "`n### " -replace '</h3>', "`n"
                $textBefore = $textBefore -replace '<h4[^>]*>', "`n#### " -replace '</h4>', "`n"
                $textBefore = $textBefore -replace '<ul[^>]*>', "`n" -replace '</ul>', "`n"
                $textBefore = $textBefore -replace '<li[^>]*>', "- " -replace '</li>', "`n"
                $textBefore = $textBefore -replace '<em[^>]*>', '_' -replace '</em>', '_'
                $textBefore = $textBefore -replace '<br\s*/?>', "`n"
                # Clean HTML entities
                $textBefore = $textBefore -replace '&#8211;', '-' -replace '&#8217;', "'" -replace '&amp;', '&' -replace '&#8212;', '--' -replace '&hellip;', '...' -replace '&nbsp;', ' '
                # Remove remaining HTML
                $textBefore = $textBefore -replace '<[^>]+>', ''
                $textBefore = $textBefore.Trim()
                if ($textBefore) {
                    $processedContent += "`n`n" + $textBefore + "`n`n"
                }
            }
            
            # Add element marker
            if ($part.Type -eq "video") {
                $iframeEscaped = $part.Content -replace '"', '\"'
                $processedContent += "{{< video iframe=`"$iframeEscaped`" >}}`n`n"
            } elseif ($part.Type -eq "image") {
                $urlEscaped = $part.Url -replace '"', '\"'
                $processedContent += "{{< image src=`"$urlEscaped`" >}}`n`n"
            }
            
            $lastPos = $part.Position + $part.Length
        }
        
        # Get remaining text
        if ($lastPos -lt $contentHtml.Length) {
            $textAfter = $contentHtml.Substring($lastPos)
            $textAfter = $textAfter -replace '<div[^>]*id=''gallery-[^>]*>.*?</div>', '' -replace '<div[^>]*class="[^"]*pb-5[^"]*text-center[^"]*"[^>]*>.*?</div>', '' -replace '<iframe[^>]*>.*?</iframe>', ''
            $textAfter = $textAfter -replace '\s+data-[^=]+="[^"]*"', ''
            $textAfter = $textAfter -replace '<p[^>]*>', "`n`n" -replace '</p>', ''
            $textAfter = $textAfter -replace '<strong[^>]*>', '**' -replace '</strong>', '**'
            $textAfter = $textAfter -replace '<h3[^>]*>', "`n### " -replace '</h3>', "`n"
            $textAfter = $textAfter -replace '<h4[^>]*>', "`n#### " -replace '</h4>', "`n"
            $textAfter = $textAfter -replace '<ul[^>]*>', "`n" -replace '</ul>', "`n"
            $textAfter = $textAfter -replace '<li[^>]*>', "- " -replace '</li>', "`n"
            $textAfter = $textAfter -replace '<em[^>]*>', '_' -replace '</em>', '_'
            $textAfter = $textAfter -replace '<br\s*/?>', "`n"
            $textAfter = $textAfter -replace '&#8211;', '-' -replace '&#8217;', "'" -replace '&amp;', '&' -replace '&#8212;', '--' -replace '&hellip;', '...' -replace '&nbsp;', ' '
            $textAfter = $textAfter -replace '<[^>]+>', ''
            $textAfter = $textAfter.Trim()
            if ($textAfter) {
                $processedContent += "`n`n" + $textAfter
            }
        }
        
        # Clean up multiple newlines
        $processedContent = $processedContent -replace "`n`n`n+", "`n`n"
        $content = $processedContent.Trim()
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
        AllImages = $parts | Where-Object { $_.Type -eq "image" } | ForEach-Object { $_.Url }
        Videos = $parts | Where-Object { $_.Type -eq "video" } | ForEach-Object { $_.Content }
    }
}

# Get project order from index page
$indexPath = Join-Path $tempDir "projects_index.html"
$projectOrder = @()
if (Test-Path $indexPath) {
    $indexContent = Get-Content $indexPath -Raw
    # Extract project URLs from c-project-item links (these are in display order)
    $orderMatches = [regex]::Matches($indexContent, '<a[^>]*href="(https://generalarcade.com/project/[^"]+)"[^>]*class="[^"]*c-project-item')
    foreach ($match in $orderMatches) {
        $url = $match.Groups[1].Value
        $slug = $url -replace "https://generalarcade.com/project/", "" -replace "/", ""
        if ($slug -and $slug -notin $projectOrder) {
            $projectOrder += $slug
        }
    }
    Write-Host "Found $($projectOrder.Count) projects in order: $($projectOrder -join ', ')" -ForegroundColor Cyan
}

# Process all HTML files in reverse order (oldest first)
$htmlFiles = Get-ChildItem -Path $tempDir -Filter "*.html" | Where-Object { $_.Name -ne "projects_index.html" }
$processedProjects = @()

foreach ($file in $htmlFiles) {
    Write-Host "Processing: $($file.Name)" -ForegroundColor Cyan
    
    $html = Get-Content $file.FullName -Raw -Encoding UTF8
    # Extract actual URL from HTML if available, otherwise construct from filename
    $actualUrl = ""
    if ($html -match '<link rel="canonical" href="([^"]+)"') {
        $actualUrl = $matches[1].Trim()
    } else {
        $actualUrl = "https://generalarcade.com/project/" + ($file.BaseName -replace '-$', '').Replace('-', '/')
    }
    $data = Extract-ProjectData -html $html -url $actualUrl
    
    # Get slug from URL (preserve dashes)
    $urlSlug = $actualUrl -replace "https://generalarcade.com/project/", "" -replace "/$", "" -replace "/", "-"
    
    if (-not $data.Title) {
        Write-Host "  Skipping: No title found" -ForegroundColor Yellow
        continue
    }
    
    $slug = Slugify-Text -text $data.Title
    $postDir = Join-Path $contentDir $slug
    
    # Remove existing if exists
    if (Test-Path $postDir) {
        Write-Host "  Removing existing: $slug" -ForegroundColor Yellow
        Remove-Item -Path $postDir -Recurse -Force
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
            Write-Host "  Downloaded featured image: $featuredImageName" -ForegroundColor Green
        } catch {
            Write-Host "  Warning: Could not download featured image: $_" -ForegroundColor Yellow
            $featuredImageName = ""
        }
    }
    
    # Download all other images referenced in content
    # Extract image URLs from content shortcodes
    $imageUrls = @()
    if ($data.Content -match '{{< image src="([^"]+)"') {
        $imgMatches = [regex]::Matches($data.Content, '{{< image src="([^"]+)"')
        foreach ($imgMatch in $imgMatches) {
            $imgUrl = $imgMatch.Groups[1].Value
            if ($imgUrl -and $imgUrl -ne $data.FeaturedImage -and $imgUrl -notin $imageUrls) {
                $imageUrls += $imgUrl
            }
        }
    }
    
    $imageCounter = 1
    foreach ($imgUrl in $imageUrls) {
        try {
            $imgExt = [System.IO.Path]::GetExtension($imgUrl) -replace '\?.*', ''
            if (-not $imgExt) { $imgExt = ".jpg" }
            # Use filename from URL or generate name
            $urlFileName = [System.IO.Path]::GetFileName($imgUrl) -replace '\?.*', ''
            if ($urlFileName -and $urlFileName -match '\.(jpg|jpeg|png|gif|webp)$') {
                $imgName = $urlFileName
            } else {
                $imgName = "image-$imageCounter$imgExt"
            }
            $imgPath = Join-Path $postDir $imgName
            Invoke-WebRequest -Uri $imgUrl -OutFile $imgPath -UseBasicParsing -ErrorAction Stop
            # Update content to use local filename
            $data.Content = $data.Content -replace [regex]::Escape($imgUrl), $imgName
            Write-Host "  Downloaded image: $imgName" -ForegroundColor Green
            $imageCounter++
        } catch {
            Write-Host "  Warning: Could not download image $imgUrl : $_" -ForegroundColor Yellow
        }
    }
    
    # Determine weight based on order (oldest = highest weight, newest = lowest)
    # Projects are listed from newest to oldest, so first in list = newest = lowest weight
    $weight = 1000
    $orderIndex = $projectOrder.IndexOf($urlSlug)
    if ($orderIndex -ge 0) {
        # Reverse order: first project (newest) gets lowest weight, last (oldest) gets highest
        $weight = 1000 - $orderIndex
    }
    
    # Create markdown file
    $frontMatter = @"
---
title: "$($data.Title -replace '"', '\"')"
weight: $weight
"@
    
    if ($data.Platforms.Count -gt 0) {
        $platformsStr = $data.Platforms -join '", "'
        $frontMatter += "`nplatforms: [`"$platformsStr`"]"
    }
    
    if ($data.Client) {
        $frontMatter += "`nclient: `"$($data.Client -replace '"', '\"')`""
    }
    
    if ($data.Developer) {
        $frontMatter += "`ndeveloper: `"$($data.Developer -replace '"', '\"')`""
    }
    
    if ($data.Publisher) {
        $frontMatter += "`npublisher: `"$($data.Publisher -replace '"', '\"')`""
    }
    
    if ($data.Website) {
        $frontMatter += "`nwebsite: `"$($data.Website -replace '"', '\"')`""
    }
    
    if ($featuredImageName) {
        $frontMatter += "`nfeatured_image: `"$featuredImageName`""
    }
    
    $frontMatter += "`ndraft: false`n---`n`n"
    
    $markdown = $frontMatter + $data.Content
    
    $mdPath = Join-Path $postDir "index.md"
    [System.IO.File]::WriteAllText($mdPath, $markdown, [System.Text.Encoding]::UTF8)
    
    $processedProjects += @{
        Slug = $slug
        Title = $data.Title
        Weight = $weight
    }
    
    Write-Host "  Created: $slug (weight: $weight)" -ForegroundColor Green
}

Write-Host "`nDone! Processed $($processedProjects.Count) projects" -ForegroundColor Cyan

