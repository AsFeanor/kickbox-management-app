# 🔌 API Dokümantasyonu

## 📋 Genel Bilgiler

- **Base URL**: `http://localhost:3001/api`
- **Format**: JSON
- **Encoding**: UTF-8
- **Authentication**: Yok (v1.0)
- **CORS**: Tüm origin'lere açık

---

## 📚 API Endpoint'leri

### 1. Üye Yönetimi

#### 📍 `POST /api/members`
Yeni üye kaydı oluşturur.

**Request Body**:
```json
{
  "ad": "Ahmet",
  "soyad": "Yılmaz",
  "cinsiyet": "Erkek",
  "kayit_tarihi": "2025-01-15",
  "yas": 25,
  "kilo": 75,
  "telefon": "05551234567",
  "ders_turu": "Özel",
  "ucret": 1500,
  "not": "Sabah dersleri tercih ediyor",
  
  // Özel ders için (opsiyonel)
  "lesson_day_1": "Pazartesi",
  "lesson_start_time_1": "18:00",
  "lesson_end_time_1": "19:00",
  "lesson_day_2": "Çarşamba",
  "lesson_start_time_2": "18:00",
  "lesson_end_time_2": "19:00",
  
  // Grup dersi için (opsiyonel)
  "yas_grubu": "1",
  "packageStatus": "active",
  "attendedSessions": 3,
  "packageStartDate": "2025-01-01",
  "totalSessions": 8
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "ad": "Ahmet",
  "soyad": "Yılmaz",
  "cinsiyet": "Erkek",
  "kayit_tarihi": "2025-01-15T00:00:00.000Z",
  "yas": 25,
  "kilo": 75,
  "telefon": "05551234567",
  "ders_turu": "Özel",
  "ucret": 1500,
  "not": "Sabah dersleri tercih ediyor",
  "paid": false,
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

**Validation Rules**:
- Tüm zorunlu alanlar dolu olmalı
- `yas`, `kilo`, `ucret` sayısal değer olmalı
- `ders_turu` "Özel" veya "Grup" olmalı
- Grup dersi için `yas_grubu` zorunlu

---

#### 📍 `GET /api/members`
Tüm üyeleri listeler.

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "ad": "Ahmet",
    "soyad": "Yılmaz",
    "cinsiyet": "Erkek",
    "kayit_tarihi": "2025-01-15T00:00:00.000Z",
    "yas": 25,
    "kilo": 75,
    "telefon": "05551234567",
    "ders_turu": "Özel",
    "ucret": 1500,
    "not": "Sabah dersleri tercih ediyor",
    "paid": false,
    "privateLessonPackages": [
      {
        "id": 1,
        "lesson_day_1": "Pazartesi",
        "lesson_day_2": "Çarşamba",
        "lesson_start_time_1": "18:00",
        "lesson_end_time_1": "19:00",
        "lesson_start_time_2": "18:00",
        "lesson_end_time_2": "19:00",
        "paid": true,
        "is_completed": false,
        "sessions": [
          {
            "id": 1,
            "date": "2025-01-20T00:00:00.000Z",
            "start_time": "18:00",
            "end_time": "19:00",
            "is_postponed": false,
            "is_attended": false,
            "is_missed": false
          }
        ]
      }
    ]
  }
]
```

---

#### 📍 `PATCH /api/members/:id/payment`
Üye ödeme durumunu günceller.

**Request Body**:
```json
{
  "paid": true,
  "payment_due_date": "2025-02-15"
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "paid": true,
  "payment_due_date": "2025-02-15T00:00:00.000Z"
}
```

---

#### 📍 `PATCH /api/members/:id`
Üye bilgilerini günceller.

**URL Parameters**:
- `id` (integer): Üye ID'si

**Request Body**:
```json
{
  "ad": "Ahmet",
  "soyad": "Yılmaz",
  "cinsiyet": "Erkek",
  "yas": 26,
  "kilo": 78,
  "telefon": "05551234567",
  "ucret": 1600,
  "not": "Güncellenen not bilgisi"
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "ad": "Ahmet",
  "soyad": "Yılmaz",
  "cinsiyet": "Erkek",
  "kayit_tarihi": "2025-01-15T00:00:00.000Z",
  "yas": 26,
  "kilo": 78,
  "telefon": "05551234567",
  "ders_turu": "Özel",
  "ucret": 1600,
  "not": "Güncellenen not bilgisi",
  "privateLessonPackages": [
    {
      "id": 1,
      "lesson_day_1": "Pazartesi",
      "lesson_day_2": "Çarşamba",
      "lesson_start_time_1": "18:00",
      "lesson_end_time_1": "19:00",
      "lesson_start_time_2": "18:00",
      "lesson_end_time_2": "19:00",
      "paid": true,
      "is_completed": false,
      "sessions": []
    }
  ]
}
```

