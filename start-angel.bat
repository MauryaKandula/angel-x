@echo off
title Angel X HUD Launcher
cd /d "%~dp0"
echo Starting Angel X Desktop Assistant...
if exist "dist\win-unpacked\Angel X.exe" (
    start "" "dist\win-unpacked\Angel X.exe"
) else (
    start "" "node_modules\electron\dist\Angel.exe" .
)
exit
