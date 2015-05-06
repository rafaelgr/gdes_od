ALTER TABLE `gdes_od`.`ejercicios`   
  ADD COLUMN `porMinIndividual` INT(11) NULL AFTER `porIndividual`,
  ADD COLUMN `porMaxIndividual` INT(11) NULL AFTER `porMinIndividual`;
  
UPDATE ejercicios
SET porMinIndividual = 0, porMaxIndividual=90;