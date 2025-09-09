@echo off
echo ================================================
echo    KICKBOXING YONETIM SISTEMI - KURULUM
echo ================================================
echo.

echo [1/4] Backend kurulumu basliyor...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo HATA: Backend kurulumu basarisiz!
    pause
    exit /b 1
)

echo [2/4] Veritabani hazirlaniyor...
call npx prisma generate
if %errorlevel% neq 0 (
    echo HATA: Prisma generate basarisiz!
    pause
    exit /b 1
)

call npx prisma migrate dev
if %errorlevel% neq 0 (
    echo HATA: Database migration basarisiz!
    pause
    exit /b 1
)

echo [3/4] Frontend kurulumu basliyor...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo HATA: Frontend kurulumu basarisiz!
    pause
    exit /b 1
)

echo [4/4] Kurulum tamamlandi!
echo.
echo ================================================
echo              KURULUM BASARILI!
echo ================================================
echo.
echo Sistemi baslatmak icin:
echo 1. BASLATMA.bat dosyasini calistirin
echo 2. Veya manuel olarak backend ve frontend'i ayri ayri baslatın
echo.
echo Kullanim rehberi: HOCA_REHBERI.md
echo.
pause
