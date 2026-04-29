# Bellora - Vinted Clone

## 📋 Projekt leírása

A **Bellora** egy Vinted-inspirált online használtruha-piactér alkalmazás, ahol a felhasználók eladhatják, megvásárolhatják és kedvencnek jelölhetik a használt ruhákat és egyéb tárgyakat. Az alkalmazás lehetővé teszi a felhasználók közötti kommunikációt, értékeléseket, valamint teljes körű rendelés- és szállításkezelést.

## 👨‍💻 Fejlesztők

- **Gere Dániel**
- **Csák Zoltán Barnabás**

## 🔗 Hasznos linkek

- **[Figma Design](https://www.figma.com/design/AojE6OGb2ZFhoMrUajjpGx/Bellora?node-id=0-1&t=MG26AZwRbQwF0x4a-1)** - A projekt teljes UI/UX terve
- **[OnlineGantt](https://www.onlinegantt.com/)** - A projekt ütemtervének (`Gantt diagram.gantt`) megtekintéséhez

## 🛠️ Technológiai stack

### Frontend
- **React** (v18+)
- **React Router** - Navigáció
- **Axios** - HTTP kérések
- **Tailwind CSS** - UI komponensek és styling
- **Context API** - State management
- **Socket.io-client** - Valós idejű üzenetküldés (WebSocket)

### Backend
- **Node.js** (v18+)
- **Express.js** - REST API
- **Nodemon** - Automatikus szerver újraindítás fejlesztés közben
- **MySQL** - Adatbázis
- **Prisma** - Adatbázis schema létrehozása
- **JWT** - Autentikáció
- **bcrypt** - Jelszó titkosítás
- **Socket.io** - WebSocket kommunikáció valós idejű chathez
- **Multer** - Fájl feltöltés (képek)

### Tesztelés
- **Jest** - Backend egység- és integrációs tesztek
- **Playwright** - Frontend End-to-End (E2E) tesztek

## 🎯 Főbb funkciók

✅ **Elkészült funkciók:**
- **Felhasználókezelés**: Regisztráció, bejelentkezés JWT tokenekkel
- **Hirdetés feltöltés**: Képfeltöltéssel, részletes leírással, kategóriákkal
- **Hirdetések böngészése**: Dark témájú, responsive kártya alapú megjelenítés
- **Védett útvonalak**: Protected routes bejelentkezéshez kötött oldalakhoz
- **Valós idejű chat**: Socket.io alapú üzenetküldés eladók és vevők között
- **Árajánlat küldés**: Hirdetésekre közvetlenül lehet ajánlatot tenni
- **Kedvencek**: Termékek mentése kedvencek közé
- **Saját hirdetések**: Felhasználók saját hirdetéseinek kezelése
- **Beszélgetések**: Összes beszélgetés listája és chat felület
- **Admin dashboard**: Felhasználók és hirdetések kezelése, moderálása
- **Tesztelés**: Backend egységtesztek (Jest) és frontend E2E tesztek (Playwright)


## 🗄️ Adatbázis séma (Prisma ORM)

A projekt adatbázisát a **Prisma** kezeli. A teljes, naprakész séma a `backend/prisma/schema.prisma` fájlban található.

### Főbb modellek

- **users**: Felhasználói fiókok (vásárlók és adminok a `role` alapján).
- **categories**: Termékkategóriák hierarchikus felépítéssel (`parent_id`).
- **items**: Feltöltött hirdetések/termékek állapotokkal (elérhető, eladva, lefoglalva).
- **itemimages**: Termékekhez tartozó képek (több kép, `is_primary` beállítással).
- **offers**: Árajánlatok a vevők részéről az eladók felé (viszontajánlat támogatással).
- **orders**: Leadott rendelések.
- **payments**: Fizetési tranzakciók.
- **shipping**: Szállítási adatok és nyomkövetés.
- **messages**: Valós idejű chat üzenetek (akár egy konkrét ajánlathoz, `offer_id` kötve).
- **favorites**: Felhasználók kedvenc termékei.
- **reviews**: Felhasználói értékelések (1-5 csillagos skálán).
- **reports**: Moderálásra váró jelentések és visszaélések.
## 🚀 Telepítés és indítás

### Előfeltételek
- Node.js 18+
- MySQL 8.0+
- npm

### Backend telepítése

1. Navigálj a backend mappába:
```bash
cd backend
npm install
```

2. Hozz létre egy `.env` fájlt (állítsd be a Prisma `DATABASE_URL`-t):
```env
PORT=5000
DATABASE_URL="mysql://root:@localhost:3306/bellora"
JWT_SECRET=bellora_super_secret_jwt_key_2025
```

3. Inicializáld az adatbázist a Prismával:
```bash
npx prisma generate
npx prisma db push
```

4. Indítsd el a szervert:
```bash
npm run dev
```

### Frontend telepítése

1. Navigálj a frontend mappába:
```bash
cd frontend
npm install
```

2. Hozz létre egy `.env` fájlt:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

3. Indítsd el a frontend alkalmazást:
```bash
npm run dev
```

## 📂 Projekt struktúra

```
Bellora/
├── frontend/                 # React alkalmazás
│   ├── public/
│   ├── src/
│   │   ├── components/      # UI komponensek
│   │   ├── pages/           # Oldalak
│   │   ├── services/        # API hívások
│   │   ├── context/         # Context API
│   │   ├── hooks/           # Custom hooks
│   │   ├── utils/           # Segédfüggvények
│   │   └── App.jsx
│   └── package.json
│
├── backend/                  # Node.js szerver
│   ├── config/              # Konfigurációk
│   ├── controllers/         # Route controllerek
│   ├── prisma/              # Prisma adatbázis sémák és modellek
│   ├── routes/              # API route-ok
│   ├── middleware/          # Middleware-ek
│   ├── utils/               # Segédfüggvények
│   ├── uploads/             # Feltöltött képek
│   └── server.js
│
├── docs/                     # Dokumentációk, diagramok (README.md, Gantt)
```

## 📝 API Endpoints

### Auth
- `POST /api/auth/register` - Regisztráció ✅
- `POST /api/auth/login` - Bejelentkezés ✅
- `GET /api/auth/me` - Aktuális felhasználó ✅

### Items (Hirdetések)
- `GET /api/items` - Összes hirdetés listája ✅
- `GET /api/items/:id` - Hirdetés részletei ✅
- `POST /api/items` - Új hirdetés létrehozása (védett) ✅
- `POST /api/items/:id/images` - Kép feltöltése hirdetéshez (védett) ✅
- `GET /api/my-items` - Saját hirdetések listája (védett) ✅

### Messages (Üzenetek)
- `GET /api/conversations` - Beszélgetések listája (védett) ✅
- `GET /api/messages/:userId` - Üzenetek egy felhasználóval (védett) ✅
- `POST /api/messages` - Üzenet küldése (védett) ✅

### Favorites (Kedvencek)
- `GET /api/favorites` - Kedvenc hirdetések (védett) ✅
- `POST /api/favorites` - Kedvenc hozzáadása (védett) ✅
- `DELETE /api/favorites/:itemId` - Kedvenc eltávolítása (védett) ✅

### Categories (Kategóriák)
- `GET /api/categories` - Kategóriák listája ✅

### Offers (Ajánlatok)
- `POST /api/offers` - Ajánlat küldése ✅
- `GET /api/offers/item/:itemId` - Ajánlatok egy termékhez ✅
- `PUT /api/offers/:offerId/accept` - Ajánlat elfogadása ✅
- `PUT /api/offers/:offerId/reject` - Ajánlat elutasítása ✅
- `PUT /api/offers/:offerId/counter` - Viszontajánlat tétele ✅

### Orders (Rendelések)
- `POST /api/orders` - Rendelés leadása ✅
- `GET /api/orders/my-orders` - Saját rendelések ✅
- `GET /api/orders/my-sales` - Saját eladások ✅
- `PUT /api/orders/:id/status` - Rendelés állapotának frissítése ✅

### Reports (Jelentések)
- `POST /api/reports` - Visszaélés jelentése ✅

### Admin (Adminisztráció)
- `GET /api/admin/stats` - Dashboard statisztikák ✅
- `GET /api/admin/users` - Felhasználók kezelése ✅
- `GET /api/admin/items` - Termékek moderálása ✅
- `GET /api/admin/reports` - Jelentések listája ✅


**Készítette**: Gere Dániel & Csák Zoltán Barnabás | **Projekt**: Bellora - Vinted Clone





