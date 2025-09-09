# 📋 İş Kuralları ve Mantığı

## 🎯 Genel İş Kuralları

### 1. Üyelik Sistemi

#### Üye Kayıt Kuralları
- ✅ Tüm zorunlu alanlar doldurulmalı
- ✅ Yaş bilgisi grup kategorisi seçimi için kritik
- ✅ Telefon numarası benzersiz olmalı (önerilir)
- ✅ Ders türü seçimi (Özel/Grup) geri değiştirilemez

#### Üye Güncelleme Kuralları
- ✅ **Düzenlenebilir**: Ad, Soyad, Yaş, Kilo, Cinsiyet, Telefon, Ücret, Not
- ❌ **Düzenlenemez**: Ders türü, Kayıt tarihi, Yaş grubu
- ⚠️ **Validation**: Tüm zorunlu alanlar kontrol edilir
- 🔄 **Güncelleme**: Değişiklikler anında uygulanır

#### Üye Silme Kuralları
- ⚠️ **Onay Gerekli**: Kullanıcı onayı olmadan silme yapılmaz
- 🗑️ **Cascade Delete**: Tüm ilişkili veriler silinir
  - Özel ders paketleri
  - Özel ders seansları
  - Grup dersi katılımları (many-to-many bağlantılar)
- ❌ **Geri Alınamaz**: Silme işlemi kalıcıdır

#### Üye Tipleri
1. **Özel Ders Üyesi**
   - 8 seanslık paketler halinde çalışır
   - Haftada 2 gün, sabit saatlerde
   - Paket bazlı ödeme

2. **Grup Dersi Üyesi**
   - Yaş grubuna göre kategorilere ayrılır
   - 4 haftalık paketler (haftalık ders sayısı × 4)
   - Aylık ödeme sistemi

---

## 💼 Özel Ders İş Kuralları

### Paket Sistemi

#### Paket Oluşturma
```
1. Üye kaydı sırasında ilk paket otomatik oluşturulur
2. 8 seans otomatik planlanır (haftada 2 gün)
3. Alternatif günlerde ders programı oluşturulur
4. Örnek: Pazartesi-Çarşamba veya Salı-Perşembe
```

#### Paket Yaşam Döngüsü
```mermaid
Yeni Paket → Aktif → Tamamlanıyor → Tamamlandı → Yenileme
     ↓          ↓           ↓            ↓           ↓
  paid=false  8 seans    6-7 seans    8 seans    Yeni paket
              başladı    tamamlandı   tamamlandı   oluştur
```

#### Seans Durumları
| Durum | Açıklama | Sonuç |
|-------|----------|-------|
| **Bekliyor** | Henüz gerçekleşmemiş | - |
| **Katıldı** | Öğrenci derse katıldı | Seans tamamlandı |
| **Katılmadı** | Öğrenci gelmedi | Seans tamamlandı, hak yandı |
| **Ertelendi** | Ders ileri tarihe alındı | Telafi dersi oluşturuldu |

### Paket Yenileme Kuralları

#### Yeni Paket Başlatma
```
1. Eski paket "is_completed = true" olarak işaretlenir
2. Yeni paket "paid = false" olarak oluşturulur
3. Başlangıç tarihi: BUGÜNKÜ TARİH (eski paketin son dersinden değil)
4. 8 yeni seans otomatik oluşturulur
```

#### Başlangıç Tarihi Hesaplama
```javascript
// Bugünden itibaren ilk uygun ders günü
if (bugün == ders_günü_1 || bugün == ders_günü_2) {
  başlangıç = bugün
} else {
  başlangıç = sonraki_ders_günü
}
```

#### Örnek Senaryolar
- **Pazartesi-Çarşamba dersleri**:
  - Bugün Pazartesi → Pazartesi'den başlar
  - Bugün Salı → Çarşamba'dan başlar  
  - Bugün Perşembe → Pazartesi'den başlar

### Erteleme Kuralları

#### Erteleme Seçenekleri
1. **1 Hafta Erteleme**: Mevcut dersi 7 gün sonraya ertele
2. **Belirli Tarihe Erteleme**: İstediği tarih ve saate ertele
3. **Sonraki Uygun Slot**: Programdaki bir sonraki boş güne ertele

#### Erteleme İş Akışı
```
1. Orijinal seans "is_postponed = true" olarak işaretlenir
2. Yeni telafi seansı oluşturulur
3. Orijinal seans telafi seansına referans verir
4. Telafi seansı normal seans gibi işlem görür
```