**Error Responses**:
- `400 Bad Request`: Eksik alan(lar) var
- `404 Not Found`: Üye bulunamadı
- `500 Internal Server Error`: Sunucu hatası

---

#### 📍 `DELETE /api/members/:id`
Üyeyi ve tüm ilişkili verilerini siler.

**URL Parameters**:
- `id` (integer): Üye ID'si

**Response** (200 OK):
```json
{
  "message": "Üye başarıyla silindi."
}
```

**Error Responses**:
- `404 Not Found`: Üye bulunamadı
- `500 Internal Server Error`: Sunucu hatası

**⚠️ Dikkat**: Bu işlem geri alınamaz ve aşağıdaki verileri siler:
- Üye bilgileri
- Özel ders paketleri
- Özel ders seansları
- Grup dersi katılımları

---

### 2. Özel Ders Yönetimi

#### 📍 `PATCH /api/private-sessions/:id`
Özel ders seansı durumunu günceller.

**Request Body Options**:

**Option 1 - Durum Güncelleme**:
```json
{
  "status": "attended"  // veya "missed"
}
```

**Option 2 - Erteleme (1 Hafta)**:
```json
{
  "action": "postpone_1_week"
}
```

**Option 3 - Yeniden Planlama**:
```json
{
  "action": "reschedule",
  "new_date": "2025-01-25",
  "new_time": "19:00",
  "new_end_time": "20:00"
}
```

**Option 4 - Sonraki Uygun Slota Erteleme**:
```json
{
  "action": "postpone_to_next_slot"
}
```

**Response** (200 OK):
```json
{
  "updated": {
    "id": 1,
    "is_postponed": true,
    "postponed_to_session_id": 9
  },
  "newSession": {
    "id": 9,
    "date": "2025-01-27T00:00:00.000Z",
    "start_time": "18:00",
    "end_time": "19:00"
  }
}
```

---

#### 📍 `PATCH /api/private-lesson-packages/:id`
Özel ders paketi ödeme durumunu günceller.

**Request Body**:
```json
{
  "paid": true
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "paid": true
}
```

---

#### 📍 `POST /api/private-lesson-packages/:id/renew`
Özel ders paketini yeniler (yeni 8 seanslık paket).

**Request Body**:
```json
{
  "lesson_day_1": "Salı",
  "lesson_time_1": "19:00-20:00",
  "lesson_day_2": "Perşembe",
  "lesson_time_2": "19:00-20:00"
}
```

**Response** (201 Created):
```json
{
  "id": 2,
  "memberId": 1,
  "lesson_day_1": "Salı",
  "lesson_day_2": "Perşembe",
  "lesson_start_time_1": "19:00",
  "lesson_end_time_1": "20:00",
  "lesson_start_time_2": "19:00",
  "lesson_end_time_2": "20:00",
  "paid": false,
  "is_completed": false,
  "sessions": [...]
}
```

**Business Logic**:
- Eski paket `is_completed = true` olarak işaretlenir
- Yeni paket `paid = false` olarak başlar
- **Yeni paket bugünkü tarihe göre başlar** (eski paketin son dersinden değil)
- Otomatik 8 seans oluşturulur
- İlk ders günü bugün veya bugünden sonraki ilk uygun gün olur

---

### 3. Grup Dersi Yönetimi

#### 📍 `GET /api/group-categories`
Tüm grup dersi kategorilerini listeler.

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "name": "Çocuklar",
    "minAge": 7,
    "maxAge": 12,
    "days": ["Salı", "Perşembe", "Cumartesi"],
    "startTime": "17:00",
    "endTime": "18:00",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]
