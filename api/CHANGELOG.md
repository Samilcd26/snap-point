# Changelog

## [1.1.0] - 2024-01-20

### Eklenen Özellikler

#### 🌟 Yeni Yer Tipleri
- **Normal Yerler** (Varsayılan)
  - Standart görünürlük kuralları
  - Puan arttıkça görünürlük mesafesi artar
  - Her 100 puan için görünürlük mesafesi: `100m + (puan * 10m)`
  - Zoom seviyeleri: 10-18 arası (puana göre değişir)

- **Gizli Yerler** 🕵️
  - Sadece yakındaki kullanıcılara görünür
  - Minimum puan şartı gerektirir
  - Özellikler:
    - `discoveryRadius`: Keşif yarıçapı (varsayılan: 50m)
    - `requiresProximity`: Yakınlık zorunluluğu
    - Sadece en yakın zoom seviyelerinde görünür (18-20)
    - Örnek: `"Gizli Hazine" - sadece 1000+ puanlı ve 50m yakınındaki kullanıcılar görebilir`

- **Özel Yerler** ⭐
  - Yüksek puanlı kullanıcılara özel
  - Daha geniş görünürlük alanı
  - Özellikler:
    - Her 200 puan için zoom seviyesi düşer
    - Görünürlük: `200m + (puan * 15m)`
    - Zoom seviyeleri: 12-16 arası
    - Örnek: `"VIP Lokasyon" - sadece 2000+ puanlı kullanıcılar görebilir`

#### 🎮 Dinamik Görünürlük Sistemi
- Her yer tipi için farklı görünürlük hesaplaması
- Puan bazlı zoom seviyesi ayarlaması
- Kullanıcı yakınlığına göre görünürlük kontrolü

### Kullanım Örnekleri

#### 1. Normal Yer Oluşturma
```typescript
const normalPlace = {
    name: "Tarihi Çeşme",
    description: "Herkesin görebileceği tarihi çeşme",
    placeType: PlaceType.NORMAL,
    points: 100,
    location: "POINT(28.979530 41.015137)"
};
```

#### 2. Gizli Yer Oluşturma
```typescript
const hiddenPlace = {
    name: "Gizli Mağara",
    description: "Sadece yakındaki tecrübeli kullanıcılar görebilir",
    placeType: PlaceType.HIDDEN,
    points: 500,
    minRequiredPoints: 1000,
    discoveryRadius: 50,
    requiresProximity: true,
    location: "POINT(28.974159 41.025659)"
};
```

#### 3. Özel Yer Oluşturma
```typescript
const specialPlace = {
    name: "VIP Lokasyon",
    description: "Sadece uzman kullanıcılara özel",
    placeType: PlaceType.SPECIAL,
    points: 1000,
    minRequiredPoints: 2000,
    location: "POINT(28.976532 41.019845)"
};
```

### API Kullanımı

#### Yakındaki Yerleri Getirme
```http
GET /api/places/nearby
```

Query Parametreleri:
- `latitude`: Enlem
- `longitude`: Boylam
- `zoomLevel`: Harita zoom seviyesi (1-20 arası)

Örnek Response:
```json
[
    {
        "id": "123",
        "name": "Tarihi Çeşme",
        "description": "Herkesin görebileceği tarihi çeşme",
        "placeType": "normal",
        "points": 100,
        "location": {
            "latitude": 41.015137,
            "longitude": 28.979530
        },
        "visibilityRadius": 1100
    },
    {
        "id": "456",
        "name": "VIP Lokasyon",
        "placeType": "special",
        "points": 1000,
        "minRequiredPoints": 2000,
        "location": {
            "latitude": 41.019845,
            "longitude": 28.976532
        },
        "visibilityRadius": 15200
    }
]
```

### Görünürlük Hesaplama Formülleri

1. **Normal Yerler**:
   - Görünürlük = 100m + (puan * 10m)
   - Min Zoom = max(18 - floor(puan/100), 10)

2. **Gizli Yerler**:
   - Görünürlük = discoveryRadius (varsayılan 50m)
   - Zoom = 18-20 arası sabit

3. **Özel Yerler**:
   - Görünürlük = 200m + (puan * 15m)
   - Min Zoom = max(16 - floor(puan/200), 12)

### 🎯 Kullanım İpuçları

1. **Gizli Yerler İçin**:
   - Küçük `discoveryRadius` değerleri kullanın (20-100m arası)
   - Yüksek `minRequiredPoints` ile özel kılın
   - Önemli/değerli lokasyonlar için kullanın

2. **Özel Yerler İçin**:
   - Orta-yüksek `minRequiredPoints` değerleri kullanın
   - Popüler/merkezi lokasyonlar için tercih edin
   - Yüksek puan değerleri verin

3. **Normal Yerler İçin**:
   - Başlangıç noktaları için düşük puanlar
   - Genel lokasyonlar için tercih edin
   - Puan değerini zorluğa göre ayarlayın 