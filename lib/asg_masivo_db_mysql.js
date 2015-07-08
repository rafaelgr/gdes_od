// asg_masivo_db_mysql
// Asignaciones masivas de objetivos 
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS

//  leer la configurción de MySQL
var config = require("./configMySQL.json");
var sql = "";

// getConnection 
// función auxiliar para obtener una conexión al servidor
// de base de datos.
function getConnection() {
    var connection = mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
        port: config.port
    });
    connection.connect(function(err) {
        if (err) throw err;
    });
    return connection;
}

// closeConnection
// función auxiliar para cerrar una conexión
function closeConnection(connection) {
    connection.end(function(err) {
        if (err) {
            throw err;
        }
    });
}

function closeConnectionCallback(connection, callback){
	connection.end(function(err){
		if (err) callback(err);
	});
}

// comprobarAsgModelo
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
// 
function comprobarAsgModelo(asgModelo){
	// debe ser objeto del tipo que toca
	var comprobado = typeof asgModelo === "object";
	// en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && asgModelo.hasOwnProperty("asgTrabajadorId"));
    comprobado = (comprobado && asgModelo.hasOwnProperty("categoriaId"));
    comprobado = (comprobado && asgModelo.hasOwnProperty("unidadId"));
	return comprobado;
}


// postAsgMasivoPuertaDeAcceso
// realizar las asignaciones masivas de objetivos en categoria de puerta de acceso.
module.exports.postAsgMasivoPuertaDeAcceso = function (asgModelo, callback) {
    if (!comprobarAsgModelo(asgModelo)) {
        var err = new Error("El asgModelo pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        callback(err);
        return;
    }
    var asgTrabajadorId = asgModelo.asgTrabajadorId;
    var connection = getConnection();
    sql = "";
    
    connection.beginTransaction(function (err) {
        if (err) { throw err; }
        // borrar los registros de puerta de acceso (categoriaId = 0)
        // de todos los trabajadores excepto el de asignación pasada que será el 
        // que servirá como modelo.
        sql = "DELETE";
        sql += " FROM asg_objetivos";
        sql += " WHERE asgTrabajadorId <> ?";
        sql += " AND objetivoId IN(SELECT objetivoId FROM objetivos WHERE categoriaId = 0)";
        sql = mysql.format(sql, asgTrabajadorId);
        connection.query(sql, function (err, result) {
            if (err) {
                return connection.rollback(function () {
                    callback(err, null);
                });
            }
            // Y ahora creamos los registros de asi
            sql = "INSERT INTO asg_objetivos(`asgTrabajadorId`,`objetivoId`,`asSn`,`asPorObjetivo`,`asMinNum`,`asMaxNum`,`asPesoVariable`,`asPrima`,`comentarios`)";
            sql += " SELECT asgt.asgTrabajadorId, asgo.`objetivoId`, asgo.`asSn`, asgo.`asPorObjetivo`, asgo.`asMinNum`, asgo.`asMaxNum`, asgo.`asPesoVariable`, asgo.`asPrima`, asgo.`comentarios`";
            sql += " FROM asg_objetivos AS asgo";
            sql += " LEFT JOIN objetivos AS o ON o.objetivoId = asgo.objetivoId";
            sql += " LEFT JOIN asg_trabajadores AS asgt ON 1 = 1";
            sql += " WHERE asgo.asgTrabajadorId = ? AND o.categoriaId = 0";
            sql += " AND asgt.asgTrabajadorId <> ?;"
            sql = mysql.format(sql, [asgTrabajadorId, asgTrabajadorId]);
            connection.query(sql, function (err, result) {
                if (err) {
                    return connection.rollback(function () {
                        callback(err, null);
                    });
                }
                connection.commit(function (err) {
                    if (err) {
                        return connection.rollback(function () {
                            callback(err, null);
                        });
                    }
                    callback(null, null);
                    closeConnectionCallback(connection, callback);
                });    
            });
        });
    });
}


// postAsgMasivoPuertaDeAcceso
// realizar las asignaciones masivas de objetivos en categoria de puerta de acceso.
module.exports.postAsgMasivoOrganizacion = function (asgModelo, callback) {
    if (!comprobarAsgModelo(asgModelo)) {
        var err = new Error("El asgModelo pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        callback(err);
        return;
    }
    var asgTrabajadorId = asgModelo.asgTrabajadorId;
    var unidadId = asgModelo.unidadId;
    var connection = getConnection();
    sql = "";
    
    connection.beginTransaction(function (err) {
        if (err) { throw err; }
        // borrar los registros de puerta de acceso (categoriaId = 0)
        // de todos los trabajadores excepto el de asignación pasada que será el 
        // que servirá como modelo.
        sql = "DELETE FROM asg_objetivos WHERE asgObjetivoId IN";
        sql += " (SELECT asgObjetivoId";
        sql += " FROM (SELECT * from asg_objetivos) AS asgo";
        sql += " LEFT JOIN asg_trabajadores AS asgt ON asgt.asgTrabajadorId = asgo.asgTrabajadorId";
        sql += " LEFT JOIN objetivos AS o ON o.objetivoId = asgo.objetivoId";
        sql += " WHERE asgt.asgTrabajadorId <> ?";
        sql += " AND o.categoriaId = 1 AND asgt.unidadId = ?)";
        sql = mysql.format(sql, [asgTrabajadorId, unidadId]);
        connection.query(sql, function (err, result) {
            if (err) {
                return connection.rollback(function () {
                    callback(err, null);
                });
            }
            // Y ahora creamos los registros de asi
            sql = "INSERT INTO asg_objetivos (`asgTrabajadorId`,`objetivoId`,`asSn`,`asPorObjetivo`,`asMinNum`,`asMaxNum`,`asPesoVariable`,`asPrima`,`comentarios`)";
            sql += " SELECT asgt.asgTrabajadorId, asgo.`objetivoId`, asgo.`asSn`, asgo.`asPorObjetivo`, asgo.`asMinNum`, asgo.`asMaxNum`, asgo.`asPesoVariable`, asgo.`asPrima`, asgo.`comentarios` ";
            sql += " FROM asg_objetivos AS asgo";
            sql += " LEFT JOIN objetivos AS o ON o.objetivoId = asgo.objetivoId";
            sql += " LEFT JOIN asg_trabajadores AS asgt ON 1 = 1";
            sql += " WHERE asgo.asgTrabajadorId = ? AND o.categoriaId = 1";
            sql += " AND asgt.asgTrabajadorId <> ? AND asgt.unidadId =?";
            sql = mysql.format(sql, [asgTrabajadorId, asgTrabajadorId, unidadId]);
            connection.query(sql, function (err, result) {
                if (err) {
                    return connection.rollback(function () {
                        callback(err, null);
                    });
                }
                connection.commit(function (err) {
                    if (err) {
                        return connection.rollback(function () {
                            callback(err, null);
                        });
                    }
                    callback(null, null);
                    closeConnectionCallback(connection, callback);
                });
            });
        });
    });
}


