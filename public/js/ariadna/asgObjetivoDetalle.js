﻿/*-------------------------------------------------------------------------- 
asgObjetivoDetalle.js
Funciones js par la página AsgObjetivoDetalle.html
---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var asgObjetivoId = 0;
var asgTrabajadorId = 0;

var dataObjetivos;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};

/*------------------------------------------------
 * Funciones comunes
 *------------------------------------------------ */

function initForm() {
    // comprobarLogin();
    // de smart admin
    pageSetUp();
    // 
    // numeral en español
    numeral.language('es', {
        delimiters: {
            thousands: '.',
            decimal: ','
        }
    });
    numeral.language('es');

    getVersionFooter();
    vm = new asgObjetivoData();
    ko.applyBindings(vm);
    // asignación de eventos al clic
    $("#btnSalir").click(salir());
    
    $("#btnAceptarPA").click(aceptarPA());
    $("#btnSalirPA").click(salir());
    
    $("#btnAceptarO").click(aceptarO());
    $("#btnSalirO").click(salir());
    
    $("#btnAceptarI").click(aceptarI());
    $("#btnSalirI").click(salir());
    
    $("#frmGeneral").submit(function () {
        return false;
    });
    $("#frmPuertaAcceso").submit(function () {
        return false;
    });
    $("#frmOrganizacion").submit(function () {
        return false;
    });
    $("#frmIndividual").submit(function () {
        return false;
    });

    initTablaObjetivosPA();
    prepareValidatePA();
    
    initTablaObjetivosO();
    prepareValidateO();
    
    initTablaObjetivosI();
    prepareValidateI();

    
    // cargar los datos generales de la asignación del trabajador
    asgTrabajadorId = gup('AsgTrabajadorId');
    if (asgTrabajadorId != 0) {
        var data = {
            asgObjetivoId: asgObjetivoId
        }
        // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: "/api/asg-trabajadores/" + asgTrabajadorId,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                mostrarAsignacionTrabajador(data);
            },
            error: errorAjax
        });
        // cargar desplegables
        loadObjetivosPA();
        buscaCargaObjetivosPA();
        loadObjetivosO();
        buscaCargaObjetivosO();
        loadObjetivosI();
        buscaCargaObjetivosI();
    } else {
        // no debe entrar aquí
    }
}

function asgObjetivoData() {
    var self = this;
    self.asgObjetivoId = ko.observable();
    //
    self.asPorObjetivoPA = ko.observable();
    self.asMinNumPA = ko.observable();
    self.asMaxNumPA = ko.observable();
    self.asPesoVariablePA = ko.observable();

    self.asPorObjetivoO = ko.observable();
    self.asMinNumO = ko.observable();
    self.asMaxNumO = ko.observable();
    self.asPesoVariableO = ko.observable();
    
    self.asPorObjetivoI = ko.observable();
    self.asMinNumI = ko.observable();
    self.asMaxNumI = ko.observable();
    self.asPesoVariableI = ko.observable();    
    
    // soporte de combos
    self.posiblesObjetivosPA = ko.observableArray([]);
    self.objetivoPA = ko.observable();

    self.posiblesObjetivosO = ko.observableArray([]);
    self.objetivoO = ko.observable();

    self.posiblesObjetivosI = ko.observableArray([]);
    self.objetivoI = ko.observable();
}