```

---

#### 📍 `POST /api/group-categories`
Yeni grup dersi kategorisi oluşturur.

**Request Body**:
```json
{
  "name": "Gençler",
  "minAge": 13,
  "maxAge": 18,
  "days": ["Pazartesi", "Çarşamba", "Cuma"],
  "startTime": "18:30",
  "endTime": "20:00"
}
```

**Response** (201 Created):
```json
{
  "id": 2,
  "name": "Gençler",
  "minAge": 13,
  "maxAge": 18,
  "days": ["Pazartesi", "Çarşamba", "Cuma"],
  "startTime": "18:30",
  "endTime": "20:00",
  "createdAt": "2025-01-15T10:00:00.000Z"
}
```

---

#### 📍 `PUT /api/group-categories/:id`
Grup dersi kategorisini günceller.

**Request Body**:
```json
{
  "name": "Gençler (Güncellendi)",
  "minAge": 13,
  "maxAge": 19,
  "days": ["Pazartesi", "Çarşamba", "Cuma"],
  "startTime": "19:00",
  "endTime": "20:30"
}
```

---

#### 📍 `DELETE /api/group-categories/:id`
Grup dersi kategorisini siler.

**Response** (200 OK):
```json
{
  "message": "Kategori ve ilgili seanslar başarıyla silindi."
}
```

**Note**: İlişkili tüm seanslar da silinir.

---

#### 📍 `POST /api/group-categories/:id/schedule`
4 haftalık ders programı oluşturur.

**Request Body**:
```json
{
  "startDate": "2025-01-20"
}
```

**Response** (200 OK):
```json
{
  "message": "12 seans oluşturuldu ve 15 üye otomatik katıldı olarak işaretlendi.",
  "sessionsCreated": 12,
  "membersAdded": 15
}
```

**Business Logic**:
- Başlangıç tarihinden itibaren 4 hafta
- Kategori günlerine göre otomatik seans oluşturma
- Kategorideki tüm üyeler otomatik eklenir

---

#### 📍 `GET /api/group-categories/:id/sessions`
Kategorinin gelecek seanslarını listeler.

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "categoryId": 1,
    "date": "2025-01-20T17:00:00.000Z",
    "attendees": [
      {
        "id": 5,
        "ad": "Ali",
        "soyad": "Veli",
        "yas": 10,
        "telefon": "05551234567"
      }
    ]
  }
]
```

---

#### 📍 `GET /api/group-categories/:id/members`
Kategoriye kayıtlı üyeleri listeler.

**Response** (200 OK):
```json
[
  {
    "id": 5,
    "ad": "Ali",
    "soyad": "Veli",
    "yas": 10,
    "telefon": "05551234567",
    "kayit_tarihi": "2025-01-01T00:00:00.000Z",
    "ucret": 800,
    "paid": true,
    "payment_due_date": "2025-02-01T00:00:00.000Z",
    "current_package_start_date": "2025-01-01T00:00:00.000Z",
    "current_package_total_sessions": 12,
    "current_package_attended_sessions": 3,
    "package_is_active": true
  }
]
```

---

#### 📍 `POST /api/group-sessions/:sessionId/attendance`
Grup dersi yoklaması günceller.

**Request Body**:
```json
{
  "memberId": 5,
  "present": true
}
```

**Response** (200 OK):
```json
{
  "message": "Yoklama güncellendi."
}
```

---

### 4. Paket Yönetimi

#### 📍 `POST /api/members/:id/start-group-package`
Üye için yeni grup dersi paketi başlatır.

**Response** (200 OK):
```json
{
  "message": "Yeni paket başlatıldı.",
  "member": {
    "id": 5,
    "current_package_start_date": "2025-01-15T00:00:00.000Z",
    "current_package_total_sessions": 12,
    "current_package_attended_sessions": 0,
    "package_is_active": true,
    "paid": false
  },
  "packageInfo": {
    "totalSessions": 12,
    "daysPerWeek": 3,
    "weeksTotal": 4
  }
}
```

---

#### 📍 `POST /api/members/:id/update-attendance`
Üyenin katılım sayısını günceller.

**Request Body**:
```json
{
  "increment": true
}
```

**Response** (200 OK):
```json
{
  "message": "Paket durumu güncellendi",
  "attendedSessions": 4
}
```

---

#### 📍 `PATCH /api/members/:id/update-package`
Üyenin paket bilgilerini manuel günceller.

**Request Body**:
```json
{
  "attended_sessions": 5,
  "package_start_date": "2025-01-01",
  "package_is_active": true
}
```

---

### 5. Takvim

#### 📍 `GET /api/calendar-events`
Tüm takvim etkinliklerini getirir.

