-- phpMyAdmin SQL Dump
-- version 6.0.0-dev+20251201.40f7317dad
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 08, 2025 at 06:09 PM
-- Server version: 8.4.3
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bellora`
--
CREATE DATABASE IF NOT EXISTS `bellora` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `bellora`;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `name`, `parent_id`) VALUES
(1, 'Ruházat', NULL),
(2, 'Elektronika', NULL),
(3, 'Bútor', NULL),
(4, 'Sport', NULL),
(5, 'Könyvek', NULL),
(6, 'Játékok', NULL),
(7, 'Konyha', NULL),
(8, 'Kert', NULL),
(9, 'Női ruházat', 1),
(10, 'Férfi ruházat', 1),
(11, 'Laptopok', 2),
(12, 'Telefonok', 2);

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `user_id` int NOT NULL,
  `item_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `favorites`
--

INSERT INTO `favorites` (`user_id`, `item_id`) VALUES
(2, 1),
(5, 2),
(1, 3),
(3, 4),
(2, 6),
(4, 7),
(5, 8),
(3, 9),
(1, 10),
(5, 11),
(2, 12),
(4, 13),
(1, 14),
(2, 14),
(3, 15),
(4, 16),
(5, 17);

-- --------------------------------------------------------

--
-- Table structure for table `itemimages`
--

CREATE TABLE `itemimages` (
  `image_id` int NOT NULL,
  `item_id` int NOT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_primary` tinyint(1) DEFAULT '0',
  `display_order` int DEFAULT '0',
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `item_id` int NOT NULL,
  `user_id` int NOT NULL,
  `category_id` int NOT NULL,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) NOT NULL,
  `status` enum('available','sold','reserved') COLLATE utf8mb4_unicode_ci DEFAULT 'available',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`item_id`, `user_id`, `category_id`, `title`, `description`, `price`, `status`, `created_at`) VALUES
(1, 1, 9, 'Zara elegáns nyári ruha', 'Gyönyörű kék színű nyári ruha, S méret. Csak egyszer volt felvéve, majdnem új állapotban. Kiváló minőségű anyag, tökéletes nyári estékre vagy partikra.', 1250.00, 'available', '2025-11-27 19:22:09'),
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

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `message_id` int NOT NULL,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `sent_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `offer_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`message_id`, `sender_id`, `receiver_id`, `content`, `sent_at`, `offer_id`) VALUES
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
(13, 1, 5, 'Árajánlatom a \"LEGO Star Wars építőkészlet\" termékre: 30000 Ft', '2025-12-02 19:29:08', NULL),

-- --------------------------------------------------------

--
-- Table structure for table `offers`
--

CREATE TABLE `offers` (
  `offer_id` int NOT NULL,
  `item_id` int NOT NULL,
  `buyer_id` int NOT NULL,
  `seller_id` int NOT NULL,
  `offer_price` decimal(10,2) NOT NULL,
  `status` enum('pending','accepted','rejected','counter_offered') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `counter_price` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `offers`
--

INSERT INTO `offers` (`offer_id`, `item_id`, `buyer_id`, `seller_id`, `offer_price`, `status`, `counter_price`, `created_at`, `updated_at`) VALUES
(1, 14, 1, 5, 30000.00, 'pending', NULL, '2025-12-02 19:39:59', '2025-12-02 19:39:59'),
(2, 10, 1, 4, 200000.00, 'pending', NULL, '2025-12-02 21:09:03', '2025-12-02 21:09:03'),
(4, 6, 1, 3, 11000.00, 'pending', NULL, '2025-12-02 21:21:35', '2025-12-02 21:21:35'),
(5, 3, 1, 2, 130000.00, 'pending', NULL, '2025-12-02 21:27:58', '2025-12-02 21:27:58'),
(6, 3, 1, 2, 130000.00, 'pending', NULL, '2025-12-02 21:30:11', '2025-12-02 21:30:11');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int NOT NULL,
  `buyer_id` int NOT NULL,
  `seller_id` int NOT NULL,
  `item_id` int NOT NULL,
  `order_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending','completed','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `buyer_id`, `seller_id`, `item_id`, `order_date`, `status`) VALUES
(1, 2, 1, 4, '2025-11-17 19:22:09', 'completed'),
(2, 4, 3, 11, '2025-11-12 19:22:09', 'completed'),
(3, 3, 4, 18, '2025-11-26 19:22:09', 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_id` int NOT NULL,
  `order_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `method` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('pending','completed','failed') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `review_id` int NOT NULL,
  `reviewer_id` int NOT NULL,
  `reviewed_user_id` int NOT NULL,
  `rating` int NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`review_id`, `reviewer_id`, `reviewed_user_id`, `rating`, `comment`, `created_at`) VALUES
(1, 2, 1, 5, 'Nagyon kedves eladó, pontos és megbízható! A termék pont olyan volt mint a leírásban.', '2025-11-22 19:22:09'),
(2, 3, 2, 5, 'Gyors kommunikáció, tisztességes ár. Ajánlom!', '2025-11-24 19:22:09'),
(3, 1, 3, 4, 'Jó minőségű termék, kis késéssel de megkaptam.', '2025-11-26 19:22:09'),
(4, 4, 2, 5, 'Professzionális eladó, minden rendben volt!', '2025-11-27 19:22:09'),
(5, 5, 4, 5, 'Gyors ügyintézés, pontos leírás. Köszönöm!', '2025-11-29 19:22:09');

