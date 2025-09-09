# 🥊 Kickboks Salonu Yönetim Sistemi - Kapsamlı Dokümantasyon

## 📌 İçindekiler

1. [Sistem Özeti](#sistem-özeti)
2. [Proje Yapısı](#proje-yapısı)
3. [Teknik Dokümantasyon](#teknik-dokümantasyon)
4. [Kurulum ve Başlangıç](#kurulum-ve-başlangıç)
5. [Detaylı Dokümantasyon](#detaylı-dokümantasyon)

---

## 🎯 Sistem Özeti

Bu sistem, küçük ve orta ölçekli kickboks salonları için geliştirilmiş kapsamlı bir yönetim platformudur. Üye kayıtları, özel ders takibi, grup dersi yönetimi ve ödeme takibi gibi temel işlevleri tek bir platformda toplar.

### 🌟 Temel Özellikler

- **Üye Yönetimi**: 
  - ✅ Detaylı üye profilleri ve takibi
  - ✅ Üye bilgilerini düzenleme
  - ✅ Güvenli üye silme (cascade delete)
- **Özel Ders Sistemi**: 8 seanslık paketler halinde özel ders yönetimi
- **Grup Dersi Yönetimi**: Yaş gruplarına göre kategorilendirilmiş grup dersleri
- **Takvim Görünümü**: Tüm derslerin görsel takibi
- **Ödeme Takibi**: Üye bazlı ödeme yönetimi
- **Yoklama Sistemi**: Grup dersleri için detaylı yoklama

---

## 📁 Proje Yapısı

```
kickboxing/
├── backend/                 # Express.js API Server
│   ├── index.js            # Ana API endpoint'leri
│   ├── package.json        # Backend bağımlılıkları
│   └── prisma/             # Veritabanı şeması ve migration'lar
│       ├── schema.prisma   # Veri modelleri
│       ├── dev.db         # SQLite veritabanı
│       └── migrations/    # Veritabanı değişiklik geçmişi
│
├── frontend/               # Vue 3 SPA
│   ├── src/
│   │   ├── App.vue        # Ana uygulama bileşeni
│   │   ├── main.js        # Uygulama başlangıç noktası
│   │   ├── components/    # Vue bileşenleri
│   │   │   ├── MemberForm.vue     # Üye kayıt formu
│   │   │   ├── MemberList.vue     # Üye listesi ve yönetimi
│   │   │   ├── OzelDersler.vue    # Özel ders yönetimi
│   │   │   ├── GrupDersleri.vue   # Grup dersi yönetimi
│   │   │   └── PrivateLessons.vue # Özel ders takvimi
│   │   └── views/
│   │       └── Calendar.vue       # Takvim görünümü
│   └── package.json       # Frontend bağımlılıkları
│
└── docs/                  # Dokümantasyon
    ├── README.md         # Ana dokümantasyon (bu dosya)
    ├── ARCHITECTURE.md   # Sistem mimarisi
    ├── DATABASE.md       # Veritabanı şeması
    ├── API.md           # API dokümantasyonu
    ├── BUSINESS_LOGIC.md # İş kuralları
    └── USER_GUIDE.md    # Kullanım kılavuzu
```

---

## ⚙️ Teknik Dokümantasyon

### Backend Teknolojileri
- **Node.js + Express**: RESTful API server
- **Prisma ORM**: Veritabanı yönetimi ve ORM
- **SQLite**: Hafif, dosya tabanlı veritabanı
- **CORS**: Cross-origin istekler için

### Frontend Teknolojileri
- **Vue 3**: Modern reactive framework
- **Vite**: Hızlı build tool
- **TailwindCSS**: Utility-first CSS framework
- **Vue Router**: SPA routing
- **Axios**: HTTP istemcisi
- **FullCalendar**: Gelişmiş takvim görünümü

---

## 🚀 Kurulum ve Başlangıç

### Gereksinimler
- Node.js (v16 veya üstü)
- npm veya yarn

### Hızlı Kurulum

#### 1. Backend Kurulumu
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
node index.js
```
Backend `http://localhost:3001` adresinde çalışacaktır.

#### 2. Frontend Kurulumu
```bash
cd frontend
npm install
npm run dev
```
Frontend `http://localhost:5173` adresinde çalışacaktır.

### Environment Variables
Backend `.env` dosyası:
```env
DATABASE_URL="file:./dev.db"
```

---

## 📚 Detaylı Dokümantasyon

### [🏗️ Sistem Mimarisi](./ARCHITECTURE.md)
Sistemin genel mimarisi, component yapısı ve veri akışı

### [💾 Veritabanı Şeması](./DATABASE.md)
Tüm veri modelleri, ilişkiler ve alan açıklamaları

### [🔌 API Dokümantasyonu](./API.md)
Tüm API endpoint'leri, request/response formatları

### [📋 İş Kuralları](./BUSINESS_LOGIC.md)
Sistemin iş mantığı, kurallar ve kısıtlamalar

### [📖 Kullanım Kılavuzu](./USER_GUIDE.md)
Son kullanıcı için detaylı kullanım talimatları

---

## 🔄 Versiyon Geçmişi

- **v1.0.0** - İlk sürüm
  - Üye yönetimi
  - Özel ders sistemi
  - Grup dersi yönetimi
  - Takvim entegrasyonu
  - Ödeme takibi

---

## 🤝 Destek ve İletişim

Sistem hakkında sorularınız veya önerileriniz için lütfen proje yöneticisiyle iletişime geçin.

---

*Son güncelleme: Ocak 2025*
