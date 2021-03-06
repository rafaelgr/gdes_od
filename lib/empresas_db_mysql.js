// empresas_db_mysql
// Manejo de la tabla empresas en la base de datos
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

// comprobarEmpresa
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarEmpresa(empresa){
	// debe ser objeto del tipo que toca
	var comprobado = "object" === typeof empresa;
	// en estas propiedades no se admiten valores nulos
	comprobado = (comprobado && empresa.hasOwnProperty("empresaId"));
	comprobado = (comprobado && empresa.hasOwnProperty("nombre"));
	return comprobado;
}


// getEmpresas
// lee todos los registros de la tabla empresas y
// los devuelve como una lista de objetos
module.exports.getEmpresas = function(callback){
	var connection = getConnection();
	var empresas = null;
	sql = "SELECT * FROM empresas";
	connection.query(sql, function(err, result){
		if (err){
			callback(err, null);
			return;
		}
		empresas = result;
		callback(null, empresas);
	});	
	closeConnectionCallback(connection, callback);
}

// postEmpresasBuscar
// lee todos los registros de la tabla empresas cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.postEmpresasBuscar = function (buscador, callback) {
    var connection = getConnection();
    var empresas = null;
    var sql = "SELECT * FROM empresas";
    if (buscador.nombre !== "*") {
        sql = "SELECT * FROM empresas WHERE nombre LIKE ?";
        sql = mysql.format(sql, '%' + buscador.nombre + '%');
    }
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        empresas = result;
        callback(null, empresas);
    });
    closeConnectionCallback(connection, callback);
}

// getEmpresa
// busca  el empresa con id pasado
module.exports.getEmpresa = function(id, callback){
	var connection = getConnection();
	var empresas = null;
	sql = "SELECT * FROM empresas WHERE empresaId = ?";
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


// postEmpresa
// crear en la base de datos el empresa pasado
module.exports.postEmpresa = function (empresa, callback){
	if (!comprobarEmpresa(empresa)){
		var err = new Error("El empresa pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
	}
	var connection = getConnection();
	empresa.empresaId = 0; // fuerza el uso de autoincremento
	sql = "INSERT INTO empresas SET ?";
	sql = mysql.format(sql, empresa);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
		}
		empresa.empresaId = result.insertId;
		callback(null, empresa);
	});
	closeConnectionCallback(connection, callback);
}

// putEmpresa
// Modifica el empresa según los datos del objeto pasao
module.exports.putEmpresa = function(id, empresa, callback){
	if (!comprobarEmpresa(empresa)){
		var err = new Error("El empresa pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
    }
    if (id != empresa.empresaId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
	var connection = getConnection();
	sql = "UPDATE empresas SET ? WHERE empresaId = ?";
	sql = mysql.format(sql, [empresa, empresa.empresaId]);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
		}
		callback(null, empresa);
	});
	closeConnectionCallback(connection, callback);
}

// deleteEmpresa
// Elimina el empresa con el id pasado
module.exports.deleteEmpresa = function(id, empresa, callback){
	var connection = getConnection();
	sql = "DELETE from empresas WHERE empresaId = ?";
	sql = mysql.format(sql, empresa.empresaId);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
			return;
		}
		callback(null);
		closeConnectionCallback(connection, callback);
	});
}