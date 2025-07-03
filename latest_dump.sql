-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: Signup
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `job_requests`
--

DROP TABLE IF EXISTS `job_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `serviceType` varchar(50) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `status` varchar(20) DEFAULT 'pending',
  `assignedWorkerId` int DEFAULT NULL,
  `timeSlot` varchar(50) DEFAULT NULL,
  `service_frequency` enum('one-time','weekly','bi-weekly','monthly') DEFAULT 'one-time',
  `special_instructions` text,
  `room_count` int DEFAULT NULL,
  `estimated_area` varchar(50) DEFAULT NULL,
  `preferred_gender` enum('male','female','no-preference') DEFAULT 'no-preference',
  `emergency_contact` varchar(15) DEFAULT NULL,
  `problem_description` text,
  `service_duration` varchar(20) DEFAULT NULL,
  `imagePath` varchar(255) DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `service_type` varchar(100) DEFAULT NULL,
  `description` text,
  `time` timestamp NULL DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `client_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_worker_assigned_01` (`assignedWorkerId`),
  CONSTRAINT `fk_worker_assigned_01` FOREIGN KEY (`assignedWorkerId`) REFERENCES `workers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_requests`
--

LOCK TABLES `job_requests` WRITE;
/*!40000 ALTER TABLE `job_requests` DISABLE KEYS */;
INSERT INTO `job_requests` VALUES (22,'shanaya',NULL,NULL,'Delhi','maid','2025-04-12','accepted',1,'10:00 - 12:00 PM','one-time',NULL,NULL,NULL,'no-preference',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(23,'nirjara',NULL,NULL,'Kailash Colony, Delhi','maid','2025-04-12','accepted',1,'08:00 - 10:00 AM','one-time',NULL,NULL,NULL,'no-preference',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(24,'nirjara',NULL,NULL,'Kailash Colony, Delhi','maid','2025-04-12','accepted',1,'08:00 - 10:00 AM','one-time',NULL,NULL,NULL,'no-preference',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(26,'Ananya',NULL,NULL,'krystal city, moshi , dehu alandi road , pune , maharashtra','maid','2025-04-13','accepted',1,'10:00 - 12:00 PM','one-time',NULL,NULL,NULL,'no-preference',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(27,'krishna more',NULL,NULL,'aurangabad ','maid','2025-04-15','accepted',1,'10:00 - 12:00 PM','one-time',NULL,NULL,NULL,'no-preference',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(29,'rajesh singh','07304939781','ananyasingh172006@gmail.com','Jhansi , India','maid','2025-05-03','accepted',1,'08:00 - 10:00 AM','one-time','',2,'','no-preference','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(30,'rajesh singh','07304939781','ananyasingh172006@gmail.com','Jhansi , India','maid','2025-05-02','accepted',1,'08:00 - 10:00 AM','one-time','',2,'','no-preference','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(31,'nirjara','07304939781','ananyasingh172006@gmail.com','hahan','maid','2025-05-02','accepted',1,'12:00 - 02:00 PM','one-time','',1,'','no-preference','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(32,'nirjara','07304939781','ananyasingh172006@gmail.com','hahan','maid','2025-05-02','accepted',1,'12:00 - 02:00 PM','one-time','',1,'','no-preference','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(33,'nirjara','07304939781','ananyasingh172006@gmail.com','hahan','maid','2025-05-02','accepted',1,'12:00 - 02:00 PM','one-time','',1,'','no-preference','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(34,'poonam singh','7304842978','abhinavsingh272009@gmail.com','Pune','maid','2025-05-02','accepted',1,'08:00 - 10:00 AM','one-time','',1,'','no-preference','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(35,'poonam singh','7304842978','abhinavsingh272009@gmail.com','Pune','maid','2025-05-03','accepted',1,'10:00 - 12:00 PM','one-time','',-1,'','no-preference','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(36,'Shreyas','6382683367','iamshreyaskadam2004@gmail.com','flat no 4 thorave apartment pune maharashtra','maid','2025-05-03','accepted',1,'08:00 - 10:00 AM','one-time','',3,'600','male','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(37,'Shreyas','6382683367','202301090023@mitaoe.ac.in','flat no 4 thorave apartment pune maharashtra','maid','2025-05-03','accepted',1,'08:00 - 10:00 AM','one-time','',3,'600','male','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(45,'krishna more','6382683367','202301100049@gmail.com','Shiv Parvati Apartments, Shirode Rd, Gangarde Nagar, New Sangavi, Pune, Pimpri-Chinchwad, Maharashtra 411061','maid','2025-05-03','accepted',1,'10:00 - 12:00 PM','one-time','',2,'','no-preference','','','',NULL,18.51957,73.85535,NULL,NULL,NULL,NULL,NULL),(46,'krishna more','6382683367','202301100049@gmail.com','Shiv Parvati Apartments, Shirode Rd, Gangarde Nagar, New Sangavi, Pune, Pimpri-Chinchwad, Maharashtra 411061','maid','2025-05-03','accepted',1,'10:00 - 12:00 PM','one-time','',2,'','no-preference','','','',NULL,18.51957,73.85535,NULL,NULL,NULL,NULL,NULL),(47,'krishna more','6382683367','iamnirju@gmail.com','Shiv Parvati Apartments, Shirode Rd, Gangarde Nagar, New Sangavi, Pune, Pimpri-Chinchwad, Maharashtra 411061','maid','2025-05-04','accepted',1,'08:00 - 10:00 AM','one-time','',2,'','no-preference','','','',NULL,18.51957,73.85535,NULL,NULL,NULL,NULL,NULL),(48,'zunaira ahmed','7304842978','nirjaramore06@gmail.com','Krystal City, Dehu alandi road , chikhali,  Pune , Maharashtra','maid','2025-05-04','accepted',1,'08:00 - 10:00 AM','one-time','',2,'','no-preference','','','',NULL,18.68169557517267,73.83428319085446,NULL,NULL,NULL,NULL,NULL),(49,'nidhi singh','7304842978','ananyaaaasingh2027@gmail.com','Krystal City, Dehu alandi road , chikhali,  Pune , Maharashtra','plumber','2025-05-04','pending',NULL,'10:00 - 12:00 PM','one-time','',2,'','no-preference','','','',NULL,18.6806580243059,73.83404397075388,NULL,NULL,NULL,NULL,NULL),(50,'karan mehta','7304842978','ananyaaaasingh2027@gmail.com','Krystal City, Dehu alandi road , chikhali,  Pune , Maharashtra','maid','2025-05-04','accepted',1,'10:00 - 12:00 PM','one-time','',2,'','no-preference','','','',NULL,18.6806580243059,73.83404397075388,NULL,NULL,NULL,NULL,NULL),(51,'kasak singh','7304842978','ananyaaaasingh2027@gmail.com','sector 23, faridbad','maid','2025-05-07','accepted',1,'12:00 - 02:00 PM','one-time','',2,'','no-preference','','','4-hours',NULL,18.681301132830587,73.83421656302868,NULL,NULL,NULL,NULL,NULL),(52,'anjana patil','7304842978','ananyaaaasingh2027@gmail.com','Shiv Parvati Apartments, Shirode Rd, Gangarde Nagar, New Sangavi, Pune, Pimpri-Chinchwad, Maharashtra 411061','maid','2025-05-07','accepted',11,'12:00 - 02:00 PM','one-time','',2,'600','female','','','',NULL,18.674896647827484,73.89225107716703,NULL,NULL,NULL,NULL,NULL),(53,'nidhi singh','07304842978','ananyaaaasingh2027@gmail.com','Krystal City, Dehu alandi road , chikhali,  Pune , Maharashtra','maid','2025-05-09','pending',NULL,'12:00 - 02:00 PM','one-time','',2,'600','no-preference','','','',NULL,18.674896647827484,73.89225107716703,NULL,NULL,NULL,NULL,NULL),(54,'kasak singh','7304842978','ananyaaaasingh2027@gmail.com','MIT AOE , ALANDI , PUNE , maharashtra ','maid','2025-05-08','accepted',1,'02:00 - 04:00 PM','one-time','',2,'900','no-preference','','','',NULL,18.67294,73.88871,NULL,NULL,NULL,NULL,NULL),(55,'kasak singh','7304842978','ananyaaaasingh2027@gmail.com','MIT AOE , ALANDI , PUNE , maharashtra ','maid','2025-05-08','accepted',6,'08:00 - 10:00 AM','one-time','',2,'900','no-preference','','','',NULL,18.674841165687,73.89212286370316,NULL,NULL,NULL,NULL,NULL),(56,'Ananya Singh','8798989071','ananyaaaasingh2027@gmail.com','Adore Happy Homes , sector 86 , budhena , greater faridabad , haryana','plumber','2025-06-10','pending',NULL,'12:00 - 02:00 PM','weekly','',1,'','male','','','4-hours',NULL,18.546688,73.793536,NULL,NULL,NULL,NULL,NULL),(57,'Rajesh Singh','7304939781','poonamksingh83.ps@gmail.com','Adore Happy Homes , sector 86 , budhena , greater faridabad , haryana','deep-cleaning','2025-06-13','pending',NULL,'08:00 - 10:00 AM','weekly','',2,'','no-preference','','','4-hours',NULL,18.5925632,73.793536,NULL,NULL,NULL,NULL,NULL),(58,'shraddha Singh','8504939781','ananyaaaasingh2027@gmail.com','Adore Happy Homes , sector 86 , budhena , greater faridabad , haryana','plumber','2025-06-13','pending',NULL,'08:00 - 10:00 AM','one-time','',1,'','no-preference','','','',NULL,18.5925632,73.793536,NULL,NULL,NULL,NULL,NULL),(59,'shreya ','9876543210','ananyaaaasingh2027@gmail.com','chikhali, swaraj capital road.','plumber','2025-06-13','pending',NULL,'08:00 - 10:00 AM','one-time','',NULL,'','no-preference','','','',NULL,18.5925632,73.793536,NULL,NULL,NULL,NULL,NULL),(60,'Sunny Singh','7304927781','ananyaaaasingh2027@gmail.com','ND rowers , akurdi , pune , INDIA','plumbing','2025-06-14','pending',NULL,'10:00 - 12:00 PM','one-time','',1,'','no-preference','','','',NULL,18.683353,73.8343855,NULL,NULL,NULL,NULL,NULL),(61,'himanshu shrey','9876543210','ananyaaaasingh2027@gmail.com','woodsville phase 3 , chikhali , dehu alandi road , pune ','plumbing','2025-06-14','pending',NULL,'08:00 - 10:00 AM','one-time','',NULL,'500','no-preference','','','',NULL,18.612224,73.744384,NULL,NULL,NULL,NULL,NULL),(62,NULL,NULL,NULL,'olive green, shastri nagar, indra nagar, Nashik , INDIA ',NULL,NULL,'pending',NULL,NULL,'one-time',NULL,NULL,NULL,'no-preference',NULL,NULL,NULL,NULL,NULL,NULL,'plumbing',NULL,NULL,600.00,1),(63,NULL,NULL,NULL,'B6, Shiv Ganesh residency, shirole nagar, pimple gurav, New Sangvi, Pune-411061',NULL,NULL,'pending',NULL,NULL,'one-time',NULL,NULL,NULL,'no-preference',NULL,NULL,NULL,NULL,NULL,NULL,'maid',NULL,NULL,1.00,1),(64,NULL,NULL,NULL,'GAT NO 98 99 PL NO C FLAT NO 905 ,B wing sapphire, CHS Krystal city ,Dehu Alandi Road, Chikhali',NULL,NULL,'pending',NULL,NULL,'one-time',NULL,NULL,NULL,'no-preference',NULL,NULL,NULL,NULL,NULL,NULL,'kitchen',NULL,NULL,200.00,1);
/*!40000 ALTER TABLE `job_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `keywords` json DEFAULT NULL,
  `averagePrice` float NOT NULL,
  `imageUrl` varchar(255) NOT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `name_2` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,'Plumbing Services','plumbing','Professional plumbing services including repairs, installations, and maintenance.','[\"pipe\", \"faucet\", \"drain\", \"toilet\", \"water heater\", \"plumbing\"]',150,'/assets/services/plumbing.jpg',1,'2025-06-08 12:30:21','2025-06-08 12:30:21'),(2,'Electrical Services','electrical','Expert electrical services for repairs, installations, and safety inspections.','[\"wiring\", \"outlet\", \"switch\", \"circuit\", \"electrical\", \"power\"]',200,'/assets/services/electrical.jpg',1,'2025-06-08 12:30:21','2025-06-08 12:30:21'),(3,'Cleaning Services','cleaning','Comprehensive cleaning services for homes and offices.','[\"broom\", \"mop\", \"vacuum\", \"cleaning\", \"dust\", \"dirt\", \"clean\"]',100,'/assets/services/cleaning.jpg',1,'2025-06-08 12:30:21','2025-06-08 12:30:21'),(4,'Carpentry Services','carpentry','Skilled carpentry work for furniture, repairs, and custom installations.','[\"wood\", \"hammer\", \"nail\", \"saw\", \"carpentry\", \"furniture\", \"repair\"]',175,'/assets/services/carpentry.jpg',1,'2025-06-08 12:30:21','2025-06-08 12:30:21'),(5,'Painting Services','painting','Professional painting services for interior and exterior surfaces.','[\"paint\", \"brush\", \"wall\", \"color\", \"painting\", \"decorate\"]',125,'/assets/services/painting.jpg',1,'2025-06-08 12:30:21','2025-06-08 12:30:21'),(6,'Gardening Services','gardening','Expert gardening and landscaping services for your outdoor spaces.','[\"garden\", \"landscape\", \"lawn\", \"flower\", \"tree\", \"gardening\", \"landscape\"]',90,'/assets/services/gardening.jpg',1,'2025-06-08 12:30:21','2025-06-08 12:30:21');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `signup`
