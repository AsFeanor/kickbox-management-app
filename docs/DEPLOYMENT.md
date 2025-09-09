# 🚀 Kurulum ve Deployment Kılavuzu

## 📋 Gereksinimler

### Minimum Sistem Gereksinimleri
- **İşletim Sistemi**: Windows 10+, macOS 10.15+, Ubuntu 20.04+
- **Node.js**: v16.0.0 veya üstü
- **NPM**: v7.0.0 veya üstü
- **RAM**: Minimum 2GB (4GB önerilir)
- **Disk Alanı**: Minimum 500MB

### Geliştirme Araçları
- **Kod Editörü**: VS Code (önerilir)
- **Terminal**: Bash, Zsh veya PowerShell
- **Git**: Versiyon kontrolü için

---

## 🛠️ Geliştirme Ortamı Kurulumu

### 1. Projeyi İndirme
```bash
# Git ile klonlama
git clone [proje-url]
cd kickboxing

# veya ZIP olarak indirip açın
```

### 2. Backend Kurulumu

#### Adım 1: Bağımlılıkları Yükleyin
```bash
cd backend
npm install
```

#### Adım 2: Environment Dosyasını Oluşturun
```bash
# .env dosyası oluştur
echo 'DATABASE_URL="file:./dev.db"' > .env
```

#### Adım 3: Veritabanını Hazırlayın
```bash
# Prisma client'ı oluştur
npx prisma generate

# Migration'ları çalıştır
npx prisma migrate dev

# (Opsiyonel) Prisma Studio'yu aç
npx prisma studio
```

#### Adım 4: Backend'i Başlatın
```bash
# Development modda çalıştır
node index.js

# veya nodemon ile (otomatik restart)
npx nodemon index.js
```

Backend `http://localhost:3001` adresinde çalışacaktır.

### 3. Frontend Kurulumu

#### Adım 1: Bağımlılıkları Yükleyin
```bash
cd frontend
npm install
```

#### Adım 2: Development Server'ı Başlatın
```bash
npm run dev
```

Frontend `http://localhost:5173` adresinde çalışacaktır.

---

## 🏭 Production Deployment

### 1. Backend Production Build

#### Environment Variables
```bash
# .env.production
DATABASE_URL="file:./prod.db"
NODE_ENV="production"
PORT=3001
```

#### PM2 ile Deployment
```bash
# PM2'yi global yükle
npm install -g pm2

# Backend'i PM2 ile başlat
cd backend
pm2 start index.js --name kickboxing-api

# PM2 komutları
pm2 list              # Çalışan processleri listele
pm2 logs kickboxing-api  # Logları görüntüle
pm2 restart kickboxing-api  # Yeniden başlat
pm2 stop kickboxing-api     # Durdur
pm2 delete kickboxing-api   # Sil

# Sistem restart'ında otomatik başlat
pm2 startup
pm2 save
```

### 2. Frontend Production Build

#### Build İşlemi
```bash
cd frontend
npm run build
```

Build dosyaları `frontend/dist` klasöründe oluşacaktır.

#### Nginx ile Serve Etme
```nginx
# /etc/nginx/sites-available/kickboxing
server {
    listen 80;
    server_name yourdomain.com;
    
    root /var/www/kickboxing/frontend/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Apache ile Serve Etme
```apache
# .htaccess
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# API proxy
ProxyPass /api http://localhost:3001/api
ProxyPassReverse /api http://localhost:3001/api
```

---

## 🐳 Docker Deployment

### Docker Compose Yapısı
```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=file:./dev.db
      - NODE_ENV=production
    volumes:
      - ./backend/prisma:/app/prisma
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
```

### Backend Dockerfile
```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npx prisma generate

EXPOSE 3001

CMD ["node", "index.js"]
```

### Frontend Dockerfile
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Komutları
```bash
# Build ve başlat
docker-compose up -d

# Logları görüntüle
docker-compose logs -f

# Durdur
docker-compose down

# Yeniden build et
docker-compose build --no-cache
```

---

## ☁️ Cloud Deployment

### Heroku Deployment

#### Backend (Heroku)
```bash
# Heroku CLI yükle ve giriş yap
heroku login

# Heroku app oluştur
heroku create kickboxing-api

# PostgreSQL addon ekle (SQLite yerine)
heroku addons:create heroku-postgresql:hobby-dev

# Deploy et
git push heroku main

# Logları görüntüle
heroku logs --tail
```

### Vercel Deployment

#### Frontend (Vercel)
```bash
# Vercel CLI yükle
npm i -g vercel

# Frontend klasöründe
cd frontend
vercel

# Environment variable ekle
# VITE_API_URL = https://your-api-url.herokuapp.com
```

### DigitalOcean App Platform

#### Yapılandırma
```yaml
# .do/app.yaml
name: kickboxing-system
services:
  - name: api
    github:
      repo: your-repo
      branch: main
      deploy_on_push: true
    source_dir: backend
    environment_slug: node-js
    http_port: 3001
    
  - name: web
    github:
      repo: your-repo
      branch: main
    source_dir: frontend
    environment_slug: node-js
    build_command: npm run build
    http_port: 8080
