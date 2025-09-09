# 📖 Kullanım Kılavuzu

## 🚀 Hızlı Başlangıç

### Sistem Gereksinimleri
- Modern web tarayıcı (Chrome, Firefox, Safari, Edge)
- İnternet bağlantısı
- 1366x768 veya üzeri ekran çözünürlüğü

### Sisteme Giriş
1. Tarayıcınızı açın
2. Adres çubuğuna `http://localhost:5173` yazın
3. Ana sayfaya yönlendirileceksiniz

---

## 🏠 Ana Sayfa ve Navigasyon

### Üst Menü
```
[Anasayfa] [Üye Kayıt] [Üye Listesi] [Özel Dersler] [Grup Dersleri] [Takvim]
```

### Menü Açıklamaları
- **Anasayfa**: Sistem ana sayfası
- **Üye Kayıt**: Yeni üye ekleme formu
- **Üye Listesi**: Tüm üyeleri görüntüleme ve yönetme
- **Özel Dersler**: Özel ders paketlerini yönetme
- **Grup Dersleri**: Grup kategorileri ve yoklama
- **Takvim**: Tüm derslerin takvim görünümü

---

## 👤 Üye Kayıt İşlemleri

### Yeni Üye Ekleme

#### 1. Üye Kayıt Formuna Gidin
- Üst menüden "Üye Kayıt" seçeneğini tıklayın

#### 2. Temel Bilgileri Doldurun
```
Ad*: [Üyenin adı]
Soyad*: [Üyenin soyadı]
Cinsiyet*: [Kadın/Erkek/Diğer seçin]
Kayıt Tarihi*: [Takvimden seçin]
Yaş*: [Sayı olarak girin]
Kilo*: [Kg cinsinden]
Telefon*: [05xx xxx xx xx]
```

#### 3. Ders Türünü Seçin

##### Özel Ders Seçilirse:
```
Ders Türü: [Özel]
Ücret: [Paket ücreti TL]

📅 Ders Günleri ve Saatleri:
Gün 1: [Pazartesi]     Saat: [18:00 - 19:00]
Gün 2: [Çarşamba]      Saat: [18:00 - 19:00]
```

##### Grup Dersi Seçilirse:
```
Ders Türü: [Grup]
Grup Kategorisi: [Yaşa uygun kategori seçin]
Ücret: [Aylık ücret TL]

📦 Mevcut Paket Durumu:
○ Yeni üye - paket başlatılacak
○ Aktif paketi var - devam ediyor [Kaç ders katıldı?]
○ Paketi tamamlamış - yeni paket gerekli
```

#### 4. Kaydet
- Formu kontrol edin
- "Kaydet" butonuna tıklayın
- Başarı mesajını bekleyin

### ⚠️ Dikkat Edilmesi Gerekenler
- (*) işaretli alanlar zorunludur
- Telefon numarası benzersiz olmalıdır
- Yaş bilgisi grup kategorisi için önemlidir
- Özel ders için gün ve saat bilgileri zorunludur

---

## 📋 Üye Listesi Yönetimi

### Üyeleri Görüntüleme

#### Filtreleme Seçenekleri
1. **Arama**: Ad, soyad veya telefon ile arama
2. **Ders Türü**: Özel / Grup
3. **Grup Kategorisi**: Çocuklar, Gençler, vb.
4. **Cinsiyet**: Kadın / Erkek / Diğer

#### Üye Kartları
Her üye kartında görünen bilgiler:
```
[Profil İkonu] Ad Soyad        [Ders Türü] [✏️] [🗑️]
               📞 Telefon No
               
Yaş: 25        Kilo: 75 kg
Cinsiyet: Erkek   Ücret: ₺1500

[Özel Ders Paketleri Listesi]
[Not Alanı]
```

### Üye Düzenleme
Üye kartının sağ üstündeki ✏️ (düzenle) butonuna tıklayarak:

#### Düzenlenebilir Alanlar:
- ✅ Ad, Soyad
- ✅ Yaş, Kilo
- ✅ Cinsiyet (Kadın/Erkek/Diğer)
- ✅ Telefon numarası
- ✅ Ücret bilgisi
- ✅ Not alanı

#### Düzenlenemez Alanlar:
- ❌ Ders türü (Özel/Grup)
- ❌ Kayıt tarihi
- ❌ Yaş grubu

#### Düzenleme Süreci:
1. ✏️ butonuna tıklayın
2. Modal pencere açılır
3. Mevcut bilgiler dolu olarak gelir
4. İstediğiniz alanları değiştirin
5. "Güncelle" butonuna basın
6. Değişiklikler anında kaydedilir

### Üye Silme
Üye kartının sağ üstündeki 🗑️ (sil) butonuna tıklayarak:

#### Silme Süreci:
1. 🗑️ butonuna tıklayın
2. Onay mesajı görüntülenir
3. "Tamam" derseniz üye silinir