function salir() {
    var mf = function () {
        var url = "AsgObjetivoGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}

function mostrarAsignacionTrabajador(data) {
    $("#txtTrabajador").text(data.trabajador.nombre);
    $("#txtPais").text(data.pais.nombre);
    $("#txtUnidad").text(data.unidad.nombre);
    $("#txtArea").text(data.area.nombre);
    $("#txtPuesto").text(data.puesto.nombre);
    // valores 
    $("#txtFijo").text(numeral(data.fijo).format('#,###,##0.00') + "€");
    $("#txtVariable").text(numeral(data.variable).format('#,###,##0.00') + "%");
}


/*------------------------------------------------
 * Funciones PA (Puerta de acceso)
 *------------------------------------------------ */

function loadObjetivosPA() {
    // enviar la consulta por la red (AJAX)
    var data = {
        "categoriaId": "0"
    };
    $.ajax({
        type: "POST",
        url: "api/objetivos-buscar",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (data, status) {
            // hay que mostrarlo en la zona de datos
            vm.posiblesObjetivosPA(data);
        },
        error: errorAjax
    });
}

function buscaCargaObjetivosPA(){
    // cargar la tabla de objetivos si hay datos
    data = {
        "asgTrabajadorId": asgTrabajadorId,
        "categoriaId": "0"
    };
    $.ajax({
        type: "POST",
        url: "api/asg-objetivos-buscar",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (data, status) {
            // hay que mostrarlo en la zona de datos
            loadTablaObjetivosPA(data);
        },
        error: errorAjax
    });
}

function prepareValidatePA(){
    var opciones = {
        rules: {
            cmbObjetivosPA: { required: true },
            txtPorObjetivoPA: { required: true, min: 0, max: 99 },
            txtMinNumPA: { required: true },
            txtMaxNumPA: { required: true },
            txtPesoVariablePA: { required: true, min: 0, max: 99 }
        },
        // Messages for form validation
        messages: {
            cmbObjetivosPA: { required: 'Seleccione un objetivo' },
            txtPorObjetivoPA: { required: 'Introduzca % mínimo', min: 'Valor incorrecto', max: 'Valor incorrecto' },
            txtMinNumPA: { required: 'Introduzca mínimo' },
            txtMaxNumPA: { required: 'Introduzca máximo' },
            txtPesoVariablePA: { required: 'Introduzca peso', min: 'Valor incorrecto', max: 'Valor incorrecto' }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    };
    $("#frmPuertaAcceso").validate(opciones);
}

function datosOKPA() {
    var opciones = $("#frmPuertaAcceso").validate().settings;
    // modificamos requerimiento según el tipo
    var objetivo = vm.objetivoPA();
    if (objetivo != null) {
        opciones.rules.cmbObjetivosPA.required = false;
        switch (objetivo.tipo.tipoId) {
            case 0:
                // Si / no
                opciones.rules.txtMinNumPA.required = false;
                opciones.rules.txtMaxNumPA.required = false;
                opciones.rules.txtPorObjetivoPA.required = false;
                break;
            case 1:
                // Porcentual
                opciones.rules.txtMinNumPA.required = false;
                opciones.rules.txtMaxNumPA.required = false;
                opciones.rules.txtPorObjetivoPA.required = true;
                break;
            case 2:
                // Numérico
                opciones.rules.txtMinNumPA.required = true;
                opciones.rules.txtMaxNumPA.required = true;
                opciones.rules.txtPorObjetivoPA.required = false;
                break;
            case 3:
                // Ligado a desempeño.
                opciones.rules.txtMinNumPA.required = false;
                opciones.rules.txtMaxNumPA.required = false;
                opciones.rules.txtPorObjetivoPA.required = false;
                break;
        }
    } else {
      opciones.rules.cmbObjetivosPA.required = true;
    }
    return $('#frmPuertaAcceso').valid();
}

function aceptarPA() {
    var mf = function () {
        if (!datosOKPA())
            return;
        var data = {
            asgObjetivo: {
                "asgObjetivoId": 0,
                "asgTrabajador": {
                    "asgTrabajadorId": asgTrabajadorId
                },
                "objetivo": {
                    "objetivoId": vm.objetivoPA().objetivoId
                },
                "asSn": null,
                "asPorObjetivo": vm.asPorObjetivoPA(),
                "asMinNum": vm.asMinNumPA(),
                "asMaxNum": vm.asMaxNumPA(),
                "asPesoVariable": vm.asPesoVariablePA()
            }
        };
        // parece idiota pero estamos controlando que los indefinidos vayan como nulos
        if (data.asgObjetivo.asPorObjetivo == null || data.asgObjetivo.asPorObjetivo == "") data.asgObjetivo.asPorObjetivo = 0;
        if (data.asgObjetivo.asMinNum == null || data.asgObjetivo.asMinNum == "") data.asgObjetivo.asMinNum = 0;
        if (data.asgObjetivo.asMaxNum == null || data.asgObjetivo.asMaxNum == "") data.asgObjetivo.asMaxNum = 0;

        $.ajax({
            type: "POST",
            url: "api/asg-objetivos",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                buscaCargaObjetivosPA();
            },
            error: errorAjax
        });
    };
    return mf;
}

function initTablaObjetivosPA() {
    tablaCarro = $('#dt_asgObjetivoPA').dataTable({
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_asgObjetivoPA'), breakpointDefinition);
            }
        },
        rowCallback: function (nRow) {
            responsiveHelper_dt_basic.createExpandIcon(nRow);
        },
        drawCallback: function (oSettings) {
            responsiveHelper_dt_basic.respond();
        },
        language: {
            processing: "Procesando...",
            info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
            infoFiltered: "(filtrado de un total de _MAX_ registros)",
            infoPostFix: "",
            loadingRecords: "Cargando...",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "Ningún dato disponible en esta tabla",
            paginate: {
                first: "Primero",
                previous: "Anterior",
                next: "Siguiente",
                last: "Último"
            },
            aria: {
                sortAscending: ": Activar para ordenar la columna de manera ascendente",
                sortDescending: ": Activar para ordenar la columna de manera descendente"
            }
        },
        data: dataObjetivos,
        columns: [{
                data: "objetivo.nombre"
            }, {
                data: "asPorObjetivo",
                render: function (data, type, row) {
                    if (data != null) {
                        var html = "<div style='text-align:right'>" + numeral(data).format('#,###,##0.00') + "%</div>";
                        return html;
                    } else {
                        return "";
                    }
                }
            }, {
                data: "asMinNum",
                render: function (data, type, row) {
                    if (data != null) {
                        var html = "<div style='text-align:right'>" + numeral(data).format('#,###,##0.00') + "</div>";
                        return html;
                    } else {
                        return "";
                    }
                }
            }, {
                data: "asMaxNum",
                render: function (data, type, row) {
                    if (data != null) {
                        var html = "<div style='text-align:right'>" + numeral(data).format('#,###,##0.00') + "</div>";
                        return html;
                    } else {
                        return "";
                    }
                }
            }, {
                data: "asPesoVariable",
                render: function (data, type, row) {
                    if (data != null) {
                        var html = "<div style='text-align:right'>" + numeral(data).format('#,###,##0.00') + "%</div>";
                        return html;
                    } else {
                        return "";
                    }
                }
            },
         {
                data: "asgObjetivoId",
                render: function (data, type, row) {
                    var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='deleteObjetivoPA(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                    var html = "<div class='pull-right'>" + bt1 + "</div>";
                    return html;
                }
            }]
    });
}