-- --------------------------------------------------------

--
-- Table structure for table `shipping`
--

CREATE TABLE `shipping` (
  `shipping_id` int NOT NULL,
  `order_id` int NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `carrier` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tracking_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('processing','shipped','delivered','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'processing'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postal_code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `join_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `daily_offers_count` int DEFAULT '0',
  `last_offer_reset` date DEFAULT NULL,
  `profile_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password_hash`, `full_name`, `phone`, `address`, `city`, `postal_code`, `join_date`, `daily_offers_count`, `last_offer_reset`, `profile_image`) VALUES
(1, 'anna_fashion', 'anna@example.com', '$2b$10$hR90GLItIK2P2xQB78dsmu2mtNmhY6M7VEMkMAZtFIcSqMqwWUXZm', 'Kiss Anna', '+36301234567', NULL, 'Budapest', NULL, '2025-06-02 18:22:09', 0, '2025-12-04', NULL),
(2, 'peter_tech', 'peter@example.com', '$2b$10$hR90GLItIK2P2xQB78dsmu2mtNmhY6M7VEMkMAZtFIcSqMqwWUXZm', 'Nagy Péter', '+36309876543', NULL, 'Debrecen', NULL, '2025-08-02 18:22:09', 0, NULL, NULL),
(3, 'eva_home', 'eva@example.com', '$2b$10$hR90GLItIK2P2xQB78dsmu2mtNmhY6M7VEMkMAZtFIcSqMqwWUXZm', 'Tóth Éva', '+36205551234', NULL, 'Szeged', NULL, '2025-09-02 18:22:09', 0, NULL, NULL),
(4, 'janos_sport', 'janos@example.com', '$2b$10$hR90GLItIK2P2xQB78dsmu2mtNmhY6M7VEMkMAZtFIcSqMqwWUXZm', 'Szabó János', '+36707778899', NULL, 'Pécs', NULL, '2025-10-02 18:22:09', 0, NULL, NULL),
(5, 'zsuzsa_books', 'zsuzsa@example.com', '$2b$10$hR90GLItIK2P2xQB78dsmu2mtNmhY6M7VEMkMAZtFIcSqMqwWUXZm', 'Horváth Zsuzsa', '+36303334455', NULL, 'Győr', NULL, '2025-11-02 19:22:09', 0, NULL, NULL);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`user_id`,`item_id`),
  ADD KEY `idx_item_id` (`item_id`);

--
-- Indexes for table `itemimages`
--
ALTER TABLE `itemimages`
  ADD PRIMARY KEY (`image_id`),
  ADD KEY `idx_item_id` (`item_id`),
  ADD KEY `idx_is_primary` (`is_primary`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`item_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_category_id` (`category_id`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `idx_sender_id` (`sender_id`),
  ADD KEY `idx_receiver_id` (`receiver_id`),
  ADD KEY `fk_messages_offer` (`offer_id`);

--
-- Indexes for table `offers`
--
ALTER TABLE `offers`
  ADD PRIMARY KEY (`offer_id`),
  ADD KEY `idx_item_id` (`item_id`),
  ADD KEY `idx_buyer_id` (`buyer_id`),
  ADD KEY `idx_seller_id` (`seller_id`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `idx_buyer_id` (`buyer_id`),
  ADD KEY `idx_seller_id` (`seller_id`),
  ADD KEY `idx_item_id` (`item_id`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD UNIQUE KEY `order_id` (`order_id`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `idx_reviewer_id` (`reviewer_id`),
  ADD KEY `idx_reviewed_user_id` (`reviewed_user_id`);

--
-- Indexes for table `shipping`
--
ALTER TABLE `shipping`
  ADD PRIMARY KEY (`shipping_id`),
  ADD UNIQUE KEY `order_id` (`order_id`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `itemimages`
--
ALTER TABLE `itemimages`
  MODIFY `image_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `item_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `message_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `offers`
--
ALTER TABLE `offers`
  MODIFY `offer_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `shipping`
--
ALTER TABLE `shipping`
  MODIFY `shipping_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`category_id`) ON DELETE SET NULL;

--
-- Constraints for table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE CASCADE;

--
-- Constraints for table `itemimages`
--
ALTER TABLE `itemimages`
  ADD CONSTRAINT `itemimages_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE CASCADE;

--
-- Constraints for table `items`
--
ALTER TABLE `items`
  ADD CONSTRAINT `items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `items_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE RESTRICT;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `fk_messages_offer` FOREIGN KEY (`offer_id`) REFERENCES `offers` (`offer_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `offers`
--
ALTER TABLE `offers`
  ADD CONSTRAINT `offers_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `offers_ibfk_2` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `offers_ibfk_3` FOREIGN KEY (`seller_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`seller_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE RESTRICT;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`reviewer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`reviewed_user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `shipping`
--
ALTER TABLE `shipping`
  ADD CONSTRAINT `shipping_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
