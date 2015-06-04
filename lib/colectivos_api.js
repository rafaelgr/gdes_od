// colectivos_api
// manejo de los mensajes REST dirigidos a colectivos
var colectivosDb = require("./colectivos_db_mysql");


// GetColectivos
// Devuelve una lista de objetos con todos los colectivos de la 
// base de datos.
module.exports.getColectivos = function(req, res){
	colectivosDb.getColectivos(function(err, colectivos){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(colectivos);
		}
	});
}

// GetColectivosBuscar
// Busca una lista de objetos donde el nombre contiene un valor pasado
module.exports.postColectivosBuscar = function (req, res){
    var buscador = req.body;
    if (buscador == null || buscador.nombre == null) {
        res.send(400, "Debe incluir en el cuerpo del mensaje un objeto 'buscador' con atributo 'nombre'.");
    }
    colectivosDb.postColectivosBuscar(buscador, function (err, colectivos) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json(colectivos);
        }
    });
}

// GetColectivo
// devuelve el colectivo con el id pasado
module.exports.getColectivo = function(req, res){
	colectivosDb.getColectivo(req.params.colectivoId, function(err, colectivo){
		if (err){
			res.send(500, err.message);
		}else{
			if (colectivo == null){
				res.send(404, "Colectivo no encontrado");
			}else{
				res.json(colectivo);
			}
		}
	});
}

// PostColectivo
// permite dar de alta un colectivo

module.exports.postColectivo = function(req, res){
	colectivosDb.postColectivo(req.body.colectivo, function(err, colectivo){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(colectivo);
		}
	});
}

// PutColectivo
// modifica el colectivo con el id pasado

module.exports.putColectivo = function(req, res){
    // antes de modificar comprobamos que el objeto existe
    colectivosDb.getColectivo(req.params.colectivoId, function (err, colectivo) {
        if (err) {
            res.send(500, err.message);
        } else {
            if (colectivo == null) {
                res.send(404, "Colectivo no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                colectivosDb.putColectivo(req.params.colectivoId, req.body.colectivo, function (err, colectivo) {
                    if (err) {
                        res.send(500, err.message);
                    } else {
                        res.json(colectivo);
                    }
                });
            }
        }
    });
}
// DeleteColectivo
// elimina un colectivo de la base de datos
module.exports.deleteColectivo = function(req, res){
    var colectivo = req.body;
    colectivosDb.deleteColectivo(req.params.colectivoId, colectivo, function(err, colectivo){
        if (err){
            res.send(500, err.message);
        }else{
            res.json(null);
        }
    });
}