function loadTablaObjetivosPA(data) {
    var dt = $('#dt_asgObjetivoPA').dataTable();
    if (data !== null && data.length === 0) {
        //mostrarMensajeSmart('No se han encontrado registros');
        $("#tbAsgObjetivoPA").hide();
    } else {
        dt.fnClearTable();
        dt.fnAddData(data);
        dt.fnDraw();
        $("#tbAsgObjetivoPA").show();
    }
}

function deleteObjetivoPA(id) {
    // eliminar la valiodación
    $("#frmPuertaAcceso").valid();
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            var data = {
                objetivoId: id
            };
            $.ajax({
                type: "DELETE",
                url: "api/asg-objetivos/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    buscaCargaObjetivosPA();
                },
                error: errorAjax
            });
        }
        if (ButtonPressed === "Cancelar") {
            // no hacemos nada (no quiere borrar)
        }
    });
}

/*------------------------------------------------
 * Funciones O (Organizacion)
 *------------------------------------------------ */

function loadObjetivosO() {
    // enviar la consulta por la red (AJAX)
    var data = {
        "categoriaId": "1"
    };
    $.ajax({
        type: "POST",
        url: "api/objetivos-buscar",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (data, status) {
            // hay que mostrarlo en la zona de datos
            vm.posiblesObjetivosO(data);
        },
        error: errorAjax
    });
}

