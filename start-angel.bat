@echo off
title Angel Assistant Launcher
cd /d "%~dp0"
echo Starting Angel Cyberpunk Desktop Assistant...
start "" "node_modules\electron\dist\Angel.exe" .
exit
