@echo off
echo ====================================
echo   تشغيل تطبيق قائمة المهام
echo ====================================
echo.

if not exist "node_modules" (
    echo جاري تثبيت الحزم...
    call npm install
    echo.
)

echo جاري تشغيل الخادم...
echo.
echo سيفتح المتصفح تلقائياً على: http://localhost:3000
echo.
call npm run dev

pause