function buscaCargaObjetivosO() {
    // cargar la tabla de objetivos si hay datos
    data = {
        "asgTrabajadorId": asgTrabajadorId,
        "categoriaId": "1"
    };
    $.ajax({
        type: "POST",
        url: "api/asg-objetivos-buscar",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (data, status) {
            // hay que mostrarlo en la zona de datos
            loadTablaObjetivosO(data);
        },
        error: errorAjax
    });
}

function prepareValidateO() {
    var opciones = {
        rules: {
            cmbObjetivosO: { required: true },
            txtPorObjetivoO: { required: true, min: 0, max: 99 },
            txtMinNumO: { required: true },
            txtMaxNumO: { required: true },
            txtPesoVariableO: { required: true, min: 0, max: 99 }
        },
        // Messages for form validation
        messages: {
            cmbObjetivosO: { required: 'Seleccione un objetivo' },
            txtPorObjetivoO: { required: 'Introduzca % mínimo', min: 'Valor incorrecto', max: 'Valor incorrecto' },
            txtMinNumO: { required: 'Introduzca mínimo' },
            txtMaxNumO: { required: 'Introduzca máximo' },
            txtPesoVariableO: { required: 'Introduzca peso', min: 'Valor incorrecto', max: 'Valor incorrecto' }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    };
    $("#frmOrganizacion").validate(opciones);
}

function datosOKO() {
    var opciones = $("#frmOrganizacion").validate().settings;
    // modificamos requerimiento según el tipo
    var objetivo = vm.objetivoO();
    if (objetivo != null) {
        opciones.rules.cmbObjetivosO.required = false;
        switch (objetivo.tipo.tipoId) {
            case 0:
                // Si / no
                opciones.rules.txtMinNumO.required = false;
                opciones.rules.txtMaxNumO.required = false;
                opciones.rules.txtPorObjetivoO.required = false;
                break;
            case 1:
                // Porcentual
                opciones.rules.txtMinNumO.required = false;
                opciones.rules.txtMaxNumO.required = false;
                opciones.rules.txtPorObjetivoO.required = true;
                break;
            case 2:
                // Numérico
                opciones.rules.txtMinNumO.required = true;
                opciones.rules.txtMaxNumO.required = true;
                opciones.rules.txtPorObjetivoO.required = false;
                break;
            case 3:
                // Ligado a desempeño.
                opciones.rules.txtMinNumO.required = false;
                opciones.rules.txtMaxNumO.required = false;
                opciones.rules.txtPorObjetivoO.required = false;
                break;
        }
    } else {
        opciones.rules.cmbObjetivosO.required = true;
    }
    return $('#frmOrganizacion').valid();
}

function aceptarO() {
    var mf = function () {
        if (!datosOKO())
            return;
        var data = {
            asgObjetivo: {
                "asgObjetivoId": 0,
                "asgTrabajador": {
                    "asgTrabajadorId": asgTrabajadorId
                },
                "objetivo": {
                    "objetivoId": vm.objetivoO().objetivoId
                },
                "asSn": null,
                "asPorObjetivo": vm.asPorObjetivoO(),
                "asMinNum": vm.asMinNumO(),
                "asMaxNum": vm.asMaxNumO(),
                "asPesoVariable": vm.asPesoVariableO()
            }
        };
        // parece idiota pero estamos controlando que los indefinidos vayan como nulos
        if (data.asgObjetivo.asPorObjetivo == null || data.asgObjetivo.asPorObjetivo == "") data.asgObjetivo.asPorObjetivo = 0;
        if (data.asgObjetivo.asMinNum == null || data.asgObjetivo.asMinNum == "") data.asgObjetivo.asMinNum = 0;
        if (data.asgObjetivo.asMaxNum == null || data.asgObjetivo.asMaxNum == "") data.asgObjetivo.asMaxNum = 0;
        
        $.ajax({
            type: "POST",
            url: "api/asg-objetivos",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                buscaCargaObjetivosO();
            },
            error: errorAjax
        });
    };
    return mf;
}

