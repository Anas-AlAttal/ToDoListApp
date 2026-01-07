Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  تشغيل تطبيق قائمة المهام" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path "node_modules")) {
    Write-Host "جاري تثبيت الحزم..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

Write-Host "جاري تشغيل الخادم..." -ForegroundColor Green
Write-Host ""
Write-Host "سيفتح المتصفح تلقائياً على: http://localhost:3000" -ForegroundColor Green
Write-Host ""

npm run dev
