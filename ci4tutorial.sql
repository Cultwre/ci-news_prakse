-- --------------------------------------------------------
-- Хост:                         127.0.0.1
-- Версия сервера:               10.4.27-MariaDB - mariadb.org binary distribution
-- Операционная система:         Win64
-- HeidiSQL Версия:              12.3.0.6589
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Дамп структуры базы данных ci4tutorial
CREATE DATABASE IF NOT EXISTS `ci4tutorial` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `ci4tutorial`;

-- Дамп структуры для таблица ci4tutorial.column_defs_meta
CREATE TABLE IF NOT EXISTS `column_defs_meta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `meta_table_name` varchar(50) NOT NULL COMMENT 'tabulas nosaukums',
  `meta_column_name` varchar(25) NOT NULL COMMENT 'kolonnas nosaukums',
  `meta_title` varchar(25) NOT NULL COMMENT 'kolonnas uzraksts',
  `meta_type` varchar(15) NOT NULL COMMENT 'kolonnas tips',
  `meta_required` varchar(10) NOT NULL DEFAULT '' COMMENT 'required: true/false',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Дамп данных таблицы ci4tutorial.column_defs_meta: ~3 rows (приблизительно)
INSERT INTO `column_defs_meta` (`id`, `meta_table_name`, `meta_column_name`, `meta_title`, `meta_type`, `meta_required`) VALUES
	(1, 'news', 'id', 'Id', 'readonly', 'false'),
	(2, 'news', 'title', 'Title', 'text', 'true'),
	(3, 'news', 'body', 'Body', 'text', 'true');

-- Дамп структуры для таблица ci4tutorial.news
CREATE TABLE IF NOT EXISTS `news` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(128) NOT NULL,
  `slug` varchar(128) NOT NULL,
  `body` text NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Дамп данных таблицы ci4tutorial.news: ~7 rows (приблизительно)
INSERT INTO `news` (`id`, `title`, `slug`, `body`, `category_id`) VALUES
	(1, 'Elvis sighted', 'elvis-sighted', 'Elvis was sighted at the Podunk internet cafe. It looked like he was writing a CodeIgniter app.', 1),
	(2, 'Say it isn\'t so!', 'say-it-isnt-so', 'Scientists conclude that some programmers have a sense of humor.', 2),
	(3, 'Caffeination, Yes!', 'caffeination-yes', 'World\'s largest coffee shop open onsite nested coffee shop for staff only.', 2),
	(5, 'Sie rieksti UPDATED', 'sie-rieksti-updated', 'Deez nuts UPDATED', 4),
	(6, 'eqweqwewq', 'eqweqwewq', 'qeqwewqeqwe', 1),
	(7, 'deeeez', 'deeeez', 'nuts', 1),
	(8, 'dasdasdas', 'dasdasdas', 'dasdasdsada', 4);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