function initTablaObjetivosO() {
    tablaCarro = $('#dt_asgObjetivoO').dataTable({
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_asgObjetivoO'), breakpointDefinition);
            }
        },
        rowCallback: function (nRow) {
            responsiveHelper_dt_basic.createExpandIcon(nRow);
        },
        drawCallback: function (oSettings) {
            responsiveHelper_dt_basic.respond();
        },
        language: {
            processing: "Procesando...",
            info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
            infoFiltered: "(filtrado de un total de _MAX_ registros)",
            infoPostFix: "",
            loadingRecords: "Cargando...",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "Ningún dato disponible en esta tabla",
            paginate: {
                first: "Primero",
                previous: "Anterior",
                next: "Siguiente",
                last: "Último"
            },
            aria: {
                sortAscending: ": Activar para ordenar la columna de manera ascendente",
                sortDescending: ": Activar para ordenar la columna de manera descendente"
            }
        },
        data: dataObjetivos,
        columns: [{
                data: "objetivo.nombre"
            }, {
                data: "asPorObjetivo",
                render: function (data, type, row) {
                    if (data != null) {
                        var html = "<div style='text-align:right'>" + numeral(data).format('#,###,##0.00') + "%</div>";
                        return html;
                    } else {
                        return "";
                    }
                }
            }, {
                data: "asMinNum",
                render: function (data, type, row) {
                    if (data != null) {
                        var html = "<div style='text-align:right'>" + numeral(data).format('#,###,##0.00') + "</div>";
                        return html;
                    } else {
                        return "";
                    }
                }
            }, {
                data: "asMaxNum",
                render: function (data, type, row) {
                    if (data != null) {
                        var html = "<div style='text-align:right'>" + numeral(data).format('#,###,##0.00') + "</div>";
                        return html;
                    } else {
                        return "";
                    }
                }
            }, {
                data: "asPesoVariable",
                render: function (data, type, row) {
                    if (data != null) {
                        var html = "<div style='text-align:right'>" + numeral(data).format('#,###,##0.00') + "%</div>";
                        return html;
                    } else {
                        return "";
                    }
                }
            },
         {
                data: "asgObjetivoId",
                render: function (data, type, row) {
                    var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='deleteObjetivoO(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                    var html = "<div class='pull-right'>" + bt1 + "</div>";
                    return html;
                }
            }]
    });
}

function loadTablaObjetivosO(data) {
    var dt = $('#dt_asgObjetivoO').dataTable();
    if (data !== null && data.length === 0) {
        //mostrarMensajeSmart('No se han encontrado registros');
        $("#tbAsgObjetivoO").hide();
    } else {
        dt.fnClearTable();
        dt.fnAddData(data);
        dt.fnDraw();
        $("#tbAsgObjetivoO").show();
    }
}

function deleteObjetivoO(id) {
    // eliminar la valiodación
    $("#frmPuertaAcceso").valid();
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            var data = {
                objetivoId: id
            };
            $.ajax({
                type: "DELETE",
                url: "api/asg-objetivos/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    buscaCargaObjetivosO();
                },
                error: errorAjax
            });
        }
        if (ButtonPressed === "Cancelar") {
            // no hacemos nada (no quiere borrar)
        }
    });
}


