-- Bellora Database Sample Data
-- This file contains sample data for testing the Bellora marketplace application

USE bellora;

-- Insert sample users
INSERT INTO users (user_id, username, email, password_hash, full_name, phone, address, city, postal_code, join_date, daily_offers_count, last_offer_reset, profile_image) VALUES
(1, 'anna_fashion', 'anna@example.com', '$2b$10$hR90GLItIK2P2xQB78dsmu2mtNmhY6M7VEMkMAZtFIcSqMqwWUXZm', 'Kiss Anna', '+36301234567', 'Petőfi u. 12', 'Budapest', '1052', '2025-06-02 18:22:09', 0, '2025-12-04', '/uploads/profile1.jpg'),
(2, 'peter_tech', 'peter@example.com', '$2b$10$hR90GLItIK2P2xQB78dsmu2mtNmhY6M7VEMkMAZtFIcSqMqwWUXZm', 'Nagy Péter', '+36309876543', 'Kossuth Lajos u. 45', 'Debrecen', '4025', '2025-08-02 18:22:09', 0, NULL, '/uploads/profile2.jpg'),
(3, 'eva_home', 'eva@example.com', '$2b$10$hR90GLItIK2P2xQB78dsmu2mtNmhY6M7VEMkMAZtFIcSqMqwWUXZm', 'Tóth Éva', '+36205551234', 'Rákóczi út 78', 'Szeged', '6721', '2025-09-02 18:22:09', 0, NULL, '/uploads/profile3.jpg'),
(4, 'janos_sport', 'janos@example.com', '$2b$10$hR90GLItIK2P2xQB78dsmu2mtNmhY6M7VEMkMAZtFIcSqMqwWUXZm', 'Szabó János', '+36707778899', 'Dózsa György út 23', 'Pécs', '7621', '2025-10-02 18:22:09', 0, NULL, '/uploads/profile4.jpg'),
(5, 'zsuzsa_books', 'zsuzsa@example.com', '$2b$10$hR90GLItIK2P2xQB78dsmu2mtNmhY6M7VEMkMAZtFIcSqMqwWUXZm', 'Horváth Zsuzsa', '+36303334455', 'Váci út 101', 'Győr', '9021', '2025-11-02 19:22:09', 0, NULL, '/uploads/profile5.jpg');

