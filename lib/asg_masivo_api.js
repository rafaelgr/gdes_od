// asg_masivo_api
// manejo de los mensajes REST dirigidos a areas
var asgMasivoDb = require("./asg_masivo_db_mysql");



// postAsgMasivoPuertaDeAcceso
//
module.exports.postAsgMasivoPuertaDeAcceso = function(req, res){
	asgMasivoDb.postAsgMasivoPuertaDeAcceso(req.body.asgModelo, function(err, masivo){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(null);
		}
	});
}


// postAsgMasivoOrganizacion
module.exports.postAsgMasivoOrganizacion = function (req, res) {
    asgMasivoDb.postAsgMasivoOrganizacion(req.body.asgModelo, function (err, masivo) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json(null);
        }
    });
}