#### ⚠️ Dikkat:
- Bu işlem **geri alınamaz**
- Aşağıdaki veriler **kalıcı olarak silinir**:
  - Üye bilgileri
  - Özel ders paketleri
  - Tüm ders seansları
  - Grup dersi katılımları
- Silmeden önce emin olun!

### Sayfalama
- Sayfa başına 6, 9, 12 veya 18 üye
- Alt kısımda sayfa numaraları
- İleri/Geri butonları

### İstatistikler
Sayfanın üstünde görünen özet bilgiler:
- 👥 Toplam Üye
- ⏰ Özel Ders Üyesi
- 👫 Grup Dersi Üyesi
- 💰 Toplam Gelir

---

## 🎯 Özel Ders Yönetimi

### Paket Görüntüleme
Her özel ders üyesi için:
```
Paket 1              [Ödendi] [Devam Ediyor]
Pazartesi: 18:00-19:00
Çarşamba: 18:00-19:00

Ders İlerlemesi: [████████--] 6/8
```

### Seans Durumu Güncelleme

#### Mevcut Durumlar:
- ⏳ **Bekliyor**: Henüz gerçekleşmemiş
- ✅ **Katıldı**: Öğrenci derse katıldı
- ❌ **Katılmadı**: Öğrenci gelmedi
- 🔄 **Ertelendi**: Başka güne alındı

### Ders Erteleme

#### Erteleme Seçenekleri:
1. **1 Hafta Ertele**: Otomatik 7 gün sonraya
2. **Tarihe Ertele**: İstediğiniz tarih ve saate
3. **Sonraki Slota Ertele**: Programdaki ilk boş güne

### Paket Yenileme
Paket tamamlandığında:
1. **"Yeni Paket Başlat"** butonuna tıklayın
2. Yeni gün ve saatleri seçin
3. **Yeni paket bugünkü tarihe göre başlar** (eski paketin bittiği tarihten değil)
4. Otomatik 8 yeni seans oluşturulur
5. Ödeme durumu "Bekliyor" olarak başlar

#### 📅 Yeni Paket Başlangıç Tarihi:
- **Bugün** ders günlerinden biriyse → Bugünden başlar
- **Bugün** ders günü değilse → Sonraki ders gününden başlar
- Örnek: Pazartesi-Çarşamba dersleri, bugün Salı ise → Çarşamba'dan başlar

---

## 👥 Grup Dersi Yönetimi

### Kategori Oluşturma

#### Yeni Kategori Ekle:
```
Kategori Adı: [Çocuklar]
Yaş Aralığı: [7-12]
Ders Günleri: [✓ Salı] [✓ Perşembe] [✓ Cumartesi]
Ders Saati: [17:00 - 18:00]
```

### Program Oluşturma

#### 4 Haftalık Otomatik Program:
1. Kategoriyi seçin
2. "Program" butonuna tıklayın
3. Başlangıç tarihini seçin
4. Sistem otomatik 4 haftalık program oluşturur

### Yoklama Yönetimi

#### Seans Yoklaması:
1. İlgili seansa tıklayın
2. Yoklama listesi açılır
3. Her üye için:
   - ✅ **Katılacak**: Yeşil
   - ❌ **Katılmayacak**: Kırmızı
   - ⚠️ **Paket Bitti**: Gri (devre dışı)

#### Toplu İşlemler:
- "Hepsini Katılacak" → Aktif paketli üyeleri ekle
- "Hepsini Katılmayacak" → Tüm üyeleri çıkar

### Üye Yönetimi

#### Üyeler Sekmesi:
```
👤 Ad Soyad     25 yaş • 0555...
💰 ₺800         [Ödendi]

Ders İlerlemesi: [████------] 4/12
40% tamamlandı  [Düzenle]
```

#### Paket Durumu:
- Yeşil bar: Katılınan dersler
- Gri bar: Kalan dersler
- Yüzde: Tamamlanma oranı

### Ödeme Takibi
- Yeşil rozet: Ödendi
- Kırmızı rozet: Bekliyor
- Tıklayarak durumu değiştirin

---

## 📅 Takvim Kullanımı

### Görünüm Modları

#### Üç farklı görünüm:
1. **Ay**: Aylık genel bakış
2. **Hafta**: Haftalık detaylı görünüm
3. **Gün**: Günlük saat bazlı görünüm

### Navigasyon
```
[◀ Önceki] [Bugün] [Sonraki ▶]     [Ay] [Hafta] [Gün]
```

### Renk Kodları
- 🟢 **Yeşil**: Özel dersler
- 🔵 **Mavi**: Grup dersleri
- ⬜ **Gri**: Geçmiş dersler

### Durum Göstergeleri
Sol taraftaki kalın çizgi:
- 🟢 Yeşil: Katılındı
- 🔴 Kırmızı: Katılınmadı
- 🟡 Sarı: Ertelendi
- ⬜ Gri: Bekliyor

