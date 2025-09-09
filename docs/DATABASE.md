# 💾 Veritabanı Şeması ve Dokümantasyonu

## 📊 Veritabanı Genel Bilgileri

- **Veritabanı Tipi**: SQLite
- **ORM**: Prisma
- **Dosya Konumu**: `backend/prisma/dev.db`
- **Schema Dosyası**: `backend/prisma/schema.prisma`

---

## 🗂️ Veri Modelleri

### 1. Member (Üye)

Sistemdeki tüm üyelerin bilgilerini tutar.

```prisma
model Member {
  id           Int      @id @default(autoincrement())
  ad           String
  soyad        String
  cinsiyet     String
  kayit_tarihi DateTime
  yas          Int
  kilo         Int
  telefon      String
  ders_turu    String
  ucret        Int
  not          String?
  yas_grubu    String?
  paid         Boolean  @default(false)
  payment_due_date     DateTime?
  last_payment_reminder DateTime?
  current_package_start_date DateTime?
  current_package_total_sessions Int?
  current_package_attended_sessions Int @default(0)
  package_is_active Boolean @default(false)
  createdAt    DateTime @default(now())
  privateLessonPackages PrivateLessonPackage[]
  groupSessions GroupSession[] @relation("GroupAttendance")
}
```

#### Alan Açıklamaları

| Alan | Tip | Açıklama | Zorunlu | Notlar |
|------|-----|----------|---------|--------|
| **id** | Int | Benzersiz üye kimliği | ✅ | Otomatik artan |
| **ad** | String | Üyenin adı | ✅ | - |
| **soyad** | String | Üyenin soyadı | ✅ | - |
| **cinsiyet** | String | Cinsiyet bilgisi | ✅ | "Kadın", "Erkek", "Diğer" |
| **kayit_tarihi** | DateTime | Üyelik başlangıç tarihi | ✅ | - |
| **yas** | Int | Üyenin yaşı | ✅ | Grup kategorisi için önemli |
| **kilo** | Int | Üyenin kilosu (kg) | ✅ | - |
| **telefon** | String | İletişim numarası | ✅ | - |
| **ders_turu** | String | Ders tipi | ✅ | "Özel" veya "Grup" |
| **ucret** | Int | Aylık/paket ücreti (TL) | ✅ | - |
| **not** | String? | Ek notlar | ❌ | Opsiyonel |
| **yas_grubu** | String? | Grup kategorisi ID'si | ❌ | Sadece grup dersi için |
| **paid** | Boolean | Ödeme durumu | ✅ | Default: false |
| **payment_due_date** | DateTime? | Ödeme vadesi | ❌ | - |
| **last_payment_reminder** | DateTime? | Son hatırlatma tarihi | ❌ | - |
| **current_package_start_date** | DateTime? | Aktif paket başlangıcı | ❌ | Grup dersi için |
| **current_package_total_sessions** | Int? | Paketteki toplam ders | ❌ | Genelde 8 veya 12 |
| **current_package_attended_sessions** | Int | Katılınan ders sayısı | ✅ | Default: 0 |
| **package_is_active** | Boolean | Paket aktiflik durumu | ✅ | Default: false |
| **createdAt** | DateTime | Kayıt oluşturma zamanı | ✅ | Otomatik |

---

### 2. PrivateLessonPackage (Özel Ders Paketi)

8 seanslık özel ders paketlerini yönetir.

```prisma
model PrivateLessonPackage {
  id                   Int      @id @default(autoincrement())
  member               Member   @relation(fields: [memberId], references: [id])
  memberId             Int
  createdAt            DateTime @default(now())
  lesson_day_1         String?
  lesson_day_2         String?
  lesson_start_time_1  String?
  lesson_end_time_1    String?
  lesson_start_time_2  String?
  lesson_end_time_2    String?
  sessions             PrivateLessonSession[]
  paid                 Boolean  @default(false)
  is_completed         Boolean  @default(false)
}
```

#### Alan Açıklamaları

