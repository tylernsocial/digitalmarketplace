CREATE DATABASE  IF NOT EXISTS `resellstore` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `resellstore`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: resellstore
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `items` (
  `item_id` int NOT NULL AUTO_INCREMENT,
  `item_name` varchar(50) DEFAULT NULL,
  `item_condition` varchar(50) DEFAULT NULL,
  `size` varchar(20) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `item_photo` varchar(255) DEFAULT NULL,
  `member_id` int DEFAULT NULL,
  PRIMARY KEY (`item_id`),
  KEY `member_id` (`member_id`),
  CONSTRAINT `items_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `member` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` VALUES (1,'Shirt','New','S','pink shirt',10.00,'https://timoweiland.com/cdn/shop/products/DSC0057.jpg?v=1615236197',1),(2,'Cargos','Used - Old','M','baggy green cargos',15.00,'https://truewerk.com/cdn/shop/files/t1_werkpants_mens_olive_flat_lay_4825e693-f588-4813-bff0-1d4c46ce82ce.jpg?v=1713822726&width=2400',1),(3,'Carpenter Pants','Used - Barely Worn','M','baggy grey cargos',15.00,'https://truewerk.com/cdn/shop/files/t1_werkpants_mens_deep_grey_flat_lay_d96d9775-1978-452a-a21b-dcc6481cf051.jpg?v=1713822757&width=2400',1),(4,'Shirt','New','M','purple long sleeve',10.00,'https://www.budgetpromotion.ca/cdn/shop/products/gildan-heavy-cotton-womens-long-sleeve-t-shirt-5400l-long-sleeve-t-shirt-434198_2000x.jpg?v=1645570147',1),(5,'Shoes','Used - Barely Worn','S','Size US 6 Womens Vans',15.00,'https://images.vans.com/is/image/VansEU/VN000EE3NVY-HERO?wid=640&hei=800&fmt=jpeg&qlt=85,1&op_sharpen=1&resMode=sharp2&op_usm=1,1,6,0',1),(6,'Pink Dress','New','M','pink dress perfect for parties',20.00,'https://1bb47ed2a0c038093a3e-b3b89d92493ab2af3722f56201bd498a.ssl.cf2.rackcdn.com/product-hugerect-3044022-356147-1596529867-e307c07b005e2e2a5060ab11fad79759.jpg',1),(7,'Men\'s shirt','Used - Barely Worn','L','black and white',10.00,'https://www.stormtech.ca/cdn/shop/products/SFV-1_FRONT_Carbon_Black_54558b20-d2ec-4c10-ab28-9891035c040f.jpg?v=1675232294&width=1200',1),(8,'Levi\'s Jeans','New','L','jeans',30.00,'https://lsco.scene7.com/is/image/lsco/A55660005-front-pdp-ld?fmt=jpeg&qlt=70&resMode=sharp2&fit=crop,1&op_usm=0.6,0.6,8&wid=2000&hei=1840',1),(9,'Sweater','Used - Barely Worn','L','blue and white',20.00,'https://www.galthouseofyarn.ca/cdn/shop/files/Porcelain-sweater-2-le-knit-lene-holme-samsoee-samse-strikkeopskrift_medium2_1024x1024.jpg?v=1727459806',1),(10,'Trench Coat','Used - Barely Worn','M','beige trench coat',30.00,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbBBiUoB4FYnvwpc-bCMUFQPq7Q-HrS0HP9w&s',1),(11,'Shirt','New','L','red shirt',10.00,'https://m.media-amazon.com/images/I/81BWrKMZD0L._AC_UY1000_.jpg',1);
/*!40000 ALTER TABLE `items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fname` varchar(50) DEFAULT NULL,
  `lname` varchar(50) DEFAULT NULL,
  `address` text,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `role` enum('buyer','seller','middleman') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` VALUES (1,'Arcleah','Pascual','111','arcciepasc@gmail.com','1234','11111111111','seller'),(2,'Anthony','Tolentino','111','anthony@gmail.com','1234','1111111111','buyer'),(3,'Middleman',NULL,'111','middleman@gmail.com','1234','1111111111','middleman');
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `cost` decimal(10,2) DEFAULT NULL,
  `order_status` varchar(30) DEFAULT NULL,
  `member_id` int DEFAULT NULL,
  `items_id` int DEFAULT NULL,
  `funds_released` tinyint(1) DEFAULT '0',
  `archived` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`order_id`),
  KEY `member_id` (`member_id`),
  KEY `items_id` (`items_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `member` (`id`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`items_id`) REFERENCES `items` (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,15.00,'Shipping',2,2,NULL,0),(2,20.00,'Completed',2,6,1,1),(3,10.00,'Pending',2,7,0,0),(4,10.00,'Order Received',2,11,NULL,0);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `payment_type` enum('credit','debit') NOT NULL,
  `card_number` varchar(255) NOT NULL,
  `expiration_date` varchar(5) NOT NULL,
  `cvc` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`payment_id`),
  KEY `idx_card_number` (`card_number`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES (1,'debit','1234','02/27','123','2024-12-08 05:09:17'),(2,'debit','111','01/26','112','2024-12-08 05:12:35'),(3,'debit','111','11/27','123','2024-12-08 05:13:10'),(4,'debit','111','01/25','111','2024-12-08 05:25:52');
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction`
--

DROP TABLE IF EXISTS `transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction` (
  `transaction_id` int NOT NULL AUTO_INCREMENT,
  `transaction_status` varchar(50) NOT NULL,
  `transaction_date` date DEFAULT NULL,
  `total_cost` decimal(10,2) NOT NULL,
  `order_id` int NOT NULL,
  `member_id` int NOT NULL,
  `payment_id` int DEFAULT NULL,
  PRIMARY KEY (`transaction_id`),
  KEY `order_id` (`order_id`),
  KEY `member_id` (`member_id`),
  KEY `payment_id` (`payment_id`),
  CONSTRAINT `transaction_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `transaction_ibfk_2` FOREIGN KEY (`member_id`) REFERENCES `member` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `transaction_ibfk_3` FOREIGN KEY (`payment_id`) REFERENCES `payment` (`payment_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction`
--

LOCK TABLES `transaction` WRITE;
/*!40000 ALTER TABLE `transaction` DISABLE KEYS */;
INSERT INTO `transaction` VALUES (1,'Completed','2024-12-08',15.00,1,2,1),(2,'Completed','2024-12-08',20.00,2,2,2),(3,'Completed','2024-12-08',10.00,3,2,3),(4,'Completed','2024-12-08',10.00,4,2,4);
/*!40000 ALTER TABLE `transaction` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-07 22:28:57
