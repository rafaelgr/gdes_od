/* Tratamiento de primas */
ALTER TABLE `gdes_od`.`asg_objetivos` ADD COLUMN `asPrima` DECIMAL(4,2) NULL AFTER `asPesoVariable`; 
ALTER TABLE `gdes_od`.`asg_objetivos`   
  CHANGE `asPrima` `asPrima` DECIMAL(12,2) NULL;