| Alan | Tip | Açıklama | Notlar |
|------|-----|----------|--------|
| **id** | Int | Paket kimliği | Otomatik |
| **memberId** | Int | Üye referansı | Foreign key |
| **lesson_day_1** | String? | İlk ders günü | "Pazartesi", "Salı", vb. |
| **lesson_day_2** | String? | İkinci ders günü | Haftada 2 gün |
| **lesson_start_time_1** | String? | 1. gün başlangıç | "18:00" formatında |
| **lesson_end_time_1** | String? | 1. gün bitiş | "19:00" formatında |
| **lesson_start_time_2** | String? | 2. gün başlangıç | Saat formatı |
| **lesson_end_time_2** | String? | 2. gün bitiş | Saat formatı |
| **paid** | Boolean | Ödeme durumu | Default: false |
| **is_completed** | Boolean | Tamamlanma durumu | 8 ders bitince true |

---

### 3. PrivateLessonSession (Özel Ders Seansı)

Her bir özel ders seansının detayları.

```prisma
model PrivateLessonSession {
  id         Int      @id @default(autoincrement())
  package    PrivateLessonPackage @relation(fields: [packageId], references: [id])
  packageId  Int
  date       DateTime
  start_time String
  end_time   String
  is_postponed Boolean @default(false)
  postponed_to_session_id Int?
  postponedTo PrivateLessonSession? @relation("PostponedTo", fields: [postponed_to_session_id], references: [id])
  postponedFrom PrivateLessonSession[] @relation("PostponedTo")
  is_attended Boolean @default(false)
  is_missed   Boolean @default(false)
}
```

#### Alan Açıklamaları

| Alan | Tip | Açıklama | Notlar |
|------|-----|----------|--------|
| **id** | Int | Seans kimliği | Otomatik |
| **packageId** | Int | Paket referansı | Foreign key |
| **date** | DateTime | Ders tarihi | - |
| **start_time** | String | Başlangıç saati | "18:00" formatı |
| **end_time** | String | Bitiş saati | "19:00" formatı |
| **is_postponed** | Boolean | Ertelendi mi? | Default: false |
| **postponed_to_session_id** | Int? | Telafi dersi ID | Self-relation |
| **is_attended** | Boolean | Katıldı mı? | Default: false |
| **is_missed** | Boolean | Katılmadı mı? | Default: false |

#### Seans Durumları
- **Bekliyor**: `is_attended=false, is_missed=false, is_postponed=false`
- **Katıldı**: `is_attended=true`
- **Katılmadı**: `is_missed=true`
- **Ertelendi**: `is_postponed=true`

---

### 4. GroupCategory (Grup Dersi Kategorisi)

Yaş gruplarına göre ders kategorileri.

```prisma
model GroupCategory {
  id         Int             @id @default(autoincrement())
  name       String
  minAge     Int?
  maxAge     Int?
  days       String
  startTime  String
  endTime    String
  createdAt  DateTime        @default(now())
  sessions   GroupSession[]
}
```

#### Alan Açıklamaları

| Alan | Tip | Açıklama | Örnek |
|------|-----|----------|-------|
| **id** | Int | Kategori kimliği | 1 |
| **name** | String | Kategori adı | "Çocuklar", "Gençler" |
| **minAge** | Int? | Minimum yaş | 7 |
| **maxAge** | Int? | Maximum yaş | 12 |
| **days** | String | Ders günleri (JSON) | '["Salı", "Perşembe"]' |
| **startTime** | String | Ders başlangıç saati | "18:00" |
| **endTime** | String | Ders bitiş saati | "19:30" |

---

### 5. GroupSession (Grup Dersi Seansı)

Grup derslerinin her bir seansı.

```prisma
model GroupSession {
  id           Int           @id @default(autoincrement())
  categoryId   Int
  category     GroupCategory @relation(fields: [categoryId], references: [id])
  date         DateTime
  createdAt    DateTime      @default(now())
  attendees    Member[]      @relation("GroupAttendance")
}
```

#### Alan Açıklamaları

| Alan | Tip | Açıklama | Notlar |
|------|-----|----------|--------|
| **id** | Int | Seans kimliği | Otomatik |
| **categoryId** | Int | Kategori referansı | Foreign key |
| **date** | DateTime | Seans tarihi ve saati | - |
| **attendees** | Member[] | Katılımcı listesi | Many-to-many relation |

