/*
SQLyog Community v12.18 (64 bit)
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
  `asPrima` decimal(12,2) DEFAULT NULL,
  `comentarios` text,
  PRIMARY KEY (`asgObjetivoId`),
  UNIQUE KEY `idx_asgobjetivos_duplicados` (`asgTrabajadorId`,`objetivoId`),
  KEY `ref_objetivos` (`objetivoId`),
  CONSTRAINT `ref_asg_trabajadores` FOREIGN KEY (`asgTrabajadorId`) REFERENCES `asg_trabajadores` (`asgTrabajadorId`),
  CONSTRAINT `ref_objetivos` FOREIGN KEY (`objetivoId`) REFERENCES `objetivos` (`objetivoId`)
) ENGINE=InnoDB AUTO_INCREMENT=171 DEFAULT CHARSET=utf8;

/*Data for the table `asg_objetivos` */

insert  into `asg_objetivos`(`asgObjetivoId`,`asgTrabajadorId`,`objetivoId`,`asSn`,`asPorObjetivo`,`asMinNum`,`asMaxNum`,`asPesoVariable`,`asPrima`,`comentarios`) values (39,3,8,NULL,'0.00','10.00','20.00','15.00',NULL,NULL);
insert  into `asg_objetivos`(`asgObjetivoId`,`asgTrabajadorId`,`objetivoId`,`asSn`,`asPorObjetivo`,`asMinNum`,`asMaxNum`,`asPesoVariable`,`asPrima`,`comentarios`) values (62,3,20,NULL,'0.00','0.00','0.00','10.00',NULL,'Vendemos ideas');
insert  into `asg_objetivos`(`asgObjetivoId`,`asgTrabajadorId`,`objetivoId`,`asSn`,`asPorObjetivo`,`asMinNum`,`asMaxNum`,`asPesoVariable`,`asPrima`,`comentarios`) values (67,2,20,NULL,'0.00','0.00','0.00','10.00',NULL,NULL);
insert  into `asg_objetivos`(`asgObjetivoId`,`asgTrabajadorId`,`objetivoId`,`asSn`,`asPorObjetivo`,`asMinNum`,`asMaxNum`,`asPesoVariable`,`asPrima`,`comentarios`) values (70,3,21,NULL,'0.00','10.00','12.00','15.00',NULL,NULL);
insert  into `asg_objetivos`(`asgObjetivoId`,`asgTrabajadorId`,`objetivoId`,`asSn`,`asPorObjetivo`,`asMinNum`,`asMaxNum`,`asPesoVariable`,`asPrima`,`comentarios`) values (73,2,8,NULL,'0.00','0.00','0.00','10.00',NULL,'Esta es una');
insert  into `asg_objetivos`(`asgObjetivoId`,`asgTrabajadorId`,`objetivoId`,`asSn`,`asPorObjetivo`,`asMinNum`,`asMaxNum`,`asPesoVariable`,`asPrima`,`comentarios`) values (88,3,1,NULL,'0.00','10.00','20.00','0.00','4500.00',NULL);
insert  into `asg_objetivos`(`asgObjetivoId`,`asgTrabajadorId`,`objetivoId`,`asSn`,`asPorObjetivo`,`asMinNum`,`asMaxNum`,`asPesoVariable`,`asPrima`,`comentarios`) values (89,2,21,NULL,'0.00','10.00','20.00','0.00','2600.00',NULL);
insert  into `asg_objetivos`(`asgObjetivoId`,`asgTrabajadorId`,`objetivoId`,`asSn`,`asPorObjetivo`,`asMinNum`,`asMaxNum`,`asPesoVariable`,`asPrima`,`comentarios`) values (90,2,1,NULL,'0.00','10.00','20.00','30.00','0.00',NULL);
insert  into `asg_objetivos`(`asgObjetivoId`,`asgTrabajadorId`,`objetivoId`,`asSn`,`asPorObjetivo`,`asMinNum`,`asMaxNum`,`asPesoVariable`,`asPrima`,`comentarios`) values (135,4,12,NULL,'10.00','10.00','30.00','10.00','0.00','Esta será propagado');
insert  into `asg_objetivos`(`asgObjetivoId`,`asgTrabajadorId`,`objetivoId`,`asSn`,`asPorObjetivo`,`asMinNum`,`asMaxNum`,`asPesoVariable`,`asPrima`,`comentarios`) values (146,2,17,NULL,'10.00','1.00','2.00','99.00',NULL,NULL);
insert  into `asg_objetivos`(`asgObjetivoId`,`asgTrabajadorId`,`objetivoId`,`asSn`,`asPorObjetivo`,`asMinNum`,`asMaxNum`,`asPesoVariable`,`asPrima`,`comentarios`) values (160,3,17,NULL,'10.00','1.00','2.00','99.00',NULL,NULL);
insert  into `asg_objetivos`(`asgObjetivoId`,`asgTrabajadorId`,`objetivoId`,`asSn`,`asPorObjetivo`,`asMinNum`,`asMaxNum`,`asPesoVariable`,`asPrima`,`comentarios`) values (161,5,17,NULL,'10.00','1.00','2.00','99.00',NULL,NULL);
insert  into `asg_objetivos`(`asgObjetivoId`,`asgTrabajadorId`,`objetivoId`,`asSn`,`asPorObjetivo`,`asMinNum`,`asMaxNum`,`asPesoVariable`,`asPrima`,`comentarios`) values (162,6,17,NULL,'10.00','1.00','2.00','99.00',NULL,NULL);
insert  into `asg_objetivos`(`asgObjetivoId`,`asgTrabajadorId`,`objetivoId`,`asSn`,`asPorObjetivo`,`asMinNum`,`asMaxNum`,`asPesoVariable`,`asPrima`,`comentarios`) values (163,7,17,NULL,'10.00','1.00','2.00','99.00',NULL,NULL);
insert  into `asg_objetivos`(`asgObjetivoId`,`asgTrabajadorId`,`objetivoId`,`asSn`,`asPorObjetivo`,`asMinNum`,`asMaxNum`,`asPesoVariable`,`asPrima`,`comentarios`) values (164,4,17,NULL,'10.00','1.00','2.00','99.00',NULL,NULL);
insert  into `asg_objetivos`(`asgObjetivoId`,`asgTrabajadorId`,`objetivoId`,`asSn`,`asPorObjetivo`,`asMinNum`,`asMaxNum`,`asPesoVariable`,`asPrima`,`comentarios`) values (167,2,12,NULL,'10.00','10.00','30.00','10.00','0.00','Esta será propagado');
insert  into `asg_objetivos`(`asgObjetivoId`,`asgTrabajadorId`,`objetivoId`,`asSn`,`asPorObjetivo`,`asMinNum`,`asMaxNum`,`asPesoVariable`,`asPrima`,`comentarios`) values (168,3,12,NULL,'10.00','10.00','30.00','10.00','0.00','Esta será propagado');
insert  into `asg_objetivos`(`asgObjetivoId`,`asgTrabajadorId`,`objetivoId`,`asSn`,`asPorObjetivo`,`asMinNum`,`asMaxNum`,`asPesoVariable`,`asPrima`,`comentarios`) values (169,5,12,NULL,'10.00','10.00','30.00','10.00','0.00','Esta será propagado');
insert  into `asg_objetivos`(`asgObjetivoId`,`asgTrabajadorId`,`objetivoId`,`asSn`,`asPorObjetivo`,`asMinNum`,`asMaxNum`,`asPesoVariable`,`asPrima`,`comentarios`) values (170,7,12,NULL,'10.00','10.00','30.00','10.00','0.00','Esta será propagado');

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
  `variableF` decimal(4,2) DEFAULT NULL,
  `fevaluadorId` int(11) DEFAULT NULL,
  `ievaluadorId` int(11) DEFAULT NULL,
  `dFecha` datetime DEFAULT NULL,
  `hFecha` date DEFAULT NULL,
  `empresaId` int(11) DEFAULT NULL,
  PRIMARY KEY (`asgTrabajadorId`),
  KEY `ref_ejercicio` (`ejercicioId`),
  KEY `ref_pais` (`paisId`),
  KEY `ref_unidad` (`unidadId`),
  KEY `ref_area` (`areaId`),
  KEY `ref_puesto` (`puestoId`),
  KEY `ref_trabajador` (`trabajadorId`),
  KEY `ref_evaf` (`fevaluadorId`),
  KEY `ref_evai` (`ievaluadorId`),
  KEY `ref_empresa` (`empresaId`),
  CONSTRAINT `ref_area` FOREIGN KEY (`areaId`) REFERENCES `areas` (`areaId`),
  CONSTRAINT `ref_ejercicio` FOREIGN KEY (`ejercicioId`) REFERENCES `ejercicios` (`ejercicioId`),
  CONSTRAINT `ref_empresa` FOREIGN KEY (`empresaId`) REFERENCES `empresas` (`empresaId`),
  CONSTRAINT `ref_evaf` FOREIGN KEY (`fevaluadorId`) REFERENCES `trabajadores` (`trabajadorId`),
  CONSTRAINT `ref_evai` FOREIGN KEY (`ievaluadorId`) REFERENCES `trabajadores` (`trabajadorId`),
  CONSTRAINT `ref_pais` FOREIGN KEY (`paisId`) REFERENCES `paises` (`paisId`),
  CONSTRAINT `ref_puesto` FOREIGN KEY (`puestoId`) REFERENCES `puestos` (`puestoId`),
  CONSTRAINT `ref_trabajador` FOREIGN KEY (`trabajadorId`) REFERENCES `trabajadores` (`trabajadorId`),
  CONSTRAINT `ref_unidad` FOREIGN KEY (`unidadId`) REFERENCES `unidades` (`unidadId`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

/*Data for the table `asg_trabajadores` */

insert  into `asg_trabajadores`(`asgTrabajadorId`,`nombre`,`trabajadorId`,`ejercicioId`,`paisId`,`unidadId`,`areaId`,`puestoId`,`fijo`,`variable`,`variableF`,`fevaluadorId`,`ievaluadorId`,`dFecha`,`hFecha`,`empresaId`) values (2,'Gonxalo pocholi [2015]',3,2,3,1,5,1,'3425.00','25.00','10.00',4,4,'2015-06-08 00:00:00','2015-06-23',2);
insert  into `asg_trabajadores`(`asgTrabajadorId`,`nombre`,`trabajadorId`,`ejercicioId`,`paisId`,`unidadId`,`areaId`,`puestoId`,`fijo`,`variable`,`variableF`,`fevaluadorId`,`ievaluadorId`,`dFecha`,`hFecha`,`empresaId`) values (3,'Pepe Maravillas The Great [2015]',1,2,3,1,5,1,'14.36','25.00','3.00',3,4,'2015-06-01 00:00:00','2015-06-26',2);
insert  into `asg_trabajadores`(`asgTrabajadorId`,`nombre`,`trabajadorId`,`ejercicioId`,`paisId`,`unidadId`,`areaId`,`puestoId`,`fijo`,`variable`,`variableF`,`fevaluadorId`,`ievaluadorId`,`dFecha`,`hFecha`,`empresaId`) values (4,'Maria Carvajal [2014]',4,3,3,1,6,2,'10.00','1.00','2.00',3,3,'2014-01-01 00:00:00','2014-12-31',3);
insert  into `asg_trabajadores`(`asgTrabajadorId`,`nombre`,`trabajadorId`,`ejercicioId`,`paisId`,`unidadId`,`areaId`,`puestoId`,`fijo`,`variable`,`variableF`,`fevaluadorId`,`ievaluadorId`,`dFecha`,`hFecha`,`empresaId`) values (5,'Maria Orgina Poloska [2015]',6,2,3,1,5,1,'45000.00','10.00','0.00',3,3,'2015-01-30 00:00:00','2015-12-12',2);
insert  into `asg_trabajadores`(`asgTrabajadorId`,`nombre`,`trabajadorId`,`ejercicioId`,`paisId`,`unidadId`,`areaId`,`puestoId`,`fijo`,`variable`,`variableF`,`fevaluadorId`,`ievaluadorId`,`dFecha`,`hFecha`,`empresaId`) values (6,'Juan García Alaman [2015]',5,2,3,3,7,1,'45000.00','10.00','0.00',3,4,'2015-01-30 00:00:00','2015-12-12',3);
insert  into `asg_trabajadores`(`asgTrabajadorId`,`nombre`,`trabajadorId`,`ejercicioId`,`paisId`,`unidadId`,`areaId`,`puestoId`,`fijo`,`variable`,`variableF`,`fevaluadorId`,`ievaluadorId`,`dFecha`,`hFecha`,`empresaId`) values (7,'John Milles Steward [2015]',7,2,3,1,6,1,'42000.00','10.00','0.00',3,3,'2015-01-30 00:00:00','2015-12-12',2);

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
insert  into `categorias`(`categoriaId`,`nombre`) values (3,'Funcional');

/*Table structure for table `colectivos` */

DROP TABLE IF EXISTS `colectivos`;

CREATE TABLE `colectivos` (
  `colectivoId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`colectivoId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Data for the table `colectivos` */

insert  into `colectivos`(`colectivoId`,`nombre`) values (1,'Directivos');
insert  into `colectivos`(`colectivoId`,`nombre`) values (3,'Mando intermedio');

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
  `porMinIndividual` int(11) DEFAULT NULL,
  `porMaxIndividual` int(11) DEFAULT NULL,
  PRIMARY KEY (`ejercicioId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Data for the table `ejercicios` */

insert  into `ejercicios`(`ejercicioId`,`nombre`,`fechaInicio`,`fechaFinal`,`porPuertaAcceso`,`porOrganizacion`,`porIndividual`,`porMinIndividual`,`porMaxIndividual`) values (2,'2015','2015-01-30 00:00:00','2015-12-12 00:00:00',0,70,30,10,20);
insert  into `ejercicios`(`ejercicioId`,`nombre`,`fechaInicio`,`fechaFinal`,`porPuertaAcceso`,`porOrganizacion`,`porIndividual`,`porMinIndividual`,`porMaxIndividual`) values (3,'2014','2016-03-19 00:00:00','2016-03-27 00:00:00',0,20,30,0,90);

/*Table structure for table `empresas` */

DROP TABLE IF EXISTS `empresas`;

CREATE TABLE `empresas` (
  `empresaId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`empresaId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Data for the table `empresas` */

insert  into `empresas`(`empresaId`,`nombre`) values (2,'LAINSA');
insert  into `empresas`(`empresaId`,`nombre`) values (3,'FALCK');

/*Table structure for table `evaluador_trabajador` */

DROP TABLE IF EXISTS `evaluador_trabajador`;

CREATE TABLE `evaluador_trabajador` (
  `evaluadorTrabajadorId` int(11) NOT NULL AUTO_INCREMENT,
  `evaluadorId` int(11) NOT NULL,
  `trabajadorId` int(11) NOT NULL,
  PRIMARY KEY (`evaluadorTrabajadorId`),
  UNIQUE KEY `idx_evaluado_duplicado` (`evaluadorId`,`trabajadorId`),
  KEY `ref_trabajador_evaluado` (`trabajadorId`),
  CONSTRAINT `ref_evaluador` FOREIGN KEY (`evaluadorId`) REFERENCES `trabajadores` (`trabajadorId`),
  CONSTRAINT `ref_trabajador_evaluado` FOREIGN KEY (`trabajadorId`) REFERENCES `trabajadores` (`trabajadorId`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

/*Data for the table `evaluador_trabajador` */

insert  into `evaluador_trabajador`(`evaluadorTrabajadorId`,`evaluadorId`,`trabajadorId`) values (12,3,3);
insert  into `evaluador_trabajador`(`evaluadorTrabajadorId`,`evaluadorId`,`trabajadorId`) values (10,4,1);
insert  into `evaluador_trabajador`(`evaluadorTrabajadorId`,`evaluadorId`,`trabajadorId`) values (9,4,3);
insert  into `evaluador_trabajador`(`evaluadorTrabajadorId`,`evaluadorId`,`trabajadorId`) values (11,4,4);

/*Table structure for table `objetivos` */

DROP TABLE IF EXISTS `objetivos`;

CREATE TABLE `objetivos` (
  `objetivoId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `categoriaId` int(11) DEFAULT NULL,
  `tipoId` int(11) DEFAULT NULL,
  `evaluadorId` int(11) DEFAULT NULL,
  PRIMARY KEY (`objetivoId`),
  KEY `ref_categorias` (`categoriaId`),
  KEY `ref_tipos` (`tipoId`),
  KEY `ref_evaluadores` (`evaluadorId`),
  CONSTRAINT `ref_categorias` FOREIGN KEY (`categoriaId`) REFERENCES `categorias` (`categoriaId`),
  CONSTRAINT `ref_evaluadores` FOREIGN KEY (`evaluadorId`) REFERENCES `trabajadores` (`trabajadorId`),
  CONSTRAINT `ref_tipos` FOREIGN KEY (`tipoId`) REFERENCES `tipos` (`tipoId`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;

/*Data for the table `objetivos` */

insert  into `objetivos`(`objetivoId`,`nombre`,`categoriaId`,`tipoId`,`evaluadorId`) values (1,'Beneficadoss',2,2,NULL);
insert  into `objetivos`(`objetivoId`,`nombre`,`categoriaId`,`tipoId`,`evaluadorId`) values (2,'Porcenta',1,1,NULL);
insert  into `objetivos`(`objetivoId`,`nombre`,`categoriaId`,`tipoId`,`evaluadorId`) values (8,'Numericas',2,0,4);
insert  into `objetivos`(`objetivoId`,`nombre`,`categoriaId`,`tipoId`,`evaluadorId`) values (9,'NSFG56',0,0,NULL);
insert  into `objetivos`(`objetivoId`,`nombre`,`categoriaId`,`tipoId`,`evaluadorId`) values (12,'Grupo 7888',1,2,3);
insert  into `objetivos`(`objetivoId`,`nombre`,`categoriaId`,`tipoId`,`evaluadorId`) values (16,'MONHJDJ',0,2,NULL);
insert  into `objetivos`(`objetivoId`,`nombre`,`categoriaId`,`tipoId`,`evaluadorId`) values (17,'VEN',0,1,NULL);
insert  into `objetivos`(`objetivoId`,`nombre`,`categoriaId`,`tipoId`,`evaluadorId`) values (19,'Puntualidad',1,1,NULL);
insert  into `objetivos`(`objetivoId`,`nombre`,`categoriaId`,`tipoId`,`evaluadorId`) values (20,'Objetivo funcional 1',3,0,NULL);
insert  into `objetivos`(`objetivoId`,`nombre`,`categoriaId`,`tipoId`,`evaluadorId`) values (21,'Objetivo funcional 2',3,2,NULL);

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
  `login` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `evaluador` tinyint(1) DEFAULT NULL,
  `colectivoId` int(11) DEFAULT NULL,
  `idioma` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`trabajadorId`),
  KEY `ref_colectivo` (`colectivoId`),
  CONSTRAINT `ref_colectivo` FOREIGN KEY (`colectivoId`) REFERENCES `colectivos` (`colectivoId`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

/*Data for the table `trabajadores` */

insert  into `trabajadores`(`trabajadorId`,`nombre`,`dni`,`login`,`password`,`evaluador`,`colectivoId`,`idioma`) values (1,'Pepe Maravillas The Great','455578','pepe','pepe',NULL,3,NULL);
insert  into `trabajadores`(`trabajadorId`,`nombre`,`dni`,`login`,`password`,`evaluador`,`colectivoId`,`idioma`) values (3,'Gonxalo pocholi','45666','S-1-5-21-3077458779-297755452-906557366-1001','gonxo',1,1,NULL);
insert  into `trabajadores`(`trabajadorId`,`nombre`,`dni`,`login`,`password`,`evaluador`,`colectivoId`,`idioma`) values (4,'Maria Carvajal','79854654','maria','maria',1,1,NULL);
insert  into `trabajadores`(`trabajadorId`,`nombre`,`dni`,`login`,`password`,`evaluador`,`colectivoId`,`idioma`) values (5,'Juan García Alaman','2563366','juan','juan',NULL,3,NULL);
insert  into `trabajadores`(`trabajadorId`,`nombre`,`dni`,`login`,`password`,`evaluador`,`colectivoId`,`idioma`) values (6,'Maria Orgina Poloska','78994545','poloska','ploska',NULL,1,NULL);
insert  into `trabajadores`(`trabajadorId`,`nombre`,`dni`,`login`,`password`,`evaluador`,`colectivoId`,`idioma`) values (7,'John Milles Steward','12458','john','john',NULL,3,NULL);

/*Table structure for table `unidades` */

DROP TABLE IF EXISTS `unidades`;

CREATE TABLE `unidades` (
  `unidadId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`unidadId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Data for the table `unidades` */

insert  into `unidades`(`unidadId`,`nombre`) values (1,'Unidad 1');
insert  into `unidades`(`unidadId`,`nombre`) values (2,'Unidad 234');
insert  into `unidades`(`unidadId`,`nombre`) values (3,'Unidad 345');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
