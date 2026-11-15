# Launch Angel X Desktop Assistant cleanly in interactive session
$appDir = $PSScriptRoot
$unpackedExe = Join-Path $appDir "dist\win-unpacked\Angel X.exe"
$devExe = Join-Path $appDir "node_modules\electron\dist\Angel.exe"
if (Test-Path $unpackedExe) {
    Start-Process -FilePath $unpackedExe -WorkingDirectory (Split-Path $unpackedExe -Parent)
    Write-Host "Angel X (packaged) launched successfully!" -ForegroundColor Cyan
} elseif (Test-Path $devExe) {
    Start-Process -FilePath $devExe -ArgumentList "`"$appDir`"" -WorkingDirectory $appDir
    Write-Host "Angel X (dev) launched successfully!" -ForegroundColor Cyan
} else {
    Write-Host "Angel executable not found." -ForegroundColor Red
}