---

## 🔗 İlişkiler (Relations)

### 1. Member ↔ PrivateLessonPackage
- **Tip**: One-to-Many
- **Açıklama**: Bir üye birden fazla özel ders paketine sahip olabilir
- **Kullanım**: Paket yenileme durumunda yeni paket oluşturulur

### 2. PrivateLessonPackage ↔ PrivateLessonSession
- **Tip**: One-to-Many
- **Açıklama**: Her paket 8 (veya daha fazla telafi) seansa sahiptir
- **Kullanım**: Paket oluşturulduğunda otomatik 8 seans oluşturulur

### 3. PrivateLessonSession ↔ PrivateLessonSession (Self)
- **Tip**: One-to-One (Self-relation)
- **Açıklama**: Ertelenen ders ile telafi dersi ilişkisi
- **Kullanım**: `postponed_to_session_id` ile telafi dersi referansı

### 4. GroupCategory ↔ GroupSession
- **Tip**: One-to-Many
- **Açıklama**: Her kategori birden fazla seansa sahiptir
- **Kullanım**: 4 haftalık program oluşturulur

### 5. Member ↔ GroupSession
- **Tip**: Many-to-Many
- **Açıklama**: Üyeler birden fazla seansa, seanslar birden fazla üyeye sahip
- **Kullanım**: Yoklama takibi için

---

## 🔄 Migration Geçmişi

Sistemde yapılan veritabanı değişiklikleri:

1. **init_member**: İlk üye tablosu
2. **make_not_optional**: Zorunlu alanlar
3. **add_private_lesson_models**: Özel ders sistemi
4. **add_lesson_fields_to_package**: Ders gün/saat bilgileri
5. **support_postponed_lessons**: Erteleme sistemi
6. **add_attended_missed_to_session**: Katılım durumu
7. **add_paid_to_private_lesson_package**: Ödeme takibi
8. **add_is_completed_to_package**: Paket tamamlama
9. **add_group_lessons**: Grup dersi sistemi
10. **add_payment_fields_to_member**: Üye ödeme detayları
11. **add_group_package_system**: Grup paketi yönetimi

---

## 🎯 Veritabanı Kuralları ve Kısıtlamalar

### İş Kuralları
1. **Özel Ders Paketi**: Her paket 8 seanstan oluşur
2. **Paket Tamamlama**: 8 seans (katıldı/katılmadı) tamamlanınca paket kapanır
3. **Erteleme**: Ertelenen ders yerine yeni telafi dersi oluşturulur
4. **Grup Dersi Paketi**: 4 hafta × haftalık ders sayısı
5. **Yoklama**: Sadece paketi aktif üyeler derse katılabilir

### Veri Bütünlüğü
- Foreign key constraints ile referans bütünlüğü
- Boolean flag'ler ile durum yönetimi
- Tarih alanları ile zaman takibi
- Optional field'lar ile esneklik

---

## 🔍 Örnek Sorgular

### Aktif özel ders paketleri
```sql
SELECT * FROM PrivateLessonPackage 
WHERE paid = true AND is_completed = false;
```

### Bugünkü grup dersleri
```sql
SELECT * FROM GroupSession 
WHERE DATE(date) = DATE('now');
```

### Ödeme bekleyen üyeler
```sql
SELECT * FROM Member 
WHERE paid = false AND ders_turu = 'Grup';
```

### Tamamlanmış özel ders oranı
```sql
SELECT 
  COUNT(CASE WHEN is_attended = true THEN 1 END) as attended,
  COUNT(CASE WHEN is_missed = true THEN 1 END) as missed,
  COUNT(*) as total
FROM PrivateLessonSession
WHERE packageId = ?;
```

---

## 🚀 Performans İpuçları

1. **Index Kullanımı**: Primary key'ler otomatik indexed
2. **Eager Loading**: Prisma `include` ile ilişkili verileri tek sorguda çek
3. **Batch Operations**: `createMany`, `updateMany` kullan
4. **Query Optimization**: Gereksiz field'ları `select` ile filtele

---

*Veritabanı dokümantasyonu v1.0 - Ocak 2025*
