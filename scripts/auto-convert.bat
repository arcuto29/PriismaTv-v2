@echo off
REM ============================================================
REM  PriismaTv Auto-Converter + Auto-Renamer
REM  Watches D:\Movies and:
REM   1. Converts new MKV files to MP4 with ENGLISH AAC audio
REM   2. Cleans up messy filenames so the website matches them
REM   3. Deletes the original MKV
REM
REM  SETUP (one time):
REM   1. Put this file AND clean-names.ps1 in D:\Movies
REM   2. Make sure ffmpeg is installed and on PATH
REM   3. Double-click to run, OR add a shortcut to it in
REM      the Windows Startup folder (Win+R -> shell:startup)
REM ============================================================

cd /d D:\Movies
echo ========================================
echo  PriismaTv Auto-Converter + Renamer
echo  Watching D:\Movies for new files...
echo  Press Ctrl+C to stop.
echo ========================================
echo.

:loop
for %%F in (*.mkv) do (
    if not exist "%%~nF.mp4" (
        echo [FOUND] %%F
        echo [CONVERTING] Picking English audio and converting to AAC...

        REM Try: copy video, English audio track -> AAC, drop subs.
        ffmpeg -y -i "%%F" -map 0:v:0 -map 0:m:language:eng -map -0:s -c:v copy -c:a aac -b:a 192k "%%~nF.mp4"

        if errorlevel 1 (
            echo [RETRY] No English track found, using first audio track...
            ffmpeg -y -i "%%F" -map 0:v:0 -map 0:a:0 -map -0:s -c:v copy -c:a aac -b:a 192k "%%~nF.mp4"
        )

        if exist "%%~nF.mp4" (
            echo [DONE] Created %%~nF.mp4
            echo [CLEANUP] Deleting original MKV...
            del "%%F"
        ) else (
            echo [ERROR] Conversion failed for %%F - leaving MKV in place.
        )
        echo.
    )
)

REM Clean up filenames so the website auto-matcher finds them
powershell -ExecutionPolicy Bypass -File "D:\Movies\clean-names.ps1"

REM wait 30 seconds, then check again
timeout /t 30 /nobreak >nul
goto loop