```

---

## 🔒 Güvenlik Ayarları

### Environment Variables
```bash
# .env.production
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-secret-key-here
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_MAX=100
```

### HTTPS/SSL Sertifikası

#### Let's Encrypt ile Ücretsiz SSL
```bash
# Certbot yükle
sudo apt-get install certbot python3-certbot-nginx

# SSL sertifikası al
sudo certbot --nginx -d yourdomain.com

# Otomatik yenileme
sudo certbot renew --dry-run
```

### Güvenlik Headers
```javascript
// backend/index.js'e ekle
import helmet from 'helmet';

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
```

---

## 📊 Monitoring ve Logging

### PM2 Monitoring
```bash
# PM2 monitoring dashboard
pm2 monit

# PM2 Plus (Cloud monitoring)
pm2 register
```

### Log Management
```javascript
// Winston logger ekle
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Health Check Endpoint
```javascript
// backend/index.js'e ekle
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'Connected'
  });
});
```

---

## 🔄 Backup ve Recovery

### Veritabanı Yedekleme

#### Manuel Backup
```bash
# SQLite backup
cp backend/prisma/dev.db backups/backup_$(date +%Y%m%d_%H%M%S).db

# PostgreSQL backup
pg_dump -U username -d database > backup.sql
```

#### Otomatik Backup Script
```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/var/backups/kickboxing"
DATE=$(date +%Y%m%d_%H%M%S)
DB_FILE="/app/backend/prisma/dev.db"

# Backup klasörünü oluştur
mkdir -p $BACKUP_DIR

# Veritabanını yedekle
cp $DB_FILE "$BACKUP_DIR/db_backup_$DATE.db"

# 30 günden eski yedekleri sil
find $BACKUP_DIR -name "*.db" -mtime +30 -delete

echo "Backup completed: db_backup_$DATE.db"
```

#### Cron Job ile Otomatik Backup
```bash
# Crontab'a ekle (her gün saat 02:00'de)
0 2 * * * /path/to/backup.sh
```

### Recovery Prosedürü
```bash
# Veritabanını geri yükle
cp backups/backup_20250115.db backend/prisma/dev.db

# Prisma'yı yeniden senkronize et
cd backend
npx prisma db push
npx prisma generate

# Server'ı yeniden başlat
pm2 restart kickboxing-api
```

---

## 🚨 Troubleshooting

### Yaygın Hatalar ve Çözümleri

#### 1. Port Kullanımda
```bash
# Error: EADDRINUSE: address already in use
# Çözüm: Port'u kullanan process'i bul ve kapat
lsof -i :3001
kill -9 [PID]
```

#### 2. Prisma Migration Hatası
```bash
# Error: Migration failed
# Çözüm: Veritabanını sıfırla
npx prisma migrate reset
npx prisma migrate dev
```

#### 3. CORS Hatası
```javascript
// Çözüm: CORS ayarlarını kontrol et
app.use(cors({
  origin: '*', // Development için
  // origin: 'https://yourdomain.com', // Production için
}));
```

#### 4. Database Lock Hatası
```bash
# SQLite locked hatası
# Çözüm: Lock dosyasını sil
rm backend/prisma/dev.db-journal
```

---

## 📈 Performance Optimization

### Frontend Optimizasyonları
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'axios'],
          calendar: ['@fullcalendar/core', '@fullcalendar/vue3']
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
}
```

### Backend Optimizasyonları
```javascript
// Compression ekle
import compression from 'compression';
app.use(compression());

// Response cache
import apicache from 'apicache';
const cache = apicache.middleware;
app.get('/api/members', cache('5 minutes'), async (req, res) => {
  // ...
});
```

---

## 🔐 Güvenlik Checklist

- [ ] Environment variables kullanılıyor
- [ ] HTTPS/SSL aktif
- [ ] CORS doğru yapılandırılmış
- [ ] Rate limiting aktif
- [ ] SQL injection koruması (Prisma ORM)
- [ ] XSS koruması (Helmet.js)
- [ ] Düzenli backup alınıyor
- [ ] Loglar takip ediliyor
- [ ] Güvenlik güncellemeleri yapılıyor

---

## 📚 Ek Kaynaklar

### Dokümantasyon
- [Node.js Docs](https://nodejs.org/docs)
- [Vue.js Docs](https://vuejs.org/guide)
- [Prisma Docs](https://www.prisma.io/docs)
- [PM2 Docs](https://pm2.keymetrics.io/docs)

### Monitoring Araçları
- [New Relic](https://newrelic.com)
- [Datadog](https://www.datadoghq.com)
- [Sentry](https://sentry.io) - Error tracking

---

*Deployment Kılavuzu v1.0 - Ocak 2025*