/*------------------------------------------------
 * Funciones I (Puerta de acceso)
 *------------------------------------------------ */

function loadObjetivosI() {
    // enviar la consulta por la red (AJAX)
    var data = {
        "categoriaId": "2"
    };
    $.ajax({
        type: "POST",
        url: "api/objetivos-buscar",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (data, status) {
            // hay que mostrarlo en la zona de datos
            vm.posiblesObjetivosI(data);
        },
        error: errorAjax
    });
}

function buscaCargaObjetivosI() {
    // cargar la tabla de objetivos si hay datos
    data = {
        "asgTrabajadorId": asgTrabajadorId,
        "categoriaId": "2"
    };
    $.ajax({
        type: "POST",
        url: "api/asg-objetivos-buscar",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (data, status) {
            // hay que mostrarlo en la zona de datos
            loadTablaObjetivosI(data);
        },
        error: errorAjax
    });
}

function prepareValidateI() {
    var opciones = {
        rules: {
            cmbObjetivosI: { required: true },
            txtPorObjetivoI: { required: true, min: 0, max: 99 },
            txtMinNumI: { required: true },
            txtMaxNumI: { required: true },
            txtPesoVariableI: { required: true, min: 0, max: 99 }
        },
        // Messages for form validation
        messages: {
            cmbObjetivosI: { required: 'Seleccione un objetivo' },
            txtPorObjetivoI: { required: 'Introduzca % mínimo', min: 'Valor incorrecto', max: 'Valor incorrecto' },
            txtMinNumI: { required: 'Introduzca mínimo' },
            txtMaxNumI: { required: 'Introduzca máximo' },
            txtPesoVariableI: { required: 'Introduzca peso', min: 'Valor incorrecto', max: 'Valor incorrecto' }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    };
    $("#frmIndividual").validate(opciones);
}

function datosOKI() {
    var opciones = $("#frmIndividual").validate().settings;
    // modificamos requerimiento según el tipo
    var objetivo = vm.objetivoI();
    if (objetivo != null) {
        opciones.rules.cmbObjetivosI.required = false;
        switch (objetivo.tipo.tipoId) {
            case 0:
                // Si / no
                opciones.rules.txtMinNumI.required = false;
                opciones.rules.txtMaxNumI.required = false;
                opciones.rules.txtPorObjetivoI.required = false;
                break;
            case 1:
                // Porcentual
                opciones.rules.txtMinNumI.required = false;
                opciones.rules.txtMaxNumI.required = false;
                opciones.rules.txtPorObjetivoI.required = true;
                break;
            case 2:
                // Numérico
                opciones.rules.txtMinNumI.required = true;
                opciones.rules.txtMaxNumI.required = true;
                opciones.rules.txtPorObjetivoI.required = false;
                break;
            case 3:
                // Ligado a desempeño.
                opciones.rules.txtMinNumI.required = false;
                opciones.rules.txtMaxNumI.required = false;
                opciones.rules.txtPorObjetivoI.required = false;
                break;
        }
    } else {
        opciones.rules.cmbObjetivosI.required = true;
    }
    return $('#frmIndividual').valid();
}

function aceptarI() {
    var mf = function () {
        if (!datosOKI())
            return;
        var data = {
            asgObjetivo: {
                "asgObjetivoId": 0,
                "asgTrabajador": {
                    "asgTrabajadorId": asgTrabajadorId
                },
                "objetivo": {
                    "objetivoId": vm.objetivoI().objetivoId
                },
                "asSn": null,
                "asPorObjetivo": vm.asPorObjetivoI(),
                "asMinNum": vm.asMinNumI(),
                "asMaxNum": vm.asMaxNumI(),
                "asPesoVariable": vm.asPesoVariableI()
            }
        };
        // parece idiota pero estamos controlando que los indefinidos vayan como nulos
        if (data.asgObjetivo.asPorObjetivo == null || data.asgObjetivo.asPorObjetivo == "") data.asgObjetivo.asPorObjetivo = 0;
        if (data.asgObjetivo.asMinNum == null || data.asgObjetivo.asMinNum == "") data.asgObjetivo.asMinNum = 0;
        if (data.asgObjetivo.asMaxNum == null || data.asgObjetivo.asMaxNum == "") data.asgObjetivo.asMaxNum = 0;
        
        $.ajax({
            type: "POST",
            url: "api/asg-objetivos",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                buscaCargaObjetivosI();
            },
            error: errorAjax
        });
    };
    return mf;
}

