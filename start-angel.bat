@echo off
title Angel X HUD Launcher
cd /d "%~dp0"
echo Starting Angel X Desktop Assistant...
start "" "node_modules\electron\dist\Angel.exe" .
exit
