/* */
INSERT INTO `gdes_od`.`categorias` (`categoriaId`, `nombre`) VALUES ('3', 'Funcional'); 

ALTER TABLE `gdes_od`.`asg_trabajadores`   
  ADD COLUMN `variableF` DECIMAL(4,2) NULL AFTER `variable`,
  ADD COLUMN `fevaluadorId` INT(11) NULL AFTER `variableF`,
  ADD COLUMN `ievaluadorId` INT(11) NULL AFTER `fevaluadorId`,
  ADD CONSTRAINT `ref_evaf` FOREIGN KEY (`fevaluadorId`) REFERENCES `gdes_od`.`trabajadores`(`trabajadorId`),
  ADD CONSTRAINT `ref_evai` FOREIGN KEY (`ievaluadorId`) REFERENCES `gdes_od`.`trabajadores`(`trabajadorId`);
  
ALTER TABLE `gdes_od`.`asg_trabajadores`   
  ADD COLUMN `dFecha` DATETIME NULL AFTER `ievaluadorId`,
  ADD COLUMN `hFecha` DATE NULL AFTER `dFecha`;