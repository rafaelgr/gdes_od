/* */
CREATE TABLE `gdes_od`.`empresas`(  
  `empresaId` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255),
  PRIMARY KEY (`empresaId`)
);
ALTER TABLE `gdes_od`.`asg_trabajadores`   
  ADD COLUMN `empresaId` INT(11) NULL AFTER `hFecha`,
  ADD CONSTRAINT `ref_empresa` FOREIGN KEY (`empresaId`) REFERENCES `gdes_od`.`empresas`(`empresaId`);
  
CREATE TABLE `gdes_od`.`colectivos`(  
  `colectivoId` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255),
  PRIMARY KEY (`colectivoId`)
);

ALTER TABLE `gdes_od`.`trabajadores`   
  ADD COLUMN `colectivoId` INT(11) NULL AFTER `evaluador`,
  ADD CONSTRAINT `ref_colectivo` FOREIGN KEY (`colectivoId`) REFERENCES `gdes_od`.`colectivos`(`colectivoId`);