-- Insert sample items
INSERT INTO items (item_id, user_id, category_id, title, description, price, status, created_at) VALUES
(1, 1, 9, 'Zara elegáns nyári ruha', 'Gyönyörű kék színű nyári ruha, S méret. Csak egyszer volt felvéve, majdnem új állapotban. Kiváló minőségű anyag, tökéletes nyári estékre vagy partikra.', 12500.00, 'available', '2025-11-27 19:22:09'),
(2, 1, 9, 'H&M fekete nadrág', 'Klasszikus fekete nadrág M méretben. Pamut keverék, nagyon kényelmes. Irodai viseletnek tökéletes.', 5500.00, 'available', '2025-11-22 19:22:09'),
(3, 2, 11, 'Lenovo ThinkPad T490', 'Kiváló állapotú laptop, 16GB RAM, 512GB SSD, i5 processzor. Üzleti használatra ideális. Minden tartozékkal együtt, eredeti táskával.', 185000.00, 'available', '2025-11-29 19:22:09'),
(4, 2, 12, 'iPhone 12 64GB', 'Fekete színű iPhone 12, 64GB tárhely. 1 éves használat után. Apró karcolások a hátlapon, képernyő tökéletes. Dobozzal, töltővel.', 165000.00, 'sold', '2025-11-17 19:22:09'),
(5, 2, 2, 'Samsung Galaxy Watch 4', 'Fekete színű okosóra, 44mm-es. Alig használt, új állapotban. Szilikon szíj + fém szíj is jár hozzá. Doboz és töltő mellé.', 45000.00, 'available', '2025-11-25 19:22:09'),
(6, 3, 3, 'IKEA MALM komód', 'Fehér színű 4 fiókos komód. Kiváló állapot, alig használt. Összeszerelve, helyben átvehető Szegeden. Méretek: 80x100x48 cm.', 15000.00, 'available', '2025-11-20 19:22:09'),
(7, 3, 7, 'Philips Airfryer', 'XXL méretű olaj nélküli sütő. 2 éves, kiváló állapotban. Minden tartozékkal, eredeti dobozzal. Könnyen tisztítható, nagyon gazdaságos.', 28000.00, 'reserved', '2025-11-28 19:22:09'),
(8, 3, 3, 'Fa étkezőasztal + 4 szék', 'Masszív fa étkezőgarnitúra. Asztal: 120x80 cm, 4 db kárpitozott székkel. Szép állapot, strapabíró. Budán átvehető.', 45000.00, 'available', '2025-11-24 19:22:09'),
(9, 4, 4, 'Decathlon túracipő', 'Quechua márkájú túracipő, 43-as méret. Vízálló, kiváló tapadás. Néhányszor volt használva, szinte új. Eredeti ár: 25.000 Ft.', 15000.00, 'available', '2025-11-26 19:22:09'),
(10, 4, 4, 'Profi kerékpár (MTB)', 'Scott Scale 970 hegyi kerékpár. Carbon váz, Shimano váltó, hidraulikus fékek. L váz, kiváló állapot. Szervizelt, azonnal használható.', 285000.00, 'available', '2025-11-30 19:22:09'),
(11, 4, 4, 'Jóga szőnyeg + súlyzók', 'Vastagabb jóga matrac + 2x2 kg-os kézi súlyzó. Lila színű szőnyeg, alig használt. Otthoni edzéshez tökéletes.', 6500.00, 'sold', '2025-11-12 19:22:09'),
(12, 5, 5, 'Harry Potter teljes sorozat', 'Minden kötet kemény kötésben, újszerű állapotban. J.K. Rowling összes HP kötete magyarul. Gyűjtői darab!', 18000.00, 'available', '2025-11-23 19:22:09'),
(13, 5, 5, 'Game of Thrones könyvek', 'George R.R. Martin: Trónok harca sorozat első 5 kötete. Puhatáblás kiadás, jó állapotban. Olvasás után árulom.', 12000.00, 'available', '2025-11-27 19:22:09'),
(14, 5, 6, 'LEGO Star Wars építőkészlet', 'Millennium Falcon LEGO szett (75257). Bontatlan, eredeti csomagolásban. Gyűjtői érték! Limitált kiadás.', 95000.00, 'available', '2025-12-01 19:22:09'),
(15, 1, 9, 'Nike sportcipő', 'Fehér-rózsaszín Nike Air Max, 38-as méret. Párszor használt, tiszta állapot. Női futócipő, nagyon kényelmes.', 18500.00, 'available', '2025-11-21 19:22:09'),
(16, 2, 2, 'Apple AirPods Pro', 'Első generációs AirPods Pro. Zajszűrős fülhallgató, kiváló állapot. Dobozzal, összes pótfüllel és töltőtokkal.', 38000.00, 'available', '2025-11-24 19:22:09'),
(17, 3, 7, 'Tescoma késkészlet', '6 darabos professzionális késkészlet faállvánnyal. Rozsdamentes acél, élesített. Újszerű, alig használt.', 9500.00, 'available', '2025-11-18 19:22:09'),
(18, 4, 8, 'Elektromos fűnyíró', 'Bosch Rotak 32. Kábelozós fűnyíró, 1200W. 2 éves, működik tökéletesen. Kertészkedés felhagyása miatt.', 22000.00, 'reserved', '2025-11-26 19:22:09'),
(19, 5, 5, 'Stephen King - Fény című könyv', 'Horror remekműve, keménytáblás kiadás. Kiváló állapot, csak egyszer olvastam. Rajongóknak kötelező!', 3500.00, 'available', '2025-11-29 19:22:09'),
(20, 1, 10, 'Tommy Hilfiger férfi póló', 'L méretű pólóing, kék-fehér csíkos. Márkás darab, premium minőség. Mosás után kissé ment be, ezért adom.', 7500.00, 'available', '2025-11-25 19:22:09');

-- Insert sample item images
INSERT INTO itemimages (image_id, item_id, image_url, is_primary, display_order, uploaded_at) VALUES
(1, 1, '/uploads/items/1_1.jpg', 1, 1, '2025-11-27 19:22:09'),
(2, 2, '/uploads/items/2_1.jpg', 1, 1, '2025-11-22 19:22:09'),
(3, 3, '/uploads/items/3_1.jpg', 1, 1, '2025-11-29 19:22:09'),
(4, 3, '/uploads/items/3_2.jpg', 0, 2, '2025-11-29 19:22:09'),
(5, 4, '/uploads/items/4_1.jpg', 1, 1, '2025-11-17 19:22:09'),
(6, 5, '/uploads/items/5_1.jpg', 1, 1, '2025-11-25 19:22:09'),
(7, 6, '/uploads/items/6_1.jpg', 1, 1, '2025-11-20 19:22:09'),
(8, 7, '/uploads/items/7_1.jpg', 1, 1, '2025-11-28 19:22:09'),
(9, 8, '/uploads/items/8_1.jpg', 1, 1, '2025-11-24 19:22:09'),
(10, 9, '/uploads/items/9_1.jpg', 1, 1, '2025-11-26 19:22:09'),
(11, 10, '/uploads/items/10_1.jpg', 1, 1, '2025-11-30 19:22:09'),
(12, 11, '/uploads/items/11_1.jpg', 1, 1, '2025-11-12 19:22:09'),
(13, 12, '/uploads/items/12_1.jpg', 1, 1, '2025-11-23 19:22:09'),
(14, 13, '/uploads/items/13_1.jpg', 1, 1, '2025-11-27 19:22:09'),
(15, 14, '/uploads/items/14_1.jpg', 1, 1, '2025-12-01 19:22:09'),
(16, 15, '/uploads/items/15_1.jpg', 1, 1, '2025-11-21 19:22:09'),
(17, 16, '/uploads/items/16_1.jpg', 1, 1, '2025-11-24 19:22:09'),
(18, 17, '/uploads/items/17_1.jpg', 1, 1, '2025-11-18 19:22:09'),
(19, 18, '/uploads/items/18_1.jpg', 1, 1, '2025-11-26 19:22:09'),
(20, 19, '/uploads/items/19_1.jpg', 1, 1, '2025-11-29 19:22:09'),
(21, 20, '/uploads/items/20_1.jpg', 1, 1, '2025-11-25 19:22:09');

