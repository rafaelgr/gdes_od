// proyectos_db_mysql
// Manejo de la tabla proyectos en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // linrería para el manejo de llamadas asíncronas en JS

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

// comprobarProyecto
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarProyecto(proyecto){
	// debe ser objeto del tipo que toca
	var comprobado = "object" === typeof proyecto;
	// en estas propiedades no se admiten valores nulos
	comprobado = (comprobado && proyecto.hasOwnProperty("proyectoId"));
	comprobado = (comprobado && proyecto.hasOwnProperty("nombre"));
	comprobado = (comprobado && proyecto.hasOwnProperty("fechaInicial"));
	comprobado = (comprobado && proyecto.hasOwnProperty("fechaFinal"));
	return comprobado;
}


// getProyectos
// lee todos los registros de la tabla proyectos y
// los devuelve como una lista de objetos
module.exports.getProyectos = function(callback){
	var connection = getConnection();
	var proyectos = null;
	sql = "SELECT * FROM proyectos";
	connection.query(sql, function(err, result){
		if (err){
			callback(err, null);
			return;
		}
		proyectos = result;
		callback(null, proyectos);
	});	
	closeConnectionCallback(connection, callback);
}

// getProyecto
// busca  el proyecto con id pasado
module.exports.getProyecto = function(id, callback){
	var connection = getConnection();
	var proyectos = null;
	sql = "SELECT * FROM proyectos WHERE proyectoId = ?";
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


// postProyecto
// crear en la base de datos el proyecto pasado
module.exports.postProyecto = function(proyecto, callback){
	if (!comprobarProyecto(proyecto)){
		var err = new Error("El proyecto pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
	}
	var connection = getConnection();
	proyecto.proyectoId = 0; // fuerza el uso de autoincremento
	sql = "INSERT INTO proyectos SET ?";
	sql = mysql.format(sql, proyecto);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
		}
		proyecto.proyectoId = result.insertId;
		callback(null, proyecto);
	});
	closeConnectionCallback(connection, callback);
}

// putProyecto
// Modifica el proyecto según los datos del objeto pasao
module.exports.putProyecto = function(proyecto, callback){
	if (!comprobarProyecto(proyecto)){
		var err = new Error("El proyecto pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
	}
	var connection = getConnection();
	sql = "UPDATE proyectos SET ? WHERE proyectoId = ?";
	sql = mysql.format(sql, [proyecto, proyecto.proyectoId]);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
		}
		callback(null, proyecto);
	});
	closeConnectionCallback(connection, callback);
}

// deleteProyecto
// Elimina el proyecto con el id pasado
module.exports.deleteProyecto = function(proyecto, callback){
	if (!comprobarProyecto(proyecto)){
		var err = new Error("El proyecto pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
	}
	var connection = getConnection();
	sql = "DELETE from proyectos WHERE proyectoId = ?";
	sql = mysql.format(sql, proyecto.proyectoId);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
			return;
		}
		callback(null);
		closeConnectionCallback(connection, callback);
	});
}