// ------------- GDES AC
// Servidor de la aplicación de gestión de área de conocimiento.
// -----------------------
// Cargar los paquetes exteriores
// -- prueba git --

var fs = require("fs"); // (file system) Maneja el acceso a ficheros
var moment = require("moment"); // Maeja las variables de fecha y hora en diversos formatos
var express = require("express"); // Framework de node para manejar peticiones
var bodyParser = require("body-parser"); // proceso de los cuerpos de mensaje
var morgan = require("morgan"); // sirve para grabar logs 
var cors = require("cors"); // maneja los problemas de mensajes cruzados CORS

// montar la aplicación express
var app = express();

// lee los parámetros generales de la aplicación
var config = require("./config.json");

// apoyo a las api
var proyectos_api = require("./lib/proyectos_api");
var administradores_api = require("./lib/administradores_api");
var version_api = require("./lib/version_api.js");
var ejercicios_api = require("./lib/ejercicios_api.js");
var paises_api = require("./lib/paises_api.js");
var unidades_api = require("./lib/unidades_api.js");
var puestos_api = require("./lib/puestos_api.js");



// ficheros en los que se grabarán los log de aplicación
var express_log_file = __dirname + "/logs/node.express.log";
var error_log_file = __dirname + "/logs/node.error.log";
var console_log_file = __dirname + "/logs/node.console.log";

// activar el procesador de los cuerpos de mensajes
app.use(bodyParser());

// preparar y activar con morgan el fichero para grabar el log
var logfile = fs.createWriteStream(express_log_file,{
	"flags":"a"
});

/*
app.use (morgan({
	format: "short",
	stream: logfile
}));
*/

// manejo de CORS
app.use(cors());

// servidor html estático
app.use(express.static(__dirname+"/public"));

/*
// al funcionar como servicio redireccionamos la consola y las pantallas
// de errores a ficheros de log.
process.__defineGetter__("stderr", function(){
	return fs.createWriteStream(error_log_file,{
		flags: "a"
	})
});

process.__defineGetter__("stdout", function(){
	return fs.createWriteStream(console_log_file,{
		flags: "a"
	})
});
*/

// ============================================================
// PREPARACION DE RUTAS
// ============================================================

var router = express.Router();

// paso común de todas las rutas
router.use(function(req, res, next){
	// aquí irá código que se desea ejecutar de manera común a todas las rutas
	// -----------
	next();
});

router.get("/", function(req, res){
//	res.json({
//		mensaje: "API GDES AC"
//	});
	res.send("API GDES OD [A la escucha]");
});

//================================================================
// Rutas específicas.
//================================================================

// --> Relacionadas con control de versiones
router.route("/version")
	.get(version_api.getVersion);


// --> Relacionadas con proyectos
router.route("/proyectos")
	.get(proyectos_api.getProyectos)
	.post(proyectos_api.postProyecto);


router.route("/proyectos/:proyectoId")
	.get(proyectos_api.getProyecto)
	.put(proyectos_api.putProyecto)
	.delete(proyectos_api.deleteProyecto);

// --> Relacionadas con administradores
router.route("/administradores")
	.get(administradores_api.getAdministradores)
	.post(administradores_api.postAdministrador);


router.route("/administradores/:administradorId")
	.get(administradores_api.getAdministrador)
	.put(administradores_api.putAdministrador)
	.delete(administradores_api.deleteAdministrador);

router.route("/administradores-buscar")
	.post(administradores_api.postAdministradoresBuscar);

// --> Relacionadas con ejercicios
router.route("/ejercicios")
	.get(ejercicios_api.getEjercicios)
	.post(ejercicios_api.postEjercicio);


router.route("/ejercicios/:ejercicioId")
	.get(ejercicios_api.getEjercicio)
	.put(ejercicios_api.putEjercicio)
	.delete(ejercicios_api.deleteEjercicio);

router.route("/ejercicios-buscar")
	.post(ejercicios_api.postEjerciciosBuscar);

// --> Relacionadas con paises
router.route("/paises")
	.get(paises_api.getPaises)
	.post(paises_api.postPais);


router.route("/paises/:paisId")
	.get(paises_api.getPais)
	.put(paises_api.putPais)
	.delete(paises_api.deletePais);

router.route("/paises-buscar")
	.post(paises_api.postPaisesBuscar);

// --> Relacionadas con unidades de negocio
router.route("/unidades")
	.get(unidades_api.getUnidades)
	.post(unidades_api.postUnidad);


router.route("/unidades/:unidadId")
	.get(unidades_api.getUnidad)
	.put(unidades_api.putUnidad)
	.delete(unidades_api.deleteUnidad);

router.route("/unidades-buscar")
	.post(unidades_api.postUnidadesBuscar);

// --> Relacionadas con puestos de trabajo
router.route("/puestos")
	.get(puestos_api.getPuestos)
	.post(puestos_api.postPuesto);


router.route("/puestos/:puestoId")
	.get(puestos_api.getPuesto)
	.put(puestos_api.putPuesto)
	.delete(puestos_api.deletePuesto);

router.route("/puestos-buscar")
	.post(puestos_api.postPuestosBuscar);


//================================================================
// Registro de rutas y arranque del servidor
//================================================================
app.use("/api", router);

app.listen(config.apiPort);
console.log("GDES OD Port: ", config.apiPort);