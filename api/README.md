# SnapPoint API

SnapPoint, kullanıcıların belirli lokasyonlarda fotoğraf çekerek puan kazanabilecekleri bir konum tabanlı fotoğraf paylaşım uygulamasının API'sidir.

## Özellikler

- Kullanıcı kaydı ve girişi
- JWT tabanlı kimlik doğrulama
- Fotoğraf yükleme ve paylaşma
- Konum tabanlı fotoğraf arama
- Puan sistemi
- Liderlik tablosu

## Teknolojiler

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- TypeORM
- JWT
- Multer
- PostGIS

## Kurulum

1. Gerekli paketleri yükleyin:
```bash
npm install
```

2. PostgreSQL veritabanını kurun ve PostGIS eklentisini etkinleştirin:
```sql
CREATE DATABASE snappoint;
\c snappoint
CREATE EXTENSION postgis;
```

3. `.env` dosyasını düzenleyin:
```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=snappoint
JWT_SECRET=your-super-secret-jwt-key
```

4. Veritabanı tablolarını oluşturun:
```bash
npm run typeorm migration:run
```

5. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

## API Endpoints

### Kullanıcı İşlemleri
- POST /api/users/register - Yeni kullanıcı kaydı
- POST /api/users/login - Kullanıcı girişi
- GET /api/users/profile - Kullanıcı profili
- PUT /api/users/profile - Profil güncelleme
- GET /api/users/leaderboard - Liderlik tablosu

### Fotoğraf İşlemleri
- POST /api/photos/upload - Fotoğraf yükleme
- GET /api/photos - Kullanıcının fotoğrafları
- GET /api/photos/:id - Fotoğraf detayları
- GET /api/photos/nearby - Yakındaki fotoğraflar

## Lisans

MIT 