**Response** (200 OK):
```json
[
  {
    "id": "private-1",
    "title": "Ahmet Yılmaz (Özel)",
    "start": "2025-01-20T18:00:00.000Z",
    "end": "2025-01-20T19:00:00.000Z",
    "extendedProps": {
      "type": "private",
      "status": "pending",
      "sessionId": 1,
      "memberId": 1
    }
  },
  {
    "id": "group-1",
    "title": "Çocuklar (Grup)",
    "start": "2025-01-20T17:00:00.000Z",
    "end": "2025-01-20T18:00:00.000Z",
    "extendedProps": {
      "type": "group",
      "status": "pending",
      "sessionId": 1,
      "categoryId": 1,
      "attendeesCount": 12
    }
  }
]
```

---

#### 📍 `PATCH /api/sessions/:id`
Takvim üzerinden seans güncelleme.

**Request Body - Yeniden Planlama**:
```json
{
  "action": "reschedule",
  "new_date": "2025-01-25",
  "new_time": "19:00"
}
```

**Request Body - Durum Güncelleme**:
```json
{
  "action": "update_status",
  "status": "attended"
}
```

---

### 6. Yardımcı Endpoint'ler

#### 📍 `POST /api/update-completed-packages`
Tamamlanmış paketleri otomatik işaretler.

**Response** (200 OK):
```json
{
  "message": "3 paket güncellendi"
}
```

---

#### 📍 `POST /api/group-sessions/mark-all-past-attended`
Geçmiş tüm grup derslerini katıldı olarak işaretler.

**Response** (200 OK):
```json
{
  "message": "Geçmiş tüm seanslar için katılım durumu güncellendi",
  "updatedSessions": 45
}
```

---

#### 📍 `POST /api/group-categories/:id/add-members-to-sessions`
Kategorideki tüm üyeleri tüm seanslara ekler.

**Response** (200 OK):
```json
{
  "message": "8 seans güncellendi, 12 üye eklendi.",
  "sessionsUpdated": 8,
  "membersAdded": 12,
  "totalSessions": 8
}
```

---

#### 📍 `POST /api/group-members/fix-packages`
Grup üyelerinin paket bilgilerini düzeltir.

**Response** (200 OK):
```json
{
  "message": "5 üyenin paket bilgisi düzeltildi",
  "fixedCount": 5,
  "totalMembers": 20
}
```

---

## 🔒 Error Responses

### 400 Bad Request
```json
{
  "error": "Eksik alan(lar) var."
}
```

### 404 Not Found
```json
{
  "error": "Package not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Bir hata oluştu."
}
```

---

## 📊 HTTP Status Kodları

| Kod | Durum | Açıklama |
|-----|-------|----------|
| 200 | OK | İşlem başarılı |
| 201 | Created | Kayıt oluşturuldu |
| 400 | Bad Request | Geçersiz istek |
| 404 | Not Found | Kayıt bulunamadı |
| 500 | Internal Server Error | Sunucu hatası |

---

## 🔄 Request/Response Headers

### Request Headers
```
Content-Type: application/json
Accept: application/json
```

### Response Headers
```
Content-Type: application/json; charset=utf-8
Access-Control-Allow-Origin: *
```

---

## 📝 Notlar

1. **CORS**: Tüm origin'lere açık (development mode)
2. **Authentication**: Henüz implementasyonu yok
3. **Rate Limiting**: Henüz implementasyonu yok
4. **Pagination**: Client-side pagination kullanılıyor
5. **Validation**: Basic validation, detaylı hata mesajları yok

---

## 🚀 Örnek API Çağrıları (Axios)

### Yeni Üye Ekleme
```javascript
const response = await axios.post('/api/members', {
  ad: 'Mehmet',
  soyad: 'Demir',
  cinsiyet: 'Erkek',
  kayit_tarihi: '2025-01-15',
  yas: 28,
  kilo: 80,
  telefon: '05559876543',
  ders_turu: 'Özel',
  ucret: 1500
})
```

### Grup Dersi Yoklama
```javascript
await axios.post(`/api/group-sessions/${sessionId}/attendance`, {
  memberId: memberId,
  present: true
})
```

### Takvim Etkinlikleri
```javascript
const events = await axios.get('/api/calendar-events')
```

---

*API Dokümantasyonu v1.0 - Ocak 2025*
