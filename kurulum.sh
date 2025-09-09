#!/bin/bash

echo "================================================"
echo "   KICKBOXING YÖNETIM SISTEMI - KURULUM"
echo "================================================"
echo

echo "[1/4] Backend kurulumu başlıyor..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "HATA: Backend kurulumu başarısız!"
    exit 1
fi

echo "[2/4] Veritabanı hazırlanıyor..."
npx prisma generate
if [ $? -ne 0 ]; then
    echo "HATA: Prisma generate başarısız!"
    exit 1
fi

npx prisma migrate dev
if [ $? -ne 0 ]; then
    echo "HATA: Database migration başarısız!"
    exit 1
fi

echo "[3/4] Frontend kurulumu başlıyor..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "HATA: Frontend kurulumu başarısız!"
    exit 1
fi

echo "[4/4] Kurulum tamamlandı!"
echo
echo "================================================"
echo "              KURULUM BAŞARILI!"
echo "================================================"
echo
echo "Sistemi başlatmak için:"
echo "1. ./baslatma.sh dosyasını çalıştırın"
echo "2. Veya manuel olarak backend ve frontend'i ayrı ayrı başlatın"
echo
echo "Kullanım rehberi: HOCA_REHBERI.md"
echo
read -p "Devam etmek için Enter'a basın..."
