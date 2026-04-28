$ErrorActionPreference = "Stop"

Write-Host "Enter Gemini API key from Google AI Studio." -ForegroundColor Yellow
Write-Host "The key will be saved only to local .env file, not to frontend code." -ForegroundColor Yellow

$secureKey = Read-Host "GEMINI_API_KEY" -AsSecureString
$bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)

try {
  $plainKey = [Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
} finally {
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
}

if ([string]::IsNullOrWhiteSpace($plainKey)) {
  throw "Key was not entered."
}

if (-not $plainKey.StartsWith("AIza")) {
  Write-Host "Warning: Gemini keys usually start with AIza. Continuing anyway." -ForegroundColor Yellow
}

$lines = @(
  "GEMINI_API_KEY=$plainKey",
  "GEMINI_MODEL=gemini-2.5-flash-lite",
  "PORT=80"
)

$envContent = [string]::Join([Environment]::NewLine, $lines) + [Environment]::NewLine
$envPath = Join-Path (Get-Location) ".env"
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

[System.IO.File]::WriteAllText($envPath, $envContent, $utf8NoBom)

Write-Host ".env updated. Restart Docker: docker compose up -d --build --force-recreate" -ForegroundColor Green
