# Launch Angel Cyberpunk Desktop Assistant cleanly in interactive session
$appDir = $PSScriptRoot
$exe = Join-Path $appDir "node_modules\electron\dist\Angel.exe"
if (Test-Path $exe) {
    Start-Process -FilePath $exe -ArgumentList "`"$appDir`"" -WorkingDirectory $appDir
    Write-Host "Angel launched successfully!" -ForegroundColor Cyan
} else {
    Write-Host "Angel.exe not found at $exe" -ForegroundColor Red
}
