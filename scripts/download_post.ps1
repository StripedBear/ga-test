# PowerShell script to download blog posts from generalarcade.com

$baseUrl = "https://generalarcade.com"
$outputDir = "E:\GA-WEB\generalarcade-hugo-starter\temp_posts"

# Create output directory
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

# List of post URLs to download
$postUrls = @(
    "https://generalarcade.com/a-joint-venture-by-general-arcade-and-lunate-beware-of-bytes/",
    "https://generalarcade.com/scaling-smart-how-small-studios-can-thrive-in-a-shifting-games-industry/",
    "https://generalarcade.com/game-development-industry-digest-41/",
    "https://generalarcade.com/your-weekly-game-development-industry-digest-devsday-40/",
    "https://generalarcade.com/your-weekly-game-development-industry-digest-devsday-39/",
    "https://generalarcade.com/a-leap-of-faith-from-gamer-girl-to-qa-engineer-at-general-arcade/",
    "https://generalarcade.com/andrei-b-the-mind-behind-general-arcades-game-production/",
    "https://generalarcade.com/the-qa-engineer-behind-your-favorite-ports/",
    "https://generalarcade.com/best-programming-books-3-algorithms-coding-practices-gamedev/",
    "https://generalarcade.com/from-malaysia-to-the-us-and-back-the-new-star-of-our-team/",
    "https://generalarcade.com/best-programming-books-2-algorithms-coding-practices-gamedev/",
    "https://generalarcade.com/gta-vice-city-stories-widescreenfixespack/"
)

foreach ($url in $postUrls) {
    $fileName = $url -replace "https://generalarcade.com/", "" -replace "/", "-" -replace "[^a-zA-Z0-9-]", ""
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




