#!/bin/bash

echo "================================================"
echo "      VERİTABANI YEDEKLEME ARACI"
echo "================================================"
echo

tarih=$(date +"%Y%m%d")
saat=$(date +"%H%M")
yedek_adi="veritabani_yedek_${tarih}_${saat}.db"

echo "Tarih: $(date)"
echo "Yedek dosya adı: $yedek_adi"
echo

if [ ! -f "backend/prisma/dev.db" ]; then
    echo "HATA: Veritabanı dosyası bulunamadı!"
    echo "Dosya yolu: backend/prisma/dev.db"
    echo
    read -p "Devam etmek için Enter'a basın..."
    exit 1
fi

echo "Veritabanı yedekleniyor..."
cp "backend/prisma/dev.db" "$yedek_adi"

if [ $? -eq 0 ]; then
    echo
    echo "================================================"
    echo "           YEDEKLEME BAŞARILI!"
    echo "================================================"
    echo
    echo "Yedek dosya: $yedek_adi"
    echo "Dosya boyutu: $(ls -lh $yedek_adi | awk '{print $5}')"
    echo
    echo "Bu dosyayı güvenli bir yere kopyalayın:"
    echo "- USB bellek"
    echo "- Google Drive"
    echo "- Dropbox"
    echo
else
    echo
    echo "HATA: Yedekleme başarısız!"
    echo
fi

read -p "Devam etmek için Enter'a basın..."
