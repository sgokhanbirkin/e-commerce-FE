# 🚀 Kayra Export E-commerce - Mikro Frontend Projesi

Modern e-ticaret platformu için **Mikro Frontend (Micro Frontend)** mimarisi kullanan Next.js 15 + Module Federation projesi.

## 📋 İçindekiler

- [Proje Hakkında](#-proje-hakkında)
- [Teknoloji Stack'i](#-teknoloji-stacki)
- [Kurulum](#-kurulum)
- [Backend Entegrasyonu](#-backend-entegrasyonu)
- [Geliştirme](#-geliştirme)
- [Mimari Yapı](#-mimari-yapı)
- [Özellikler](#-özellikler)
- [API Entegrasyonu](#-api-entegrasyonu)
- [Deployment](#-deployment)
- [Katkıda Bulunma](#-katkıda-bulunma)

---

## 🎯 Proje Hakkında

Bu proje, büyük e-ticaret uygulamalarını daha küçük, bağımsız parçalara bölerek geliştirme ve bakım süreçlerini kolaylaştırmayı amaçlar. **Mikro Frontend** mimarisi kullanarak her özellik bağımsız olarak geliştirilebilir ve deploy edilebilir.

### 🎯 Ana Hedefler

- **Modüler Geliştirme**: Her mikro frontend bağımsız olarak geliştirilebilir
- **Teknoloji Çeşitliliği**: Farklı teknolojiler (Next.js, Vite) kullanabilme
- **Ölçeklenebilirlik**: Büyük ekipler için uygun yapı
- **Performans**: Lazy loading ve code splitting
- **Güvenlik**: JWT tabanlı kimlik doğrulama

---

## 🛠️ Teknoloji Stack'i

| Bileşen               | Teknoloji     | Versiyon | Amaç                      |
| --------------------- | ------------- | -------- | ------------------------- |
| **Host App**          | Next.js 15    | 15.4.5   | Ana uygulama, routing     |
| **Products App**      | Next.js 15    | 15.4.5   | Ürün yönetimi             |
| **Basket App**        | Vite + React  | 7.0.4    | Sepet işlemleri           |
| **State Management**  | Redux Toolkit | 2.0.0    | Global state              |
| **UI Framework**      | Ant Design    | 5.26.7   | UI bileşenleri            |
| **Package Manager**   | pnpm          | -        | Dependency management     |
| **Build Tool**        | Turborepo     | -        | Monorepo build            |
| **Module Federation** | Webpack 5     | -        | Mikro frontend bağlantısı |

---

## 🚀 Kurulum

### Ön Gereksinimler

- **Node.js**: 18.x veya üzeri
- **pnpm**: 8.x veya üzeri
- **Git**: En son versiyon

### 1. Repository'yi Klonlayın

```bash
git clone https://github.com/sgokhanbirkin/kayra-export-e-commerce-new.git
cd kayra-export-e-commerce-new
```

### 2. Bağımlılıkları Yükleyin

```bash
pnpm install
```

### 3. Environment Dosyalarını Oluşturun

```bash
# Host app için
cp apps/host/env.example apps/host/.env.local

# Products app için
cp apps/products/env.example apps/products/.env.local

# Basket app için
cp apps/basket/env.example apps/basket/.env.local
```

### 4. Environment Değişkenlerini Düzenleyin

**apps/host/.env.local**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_HOST_URL=http://localhost:3000
NEXT_PUBLIC_PRODUCTS_URL=http://localhost:3001
NEXT_PUBLIC_BASKET_URL=http://localhost:3002
```

**apps/products/.env.local**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_PRODUCTS_URL=http://localhost:3001
```

**apps/basket/.env.local**
```bash
VITE_API_URL=http://localhost:8080/api
VITE_BASKET_URL=http://localhost:3002
```

### 5. Geliştirme Sunucusunu Başlatın

```bash
# Tüm uygulamaları başlat
pnpm dev:all
```

### 6. Uygulamalara Erişim

- **Ana Uygulama**: http://localhost:3000
- **Ürünler**: http://localhost:3001
- **Sepet**: http://localhost:3002

---

## 🔗 Backend Entegrasyonu

Bu frontend projesi, [E-commerce Backend API](https://github.com/sgokhanbirkin/e-commerce-app-BE) ile entegre çalışır.

### Backend Kurulumu

1. **Backend Repository'sini Klonlayın**
```bash
git clone https://github.com/sgokhanbirkin/e-commerce-app-BE.git
cd e-commerce-app-BE
```

2. **Backend Bağımlılıklarını Yükleyin**
```bash
pnpm install
```

3. **Environment Dosyasını Oluşturun**
```bash
cp .env.example .env
```

4. **Veritabanını Hazırlayın**
```bash
pnpm prisma generate
pnpm prisma db push
pnpm seed
```

5. **Backend Sunucusunu Başlatın**
```bash
pnpm dev
```

Backend API: http://localhost:8080

### API Dokümantasyonu

Backend API dokümantasyonuna erişmek için:
```
http://localhost:8080/api-docs
```

---

## 🏗️ Mimari Yapı

```
kayra-export-e-commerce/
├── apps/                          # Mikro frontend uygulamaları
│   ├── host/                      # Ana host uygulaması (Next.js 15)
│   ├── products/                  # Ürünler mikro frontend (Next.js 15)
│   └── basket/                    # Sepet mikro frontend (Vite + React)
├── libs/                          # Paylaşılan kütüphaneler
│   └── data-access/               # API, Redux store, tipler
├── scripts/                       # Yardımcı scriptler
├── docker-compose.yml             # Docker konfigürasyonu
├── turbo.json                     # Turborepo konfigürasyonu
└── pnpm-workspace.yaml           # pnpm workspace tanımı
```

### Uygulama Detayları

#### 🏠 Host Uygulaması (`apps/host/`)
- **Port**: 3000
- **Amaç**: Ana e-ticaret platformu
- **Özellikler**: Routing, Module Federation, Authentication

#### 🛍️ Products Uygulaması (`apps/products/`)
- **Port**: 3001
- **Amaç**: Ürün yönetimi ve görüntüleme
- **Özellikler**: Ürün listesi, filtreleme, arama

#### 🛒 Basket Uygulaması (`apps/basket/`)
- **Port**: 3002
- **Amaç**: Sepet işlemleri
- **Özellikler**: Sepet yönetimi, fiyat hesaplama

---

## ⚡ Geliştirme

### Mevcut Scriptler

```bash
# Tüm uygulamaları başlat
pnpm dev:all

# Sadece host uygulamasını başlat
pnpm dev:host

# Sadece products uygulamasını başlat
pnpm dev:products

# Sadece basket uygulamasını başlat
pnpm dev:basket

# Build işlemi
pnpm build

# Lint kontrolü
pnpm lint

# Type check
pnpm type-check

# Test
pnpm test
```

### Docker ile Geliştirme

```bash
# Development environment
docker-compose up dev

# Production build
docker-compose up host products basket
```

---

## 🎨 Özellikler

### 🔐 Kimlik Doğrulama
- **JWT Token**: User ve guest token sistemi
- **Login/Register**: Kullanıcı kayıt ve giriş
- **Protected Routes**: Güvenli sayfa erişimi
- **Token Refresh**: Otomatik token yenileme

### 🛍️ E-ticaret Özellikleri
- **Ürün Listesi**: Kategorilere göre ürün görüntüleme
- **Ürün Detayı**: Detaylı ürün bilgileri
- **Sepet Yönetimi**: Ürün ekleme, çıkarma, miktar güncelleme
- **Fiyat Hesaplama**: Otomatik toplam hesaplama
- **Sipariş İşlemleri**: Checkout ve ödeme
- **Review Sistemi**: Ürün değerlendirmeleri

### 🎯 Mikro Frontend Özellikleri
- **Module Federation**: Dinamik bileşen yükleme
- **Independent Development**: Bağımsız geliştirme
- **Technology Diversity**: Farklı teknolojiler
- **Lazy Loading**: Performans optimizasyonu

### 📱 Responsive Tasarım
- **Mobile First**: Mobil uyumlu tasarım
- **Ant Design**: Modern UI bileşenleri
- **Breakpoint System**: Responsive grid sistemi

---

## 🔌 API Entegrasyonu

### RTK Query Kullanımı

```typescript
// Ürün listesi
const { data: products, isLoading } = useGetProductsQuery();

// Sepete ekleme
const [addToCart] = useAddToCartMutation();
await addToCart({ variantId: 1, quantity: 2 });

// Login
const [loginUser] = useLoginUserMutation();
await loginUser({ email: 'user@example.com', password: 'password' });
```

### API Endpoint'leri

| Endpoint | Method | Açıklama |
|----------|--------|----------|
| `/api/products` | GET | Ürün listesi |
| `/api/products/{id}` | GET | Ürün detayı |
| `/api/cart` | GET/POST | Sepet işlemleri |
| `/api/auth/login` | POST | Kullanıcı girişi |
| `/api/auth/register` | POST | Kullanıcı kaydı |
| `/api/orders` | POST | Sipariş oluşturma |

### Token Yönetimi

```typescript
// User token (giriş yapmış kullanıcılar)
const userToken = getToken();

// Guest token (misafir kullanıcılar)
const guestToken = getGuestToken();

// API isteklerinde otomatik token gönderimi
headers.set('Authorization', `Bearer ${token}`);
```

---

## 🚀 Deployment

### Production Build

```bash
# Tüm uygulamaları build et
pnpm build

# Production sunucusunu başlat
pnpm start
```

### Docker Deployment

```bash
# Docker image oluştur
docker build -t kayra-ecommerce .

# Container çalıştır
docker run -p 3000:3000 -p 3001:3001 -p 3002:3002 kayra-ecommerce
```

### Environment Variables

**Production için gerekli değişkenler:**
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_HOST_URL=https://yourdomain.com
NEXT_PUBLIC_PRODUCTS_URL=https://products.yourdomain.com
NEXT_PUBLIC_BASKET_URL=https://basket.yourdomain.com
```

---

## 🧪 Test

### Test Çalıştırma

```bash
# Tüm testleri çalıştır
pnpm test

# Test coverage
pnpm test:coverage

# E2E testler
pnpm test:e2e
```

### Test Türleri

- **Unit Tests**: Bileşen ve utility testleri
- **Integration Tests**: API entegrasyon testleri
- **E2E Tests**: Kullanıcı akış testleri

---

## 📚 Dokümantasyon

### Proje Dokümantasyonu

Detaylı proje dokümantasyonu için:
- [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)

### API Dokümantasyonu

Backend API dokümantasyonu:
- [Backend Repository](https://github.com/sgokhanbirkin/e-commerce-app-BE)
- [API Docs](http://localhost:8080/api-docs)

---

## 🤝 Katkıda Bulunma

### Geliştirme Süreci

1. **Fork yapın**
2. **Feature branch oluşturun** (`git checkout -b feature/amazing-feature`)
3. **Değişikliklerinizi commit edin** (`git commit -m 'feat: add amazing feature'`)
4. **Branch'inizi push edin** (`git push origin feature/amazing-feature`)
5. **Pull Request oluşturun**

### Commit Mesaj Formatı

```
<type>(<scope>): <short summary>

Types:
- feat: new feature
- fix: bug fix
- refactor: code refactoring
- docs: documentation
- test: test additions
- chore: maintenance tasks
```

### Kod Standartları

- **TypeScript**: Strict mode kullanımı
- **ESLint**: Kod kalitesi kontrolü
- **Prettier**: Kod formatlaması
- **SOLID**: Yazılım prensipleri

---

## 📞 Destek

### İletişim

- **Email**: support@kayraexport.com
- **GitHub Issues**: [Repository Issues](https://github.com/sgokhanbirkin/kayra-export-e-commerce-new/issues)
- **Backend Support**: [Backend Repository](https://github.com/sgokhanbirkin/e-commerce-app-BE)

### Sık Sorulan Sorular

**Q: Backend olmadan çalışır mı?**
A: Hayır, bu frontend projesi backend API'sine bağımlıdır. Backend'i de kurmanız gerekir.

**Q: Farklı portlarda çalıştırabilir miyim?**
A: Evet, environment dosyalarında port değişkenlerini düzenleyebilirsiniz.

**Q: Module Federation nasıl çalışır?**
A: Mikro frontend'ler arasında dinamik bileşen paylaşımı sağlar. Detaylar için dokümantasyona bakın.

---

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

## 🙏 Teşekkürler

- **Next.js Team**: Harika framework için
- **Ant Design**: UI bileşenleri için
- **Redux Toolkit**: State management için
- **Turborepo**: Monorepo build sistemi için

---

**Built with ❤️ using Next.js 15, React 19, TypeScript, Ant Design, and Redux Toolkit**

---

> **Not**: Bu proje [E-commerce Backend API](https://github.com/sgokhanbirkin/e-commerce-app-BE) ile entegre çalışır. Backend'i de kurmanız gereklidir.
