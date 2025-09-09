@echo off
echo ================================================
echo      VERİTABANI YEDEKLEME ARACI
echo ================================================
echo.

set "tarih=%date:~-4,4%%date:~-7,2%%date:~-10,2%"
set "saat=%time:~0,2%%time:~3,2%"
set "yedek_adi=veritabani_yedek_%tarih%_%saat%.db"

echo Tarih: %date%
echo Saat: %time%
echo Yedek dosya adi: %yedek_adi%
echo.

if not exist "backend\prisma\dev.db" (
    echo HATA: Veritabani dosyasi bulunamadi!
    echo Dosya yolu: backend\prisma\dev.db
    echo.
    pause
    exit /b 1
)

echo Veritabani yedekleniyor...
copy "backend\prisma\dev.db" "%yedek_adi%"

if %errorlevel% equ 0 (
    echo.
    echo ================================================
    echo           YEDEKLEME BASARILI!
    echo ================================================
    echo.
    echo Yedek dosya: %yedek_adi%
    echo Dosya boyutu: 
    dir "%yedek_adi%" | find "%yedek_adi%"
    echo.
    echo Bu dosyayi guvenli bir yere kopyalayin:
    echo - USB bellek
    echo - Google Drive
    echo - Dropbox
    echo.
) else (
    echo.
    echo HATA: Yedekleme basarisiz!
    echo.
)

pause
