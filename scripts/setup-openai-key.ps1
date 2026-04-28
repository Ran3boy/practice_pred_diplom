$ErrorActionPreference = "Stop"

Write-Host "This project now uses Gemini. Starting setup-gemini-key.ps1..." -ForegroundColor Yellow
& (Join-Path $PSScriptRoot "setup-gemini-key.ps1")
