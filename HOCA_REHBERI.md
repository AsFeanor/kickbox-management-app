# 🥊 Kickboxing Yönetim Sistemi - Hoca Rehberi

## 📖 Bu Sistem Nedir?

Bu sistem spor salonunuzda **özel dersler** ve **grup derslerini** yönetmeniz için hazırlanmış bir web uygulamasıdır.

### ✨ Neler Yapabilirsiniz?

#### 👥 **Üye Yönetimi**
- Yeni üye kaydetme
- Üye bilgilerini güncelleme
- Üye listesini görüntüleme
- Üye silme

#### 🎯 **Özel Ders Yönetimi**
- 8 seanslık özel ders paketleri
- Ders tarih/saat planlaması
- Katılım durumu takibi (Katıldı/Katılmadı)
- Ders erteleme
- Yeni paket başlatma

#### 👫 **Grup Dersi Yönetimi**
- Yaş kategorileri oluşturma
- 4 haftalık program planları
- Toplu yoklama alma
- Paket takibi

#### 📅 **Takvim**
- Tüm dersleri takvimde görme
- Ders durumlarını güncelleme
- Haftalık/aylık görünüm

#### 💰 **Ödeme Takibi**
- Ödeme durumları
- Vade takibi

---

## 🚀 İlk Kurulum (Tek Seferlik)

### 1. Gerekli Programları İndirin

#### **Node.js İndirin:**
1. https://nodejs.org adresine gidin
2. **"LTS"** yazan yeşil butona tıklayın
3. İndirilen dosyayı çalıştırıp kurun
4. Kurulum tamamlandığında bilgisayarı yeniden başlatın

#### **Kod Editörü (Opsiyonel):**
- **VS Code**: https://code.visualstudio.com (önerilir)
- Veya başka bir metin editörü

### 2. Proje Dosyalarını Hazırlayın

1. **Proje klasörünü** masaüstüne kopyalayın
2. Klasör adı: `kickboxing`

### 3. Sistemin İlk Kurulumu

#### **Windows'ta:**
1. **"Başlat"** menüsünde **"cmd"** yazın
2. **"Komut İstemi"** açın
3. Aşağıdaki komutları sırayla yazın:

```cmd
cd Desktop\kickboxing\backend
npm install
npx prisma generate
npx prisma migrate dev
```

4. Sonra:
```cmd
cd ..\frontend
npm install
```

#### **Mac'te:**
1. **"Terminal"** uygulamasını açın
2. Aşağıdaki komutları sırayla yazın:

```bash
cd Desktop/kickboxing/backend
npm install
npx prisma generate
npx prisma migrate dev
```

3. Sonra:
```bash
cd ../frontend
npm install
```

---

## 🎮 Günlük Kullanım

### Sistemi Başlatma

#### **1. Backend'i Başlatın (Sunucu)**
**Windows:**
```cmd
cd Desktop\kickboxing\backend
node index.js
```

**Mac/Linux:**
```bash
cd Desktop/kickboxing/backend
node index.js
```

✅ **Başarılı mesaj:** "Server running on port 3001"

#### **2. Frontend'i Başlatın (Web Sitesi)**
**Yeni bir terminal/komut istemi açın:**

**Windows:**
```cmd
cd Desktop\kickboxing\frontend
npm run dev
```

**Mac/Linux:**
```bash
cd Desktop/kickboxing/frontend
npm run dev
```

✅ **Başarılı mesaj:** "Local: http://localhost:5173"

#### **3. Web Sitesini Açın**
- Tarayıcınızda: **http://localhost:5173** adresine gidin
- Chrome, Firefox, Safari, Edge kullanabilirsiniz

---

## 📱 Sistem Kullanımı

### 🏠 **Ana Sayfa**
- Üst menüden istediğiniz bölüme gidin
- 6 ana bölüm var: Anasayfa, Üye Kayıt, Üye Listesi, Özel Dersler, Grup Dersleri, Takvim

### 👤 **Yeni Üye Kaydetme**
1. **"Üye Kayıt"** sekmesine gidin
2. **Zorunlu alanları** doldurun (⭐ işaretli)
3. **Ders türünü** seçin:
   - **Özel**: Haftada 2 gün, 8 seans
   - **Grup**: Yaş kategorisine göre
4. **"Kaydet"** butonuna tıklayın

### 🎯 **Özel Ders Yönetimi**
1. **"Özel Dersler"** sekmesine gidin
2. **Her üyenin kartında:**
   - Ders programını görün
   - İlerleme çubuğunu kontrol edin
   - Ödeme durumunu görün

#### **Ders İşaretleme:**
1. **Ders kartına** tıklayın
2. **Seçenekler:**
   - ✅ **Katıldı**: Öğrenci derse geldi
   - ❌ **Katılmadı**: Öğrenci gelmedi (hakkı yanar)
   - 🔄 **1 ders ertele**: Bir sonraki derse kaydır
   - 📅 **Yeni tarih seç**: İstediğiniz tarihe ertele

### 👫 **Grup Dersi Yönetimi**
1. **"Grup Dersleri"** sekmesine gidin
2. **İlk kategoriyi oluşturun:**
   - **"Yeni Kategori"** butonuna tıklayın
   - Yaş aralığı, günler, saatleri belirleyin
