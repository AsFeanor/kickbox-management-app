# 🏗️ Sistem Mimarisi

## 📐 Genel Mimari

```
┌─────────────────────────────────────────────────────────────┐
│                     Kullanıcı Arayüzü                       │
│                  Vue 3 + TailwindCSS (SPA)                  │
│                    http://localhost:5173                     │
└──────────────────────────┬──────────────────────────────────┘
                          │
                    HTTP/REST API
                          │
┌──────────────────────────┴──────────────────────────────────┐
│                      Backend API Server                      │
│                   Express.js + Node.js                       │
│                    http://localhost:3001                     │
└──────────────────────────┬──────────────────────────────────┘
                          │
                     Prisma ORM
                          │
┌──────────────────────────┴──────────────────────────────────┐
│                     SQLite Veritabanı                        │
│                      (dev.db dosyası)                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Mimari Prensipler

### 1. **Katmanlı Mimari**
- **Sunum Katmanı**: Vue.js SPA
- **İş Mantığı Katmanı**: Express.js API
- **Veri Erişim Katmanı**: Prisma ORM
- **Veritabanı Katmanı**: SQLite

### 2. **RESTful API Tasarımı**
- Standart HTTP metodları (GET, POST, PATCH, DELETE)
- JSON veri formatı
- Resource-based URL yapısı

### 3. **Single Page Application (SPA)**
- Client-side routing
- Reactive state management
- Component-based architecture

---

## 🔧 Backend Mimarisi

### API Endpoint Grupları

```
/api/members                 # Üye yönetimi
├── GET    /                # Tüm üyeleri listele
├── POST   /                # Yeni üye ekle
└── PATCH  /:id/payment     # Ödeme durumu güncelle

/api/private-lesson-packages      # Özel ders paketleri
├── PATCH  /:id             # Paket güncelle
└── POST   /:id/renew       # Paket yenile

/api/private-sessions       # Özel ders seansları
└── PATCH  /:id             # Seans durumu güncelle

/api/group-categories       # Grup dersi kategorileri
├── GET    /                # Kategorileri listele
├── POST   /                # Yeni kategori ekle
├── PUT    /:id             # Kategori güncelle
├── DELETE /:id             # Kategori sil
└── POST   /:id/schedule    # Program oluştur

/api/group-sessions         # Grup dersi seansları
└── POST   /:id/attendance  # Yoklama güncelle

/api/calendar-events        # Takvim etkinlikleri
└── GET    /                # Tüm etkinlikleri getir
```

### Veri Akış Süreci

1. **Request Flow**:
   ```
   Client → Axios → Express Router → Controller → Prisma → Database
   ```

2. **Response Flow**:
   ```
   Database → Prisma → Controller → Express Router → JSON Response → Client
   ```

### Önemli Backend Fonksiyonları

#### `getNextAlternatingDates()`
- Özel dersler için alternatif günlerde 8 seans oluşturur
- Haftalık ders programına göre otomatik tarih hesaplama

#### Session Management
- Erteleme (postpone) sistemi
- Telafi dersi oluşturma
- Otomatik paket tamamlama kontrolü

---

## 🎨 Frontend Mimarisi

### Component Hiyerarşisi

```
App.vue
├── Router View
│   ├── Home
│   ├── MemberForm        # Üye kayıt
│   ├── MemberList        # Üye listesi
│   ├── OzelDersler       # Özel ders yönetimi
│   ├── GrupDersleri      # Grup dersi yönetimi
│   └── Calendar          # Takvim görünümü
```

### State Management
- Component-level reactive state (Vue 3 Composition API)
- Props/Events ile parent-child iletişim
- Axios ile async data fetching

### Routing Yapısı

```javascript
const routes = [
  { path: '/', component: Home },
  { path: '/uye-kayit', component: MemberForm },
  { path: '/uyeler', component: MemberList },
  { path: '/ozel-dersler', component: PrivateLessons },
  { path: '/grup-dersleri', component: GrupDersleri },
  { path: '/takvim', component: Calendar }
]
```

### UI/UX Özellikleri

#### MemberList Component
- **Filtreleme**: Ders türü, cinsiyet, yaş grubu
- **Arama**: Ad, soyad, telefon
- **Pagination**: Sayfalama sistemi
- **Detay Görünümü**: Paket bilgileri, ödeme durumu

#### GrupDersleri Component
- **Tab System**: Seanslar ve üyeler için ayrı sekmeler
- **Yoklama Yönetimi**: Toplu veya tekil yoklama
- **Paket Takibi**: İlerleme göstergesi
- **Otomatik Program**: 4 haftalık ders programı oluşturma

#### Calendar Component
- **Çoklu Görünüm**: Ay, hafta, gün
- **Drag & Drop**: Seans yeniden planlama
- **Renk Kodlama**: Ders türü ve duruma göre
- **Event Details Modal**: Detaylı bilgi ve aksiyonlar

---

## 🔐 Güvenlik Mimarisi

### CORS Politikası
```javascript
app.use(cors()); // Tüm origin'lere açık (development)
```

### Veri Validasyonu
- Frontend: Form-level validation
- Backend: Request body validation
- Database: Schema-level constraints

### Error Handling
- Try-catch blokları
- HTTP status kodları
- Kullanıcı dostu hata mesajları

---

## 🚀 Deployment Mimarisi

### Development Environment
```
Frontend: Vite dev server (HMR enabled)
Backend: Node.js with nodemon (auto-restart)
Database: Local SQLite file
```

### Production Recommendations
```
Frontend: 
  - Build: npm run build
  - Serve: Nginx/Apache
  - CDN for static assets

