# MemoTicaretSite

Staj kapsamında geliştirilen, uçtan uca çalışan **demo e-ticaret** uygulaması.
Admin paneli + müşteri (mağaza) tarafı olan tam yığın (full-stack) bir örnektir;
gerçek yayına/ödeme sistemine bağlanmaz, amaç bir e-ticaret sisteminin işleyişini
kurgulamaktır.

## Teknolojiler

| Katman | Teknoloji |
|--------|-----------|
| Frontend | Angular 22 (standalone components, lazy routing) |
| Backend | Node.js + Express 5 (REST API) |
| Veritabanı | PostgreSQL |
| ORM | Prisma 7 |
| Kimlik doğrulama | JWT (`Authorization: Bearer`) + bcrypt |
| Doğrulama | Zod |

## Klasör Yapısı

```
MemoTicaretSite/
├── backend/     # Node + Express + Prisma API
│   ├── prisma/  # schema.prisma, migrations, seed.js
│   └── src/     # config, middleware, routes, controllers, validators, utils
└── frontend/    # Angular uygulaması
    └── src/app/ # core, shared, customer, admin
```

## Hızlı Başlatma

Kurulum bir kez yapıldıysa (bkz. aşağıdaki Kurulum), projeyi tek tıkla başlatmak için:

- **macOS:** `baslat.command` dosyasına çift tıkla
- **Windows:** `baslat.bat` dosyasına çift tıkla

Betik backend ve frontend için iki ayrı terminal açar ve frontend hazır olunca
tarayıcıda `http://localhost:4200` adresini açar. Durdurmak için terminallerde `Ctrl+C`.

## Kurulum

### Ön koşullar
- Node.js, PostgreSQL (`eticaret` veritabanı), Angular CLI

### Backend
```bash
cd backend
npm install
cp .env.example .env          # DATABASE_URL ve JWT_SECRET değerlerini düzenle
npx prisma migrate dev        # şema + migration
npm run seed                  # örnek veri + admin kullanıcısı
npm run dev                   # http://localhost:3000
```

Seed ile oluşturulan varsayılan admin: `admin@example.com` / `admin123`

### Frontend
```bash
cd frontend
npm install
npm start                     # http://localhost:4200
```

Geliştirme ortamında frontend `http://localhost:3000/api` adresine istek atar
(`src/environments/environment.development.ts`).

## API Özeti

| Alan | Endpoint(ler) |
|------|---------------|
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Hesap | `PUT /api/auth/profile` (ad/e-posta), `PUT /api/auth/password` (şifre değiştir) |
| Ürünler | `GET/POST /api/products`, `GET/PUT/DELETE /api/products/:id` |
| Yorumlar | `GET/POST /api/products/:id/reviews` |
| Kategoriler | `GET/POST /api/categories`, `PUT/DELETE /api/categories/:id` |
| Sepet | `GET /api/cart`, `POST /api/cart/items`, `PUT/DELETE /api/cart/items/:id` |
| Siparişler | `POST/GET /api/orders` |
| Admin | `GET /api/admin/dashboard`, `GET /api/admin/users`, `GET /api/admin/orders`, `PUT /api/admin/orders/:id/status` |

Admin uçları hem frontend route guard hem backend middleware ile korunur; yetki
her zaman backend'de doğrulanır.