#### Erteleme Limitleri
- ❌ Tamamlanmış paketler ertelenemez
- ❌ Zaten ertelenmiş dersler tekrar ertelenemez
- ✅ Ertelenen ders daha sonra "katıldı" işaretlenebilir

### Paket Tamamlama Kuralları

#### Otomatik Tamamlama
```javascript
if (katıldı_sayısı + katılmadı_sayısı >= 8) {
  paket.is_completed = true
}
```

#### Manuel Müdahale
- Ertelenen ama katılım sağlanan dersler
- Telafi dersleri silinir
- Paket durumu güncellenir

### Paket Yenileme

#### Yenileme Şartları
1. Mevcut paket tamamlanmış olmalı
2. Yeni gün/saat seçilebilir
3. Eski paketin son dersinden sonra başlar

#### Yenileme Süreci
```
1. Eski paket: is_completed = true
2. Yeni paket oluştur: paid = false
3. Yeni 8 seans planla
4. Başlangıç: Eski paketin bitişinden sonraki ilk uygun gün
```

---

## 👥 Grup Dersi İş Kuralları

### Kategori Yönetimi

#### Kategori Tanımlama
```
- İsim: "Çocuklar", "Gençler", "Yetişkinler"
- Yaş Aralığı: min_age - max_age
- Ders Günleri: ["Salı", "Perşembe", "Cumartesi"]
- Ders Saatleri: 18:00 - 19:30
```

#### Yaş Grubu Eşleştirme
```javascript
if (üye.yaş >= kategori.min_age && üye.yaş <= kategori.max_age) {
  // Üye bu kategoriye uygun
}
```

### Paket Sistemi

#### Paket Hesaplama
```
Toplam Ders = Haftalık Ders Sayısı × 4 Hafta

Örnek:
- Haftada 3 gün = 12 ders/ay
- Haftada 2 gün = 8 ders/ay
```

#### Paket Durumları
| Alan | Açıklama |
|------|----------|
| `package_is_active` | Paket aktif mi? |
| `current_package_start_date` | Başlangıç tarihi |
| `current_package_total_sessions` | Toplam ders hakkı |
| `current_package_attended_sessions` | Katılınan ders sayısı |

#### Kalan Ders Hesabı
```javascript
kalan_ders = total_sessions - attended_sessions
if (kalan_ders <= 0) {
  // Paket bitmiş, yenilenmeli
}
```

### Yoklama Sistemi

#### Yoklama Kuralları
1. ✅ Sadece paketi aktif üyeler derse katılabilir
2. ✅ Paket bitmiş üyeler yoklamaya alınmaz
3. ✅ Geçmiş dersler otomatik "katıldı" sayılır
4. ✅ Gelecek dersler için ön yoklama yapılabilir

#### Toplu Yoklama
```
"Hepsini Katılacak" → Sadece paketi aktif üyeler eklenir
"Hepsini Katılmayacak" → Tüm üyeler çıkarılır
```

#### Yoklama Uyarıları
- 🔴 Paketi bitmiş üye → "Paket Bitti" uyarısı
- 🟡 Son 1-2 ders kalmış → "Az ders kaldı" uyarısı
- 🟢 Yeterli ders var → Normal yoklama

### Program Oluşturma

#### 4 Haftalık Program
```
1. Başlangıç tarihi seçilir
2. Kategori günlerine göre 28 gün taranır
3. Her uygun gün için seans oluşturulur
4. Kategorideki tüm üyeler otomatik eklenir
```

#### Otomatik Üye Ekleme
```javascript
// Program oluşturulduğunda
for (her_seans) {
  for (kategorideki_üyeler) {
    seans.attendees.add(üye)
  }
}
```

---

## 💰 Ödeme İş Kuralları

### Ödeme Takibi

#### Özel Ders Ödemeleri
- Paket bazlı ödeme
- Her paket için ayrı ödeme durumu
- `package.paid = true/false`

#### Grup Dersi Ödemeleri
- Aylık ödeme sistemi
- Üye bazlı takip
- `member.paid = true/false`
- `member.payment_due_date` ile vade takibi

### Ödeme Hatırlatma
```
if (ödeme_vadesi_geçti && !paid) {
  // Hatırlatma gönder
  member.last_payment_reminder = bugün
}
```

