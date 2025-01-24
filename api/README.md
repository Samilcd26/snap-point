# SnapPoint API

Location based photo sharing application API.

## Versiyonlama Kılavuzu

Bu projede [Semantic Versioning](https://semver.org/) kullanılmaktadır.

### Versiyon Numarası Formatı

`MAJOR.MINOR.PATCH` formatında versiyon numaraları kullanılır:

- **MAJOR**: Geriye uyumlu olmayan API değişikliklerinde
- **MINOR**: Geriye uyumlu yeni özellik eklemelerinde
- **PATCH**: Geriye uyumlu hata düzeltmelerinde

### Versiyon Güncelleme Komutları

```bash
# Major versiyon artırımı (1.0.0 -> 2.0.0)
npm run version:major

# Minor versiyon artırımı (1.0.0 -> 1.1.0)
npm run version:minor

# Patch versiyon artırımı (1.0.0 -> 1.0.1)
npm run version:patch
```

### Yeni Versiyon Yayınlama Adımları

1. Değişiklikleri commit edin:
```bash
git add .
git commit -m "feat: yeni özellikler eklendi"
```

2. Versiyonu artırın:
```bash
# Yeni özellik eklendiyse
npm run version:minor

# Hata düzeltildiyse
npm run version:patch

# API'de büyük değişiklik varsa
npm run version:major
```

3. GitHub'a push edin:
```bash
git push origin main --tags
```

### Commit Mesajı Formatı

Commit mesajlarında [Conventional Commits](https://www.conventionalcommits.org/) standardı kullanılır:

- `feat:` - Yeni özellik
- `fix:` - Hata düzeltmesi
- `docs:` - Sadece dokümantasyon değişiklikleri
- `style:` - Kod formatı değişiklikleri
- `refactor:` - Kod refactoring
- `test:` - Test eklemeleri
- `chore:` - Genel bakım işlemleri

Örnek:
```bash
git commit -m "feat: gizli lokasyon özelliği eklendi"
git commit -m "fix: yakındaki yerler API'sindeki hata düzeltildi"
```

### CHANGELOG Güncelleme

Her versiyon değişikliğinde CHANGELOG.md dosyası güncellenir:

1. Yeni versiyon numarası ve tarihi eklenir
2. Yapılan değişiklikler kategorize edilir:
   - Added (Eklenenler)
   - Changed (Değişenler)
   - Deprecated (Kullanımdan Kaldırılacaklar)
   - Removed (Kaldırılanlar)
   - Fixed (Düzeltilenler)
   - Security (Güvenlik Güncellemeleri)

## Örnek Versiyon Geçişi

1. Yeni özellik eklendiğinde:
```bash
git add .
git commit -m "feat: özel lokasyon sistemi eklendi"
npm run version:minor
git push origin main --tags
```

2. Hata düzeltildiğinde:
```bash
git add .
git commit -m "fix: kullanıcı puanı hesaplama hatası düzeltildi"
npm run version:patch
git push origin main --tags
```

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