# ============================================================
#  PriismaTv - Smart File Renamer
#  Cleans messy torrent filenames in D:\Movies so the
#  website's auto-matcher finds them reliably.
#
#  Movies  ->  "Title (Year).mp4"
#  Shows   ->  "Title S01E01.mp4"
#
#  USAGE:
#   - Right-click this file -> "Run with PowerShell"
#   - OR it runs automatically from auto-convert.bat
#
#  It only RENAMES - it never deletes or re-encodes.
# ============================================================

$folder = "D:\Movies"
Set-Location $folder

# Junk words to strip out of filenames (quality, codec, source, audio, groups)
$junk = @(
    '2160p','1080p','720p','480p','4K','UHD','HDR','HDR10','DV','SDR','10bit','10-bit','8bit',
    'BluRay','Blu-Ray','BRRip','BDRip','WEB-DL','WEBDL','WEBRip','WEB','HDRip','DVDRip','REMUX',
    'x264','x265','H264','H265','H.264','H.265','HEVC','AVC','XviD','DivX',
    'AAC','AAC5.1','AC3','EAC3','DDP','DDP5.1','DD5.1','DTS','DTS-HD','TrueHD','Atmos','FLAC','MP3','5.1','7.1','2.0',
    'EXTENDED','REPACK','PROPER','LIMITED','UNRATED','DIRECTORS.CUT','IMAX','REMASTERED',
    'MULTI','DUAL','ITA','RUS','ENG','SUB','DUBBED','seleZen','YIFY','YTS','RARBG','GalaxyRG','MeGusta','Tigole'
)

Get-ChildItem -File | Where-Object { $_.Extension -match '\.(mp4|mkv|avi)$' } | ForEach-Object {
    $file = $_
    $name = $file.BaseName
    $ext  = $file.Extension

    # Replace dots/underscores with spaces
    $clean = $name -replace '[\._]', ' '

    # Detect TV show pattern (S01E01, s1e1, 1x01)
    $isShow = $false
    $seCode = ''
    if ($clean -match '(?i)\bS(\d{1,2})E(\d{1,3})\b') {
        $isShow = $true
        $seCode = ('S{0:D2}E{1:D2}' -f [int]$Matches[1], [int]$Matches[2])
    } elseif ($clean -match '(?i)\b(\d{1,2})x(\d{1,3})\b') {
        $isShow = $true
        $seCode = ('S{0:D2}E{1:D2}' -f [int]$Matches[1], [int]$Matches[2])
    }

    # Find year (1900-2099)
    $year = ''
    if ($clean -match '\b(19\d{2}|20\d{2})\b') { $year = $Matches[1] }

    if ($isShow) {
        # Title is everything BEFORE the SxxExx code
        $title = ($clean -split '(?i)\bS\d{1,2}E\d{1,3}\b')[0]
        $title = ($title -split '(?i)\b\d{1,2}x\d{1,3}\b')[0]
    } else {
        # Title is everything BEFORE the year
        if ($year) { $title = ($clean -split "\b$year\b")[0] } else { $title = $clean }
    }

    # Strip junk words from the title
    foreach ($j in $junk) {
        $title = $title -replace ('(?i)\b' + [regex]::Escape($j) + '\b'), ''
    }
    # Remove anything in brackets/parens, leftover dashes, collapse spaces
    $title = $title -replace '[\[\(\{].*?[\]\)\}]', ''
    $title = $title -replace '-.*$', ''
    $title = ($title -replace '\s+', ' ').Trim()

    # Build the clean name
    if ($isShow) {
        $newName = "$title $seCode$ext"
    } elseif ($year) {
        $newName = "$title ($year)$ext"
    } else {
        $newName = "$title$ext"
    }

    # Only rename if it actually changed and target doesn't exist
    if ($newName -ne $file.Name -and $title.Length -gt 1) {
        if (Test-Path $newName) {
            Write-Host "[SKIP] $newName already exists"
        } else {
            Write-Host "[RENAME] $($file.Name)"
            Write-Host "      -> $newName"
            Rename-Item -LiteralPath $file.FullName -NewName $newName
        }
    }
}

Write-Host ""
Write-Host "Done cleaning filenames."
