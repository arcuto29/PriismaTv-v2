@echo off
REM ============================================================
REM  PriismaTv - Convert ONE file (drag & drop)
REM  Drag any .mkv (or .mp4 with bad audio) ONTO this file.
REM  It converts to MP4 with English AAC audio.
REM
REM  Keep this file in D:\Movies for convenience.
REM ============================================================

if "%~1"=="" (
    echo Drag a video file onto this .bat to convert it.
    pause
    exit /b
)

set "INPUT=%~1"
set "OUTPUT=%~dpn1.eng.mp4"

echo [CONVERTING] %INPUT%
echo Picking English audio, converting to AAC...
echo.

ffmpeg -y -i "%INPUT%" -map 0:v:0 -map 0:m:language:eng -map -0:s -c:v copy -c:a aac -b:a 192k "%OUTPUT%"

if errorlevel 1 (
    echo [RETRY] No English track tagged, using first audio track...
    ffmpeg -y -i "%INPUT%" -map 0:v:0 -map 0:a:0 -map -0:s -c:v copy -c:a aac -b:a 192k "%OUTPUT%"
)

if exist "%OUTPUT%" (
    echo.
    echo [DONE] Created: %OUTPUT%
    echo You can now delete the original if you want.
) else (
    echo.
    echo [ERROR] Conversion failed. Run "ffmpeg -i your-file.mkv" to see the audio tracks.
)

echo.
pause
