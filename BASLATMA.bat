@echo off
echo ================================================
echo    KICKBOXING YONETIM SISTEMI - BASLATMA
echo ================================================
echo.

echo Backend baslatiliyor...
start "Backend Server" cmd /k "cd backend && node index.js"

echo 3 saniye bekleniyor...
timeout /t 3 /nobreak >nul

echo Frontend baslatiliyor...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ================================================
echo           SISTEM BASLATILDI!
echo ================================================
echo.
echo 2 adet terminal penceresi acildi:
echo 1. Backend Server (Port 3001)
echo 2. Frontend Server (Port 5173)
echo.
echo Tarayicinizda su adresi acin:
echo http://localhost:5173
echo.
echo Sistemi kapatmak icin terminal pencerelerini kapatin.
echo.
pause