3. **Program oluşturun:**
   - **"Program"** butonuna tıklayın
   - 4 haftalık otomatik program oluşur

#### **Yoklama Alma:**
1. **Derslere** tıklayın
2. **Üyeleri** görün
3. **Toplu işlemler:**
   - **"Hepsini Katılacak"**: Tüm aktif üyeler
   - **"Hepsini Katılmayacak"**: Tümünü çıkar
4. **Tekil işlemler:** Her üyeyi ayrı ayrı işaretle

### 📅 **Takvim Kullanımı**
1. **"Takvim"** sekmesine gidin
2. **Görünüm seçin:** Ay, Hafta, Gün
3. **Derslere tıklayarak** durumlarını güncelleyin
4. **Renk kodları:**
   - 🟢 **Yeşil çizgi**: Katıldı
   - 🔴 **Kırmızı çizgi**: Katılmadı
   - ⬜ **Gri çizgi**: Bekliyor

---

## 💡 İpuçları ve Püf Noktaları

### 🔄 **Günlük Rutin**
1. **Sabah**: Sistemi başlatın (Backend + Frontend)
2. **Ders öncesi**: Takvimden günün derslerini kontrol edin
3. **Ders sonrası**: Katılım durumlarını işaretleyin
4. **Akşam**: Sistemi kapatabilirsiniz

### 💰 **Ödeme Takibi**
- **Kırmızı "Ödeme Bekliyor"**: Ödeme alınmamış
- **Yeşil "Ödendi"**: Ödeme tamamlanmış
- Ödeme durumunu tıklayarak değiştirebilirsiniz

### 📊 **Paket Takibi**
- **İlerleme çubukları**: Kaç ders tamamlandığını gösterir
- **"6/8 Tamamlandı"**: 6 ders yapıldı, 2 ders kaldı
- Paket bitince **"Yeni Paket Başlat"** butonu çıkar

### 🚨 **Dikkat Edilmesi Gerekenler**
- **Gelecek dersleri** "Katıldı" olarak işaretleyemezsiniz
- **Paket biten üyeler** grup derslerine katılamaz
- **Ertelenen dersler** otomatik olarak telafi edilir
- **Silinen üyeler** geri getirilemez

---

## 🆘 Sorun Giderme

### ❌ **"Sunucu bağlantısı kurulamadı" Hatası**
**Çözüm:** Backend çalışmıyor
1. Backend terminalini kontrol edin
2. Hata varsa terminali kapatıp yeniden başlatın:
```bash
cd backend
node index.js
```

### ❌ **"Sayfa yüklenmiyor" Hatası**
**Çözüm:** Frontend çalışmıyor
1. Frontend terminalini kontrol edin
2. http://localhost:5173 adresini yenileyin
3. Gerekirse terminali yeniden başlatın:
```bash
cd frontend
npm run dev
```

### ❌ **"Geçersiz aksiyon" Hatası**
**Çözüm:** Sayfayı yenileyin (F5 veya Ctrl+R)

### ❌ **Veriler kayboldu**
**Çözüm:** Veritabanı dosyası korunmuş olmalı
- Dosya: `backend/prisma/dev.db`
- Bu dosyayı yedekleyin (kopyalayın)

---

## 💾 Yedekleme

### **Önemli Dosyalar**
Düzenli olarak yedekleyin:
```
kickboxing/
├── backend/prisma/dev.db (VERİTABANI - ÇOK ÖNEMLİ!)
└── tüm klasör (güvenlik için)
```

### **Yedekleme Nasıl Yapılır**
1. **"dev.db"** dosyasını kopyalayın
2. **Tarihli** olarak kaydedin: `dev_20250120.db`
3. **USB bellek** veya **Google Drive**'a atın
4. **Haftalık** yedekleme yapın

---

## 📞 Destek

### **Sorun Yaşarsanız:**
1. **Hata mesajının** ekran görüntüsünü alın
2. **Hangi işlemi** yaparken hata aldığınızı not edin
3. **Terminal/Komut istemindeki** hataları kopyalayın
4. Bu bilgileri benimle paylaşın

### **Özellik İstekleri:**
- Eksik gördüğünüz özellikleri bildirin
- İyileştirme önerilerinizi paylaşın

---

## ✅ Hızlı Başlangıç Kontrol Listesi

### **İlk Kurulum** (Tek seferlik)
- [ ] Node.js indirdim ve kurdum
- [ ] Proje klasörünü masaüstüne kopyaladım
- [ ] Backend kurulumunu yaptım (`npm install`)
- [ ] Frontend kurulumunu yaptım (`npm install`)
- [ ] Veritabanını hazırladım (`prisma migrate dev`)

### **Günlük Kullanım**
- [ ] Backend'i başlattım (`node index.js`)
- [ ] Frontend'i başlattım (`npm run dev`)
- [ ] Tarayıcıda http://localhost:5173 açtım
- [ ] Sisteme giriş yaptım

### **İlk Veri Girişi**
- [ ] İlk üyemi ekledim
- [ ] İlk grup kategorisini oluşturdum
- [ ] Program oluşturdum
- [ ] Takvimi kontrol ettim

---

**🎉 Artık sistemi kullanmaya hazırsınız!**

*Bu rehberi yanınızda bulundurun ve ihtiyaç duyduğunuzda başvurun.*
