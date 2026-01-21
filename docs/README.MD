# Bellora - Vinted Clone

## 📋 Projekt leírása

A **Bellora** egy Vinted-inspirált online használtruha-piactér alkalmazás, ahol a felhasználók eladhatják, megvásárolhatják és kedvencnek jelölhetik a használt ruhákat és egyéb tárgyakat. Az alkalmazás lehetővé teszi a felhasználók közötti kommunikációt, értékeléseket, valamint teljes körű rendelés- és szállításkezelést.

## 👨‍💻 Fejlesztők

- **Gere Dániel**
- **Csák Zoltán Barnabás**

## 🎨 Design

A projekt teljes UI/UX terve megtekinthető Figmában:
- **[Bellora Figma Design](https://www.figma.com/design/AojE6OGb2ZFhoMrUajjpGx/Bellora?node-id=0-1&t=MG26AZwRbQwF0x4a-1)**

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


## 🗄️ Adatbázis séma

### Táblák

#### Users (Felhasználók)
- `user_id` - Egyedi azonosító (elsődleges kulcs)
- `username` - Felhasználónév (egyedi)
- `email` - E-mail cím (egyedi)
- `password_hash` - Jelszó hash
- `join_date` - Regisztráció dátuma

#### Categories (Kategóriák)
- `category_id` - Egyedi azonosító (elsődleges kulcs)
- `name` - Kategória neve
- `parent_id` - Szülő kategória (hierarchikus struktúra)

#### Items (Termékek)
- `item_id` - Egyedi azonosító (elsődleges kulcs)
- `user_id` - Eladó azonosítója (külső kulcs)
- `category_id` - Kategória azonosítója (külső kulcs)
- `title` - Termék címe
- `description` - Termék leírása
- `price` - Ár
- `status` - Státusz ENUM (available, sold, reserved)
- `created_at` - Létrehozás dátuma

#### ItemImages (Termék képek)
- `image_id` - Egyedi azonosító (elsődleges kulcs)
- `item_id` - Termék azonosítója (külső kulcs)
- `image_url` - Kép URL/elérési útja
- `is_primary` - Főkép-e (boolean)
- `display_order` - Megjelenítési sorrend
- `uploaded_at` - Feltöltés dátuma

#### Orders (Rendelések)
- `order_id` - Egyedi azonosító (elsődleges kulcs)
- `buyer_id` - Vevő azonosítója (külső kulcs)
- `seller_id` - Eladó azonosítója (külső kulcs)
- `item_id` - Termék azonosítója (külső kulcs)
- `order_date` - Rendelés dátuma
- `status` - Rendelés státusza ENUM (pending, completed, cancelled)

#### Payments (Fizetések)
- `payment_id` - Egyedi azonosító (elsődleges kulcs)
- `order_id` - Rendelés azonosítója (külső kulcs)
- `amount` - Fizetett összeg
- `method` - Fizetési módszer
- `status` - Fizetés státusza ENUM (pending, completed, failed)
- `created_at` - Létrehozás dátuma

#### Messages (Üzenetek)
- `message_id` - Egyedi azonosító (elsődleges kulcs)
- `sender_id` - Küldő azonosítója (külső kulcs)
- `receiver_id` - Címzett azonosítója (külső kulcs)
- `content` - Üzenet tartalma
- `sent_at` - Küldés dátuma

#### Favorites (Kedvencek)
- `user_id` - Felhasználó azonosítója (összetett elsődleges kulcs)
- `item_id` - Termék azonosítója (összetett elsődleges kulcs)

#### Reviews (Értékelések)
- `review_id` - Egyedi azonosító (elsődleges kulcs)
- `reviewer_id` - Értékelő azonosítója (külső kulcs)
- `reviewed_user_id` - Értékelt felhasználó azonosítója (külső kulcs)
- `rating` - Értékelés (1-5 csillag)
- `comment` - Szöveges értékelés
- `created_at` - Létrehozás dátuma

#### Shipping (Szállítás)
- `shipping_id` - Egyedi azonosító (elsődleges kulcs)
- `order_id` - Rendelés azonosítója (külső kulcs)
- `address` - Szállítási cím
- `carrier` - Futárszolgálat
- `tracking_number` - Követőszám
- `status` - Szállítás státusza ENUM (processing, shipped, delivered, cancelled)
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

2. Hozz létre egy `.env` fájlt:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=bellora
JWT_SECRET=bellora_super_secret_jwt_key_2025
```

3. Indítsd el a szervert:
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
│   ├── models/              # Adatbázis modellek
│   ├── routes/              # API route-ok
│   ├── middleware/          # Middleware-ek
│   ├── utils/               # Segédfüggvények
│   ├── uploads/             # Feltöltött képek
│   └── server.js
│
├── bellora_schema.sql       # MySQL séma
├── Ballora_ERD.drawio       # ERD diagram
└── README.MD
```

## 💡 További fejlesztési ötletek


1. **Képfeltöltés és galéria**
   - Több kép feltöltése termékekhez
   - Képek optimalizálása és thumbnail generálás
   - Drag & drop funkcionalitás
   - Képszerkesztő (crop, rotate)

2. **Keresés és szűrés**
   - Full-text keresés
   - Szűrés ár, méret, márka, állapot szerint
   - Rendezési opciók (legújabb, legolcsóbb, stb.)
   - Autocomplete keresőmező

3. **Profil oldal**
   - Felhasználói profilok
   - Értékelések és visszajelzések megjelenítése
   - Saját termékek listája
   - Eladási statisztikák

4. **Valós idejű chat**
   - Socket.io alapú üzenetküldés
   - Online/offline státusz
   - Üzenet értesítések
   - Képküldés a chatben

5. **Értesítési rendszer**
   - Push értesítések
   - Email értesítések
   - In-app értesítések
   - Értesítési beállítások

6. **Fizetési integráció**
   - Stripe/PayPal integráció
   - Biztonságos fizetés
   - Tranzakció történet
   - Visszatérítések kezelése

7. **Speciális szűrők**
   - Mérettáblázat
   - Márka filter
   - Szín filter
   - Állapot (új, használt, megkímélt)

8. **Ajánló rendszer**
   - Hasonló termékek ajánlása
   - Személyre szabott ajánlatok
   - "Neked ajánljuk" szekció

9. **Közösségi funkciók**
   - Felhasználók követése
   - Kedvenc eladók
   - Profil megosztás

10. **Admin dashboard**
    - Felhasználók kezelése
    - Termékek moderálása
    - Statisztikák és grafikonok
    - Visszaélések kezelése

11. **Többnyelvűség**
    - i18n integráció
    - Magyar és angol nyelv
    - Nyelvváltó funkció

12. **SEO optimalizáció**
    - Meta tagek
    - Open Graph
    - Sitemap generálás
    - Structured data

13. **Mobilalkalmazás**
    - React Native verzió
    - Push notificationök
    - Natív funkciók használata

14. **Analytics és metrikák**
    - Google Analytics integráció
    - Felhasználói viselkedés követése
    - Konverziós metrikák
    - A/B tesztelés

15. **Prémium funkciók**
    - Kiemelt termékek
    - Előre sorolt listázás
    - Prémium badge
    - Hirdetési lehetőségek

17. **Wishlist és riasztások**
    - Kívánságlista
    - Árcsökkenési értesítések
    - Újra készleten értesítések

18. **Adatvédelem és biztonság**
    - GDPR megfelelés
    - Két-faktoros autentikáció
    - Adatok exportálása
    - Fiók törlés opció

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
- `GET /api/messages` - Üzenetek listája
- `POST /api/messages` - Üzenet küldése
- `GET /api/messages/:userId` - Chat egy felhasználóval

### Favorites
- `POST /api/favorites` - Kedvenc hozzáadása
- `DELETE /api/favorites/:itemId` - Kedvenc eltávolítása
- `GET /api/favorites` - Saját kedvencek

## 📊 Adatbázis diagram

Az adatbázis entitás-kapcsolat diagramja (ERD) megtalálható a `Ballora_ERD.drawio` fájlban. A diagram megtekintéséhez használja a [draw.io](https://app.diagrams.net/) alkalmazást.

**Készítette**: Gere Dániel & Csák Zoltán Barnabás | **Projekt**: Bellora - Vinted Clone