Backend:
  - Process Manager: PM2
  - Reverse Proxy: Nginx
  - Database: PostgreSQL/MySQL migration

Security:
  - HTTPS/SSL
  - Environment variables
  - Rate limiting
  - Authentication/Authorization
```

---

## 📊 Performans Optimizasyonları

### Frontend
- **Code Splitting**: Vue Router lazy loading
- **Component Caching**: v-memo directive
- **Image Optimization**: Lazy loading
- **Bundle Size**: Tree shaking with Vite

### Backend
- **Query Optimization**: Prisma include/select
- **Batch Operations**: createMany, updateMany
- **Connection Pooling**: Prisma connection management
- **Response Caching**: For static data

### Database
- **Indexes**: Primary keys and foreign keys
- **Relations**: Efficient JOIN operations
- **Migrations**: Version controlled schema changes

---

## 🔄 Veri Senkronizasyonu

### Real-time Updates
- Manual refresh buttons
- Auto-refresh on critical actions
- Optimistic UI updates

### Data Consistency
- Transaction support via Prisma
- Cascade delete rules
- Referential integrity

---

## 📈 Ölçeklenebilirlik

### Horizontal Scaling
- Stateless API design
- Database connection pooling
- Load balancer ready

### Vertical Scaling
- Efficient query patterns
- Minimal memory footprint
- Optimized algorithms

---

## 🛠️ Geliştirme Araçları

### Development
- **Vite**: Fast build and HMR
- **Prisma Studio**: Database GUI
- **Vue DevTools**: Component debugging

### Testing
- **Unit Tests**: Jest/Vitest ready
- **E2E Tests**: Cypress/Playwright ready
- **API Tests**: Postman/Insomnia

### Monitoring
- **Error Tracking**: Console logs
- **Performance**: Browser DevTools
- **Database**: Prisma logs

---

## 🎯 Gelecek Geliştirmeler

### Planlanan Özellikler
1. **Authentication System**: JWT based auth
2. **Role Management**: Admin, trainer, member roles
3. **Notification System**: Email/SMS reminders
4. **Analytics Dashboard**: Revenue and attendance reports
5. **Mobile App**: React Native or Flutter
6. **Multi-tenant Support**: Multiple gym locations
7. **Payment Gateway**: Online payment integration
8. **Backup System**: Automated database backups

---

*Mimari dokümantasyon v1.0 - Ocak 2025*