-- Insert sample favorites
INSERT INTO favorites (user_id, item_id) VALUES
(2, 1), (5, 2), (1, 3), (3, 4), (2, 6), (4, 7), (5, 8), (3, 9), (1, 10), (5, 11), (2, 12), (4, 13), (1, 14), (2, 14), (3, 15), (4, 16), (5, 17);

-- Insert sample messages
INSERT INTO messages (message_id, sender_id, receiver_id, content, sent_at, offer_id) VALUES
(1, 2, 1, 'Szia! Érdekelne a Zara ruha. Megalkudható az ára?', '2025-11-30 19:22:09', NULL),
(2, 1, 2, 'Helló! Kicsit igen, 11.000-ért odaadom :)', '2025-11-30 19:32:09', NULL),
(3, 2, 1, 'Szuper! Mikor tudnám átvenni Budapesten?', '2025-11-30 19:47:09', NULL),
(4, 1, 2, 'Hétvégén bármikor, írd meg mikor jó neked!', '2025-11-30 19:52:09', NULL),
(5, 3, 2, 'Érdeklődnék a laptop iránt. Van még garancia rajta?', '2025-12-01 19:22:09', NULL),
(6, 2, 3, 'Sajnos a gyári lejárt, de tökéletesen működik!', '2025-12-01 21:22:09', NULL),
(7, 4, 3, 'Az Airfryer még elérhető? Szegeden lakom.', '2025-12-02 14:22:09', NULL),
(8, 3, 4, 'Igen, elérhető! Találkozhatunk a Klauzál térnél.', '2025-12-02 15:22:09', NULL),
(9, 5, 4, 'A kerékpár még megvan? Milyen magasságú váz?', '2025-12-02 16:22:09', NULL),
(10, 4, 5, 'Megvan! L váz, kb 175-190 cm közötti magasságra jó.', '2025-12-02 17:22:09', NULL),
(11, 1, 5, 'A Harry Potter könyvek érdekelnének. Pestről jönnél Győrbe?', '2025-12-02 18:22:09', NULL),
(12, 5, 1, 'Postán is tudnám küldeni, utánvéttel 2000 Ft + postaköltség.', '2025-12-02 18:37:09', NULL),
(13, 1, 5, 'Árajánlatom a \"LEGO Star Wars építőkészlet\" termékre: 30000 Ft', '2025-12-02 19:29:08', NULL);

-- Insert sample offers
INSERT INTO offers (offer_id, item_id, buyer_id, seller_id, offer_price, status, counter_price, created_at, updated_at) VALUES
(1, 14, 1, 5, 30000.00, 'pending', NULL, '2025-12-02 19:39:59', '2025-12-02 19:39:59'),
(2, 10, 1, 4, 200000.00, 'pending', NULL, '2025-12-02 21:09:03', '2025-12-02 21:09:03'),
(3, 6, 1, 3, 11000.00, 'pending', NULL, '2025-12-02 21:21:35', '2025-12-02 21:21:35'),
(4, 3, 1, 2, 130000.00, 'pending', NULL, '2025-12-02 21:27:58', '2025-12-02 21:27:58'),
(5, 3, 1, 2, 130000.00, 'pending', NULL, '2025-12-02 21:30:11', '2025-12-02 21:30:11');

-- Insert sample orders
INSERT INTO orders (order_id, buyer_id, seller_id, item_id, order_date, status) VALUES
(1, 2, 1, 4, '2025-11-17 19:22:09', 'completed'),
(2, 4, 3, 11, '2025-11-12 19:22:09', 'completed'),
(3, 3, 4, 18, '2025-11-26 19:22:09', 'pending');

-- Insert sample reviews
INSERT INTO reviews (review_id, reviewer_id, reviewed_user_id, rating, comment, created_at) VALUES
(1, 2, 1, 5, 'Nagyon kedves eladó, pontos és megbízható! A termék pont olyan volt mint a leírásban.', '2025-11-22 19:22:09'),
(2, 3, 2, 5, 'Gyors kommunikáció, tisztességes ár. Ajánlom!', '2025-11-24 19:22:09'),
(3, 1, 3, 4, 'Jó minőségű termék, kis késéssel de megkaptam.', '2025-11-26 19:22:09'),
(4, 4, 2, 5, 'Professzionális eladó, minden rendben volt!', '2025-11-27 19:22:09'),
(5, 5, 4, 5, 'Gyors ügyintézés, pontos leírás. Köszönöm!', '2025-11-29 19:22:09');