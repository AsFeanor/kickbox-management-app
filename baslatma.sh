#!/bin/bash

echo "================================================"
echo "   KICKBOXING YÖNETIM SISTEMI - BAŞLATMA"
echo "================================================"
echo

echo "Backend başlatılıyor..."
osascript -e 'tell app "Terminal" to do script "cd '$(pwd)'/backend && node index.js"'

echo "3 saniye bekleniyor..."
sleep 3

echo "Frontend başlatılıyor..."
osascript -e 'tell app "Terminal" to do script "cd '$(pwd)'/frontend && npm run dev"'

echo
echo "================================================"
echo "           SISTEM BAŞLATILDI!"
echo "================================================"
echo
echo "2 adet terminal penceresi açıldı:"
echo "1. Backend Server (Port 3001)"
echo "2. Frontend Server (Port 5173)"
echo
echo "Tarayıcınızda şu adresi açın:"
echo "http://localhost:5173"
echo
echo "Sistemi kapatmak için terminal pencerelerini kapatın."
echo
read -p "Devam etmek için Enter'a basın..."