### Ödeme Durumu Etkileri
- ❌ Ödenmemiş paketler takvimde farklı gösterilir
- ⚠️ Ödeme bekleyen üyeler listede işaretlenir
- ✅ Ödemesi tam üyeler normal görünür

---

## 📅 Takvim İş Kuralları

### Renk Kodlaması

#### Ders Türüne Göre
- 🟢 **Yeşil**: Özel dersler
- 🔵 **Mavi**: Grup dersleri

#### Duruma Göre
- ✅ **Kalın Sol Çizgi - Yeşil**: Katılındı
- ❌ **Kalın Sol Çizgi - Kırmızı**: Katılınmadı
- 🟡 **Kalın Sol Çizgi - Sarı**: Ertelendi
- ⬜ **Kalın Sol Çizgi - Gri**: Bekliyor

### Drag & Drop Kuralları
1. Sadece gelecek dersler taşınabilir
2. Geçmiş dersler değiştirilemez
3. Taşıma = Yeniden planlama

### Takvim Görünümleri
- **Aylık**: Genel bakış
- **Haftalık**: Detaylı program
- **Günlük**: Saat bazlı detay

---

## 🔄 Otomatik İşlemler

### Paket Tamamlama Kontrolü
```javascript
// Her seans güncellenmesinde
function checkPackageCompletion(package) {
  const completedSessions = sessions.filter(
    s => (s.is_attended || s.is_missed) && !s.is_postponed
  )
  if (completedSessions.length >= 8) {
    package.is_completed = true
  }
}
```

### Geçmiş Ders İşaretleme
```javascript
// Grup dersleri için
if (seans.date < bugün) {
  // Otomatik katıldı say
  seans.status = 'attended'
}
```

### Paket Bilgisi Düzeltme
```javascript
// Eksik paket bilgileri için
if (!member.current_package_total_sessions) {
  member.current_package_total_sessions = 
    kategori.days.length * 4 // hafta
}
```

---

## ⚠️ Kritik Kısıtlamalar

### Sistem Limitleri
1. **Maksimum 8 tamamlanmış ders**: Özel ders paketinde
2. **Maksimum 4 hafta**: Grup dersi programı
3. **Tek erteleme**: Bir ders sadece 1 kez ertelenebilir

### Veri Bütünlüğü
1. **Cascade Delete**: Kategori silinince seanslar da silinir
2. **Referans Kontrolü**: Telafi dersi referansları korunur
3. **Durum Tutarlılığı**: Bir seans aynı anda hem katıldı hem katılmadı olamaz

### İş Mantığı Öncelikleri
```
1. Öncelik: Veri tutarlılığı
2. Öncelik: Kullanıcı deneyimi
3. Öncelik: Performans
```

---

## 📈 Raporlama Kuralları

### Katılım Oranı
```javascript
katılım_oranı = (katıldı_sayısı / toplam_ders) * 100
```

### Gelir Hesabı
```javascript
// Özel ders
gelir = ödenen_paket_sayısı * paket_ücreti

// Grup dersi
gelir = ödeyen_üye_sayısı * aylık_ücret
```

### Doluluk Oranı
```javascript
// Grup dersleri için
doluluk = (katılan_üye_sayısı / toplam_üye_sayısı) * 100
```

---

## 🚨 Hata Yönetimi

### Validasyon Hataları
- Eksik alan kontrolü
- Tip kontrolü (sayısal/metin)
- Format kontrolü (tarih/saat)

### İş Mantığı Hataları
- Limit aşımı (8 ders limiti)
- Çakışma kontrolü
- Yetki kontrolü

### Sistem Hataları
- Veritabanı bağlantı hataları
- Ağ hataları
- Beklenmeyen hatalar

---

## 🔮 Gelecek Geliştirmeler

### Planlanan İyileştirmeler
1. **Otomatik SMS/Email**: Ders hatırlatmaları
2. **Çakışma Kontrolü**: Aynı saatte birden fazla ders engelleme
3. **Kapasite Yönetimi**: Grup derslerinde maksimum kişi sayısı
4. **İptal Politikası**: 24 saat önceden iptal kuralı
5. **Ceza Sistemi**: Habersiz gelmeyen için ceza
6. **Telafi Hakkı**: Aylık maksimum telafi sayısı

---

*İş Kuralları Dokümantasyonu v1.0 - Ocak 2025*
