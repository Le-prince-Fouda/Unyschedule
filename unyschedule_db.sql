-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jun 06, 2023 at 03:50 AM
-- Server version: 5.7.26
-- PHP Version: 7.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `unyschedule_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
CREATE TABLE IF NOT EXISTS `admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(20) NOT NULL,
  `prenom` varchar(20) NOT NULL,
  `sexe` tinyint(1) NOT NULL,
  `telephone` int(9) NOT NULL,
  `e-mail` varchar(30) NOT NULL,
  `pseudo` varchar(20) NOT NULL,
  `password` varchar(30) NOT NULL,
  `etablissement` varchar(60) NOT NULL,
  `ville` int(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `etablissement` (`etablissement`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `apparaitre`
--

DROP TABLE IF EXISTS `apparaitre`;
CREATE TABLE IF NOT EXISTS `apparaitre` (
  `id_specialite` int(10) NOT NULL,
  `id_niveau` int(10) NOT NULL,
  PRIMARY KEY (`id_specialite`,`id_niveau`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `apparaitre`
--

INSERT INTO `apparaitre` (`id_specialite`, `id_niveau`) VALUES
(9, 1),
(9, 8),
(9, 18),
(9, 19),
(11, 18),
(11, 19),
(12, 1),
(12, 9),
(13, 19),
(13, 21);

-- --------------------------------------------------------

--
-- Table structure for table `avoir`
--

DROP TABLE IF EXISTS `avoir`;
CREATE TABLE IF NOT EXISTS `avoir` (
  `id_departement` int(11) NOT NULL,
  `id_niveau` int(11) NOT NULL,
  `effectif` int(11) NOT NULL,
  PRIMARY KEY (`id_departement`,`id_niveau`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COMMENT='consequence de la liaison entre le departement et specialite';

--
-- Dumping data for table `avoir`
--

INSERT INTO `avoir` (`id_departement`, `id_niveau`, `effectif`) VALUES
(1, 18, 500),
(2, 18, 700),
(3, 18, 900),
(6, 18, 1000),
(5, 18, 1020),
(7, 18, 1000),
(1, 19, 400),
(2, 19, 600),
(3, 19, 900),
(6, 19, 900),
(5, 19, 988),
(7, 19, 1000),
(6, 20, 2),
(3, 21, 2);

-- --------------------------------------------------------

--
-- Table structure for table `delegue`
--

DROP TABLE IF EXISTS `delegue`;
CREATE TABLE IF NOT EXISTS `delegue` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(20) NOT NULL,
  `prenom` varchar(20) NOT NULL,
  `telephone` int(9) NOT NULL,
  `id_specialite` int(11) NOT NULL,
  `id_niveau` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_specialite` (`id_specialite`),
  KEY `id_niveau` (`id_niveau`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `departement`
--

DROP TABLE IF EXISTS `departement`;
CREATE TABLE IF NOT EXISTS `departement` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `departement` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `departement` (`departement`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `departement`
--

INSERT INTO `departement` (`id`, `departement`) VALUES
(1, 'INFORMATIQUE'),
(2, 'MATHEMATIQUE'),
(3, 'PHYSIQUE'),
(6, 'CHIMIE'),
(5, 'BIOCHIMIE'),
(7, 'STU'),
(8, 'ANGLAIS');

-- --------------------------------------------------------

--
-- Table structure for table `dispenser`
--

DROP TABLE IF EXISTS `dispenser`;
CREATE TABLE IF NOT EXISTS `dispenser` (
  `id_specialite` int(11) NOT NULL,
  `id_ue` varchar(20) NOT NULL,
  PRIMARY KEY (`id_specialite`,`id_ue`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `dispenser`
--

INSERT INTO `dispenser` (`id_specialite`, `id_ue`) VALUES
(9, 'INFO112'),
(9, 'INFO130'),
(9, 'INFO1300'),
(9, 'MATHS115'),
(10, '45JK'),
(10, 'INFO13'),
(10, 'MATHS15'),
(11, 'INFO112'),
(11, 'INFO130'),
(13, 'BIOS33');

-- --------------------------------------------------------

--
-- Table structure for table `enseignant`
--

DROP TABLE IF EXISTS `enseignant`;
CREATE TABLE IF NOT EXISTS `enseignant` (
  `id` varchar(10) NOT NULL,
  `nom` varchar(30) NOT NULL,
  `prenom` varchar(30) NOT NULL,
  `telephone` int(9) NOT NULL,
  `e_mail` varchar(50) NOT NULL,
  `id_departement` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_departement` (`id_departement`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `enseignant`
--

INSERT INTO `enseignant` (`id`, `nom`, `prenom`, `telephone`, `e_mail`, `id_departement`) VALUES
('002', 'TAPAMO', 'Marcus', 22115544, 'xrcytgvub@hijnok', 1),
('001', 'JIOMEKON', 'Azanzi', 655448822, 'jio@yaho.com', 1),
('003', 'MONTHE', 'francois', 22448866, 'fouda.ambassa.francky@gmail.com', 5);

-- --------------------------------------------------------

--
-- Table structure for table `enseigner`
--

DROP TABLE IF EXISTS `enseigner`;
CREATE TABLE IF NOT EXISTS `enseigner` (
  `id_enseignant` int(11) NOT NULL,
  `id_UE` int(11) NOT NULL,
  PRIMARY KEY (`id_enseignant`,`id_UE`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COMMENT='Represente le lien entre la table enseignat et le table UE';

-- --------------------------------------------------------

--
-- Table structure for table `heure`
--

DROP TABLE IF EXISTS `heure`;
CREATE TABLE IF NOT EXISTS `heure` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `description` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `description` (`description`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `heure`
--

INSERT INTO `heure` (`id`, `description`) VALUES
(1, '7h00 - 9h55'),
(2, '10h00 - 12h55'),
(3, '13h00 - 16h55'),
(4, '17h00 - 20h55'),
(5, '21h00 - 22h55');

-- --------------------------------------------------------

--
-- Table structure for table `jour`
--

DROP TABLE IF EXISTS `jour`;
CREATE TABLE IF NOT EXISTS `jour` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `jour` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `jour`
--

INSERT INTO `jour` (`id`, `jour`) VALUES
(1, 'Lundi'),
(2, 'Mardi'),
(3, 'Mercredi'),
(4, 'Jeudi'),
(5, 'Vendredi'),
(6, 'Samedi'),
(7, 'Dimanche');

-- --------------------------------------------------------

--
-- Table structure for table `niveau`
--

DROP TABLE IF EXISTS `niveau`;
CREATE TABLE IF NOT EXISTS `niveau` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `libelle` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=22 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `niveau`
--

INSERT INTO `niveau` (`id`, `libelle`) VALUES
(18, 'L1'),
(19, 'L2'),
(20, 'L3'),
(21, 'm2');

-- --------------------------------------------------------

--
-- Table structure for table `passer`
--

DROP TABLE IF EXISTS `passer`;
CREATE TABLE IF NOT EXISTS `passer` (
  `id_ue` varchar(20) NOT NULL,
  `id_salle` int(11) NOT NULL,
  `id_jour` int(11) NOT NULL,
  `id_heure` varchar(10) NOT NULL,
  PRIMARY KEY (`id_ue`,`id_salle`,`id_jour`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `posserder`
--

DROP TABLE IF EXISTS `posserder`;
CREATE TABLE IF NOT EXISTS `posserder` (
  `id_departement` int(11) NOT NULL,
  `id_salle` int(11) NOT NULL,
  PRIMARY KEY (`id_departement`,`id_salle`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COMMENT='consequence de lqa liaison entre departement et salle';

-- --------------------------------------------------------

--
-- Table structure for table `salle`
--

DROP TABLE IF EXISTS `salle`;
CREATE TABLE IF NOT EXISTS `salle` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(10) NOT NULL,
  `capacite` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `salle`
--

INSERT INTO `salle` (`id`, `nom`, `capacite`) VALUES
(1, 'jj55', 152),
(2, 'A135', 135),
(3, 'A1002', 1002),
(4, 'SS44', 28),
(5, 'A1001', 1001),
(6, 'A1', 100),
(7, 'A350', 350),
(8, 'A250', 250),
(9, 'A502', 502),
(10, 'A3', 150),
(11, 'A1003', 1003),
(12, 'K5', 11),
(13, '3M', 22);

-- --------------------------------------------------------

--
-- Table structure for table `se trouver`
--

DROP TABLE IF EXISTS `se trouver`;
CREATE TABLE IF NOT EXISTS `se trouver` (
  `id_specialite` int(11) NOT NULL,
  `id_niveau` int(11) NOT NULL,
  PRIMARY KEY (`id_specialite`,`id_niveau`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `specialite`
--

DROP TABLE IF EXISTS `specialite`;
CREATE TABLE IF NOT EXISTS `specialite` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `libelle` varchar(50) NOT NULL,
  `id_departement` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_departement` (`id_departement`)
) ENGINE=MyISAM AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `specialite`
--

INSERT INTO `specialite` (`id`, `libelle`, `id_departement`) VALUES
(9, 'SYTEME D\'INFORMATION ET GENIE LOGICIEL', 1),
(10, 'SYTEME D\'INFORMATION ET GENIE LOGICIEL', 2),
(11, 'TRONC COMMUN', 1),
(12, 'MECANIQUE', 5),
(13, 'RZEDXTFCGVHBJNKM', 6);

-- --------------------------------------------------------

--
-- Table structure for table `ue`
--

DROP TABLE IF EXISTS `ue`;
CREATE TABLE IF NOT EXISTS `ue` (
  `id` varchar(20) NOT NULL,
  `libelle` varchar(100) NOT NULL,
  `id_departement_responsable` int(50) NOT NULL,
  `id_niveau` int(10) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_niveau` (`id_niveau`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ue`
--

INSERT INTO `ue` (`id`, `libelle`, `id_departement_responsable`, `id_niveau`) VALUES
('INFO13', 'ALGORITHMIQUE', 6, 19),
('MATHS15', 'MATHS 1', 2, 19),
('MATHS115', 'MATHS 11', 1, 18),
('INFO1300', 'ALGORITHMIQUE2', 1, 18),
('INFO112', 'RESEAU', 1, 18),
('BIOS33', 'BIOLOGIE', 5, 20),
('45JK', 'JUIO', 2, 18);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
