﻿// version_api
// Sirve para poder devolver un mensaje con la
// versión de la aplicación.
module.exports.getVersion = function (req, res){
    var data = { "version": "VRS 2015.1.0.18" };
    res.json(data);
}