function initTablaObjetivosI() {
    tablaCarro = $('#dt_asgObjetivoI').dataTable({
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_asgObjetivoI'), breakpointDefinition);
            }
        },
        rowCallback: function (nRow) {
            responsiveHelper_dt_basic.createExpandIcon(nRow);
        },
        drawCallback: function (oSettings) {
            responsiveHelper_dt_basic.respond();
        },
        language: {
            processing: "Procesando...",
            info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
            infoFiltered: "(filtrado de un total de _MAX_ registros)",
            infoPostFix: "",
            loadingRecords: "Cargando...",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "Ningún dato disponible en esta tabla",
            paginate: {
                first: "Primero",
                previous: "Anterior",
                next: "Siguiente",
                last: "Último"
            },
            aria: {
                sortAscending: ": Activar para ordenar la columna de manera ascendente",
                sortDescending: ": Activar para ordenar la columna de manera descendente"
            }
        },
        data: dataObjetivos,
        columns: [{
                data: "objetivo.nombre"
            }, {
                data: "asPorObjetivo",
                render: function (data, type, row) {
                    if (data != null) {
                        var html = "<div style='text-align:right'>" + numeral(data).format('#,###,##0.00') + "%</div>";
                        return html;
                    } else {
                        return "";
                    }
                }
            }, {
                data: "asMinNum",
                render: function (data, type, row) {
                    if (data != null) {
                        var html = "<div style='text-align:right'>" + numeral(data).format('#,###,##0.00') + "</div>";
                        return html;
                    } else {
                        return "";
                    }
                }
            }, {
                data: "asMaxNum",
                render: function (data, type, row) {
                    if (data != null) {
                        var html = "<div style='text-align:right'>" + numeral(data).format('#,###,##0.00') + "</div>";
                        return html;
                    } else {
                        return "";
                    }
                }
            }, {
                data: "asPesoVariable",
                render: function (data, type, row) {
                    if (data != null) {
                        var html = "<div style='text-align:right'>" + numeral(data).format('#,###,##0.00') + "%</div>";
                        return html;
                    } else {
                        return "";
                    }
                }
            },
         {
                data: "asgObjetivoId",
                render: function (data, type, row) {
                    var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='deleteObjetivoI(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                    var html = "<div class='pull-right'>" + bt1 + "</div>";
                    return html;
                }
            }]
    });
}

function loadTablaObjetivosI(data) {
    var dt = $('#dt_asgObjetivoI').dataTable();
    if (data !== null && data.length === 0) {
        //mostrarMensajeSmart('No se han encontrado registros');
        $("#tbAsgObjetivoI").hide();
    } else {
        dt.fnClearTable();
        dt.fnAddData(data);
        dt.fnDraw();
        $("#tbAsgObjetivoI").show();
    }
}

function deleteObjetivoI(id) {
    // eliminar la valiodación
    $("#frmIndividual").valid();
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            var data = {
                objetivoId: id
            };
            $.ajax({
                type: "DELETE",
                url: "api/asg-objetivos/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    buscaCargaObjetivosI();
                },
                error: errorAjax
            });
        }
        if (ButtonPressed === "Cancelar") {
            // no hacemos nada (no quiere borrar)
        }
    });
}