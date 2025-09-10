# 🚀 Railway SQLite Monorepo Deployment

## 🎯 Avantajlar

### ✅ **Tek Deployment:**
- Frontend + Backend + Database tek projede
- Tek URL → `https://your-app.railway.app`
- SQLite korunuyor → Hiç değişiklik yok
- Mevcut veriler → Aynen kalıyor

### ✅ **Basit Yapı:**
```
https://your-app.railway.app/          → Frontend (Vue.js)
https://your-app.railway.app/api/     → Backend API
SQLite Database                       → Volume'da persist
```

---

## 🚀 Deployment Adımları

### **1. GitHub'a Yükleme**

```bash
cd Desktop/kickboxing

# Git init (eğer yoksa)
git init

# Tüm dosyaları ekle
git add .

# Commit
git commit -m "Railway SQLite monorepo deployment"

# GitHub repo oluştur ve push et
git remote add origin https://github.com/KULLANICI_ADI/kickboxing-app.git
git push -u origin main
```

### **2. Railway Deployment**

1. **Railway.app** → Login with GitHub
2. **"New Project"** → **"Deploy from GitHub repo"**
3. **kickboxing-app** repository seçin
4. **"Deploy Now"**

### **3. Environment Variables**

Railway dashboard'da **Variables** sekmesinde:

```bash
NODE_ENV=production
DATABASE_URL=file:/app/data/production.db
RAILWAY_VOLUME_MOUNT_PATH=/app/data
```

### **4. Volume Mount (SQLite İçin)**

Railway dashboard'da:
1. **Settings** → **Volumes**
2. **"Add Volume"**
3. **Mount Path:** `/app/data`
4. **Size:** 1GB (ücretsiz)

### **5. İlk Database Setup**

Railway console'dan:
```bash
# Migration'ları çalıştır
cd backend && npx prisma migrate deploy

# Veya reset (temiz başlangıç)
cd backend && npx prisma migrate reset --force
```

---

## 🔧 Teknik Detaylar

### **Proje Yapısı:**
```
kickboxing/
├── package.json              ← Root build scripts
├── nixpacks.toml             ← Railway build config
├── railway.json              ← Railway deployment config
├── backend/
│   ├── index.js              ← Static file serving + API
│   └── prisma/dev.db         ← SQLite database
├── frontend/
│   ├── dist/                 ← Build output (Railway'de)
│   └── src/config.js         ← API URL config
└── scripts/
    └── setup-database.sh     ← Database setup script
```

### **Build Process:**
1. **Frontend build:** `npm run build:frontend`
2. **Backend setup:** `npm run build:backend`
3. **Start:** Backend serves frontend + API

### **API Routes:**
- `/api/*` → Backend API
- `/*` → Frontend SPA (index.html)

---

## 📊 SQLite Avantajları

### ✅ **Hiç Değişiklik Yok:**
- Mevcut Prisma schema → Aynen çalışır
- Mevcut migrations → Aynen çalışır
- Mevcut veriler → Aynen korunur

### ✅ **Performance:**
- Çok hızlı → Network latency yok
- Basit queries → SQLite mükemmel
- Küçük veri → Spor salonu için ideal

### ✅ **Maliyet:**
- **0 TL** → PostgreSQL gibi ayrı DB yok
- **Volume:** 1GB ücretsiz
- **Compute:** 500 saat/ay ücretsiz

---

## 🆘 Sorun Giderme

### **"Build Failed" Hatası:**

**1. Package.json kontrol:**
```json
{
  "scripts": {
    "build": "npm run build:frontend && npm run build:backend",
    "build:frontend": "cd frontend && npm install && npm run build",
    "build:backend": "cd backend && npm install && npx prisma generate"
  }
}
```

**2. Nixpacks.toml kontrol:**
```toml
[phases.install]
cmds = ["npm run install:all"]

[phases.build]  
cmds = ["npm run build"]
```

### **"Database Not Found" Hatası:**

**1. Volume mount kontrol:**
- Railway dashboard → Settings → Volumes
- Mount path: `/app/data`

**2. DATABASE_URL kontrol:**
```bash
DATABASE_URL=file:/app/data/production.db
```

**3. Migration çalıştır:**
```bash
cd backend && npx prisma migrate deploy
```

### **"Frontend Not Loading" Hatası:**

**1. Static file serving kontrol:**
```javascript
// backend/index.js
app.use(express.static(path.join(__dirname, '../frontend/dist')));
```

**2. Build output kontrol:**
```bash
# Frontend build çalıştı mı?
ls -la frontend/dist/
```

---

## 🎯 Test Checklist

### **Deployment Sonrası:**
- [ ] Site açılıyor: `https://your-app.railway.app`
- [ ] API çalışıyor: `https://your-app.railway.app/api/members`
- [ ] Database bağlantısı OK
- [ ] Üye ekleme çalışıyor
- [ ] Kategori oluşturma çalışıyor
- [ ] Takvim görünümü OK

### **Production Test:**
- [ ] Responsive tasarım
- [ ] Tüm CRUD işlemleri
- [ ] File upload (eğer varsa)
- [ ] Error handling

---

## 📱 Hocaya Teslim

### **Tek URL:**
```
🌐 https://kickboxing-salon.railway.app
📱 Telefon/tablet/bilgisayar hepsinde çalışır
🔖 Bookmark yap, kullan!
```

### **Söylemeniz Gerekenler:**
> "Hocam, sisteminiz hazır! Bu linke girin ve bookmark yapın. Hiçbir kurulum yok, her yerden kullanabilirsiniz. Verileriniz güvende, otomatik yedekleniyor."

---

## 🎉 Sonuç

### **Elde Ettikleriniz:**
- ✅ **Tek URL** → Frontend + Backend + Database
- ✅ **SQLite korundu** → Hiç değişiklik yok
- ✅ **Ücretsiz** → 0 TL/ay
- ✅ **Otomatik SSL** → https://
- ✅ **Persistent storage** → Veriler kaybolmaz
- ✅ **Auto-deploy** → Git push = deploy

### **Deployment Süresi:**
- **GitHub upload:** 5 dakika
- **Railway setup:** 10 dakika  
- **Volume mount:** 5 dakika
- **Test:** 5 dakika
- **Toplam:** 25 dakika

**Sonuç: Profesyonel web uygulaması, hiçbir kurulum gerektirmez!** 🎯✨
