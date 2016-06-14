
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table displays
# ------------------------------------------------------------

DROP TABLE IF EXISTS `displays`;

CREATE TABLE `displays` (
  `display_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `slideshowId` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT 'No name',
  `dataCreated` datetime DEFAULT NULL,
  `location` varchar(100) NOT NULL DEFAULT 'TTH',
  PRIMARY KEY (`display_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `displays` WRITE;
/*!40000 ALTER TABLE `displays` DISABLE KEYS */;

/*!40000 ALTER TABLE `displays` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table screens
# ------------------------------------------------------------

DROP TABLE IF EXISTS `screens`;

CREATE TABLE `screens` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL DEFAULT '0',
  `type` varchar(100) NOT NULL DEFAULT 'poster',
  `name` varchar(100) DEFAULT 'No title',
  `discription` text,
  `animation` varchar(100) DEFAULT 'easeOut',
  `filename` varchar(255) DEFAULT 'no-poster.jpg',
  `duration` decimal(10,0) NOT NULL DEFAULT '1000',
  `color` varchar(10) DEFAULT '#FFCC00',
  `dateStart` date DEFAULT NULL,
  `dateEnd` date DEFAULT NULL,
  `dataCreated` datetime DEFAULT NULL,
  `checked` int(1) NOT NULL DEFAULT '0',
  `vimeoId` varchar(30) DEFAULT '0',
  `vimeoImage` varchar(200) DEFAULT '/download/no-poster.png',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `screens` WRITE;
/*!40000 ALTER TABLE `screens` DISABLE KEYS */;

/*!40000 ALTER TABLE `screens` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table screens_In_slideshow
# ------------------------------------------------------------

DROP TABLE IF EXISTS `screens_In_slideshow`;

CREATE TABLE `screens_In_slideshow` (
  `screen_id` int(11) NOT NULL,
  `slideshow_id` int(11) NOT NULL,
  `short` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `screens_In_slideshow` WRITE;
/*!40000 ALTER TABLE `screens_In_slideshow` DISABLE KEYS */;

/*!40000 ALTER TABLE `screens_In_slideshow` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table slideshows
# ------------------------------------------------------------

DROP TABLE IF EXISTS `slideshows`;

CREATE TABLE `slideshows` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `slideshow_userId` int(11) NOT NULL,
  `slideshow_discription` text,
  `slideshow_name` varchar(100) DEFAULT 'Unknown',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `slideshows` WRITE;
/*!40000 ALTER TABLE `slideshows` DISABLE KEYS */;

/*!40000 ALTER TABLE `slideshows` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL DEFAULT '',
  `name` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'publisher',
  `hash` varchar(255) NOT NULL DEFAULT '',
  `salt` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `users` WRITE;

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