--

DROP TABLE IF EXISTS `signup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `signup` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `signup`
--

LOCK TABLES `signup` WRITE;
/*!40000 ALTER TABLE `signup` DISABLE KEYS */;
INSERT INTO `signup` VALUES (1,'Test User','test@example.com','9876543210',NULL,'testpassword'),(2,'Test User','test@example.com','9876543210',NULL,'testpassword'),(3,'Test User','test@example.com','9876543210',NULL,'testpassword'),(4,'Ananya','ananyasingh172006@gmail.com','07304939781','hahan','123'),(5,'Test User','test@example.com','9876543210',NULL,'testpassword'),(6,'nirjara','test@example.com','9876543210',NULL,'testpassword'),(7,'shreya','202301100063@mitaoe.ac.in','7304939781','delhi','234'),(8,'kiwi','202301100063@mitaoe.ac.in','7304939781','ananyasingh172006@gmail.com','123'),(9,'ananya kadam','ananyakadam@gmail.com','7447307199','delhi','an23'),(10,'ananya kadam','ananyakadam@gmail.com','7447307199','delhi','an23'),(11,'poonam','202301100049@mitaoe.ac.in','07304939781','hahan','hah'),(12,'poonam','202301100049@mitaoe.ac.in','07304939781','hahan','$2b$10$gjMLIdhfhn0kNpDFtVpxIe8DsYi62uGNELeJwSsYsWR0mtCieb/hq'),(13,'karan','202301100050@mitaoe.ac.in','07304939781','ananyasingh172006@gmail.com','$2b$10$ZRv1DCXj/tJEn21rkes/buEex4fkGqhNZ3nQVokS9SXs0l3RLas8i'),(14,'sharan','ananyasingh172006@gmail.com','07304939781','ananyasingh172006@gmail.com','$2b$10$kL.BUOC/6HWgsen./GlLae5WVYQMWrz1dVqFFfVN9oHQLJfBmrjgG'),(15,'kanan','ananyakadam@gmail.com','07447307199','ananyasingh172006@gmail.com','$2b$10$CUpyeNV65MF1IQ2eoMngjeGxwb3pMfEuDxccV9NhW4h7s0a3/deWK'),(16,'abhishek','abhishek231@gmail.com','8978543210','gwalior','$2b$10$gHX.nriM9PJoeKI3dASQleTzzCWfw7gMPqZP9TZHdK85aoQJP1bgW'),(17,'ananya kadam 96k','ananyasingh231@gmail.com','8978543210','gwalior','$2b$10$nKgP3smsScYsfwJD7Z0slu6CIdBtxLNFyvhOkIz9HgO.zWA6egR7q'),(18,'Nirjara','nirjaramore06@gmail.com','7058592801','pune','$2b$10$w9N7HQGHO0a8ogq0DhG0LOLZOw/Ro4K8nFcj0JAwO.g.QWlMzt3mq'),(19,'Nirjara','nirjaramore06@gmail.com','7058592801','pune','$2b$10$PWPCx0wD/gBQIaRzP34fZuXg9cjWV57B7iMlKIa/OwfA0kKjwoAcW'),(20,'nidhi ','nirjaramore06@gmail.com','7058592801','noida','$2b$10$CLaE2MYD5.jbSjsBkUGa3OqhnNKyXwMzsG/9UygwEG7WTGKXiNSqS'),(21,'om','nirjaramore06@gmail.com','7058592801','ananyasingh172006@gmail.com','$2b$10$A50Rkdsbz5yuG/jiNdOki.0p9ER74ZzY49qKzpBeLXk9t2vvrSFBO'),(22,'Ananya Singh','ananyasingh172006@gmail.com','7304939781','Pune','$2b$10$t9yt9LIO2I1afC9pIsBqpONAsEAX.encohlDkjWu6/40evdqlrv5u'),(23,'rajesh singh','ananyasingh172006@gmail.com','7304939781','jhansi','$2b$10$VRmO3V/FY93fQX1dpgzede0Gv3gKVBfmDwVxPR68ORl3unxTkTFCG'),(24,'azwar khan','ananyasingh172006@gmail.com','7304939781','lonavala','$2b$10$IGZwvH1EjPGd4y86A8AfDOZUGfbXUrLE//sEqu5JqX7U8TIkK.ZlO'),(25,'shaan mehta','abhishek231@gmail.com','08978543210','dwarka','$2b$10$6rJVfAaJOolmFhxZag2t8u.taSjStG5OOfAA.wpcKGFWS21Vkzz1.'),(26,'kavvya mankulwar','kavvya231@gmail.com','08978543210','merrut','$2b$10$Ti/ca8HrG1KlMilTfaTrROlDillAuukwJ.sKf7E.KV/8pYOXvZKzu'),(27,'kavvya mankulwar','kavvya231@gmail.com','08978543210','kavvya231@gmail.com','$2b$10$4MA4UZUQxXinFjXdlXzx.eNB5/0B8ZtfyLc10SCAQkGVHPBvanEgS'),(28,'kavvya mankulwar','kavvya231@gmail.com','08978543210','kavvya231@gmail.com','$2b$10$hPL.60IL89TmxuhEESCkfOoO/RLHIscUQaNanJdabSp8wTgcr4mPq'),(29,'riya rai','riya231@gmail.com','08978543210','rishikesh','$2b$10$V0LfnB31S/vaxPnTyXsBDeGRDSukTYrNFHWFW8nMzZC6qCwg8zGv6'),(30,'poonam singh','abhinavsingh272009@gmail.com','7304842978','Pune','$2b$10$DJIXxwt4feCu/CXODE2H9equblw/gV9wTi.K9TsHUnOvSfHDHnbvW'),(31,'kasak singh','ananyaaaasingh2027@gmail.com','7304842978','sector 23, faridbad','$2b$10$Fl1rWyAWpZORGyjUDup9ce6CsHa8.frkm0/Hpb9/aVnG8dpwlNp0m'),(32,'anjana patil','ananyaaaasingh2027@gmail.com','7304842978','shive ganesh residency , pune ','$2b$10$cHx/Ya4nYUP32LKSeMHD..pIgwcEz4AcQsyEt2W9hRb9KZArVZhwW'),(33,'nirjara patil','ananyaaaasingh2027@gmail.com','7304842978','shive ganesh residency , pune ','$2b$10$h118dlQ5oHi/4FT6DoQjauEEYnx5QeAwtj.1P7kKvh9srOcQC8ngm'),(34,'Nirjara More','iamnirju@gmail.com','8327979115','B6, Shiv Ganesh residency, shirole nagar, pimple gurav, New Sangvi, Pune-411061','$2b$10$eXXyUmpWrmT7DAJJ08RYDeoGmYA2S1Hbe5iVl4sBLK9eRNGWg21X6');
/*!40000 ALTER TABLE `signup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'abhinav singh','abhinavsingh272009@gmail.com',NULL,NULL,'h'),(2,'shreya','202301100063@mitaoe.ac.in',NULL,NULL,'hiii');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `worker_portfolios`
--

