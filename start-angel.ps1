# Launch Angel X Desktop Assistant cleanly in interactive session
$appDir = $PSScriptRoot
$exe = Join-Path $appDir "node_modules\electron\dist\Angel.exe"
if (Test-Path $exe) {
    Start-Process -FilePath $exe -ArgumentList "`"$appDir`"" -WorkingDirectory $appDir
    Write-Host "Angel X launched successfully!" -ForegroundColor Cyan
} else {
    Write-Host "Angel executable not found at $exe" -ForegroundColor Red
}