### Etkinlik Detayları

#### Etkinliğe tıkladığınızda:
```
📋 Ders Detayları
─────────────────
Ad Soyad (Özel/Grup)
[Özel Ders] [Bekliyor]

Tarih: 20 Ocak 2025 Pazartesi
Saat: 18:00
Süre: 1 saat

[Katıldı] [Katılmadı] [Ertelendi]     [Kapat]
```

### Drag & Drop
- Dersleri sürükleyerek başka güne taşıyın
- Sadece gelecek dersler taşınabilir
- Otomatik saat ayarlaması yapılır

---

## 💡 İpuçları ve Püf Noktaları

### Hızlı İşlemler

#### Klavye Kısayolları:
- `Tab`: Sonraki alana geç
- `Enter`: Formu gönder
- `Esc`: Modal'ı kapat

### Veri Güvenliği
- Düzenli yedekleme yapın
- Önemli değişikliklerden önce kontrol edin
- Silme işlemlerinde dikkatli olun

### Performans İpuçları
- Filtreleme kullanarak arama yapın
- Gereksiz yenilemeleri önleyin
- Büyük veri setlerinde sayfalama kullanın

---

## 🔧 Sorun Giderme

### Sık Karşılaşılan Sorunlar

#### 1. Sayfa Yüklenmiyor
- İnternet bağlantınızı kontrol edin
- Backend server'ın çalıştığından emin olun
- Tarayıcı önbelleğini temizleyin (Ctrl+F5)

#### 2. Form Gönderilmiyor
- Zorunlu alanları kontrol edin
- Kırmızı hata mesajlarını okuyun
- Sayısal alanlara metin girmediğinizden emin olun

#### 3. Takvim Görünmüyor
- JavaScript'in etkin olduğundan emin olun
- Tarayıcınızı güncelleyin
- Farklı bir tarayıcı deneyin

#### 4. Veri Kayboldu
- Backend klasöründeki `dev.db` dosyasını kontrol edin
- Yedek dosyasından geri yükleyin
- Migration'ları yeniden çalıştırın

### Hata Mesajları

| Mesaj | Anlam | Çözüm |
|-------|-------|-------|
| "Eksik alan(lar) var" | Zorunlu alan boş | Tüm * işaretli alanları doldurun |
| "Bir hata oluştu" | Sunucu hatası | Backend'i yeniden başlatın |
| "Kategori bulunamadı" | Silinmiş kategori | Sayfayı yenileyin |
| "Maksimum 8 ders" | Limit aşımı | Paketi yenileyin |

---

## 📞 Destek ve İletişim

### Teknik Destek
- Sistem yöneticisiyle iletişime geçin
- Hata mesajlarının ekran görüntüsünü alın
- Konsol hatalarını not edin (F12 → Console)

### Özellik İstekleri
- Kullanım sırasında eksik gördüğünüz özellikleri bildirin
- İyileştirme önerilerinizi paylaşın

---

## 📝 Notlar

### Veri Yedekleme
Backend klasöründeki `dev.db` dosyasını düzenli olarak yedekleyin:
```bash
cp backend/prisma/dev.db backup/dev_$(date +%Y%m%d).db
```

### Güncelleme Kontrolü
Sistem güncellemelerini takip edin ve yeni özellikleri öğrenin.

### Eğitim
Yeni kullanıcılar için test ortamında pratik yapın.

---

## 🎓 Örnek Senaryolar

### Senaryo 1: Yeni Özel Ders Üyesi
1. Üye Kayıt → Özel Ders seç
2. Pazartesi 18:00, Çarşamba 18:00 gir
3. Kaydet → 8 seans otomatik oluşur
4. Takvimde dersleri gör

### Senaryo 2: Grup Dersi Yoklaması
1. Grup Dersleri → İlgili kategori
2. Bugünkü seansa tıkla
3. Yoklama listesini güncelle
4. Paket durumları otomatik güncellenir

### Senaryo 3: Ders Erteleme
1. Takvim → Ertelenecek ders
2. Derse tıkla → "Ertelendi" seç
3. Yeni tarih belirle
4. Telafi dersi otomatik oluşur

---

*Kullanım Kılavuzu v1.0 - Ocak 2025*

---

## 🚀 Hızlı Referans Kartı

### Özel Ders Akışı
```
Üye Kaydı → 8 Seans Planı → Ders Takibi → Paket Bitişi → Yenileme
```

### Grup Dersi Akışı
```
Kategori Oluştur → Program Planla → Üye Ekle → Yoklama Al → Paket Yenile
```

### Ödeme Takibi
```
Bekliyor (Kırmızı) → Ödeme Al → Ödendi (Yeşil) → Vade Takibi
```

---

**💡 İpucu**: Bu kılavuzu yanınızda bulundurun ve ihtiyaç duyduğunuzda hızlıca başvurun!