DROP TABLE IF EXISTS `worker_portfolios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `worker_portfolios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `worker_id` int NOT NULL,
  `skills` text,
  `experience` text,
  `description` text,
  `files` json DEFAULT NULL,
  `profile_photo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_worker` (`worker_id`),
  CONSTRAINT `fk_worker` FOREIGN KEY (`worker_id`) REFERENCES `workers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `worker_portfolios_ibfk_1` FOREIGN KEY (`worker_id`) REFERENCES `workers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `worker_portfolios`
--

LOCK TABLES `worker_portfolios` WRITE;
/*!40000 ALTER TABLE `worker_portfolios` DISABLE KEYS */;
/*!40000 ALTER TABLE `worker_portfolios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workers`
--

DROP TABLE IF EXISTS `workers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `profession` varchar(50) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `skills` json NOT NULL,
  `certifications` json NOT NULL,
  `experience` varchar(50) NOT NULL,
  `description` text,
  `profile_photo` varchar(255) DEFAULT NULL,
  `portfolio_files` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `profileImage` varchar(255) DEFAULT 'default-profile.jpg',
  `specializations` json DEFAULT NULL,
  `rating` float DEFAULT '5',
  `reviewCount` int DEFAULT '0',
  `successRate` float DEFAULT '100',
  `isAvailable` tinyint(1) DEFAULT '1',
  `latitude` float DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  `completedJobs` int DEFAULT '0',
  `hourlyRate` float NOT NULL DEFAULT '0',
  `bio` text,
  `documents` json DEFAULT NULL,
  `availability` json DEFAULT NULL,
  `face_photo` varchar(255) DEFAULT NULL,
  `review_count` int DEFAULT '0',
  `success_rate` decimal(5,2) DEFAULT '0.00',
  `is_available` tinyint(1) DEFAULT '1',
  `completed_jobs` int DEFAULT '0',
  `hourly_rate` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workers`
--

LOCK TABLES `workers` WRITE;
/*!40000 ALTER TABLE `workers` DISABLE KEYS */;
INSERT INTO `workers` VALUES (1,'Plumber','John Doe','john.doe@example.com','123-456-7890','123 Main St, Anytown','hashedpassword','[\"pipe repair\", \"drain cleaning\"]','[\"Certified Plumber\"]','5 years','Experienced plumber and electrician with a strong track record.','/assets/workers/john_doe.jpg','[]','2025-06-08 07:00:21','2025-06-08 07:00:21','/assets/workers/john_doe.jpg','[\"plumbing\", \"electrical\"]',4.9,75,98,1,34.0522,-118.244,80,35,'Experienced plumber and electrician with a strong track record.','[]','{\"monday\": {\"end\": \"17:00\", \"start\": \"09:00\"}, \"tuesday\": {\"end\": \"17:00\", \"start\": \"09:00\"}}',NULL,0,0.00,1,0,0.00),(2,'Cleaner','Jane Smith','jane.smith@example.com','987-654-3210','456 Oak Ave, Anytown','anotherhashedpassword','[\"deep cleaning\", \"office cleaning\"]','[]','3 years','Dedicated and thorough cleaner for homes and offices.','/assets/workers/jane_smith.jpg','[]','2025-06-08 07:00:21','2025-06-08 07:00:21','/assets/workers/jane_smith.jpg','[\"cleaning\"]',4.7,50,95,1,34.0522,-118.244,60,25,'Dedicated and thorough cleaner for homes and offices.','[]','{\"thursday\": {\"end\": \"17:00\", \"start\": \"09:00\"}, \"wednesday\": {\"end\": \"17:00\", \"start\": \"09:00\"}}',NULL,0,0.00,1,0,0.00),(3,'maid','Nirjara More','iamnirju@gmail.com','07304979781','B6, Shiv Ganesh residency, shirole nagar, pimple gurav, New Sangvi, Pune-411061','$2b$10$EvphxBTlFdHmi4BIe/GmRe2Omzso1uL5CURJI2epO3pYkv29B5swK','[\"House Cleaning\"]','[\"First Aid Training\"]','Less than 1 year','',NULL,'[]','2025-06-11 17:12:15','2025-06-11 17:12:15','default-profile.jpg',NULL,5,0,100,1,NULL,NULL,0,0,NULL,NULL,NULL,'uploads\\worker_media\\1749661935052-Screenshot 2024-06-15 141228.png',0,0.00,1,0,0.00),(5,'electrician','ravi','ravi2006@gmail.com','8304939781','chikhali, swaraj capital road.','$2b$10$Xzv0ghHtmegMwMbUo9oIyOOyCFgaPhjHM5dantHUSVIq0TmM06A/m','[\"Wiring Installation\"]','[\"Electrical License\"]','Less than 1 year','',NULL,'[]','2025-06-12 05:26:44','2025-06-12 05:26:44','default-profile.jpg',NULL,5,0,100,1,NULL,NULL,0,0,NULL,NULL,NULL,'uploads\\worker_media\\1749706004842-Screenshot 2024-06-15 141228.png',0,0.00,1,0,0.00),(6,'maid','rekha','iamrekha@gmail.com','8224939781','chikhali, swaraj capital road.','$2b$10$PrHX3FzXrFMTyxlLwQ4uhOffx8LXOTsYKas45e3i7xjlPY3gpFcKC','[\"Cooking\", \"House Cleaning\"]','[\"Housekeeping Certification\"]','Less than 1 year','',NULL,'[]','2025-06-12 06:01:00','2025-06-12 06:01:00','default-profile.jpg',NULL,5,0,100,1,NULL,NULL,0,0,NULL,NULL,NULL,'uploads\\worker_media\\1749708060198-Screenshot 2024-06-16 233218.png',0,0.00,1,0,0.00),(7,'plumber','himan','himan17@gmail.com','7654329087','chikhali, swaraj capital road.','$2b$10$9KAsSx2INDce8OZNjlyKC.LNKrodA8dIhv.yWuYOPcIVezD02jm5i','[\"Pipe Installation\"]','[\"Plumbing License\"]','Less than 1 year','',NULL,'[]','2025-06-12 06:57:46','2025-06-12 06:57:46','default-profile.jpg',NULL,5,0,100,1,NULL,NULL,0,0,NULL,NULL,NULL,'uploads\\worker_media\\1749711466032-Screenshot 2024-06-16 233218.png',0,0.00,1,0,0.00),(8,'plumber','rakesh','rakesh49@gmail.com','9876543210','chikhali, swaraj capital road.','$2b$10$/w018HwM6RIRqjFVjZe.KOGDd5FWMv9BXx55Py37dPjdMDIrx/JgW','[\"Pipe Installation\"]','[\"Plumbing License\"]','1-3 years','',NULL,'[]','2025-06-12 14:46:16','2025-06-12 14:46:16','default-profile.jpg',NULL,5,0,100,1,NULL,NULL,0,0,NULL,NULL,NULL,'uploads\\worker_media\\1749739576371-Screenshot 2024-06-15 141228.png',0,0.00,1,0,0.00),(9,'plumber','prem','prem06@gmail.com','7632783484','chikhali, swaraj capital road.','$2b$10$RIPTn7ZM1ou0DSq7vl9qh.ftMyePUaxal1rJRTV5FmfJFQZQMz8jm','[\"Drain Cleaning\", \"Water Heater Installation\"]','[\"Plumbing License\"]','1-3 years','',NULL,'[]','2025-06-12 15:52:31','2025-06-12 15:52:31','default-profile.jpg',NULL,5,0,100,1,NULL,NULL,0,0,NULL,NULL,NULL,'uploads\\worker_media\\1749743551174-Screenshot 2024-06-15 141228.png',0,0.00,1,0,0.00),(10,'plumber','raj','raj666@gmail.com','9876428146','chikhali, swaraj capital road.','$2b$10$axdxLZiVuVPWVLLEOBywRucISRS.imdRcapoyjV3Qd7ysOlr8L8Ae','[\"Pipe Installation\", \"Kitchen Plumbing\"]','[\"Safety Certification\"]','Less than 1 year','',NULL,'[]','2025-06-12 16:26:38','2025-06-12 16:26:38','default-profile.jpg',NULL,5,0,100,1,NULL,NULL,0,0,NULL,NULL,NULL,'uploads\\worker_media\\1749745598792-Screenshot 2024-06-15 141228.png',0,0.00,1,0,0.00),(11,'maid','rajni','rajni06@gmail.com','9876543210','chikhali, swaraj capital road.','$2b$10$.Wy0uIUYk/zXJI6zlxZkQuhLVQc2ABCZ4Fg5pRsKFkJ3bnRuvHCRu','[\"House Cleaning\", \"Laundry\"]','[]','Less than 1 year','',NULL,'[]','2025-06-14 08:50:30','2025-06-14 08:50:30','default-profile.jpg',NULL,5,0,100,1,NULL,NULL,0,0,NULL,NULL,NULL,'uploads\\worker_media\\1749891029777-Screenshot 2024-06-15 141228.png',0,0.00,1,0,0.00);
/*!40000 ALTER TABLE `workers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-01 22:34:27
