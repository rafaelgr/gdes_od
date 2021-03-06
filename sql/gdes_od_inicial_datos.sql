/*
SQLyog Community v12.09 (64 bit)
MySQL - 5.6.16 : Database - gdes_od
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
USE `gdes_od`;

/*Table structure for table `administradores` */

DROP TABLE IF EXISTS `administradores`;

CREATE TABLE `administradores` (
  `administradorId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `login` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`administradorId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `administradores` */

insert  into `administradores`(`administradorId`,`nombre`,`login`,`password`,`email`) values (1,'AdministradorGH','admin','','admin@g.com');
insert  into `administradores`(`administradorId`,`nombre`,`login`,`password`,`email`) values (4,'Juan','juan','jom','juan@ghy.com');

/*Table structure for table `areas` */

DROP TABLE IF EXISTS `areas`;

CREATE TABLE `areas` (
  `areaId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`areaId`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

/*Data for the table `areas` */

insert  into `areas`(`areaId`,`nombre`) values (5,'Area 334566');
insert  into `areas`(`areaId`,`nombre`) values (6,'Nueva area');
insert  into `areas`(`areaId`,`nombre`) values (7,'Arieta 13');

/*Table structure for table `asg_objetivos` */

DROP TABLE IF EXISTS `asg_objetivos`;

CREATE TABLE `asg_objetivos` (
  `asgObjetivoId` int(11) NOT NULL AUTO_INCREMENT,
  `asgTrabajadorId` int(11) DEFAULT NULL,
  `objetivoId` int(11) DEFAULT NULL,
  `asSn` tinyint(1) DEFAULT NULL,
  `asPorObjetivo` decimal(4,2) DEFAULT NULL,
  `asMinNum` decimal(12,2) DEFAULT NULL,
  `asMaxNum` decimal(12,2) DEFAULT NULL,
  `asPesoVariable` decimal(4,2) DEFAULT NULL,
  PRIMARY KEY (`asgObjetivoId`),
  KEY `ref_asg_trabajadores` (`asgTrabajadorId`),
  KEY `ref_objetivos` (`objetivoId`),
  CONSTRAINT `ref_asg_trabajadores` FOREIGN KEY (`asgTrabajadorId`) REFERENCES `asg_trabajadores` (`asgTrabajadorId`),
  CONSTRAINT `ref_objetivos` FOREIGN KEY (`objetivoId`) REFERENCES `objetivos` (`objetivoId`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8;

/*Data for the table `asg_objetivos` */

insert  into `asg_objetivos`(`asgObjetivoId`,`asgTrabajadorId`,`objetivoId`,`asSn`,`asPorObjetivo`,`asMinNum`,`asMaxNum`,`asPesoVariable`) values (6,3,1,NULL,NULL,NULL,NULL,'25.00');
insert  into `asg_objetivos`(`asgObjetivoId`,`asgTrabajadorId`,`objetivoId`,`asSn`,`asPorObjetivo`,`asMinNum`,`asMaxNum`,`asPesoVariable`) values (27,2,17,NULL,'10.00','0.00','0.00','21.00');
insert  into `asg_objetivos`(`asgObjetivoId`,`asgTrabajadorId`,`objetivoId`,`asSn`,`asPorObjetivo`,`asMinNum`,`asMaxNum`,`asPesoVariable`) values (32,3,17,NULL,'10.00','0.00','0.00','25.00');
insert  into `asg_objetivos`(`asgObjetivoId`,`asgTrabajadorId`,`objetivoId`,`asSn`,`asPorObjetivo`,`asMinNum`,`asMaxNum`,`asPesoVariable`) values (34,2,18,NULL,'0.00','140.00','160.00','10.00');
insert  into `asg_objetivos`(`asgObjetivoId`,`asgTrabajadorId`,`objetivoId`,`asSn`,`asPorObjetivo`,`asMinNum`,`asMaxNum`,`asPesoVariable`) values (35,3,2,NULL,'10.00','0.00','0.00','15.00');
insert  into `asg_objetivos`(`asgObjetivoId`,`asgTrabajadorId`,`objetivoId`,`asSn`,`asPorObjetivo`,`asMinNum`,`asMaxNum`,`asPesoVariable`) values (37,3,12,NULL,'0.00','15.00','60.00','25.00');
insert  into `asg_objetivos`(`asgObjetivoId`,`asgTrabajadorId`,`objetivoId`,`asSn`,`asPorObjetivo`,`asMinNum`,`asMaxNum`,`asPesoVariable`) values (38,3,1,NULL,'0.00','10.00','20.00','15.00');
insert  into `asg_objetivos`(`asgObjetivoId`,`asgTrabajadorId`,`objetivoId`,`asSn`,`asPorObjetivo`,`asMinNum`,`asMaxNum`,`asPesoVariable`) values (39,3,8,NULL,'0.00','10.00','20.00','15.00');

/*Table structure for table `asg_trabajadores` */

DROP TABLE IF EXISTS `asg_trabajadores`;

CREATE TABLE `asg_trabajadores` (
  `asgTrabajadorId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `trabajadorId` int(11) DEFAULT NULL,
  `ejercicioId` int(11) DEFAULT NULL,
  `paisId` int(11) DEFAULT NULL,
  `unidadId` int(11) DEFAULT NULL,
  `areaId` int(11) DEFAULT NULL,
  `puestoId` int(11) DEFAULT NULL,
  `fijo` decimal(12,2) DEFAULT NULL,
  `variable` decimal(4,2) DEFAULT NULL,
  PRIMARY KEY (`asgTrabajadorId`),
  KEY `ref_ejercicio` (`ejercicioId`),
  KEY `ref_pais` (`paisId`),
  KEY `ref_unidad` (`unidadId`),
  KEY `ref_area` (`areaId`),
  KEY `ref_puesto` (`puestoId`),
  KEY `ref_trabajador` (`trabajadorId`),
  CONSTRAINT `ref_area` FOREIGN KEY (`areaId`) REFERENCES `areas` (`areaId`),
  CONSTRAINT `ref_ejercicio` FOREIGN KEY (`ejercicioId`) REFERENCES `ejercicios` (`ejercicioId`),
  CONSTRAINT `ref_pais` FOREIGN KEY (`paisId`) REFERENCES `paises` (`paisId`),
  CONSTRAINT `ref_puesto` FOREIGN KEY (`puestoId`) REFERENCES `puestos` (`puestoId`),
  CONSTRAINT `ref_trabajador` FOREIGN KEY (`trabajadorId`) REFERENCES `trabajadores` (`trabajadorId`),
  CONSTRAINT `ref_unidad` FOREIGN KEY (`unidadId`) REFERENCES `unidades` (`unidadId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

/*Data for the table `asg_trabajadores` */

insert  into `asg_trabajadores`(`asgTrabajadorId`,`nombre`,`trabajadorId`,`ejercicioId`,`paisId`,`unidadId`,`areaId`,`puestoId`,`fijo`,`variable`) values (2,'Gonxalo pocholi [2015]',3,2,3,1,5,1,'3425.00','25.00');
insert  into `asg_trabajadores`(`asgTrabajadorId`,`nombre`,`trabajadorId`,`ejercicioId`,`paisId`,`unidadId`,`areaId`,`puestoId`,`fijo`,`variable`) values (3,'Pepe Maravillas The Great [2015]',1,2,3,1,5,1,'14.36','25.00');

/*Table structure for table `categorias` */

DROP TABLE IF EXISTS `categorias`;

CREATE TABLE `categorias` (
  `categoriaId` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`categoriaId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `categorias` */

insert  into `categorias`(`categoriaId`,`nombre`) values (0,'Puerta acceso');
insert  into `categorias`(`categoriaId`,`nombre`) values (1,'Organización');
insert  into `categorias`(`categoriaId`,`nombre`) values (2,'Individual');

/*Table structure for table `ejercicios` */

DROP TABLE IF EXISTS `ejercicios`;

CREATE TABLE `ejercicios` (
  `ejercicioId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `fechaInicio` datetime DEFAULT NULL,
  `fechaFinal` datetime DEFAULT NULL,
  `porPuertaAcceso` int(11) DEFAULT NULL,
  `porOrganizacion` int(11) DEFAULT NULL,
  `porIndividual` int(11) DEFAULT NULL,
  PRIMARY KEY (`ejercicioId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Data for the table `ejercicios` */

insert  into `ejercicios`(`ejercicioId`,`nombre`,`fechaInicio`,`fechaFinal`,`porPuertaAcceso`,`porOrganizacion`,`porIndividual`) values (2,'2015','2015-01-30 00:00:00','2015-12-12 00:00:00',0,70,30);
insert  into `ejercicios`(`ejercicioId`,`nombre`,`fechaInicio`,`fechaFinal`,`porPuertaAcceso`,`porOrganizacion`,`porIndividual`) values (3,'2014','2016-03-19 00:00:00','2016-03-27 00:00:00',0,20,30);

/*Table structure for table `objetivos` */

DROP TABLE IF EXISTS `objetivos`;

CREATE TABLE `objetivos` (
  `objetivoId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `categoriaId` int(11) DEFAULT NULL,
  `tipoId` int(11) DEFAULT NULL,
  PRIMARY KEY (`objetivoId`),
  KEY `ref_categorias` (`categoriaId`),
  KEY `ref_tipos` (`tipoId`),
  CONSTRAINT `ref_categorias` FOREIGN KEY (`categoriaId`) REFERENCES `categorias` (`categoriaId`),
  CONSTRAINT `ref_tipos` FOREIGN KEY (`tipoId`) REFERENCES `tipos` (`tipoId`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;

/*Data for the table `objetivos` */

insert  into `objetivos`(`objetivoId`,`nombre`,`categoriaId`,`tipoId`) values (1,'Beneficadoss',2,2);
insert  into `objetivos`(`objetivoId`,`nombre`,`categoriaId`,`tipoId`) values (2,'Porcenta',1,1);
insert  into `objetivos`(`objetivoId`,`nombre`,`categoriaId`,`tipoId`) values (8,'Numerica',2,0);
insert  into `objetivos`(`objetivoId`,`nombre`,`categoriaId`,`tipoId`) values (9,'NSFG56',0,0);
insert  into `objetivos`(`objetivoId`,`nombre`,`categoriaId`,`tipoId`) values (11,'Organiza Numerico',1,3);
insert  into `objetivos`(`objetivoId`,`nombre`,`categoriaId`,`tipoId`) values (12,'Grupo 7888',1,2);
insert  into `objetivos`(`objetivoId`,`nombre`,`categoriaId`,`tipoId`) values (16,'MONHJDJ',0,2);
insert  into `objetivos`(`objetivoId`,`nombre`,`categoriaId`,`tipoId`) values (17,'VEN',0,1);
insert  into `objetivos`(`objetivoId`,`nombre`,`categoriaId`,`tipoId`) values (18,'pepe',1,2);
insert  into `objetivos`(`objetivoId`,`nombre`,`categoriaId`,`tipoId`) values (19,'Puntualidad',1,1);

/*Table structure for table `paises` */

DROP TABLE IF EXISTS `paises`;

CREATE TABLE `paises` (
  `paisId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`paisId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Data for the table `paises` */

insert  into `paises`(`paisId`,`nombre`) values (3,'España');

/*Table structure for table `proyectos` */

DROP TABLE IF EXISTS `proyectos`;

CREATE TABLE `proyectos` (
  `proyectoId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `fechaInicial` datetime DEFAULT NULL,
  `fechaFinal` datetime DEFAULT NULL,
  PRIMARY KEY (`proyectoId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `proyectos` */

/*Table structure for table `puestos` */

DROP TABLE IF EXISTS `puestos`;

CREATE TABLE `puestos` (
  `puestoId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`puestoId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `puestos` */

insert  into `puestos`(`puestoId`,`nombre`) values (1,'Soldador');
insert  into `puestos`(`puestoId`,`nombre`) values (2,'Armero');

/*Table structure for table `tipos` */

DROP TABLE IF EXISTS `tipos`;

CREATE TABLE `tipos` (
  `tipoId` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`tipoId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `tipos` */

insert  into `tipos`(`tipoId`,`nombre`) values (0,'Si/No');
insert  into `tipos`(`tipoId`,`nombre`) values (1,'Porcentual');
insert  into `tipos`(`tipoId`,`nombre`) values (2,'Numérico');
insert  into `tipos`(`tipoId`,`nombre`) values (3,'Desempeño');

/*Table structure for table `trabajadores` */

DROP TABLE IF EXISTS `trabajadores`;

CREATE TABLE `trabajadores` (
  `trabajadorId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `dni` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`trabajadorId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `trabajadores` */

insert  into `trabajadores`(`trabajadorId`,`nombre`,`dni`) values (1,'Pepe Maravillas The Great','455578');
insert  into `trabajadores`(`trabajadorId`,`nombre`,`dni`) values (3,'Gonxalo pocholi','45666');
insert  into `trabajadores`(`trabajadorId`,`nombre`,`dni`) values (4,'Maria Carvajal','79854654');

/*Table structure for table `unidades` */

DROP TABLE IF EXISTS `unidades`;

CREATE TABLE `unidades` (
  `unidadId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`unidadId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `unidades` */

insert  into `unidades`(`unidadId`,`nombre`) values (1,'Unidad 1');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
