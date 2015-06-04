// colectivos_db_mysql
// Manejo de la tabla colectivos en la base de datos
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

// comprobarColectivo
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarColectivo(colectivo){
	// debe ser objeto del tipo que toca
	var comprobado = "object" === typeof colectivo;
	// en estas propiedades no se admiten valores nulos
	comprobado = (comprobado && colectivo.hasOwnProperty("colectivoId"));
	comprobado = (comprobado && colectivo.hasOwnProperty("nombre"));
	return comprobado;
}


// getColectivos
// lee todos los registros de la tabla colectivos y
// los devuelve como una lista de objetos
module.exports.getColectivos = function(callback){
	var connection = getConnection();
	var colectivos = null;
	sql = "SELECT * FROM colectivos";
	connection.query(sql, function(err, result){
		if (err){
			callback(err, null);
			return;
		}
		colectivos = result;
		callback(null, colectivos);
	});	
	closeConnectionCallback(connection, callback);
}

// postColectivosBuscar
// lee todos los registros de la tabla colectivos cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.postColectivosBuscar = function (buscador, callback) {
    var connection = getConnection();
    var colectivos = null;
    var sql = "SELECT * FROM colectivos";
    if (buscador.nombre !== "*") {
        sql = "SELECT * FROM colectivos WHERE nombre LIKE ?";
        sql = mysql.format(sql, '%' + buscador.nombre + '%');
    }
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        colectivos = result;
        callback(null, colectivos);
    });
    closeConnectionCallback(connection, callback);
}

// getColectivo
// busca  el colectivo con id pasado
module.exports.getColectivo = function(id, callback){
	var connection = getConnection();
	var colectivos = null;
	sql = "SELECT * FROM colectivos WHERE colectivoId = ?";
	sql = mysql.format(sql, id);
	connection.query(sql, function(err, result){
		if (err){
			callback(err, null);
			return;
		}
		if (result.length == 0){
			callback(null, null);
			return;
		}
		callback(null, result[0]);
	});
	closeConnectionCallback(connection, callback);
}


// postColectivo
// crear en la base de datos el colectivo pasado
module.exports.postColectivo = function (colectivo, callback){
	if (!comprobarColectivo(colectivo)){
		var err = new Error("El colectivo pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
	}
	var connection = getConnection();
	colectivo.colectivoId = 0; // fuerza el uso de autoincremento
	sql = "INSERT INTO colectivos SET ?";
	sql = mysql.format(sql, colectivo);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
		}
		colectivo.colectivoId = result.insertId;
		callback(null, colectivo);
	});
	closeConnectionCallback(connection, callback);
}

// putColectivo
// Modifica el colectivo según los datos del objeto pasao
module.exports.putColectivo = function(id, colectivo, callback){
	if (!comprobarColectivo(colectivo)){
		var err = new Error("El colectivo pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
    }
    if (id != colectivo.colectivoId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
	var connection = getConnection();
	sql = "UPDATE colectivos SET ? WHERE colectivoId = ?";
	sql = mysql.format(sql, [colectivo, colectivo.colectivoId]);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
		}
		callback(null, colectivo);
	});
	closeConnectionCallback(connection, callback);
}

// deleteColectivo
// Elimina el colectivo con el id pasado
module.exports.deleteColectivo = function(id, colectivo, callback){
	var connection = getConnection();
	sql = "DELETE from colectivos WHERE colectivoId = ?";
	sql = mysql.format(sql, colectivo.colectivoId);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
			return;
		}
		callback(null);
		closeConnectionCallback(connection, callback);
	});
}