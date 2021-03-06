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

var porMinIndividual = 0;
var porMaxIndividual = 99;

var dataObjetivos;
var trabajador;

var esEvaluadorF = false;
var esEvaluadorI = false;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};

/*------------------------------------------------
 * Funciones comunes
 *------------------------------------------------ */

function initForm() {
    trabajador = comprobarLoginTrabajador();
    $("#userName").text(trabajador.nombre);
    controlBotones(trabajador);
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
    
    $("#btnAceptarF").click(aceptarF());
    $("#btnSalirF").click(salir());

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
    $("#frmFuncional").submit(function () {
        return false;
    });
    $("#frmOrganizacion").submit(function () {
        return false;
    });
    $("#frmIndividual").submit(function () {
        return false;
    });
    
    $("#cmbObjetivosPA").change(cambioComboPA());
    $("#cmbObjetivosF").change(cambioComboF());
    $("#cmbObjetivosO").change(cambioComboO());
    $("#cmbObjetivosI").change(cambioComboI());

    initTablaObjetivosPA();
    prepareValidatePA();
    
    initTablaObjetivosF();
    initTablaObjetivosF2();
    prepareValidateF();

    initTablaObjetivosO();
    prepareValidateO();
    
    initTablaObjetivosI();
    initTablaObjetivosI2();
    

    
    // cargar los datos generales de la asignación del trabajador
    asgTrabajadorId = gup('AsgTrabajadorId');
    // save as a cookie for back page purposes
    setCookie("asgTrabajadorId", asgTrabajadorId, 1);
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
                // obtener lo límites y fijarlos
                porMinIndividual = data.ejercicio.porMinIndividual;
                porMaxIndividual = data.ejercicio.porMaxIndividual;
                $('#FuncionalEdit').hide();
                $('#IndividualEdit').hide();
                $('#FuncionalShow').hide();
                $('#IndividualShow').hide();
                // control que tipo de evaluador es el actual 
                if (data.evaluadorF.trabajadorId == trabajador.trabajadorId) {
                    $('#FuncionalEdit').show();
                    $('#FuncionalShow').hide();
                    esEvaluadorF = true;
                } else {
                    $('#FuncionalShow').show();
                }

                if (data.evaluadorI.trabajadorId == trabajador.trabajadorId) {
                    $('#IndividualEdit').show();
                    $('#IndividualShow').hide();
                    esEvaluadorI = true;
                } else {
                    $('#IndividualShow').show();
                }
                prepareValidateI();
                prepareValidateF();
                // hay que mostrarlo en la zona de datos
                mostrarAsignacionTrabajador(data);
            },
            error: errorAjax
        });
        // cargar desplegables
        //loadObjetivosPA();
        buscaCargaObjetivosPA();
        loadObjetivosF();
        buscaCargaObjetivosF();
        buscaCargaObjetivosF2();
        //loadObjetivosO();
        buscaCargaObjetivosO();
        loadObjetivosI();
        buscaCargaObjetivosI();
        buscaCargaObjetivosI2();
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
    self.comentariosPA = ko.observable(); 
    
    self.asPorObjetivoF = ko.observable();
    self.asMinNumF = ko.observable();
    self.asMaxNumF = ko.observable();
    self.asPesoVariableF = ko.observable();
    self.asPrimaF = ko.observable();
    self.comentariosF = ko.observable(); 

    self.asPorObjetivoO = ko.observable();
    self.asMinNumO = ko.observable();
    self.asMaxNumO = ko.observable();
    self.asPesoVariableO = ko.observable();
    self.asPrimaO = ko.observable();
    self.comentariosO = ko.observable(); 
    
    self.asPorObjetivoI = ko.observable();
    self.asMinNumI = ko.observable();
    self.asMaxNumI = ko.observable();
    self.asPesoVariableI = ko.observable();
    self.asPrimaI = ko.observable();
    self.comentariosI = ko.observable(); 
    
    
    // soporte de combos
    self.posiblesObjetivosPA = ko.observableArray([]);
    self.objetivoPA = ko.observable();
    
    self.posiblesObjetivosF = ko.observableArray([]);
    self.objetivoF = ko.observable();

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
    $("#txtEmpresa").text(data.empresa.nombre);
    $("#txtDFecha").text(moment(data.dFecha).format("DD/MM/YYYY"));
    $("#txtHFecha").text(moment(data.hFecha).format("DD/MM/YYYY"));
    $("#txtTrabajador").text(data.trabajador.nombre);
    $("#txtPais").text(data.pais.nombre);
    $("#txtUnidad").text(data.unidad.nombre);
    $("#txtArea").text(data.area.nombre);
    $("#txtPuesto").text(data.puesto.nombre);
    // valores 
    $("#txtFijo").text(numeral(data.fijo).format('#,###,##0.00') + "€");
    $("#txtVariableFuncional").text(numeral(data.variableF).format('#,###,##0.00') + "%");
    $("#txtVariable").text(numeral(data.variable).format('#,###,##0.00') + "%");
    // 
    $("#txtEjercicio").text(data.ejercicio.nombre);
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
        // Se cargan los mensajes desde eun fichero externo.

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
                "asPesoVariable": vm.asPesoVariablePA(),
                "comentarios": vm.comentariosPA()
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
        bPaginate: false,
        bFilter: false,
        bInfo: false,
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
            },  
            {
                data: "comentarios"
            }
        ]
    });
}

function detalleObjetivo(data){
    var html = "";
    switch (data.tipo.tipoId) {
        case 0:
            html = "Se cumple o nó de manera total";
            break;
        case 1:
            html = "Se cumple superando valor objetivo de " + data.asPorObjetivo + "%"; 
            break;
        case 2:
            html = "Se cumple alcanzando un mínimo de " + data.asMinNum; 
            html = html + " y su máximo es de " + data.asMaxNum;
            break;
        case 3:
            html = "Objetivo ligado al desempeño";
            break;
    }
    return html;
}

function loadTablaObjetivosPA(data) {
    var dt = $('#dt_asgObjetivoPA').dataTable();
    if (data !== null && data.length === 0) {
        //mostrarMensajeSmart('No se han encontrado registros');
        //$("#tbAsgObjetivoPA").hide();
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
 * Funciones F (Funcionales 2)
 *------------------------------------------------ */


function buscaCargaObjetivosF2() {
    // cargar la tabla de objetivos si hay datos
    data = {
        "asgTrabajadorId": asgTrabajadorId,
        "categoriaId": "3"
    };
    $.ajax({
        type: "POST",
        url: "api/asg-objetivos-buscar",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (data, status) {
            // hay que mostrarlo en la zona de datos
            loadTablaObjetivosF2(data);
        },
        error: errorAjax
    });
}


function initTablaObjetivosF2() {
    tablaCarro = $('#dt_asgObjetivoF2').dataTable({
        bPaginate: false,
        bFilter: false,
        bInfo: false,
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_asgObjetivoF2'), breakpointDefinition);
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
            },  
            {
                data: "asgObjetivoId",
                render: function (data, type, row) {
                    return detalleObjetivo(row);
                }
            }, 
            {
                data: "comentarios"
            },
            {
                data: "asPesoVariable",
                render: function (data, type, row) {
                    return detalleRetribucion(row, "F");
                }
            }]
    });
}

function loadTablaObjetivosF2(data) {
    var dt = $('#dt_asgObjetivoF2').dataTable();
    if (data !== null && data.length === 0) {
        //mostrarMensajeSmart('No se han encontrado registros');
        //$("#tbAsgObjetivoF2").hide();
    } else {
        dt.fnClearTable();
        dt.fnAddData(data);
        dt.fnDraw();
        $("#tbAsgObjetivoF2").show();
    }
}



/*------------------------------------------------
 * Funciones F (Funcionales)
 *------------------------------------------------ */

function loadObjetivosF() {
    // enviar la consulta por la red (AJAX)
    var data = {
        "categoriaId": "3"
    };
    $.ajax({
        type: "POST",
        url: "api/objetivos-buscar",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (data, status) {
            // hay que mostrarlo en la zona de datos
            vm.posiblesObjetivosF(data);
        },
        error: errorAjax
    });
}

function buscaCargaObjetivosF() {
    // cargar la tabla de objetivos si hay datos
    data = {
        "asgTrabajadorId": asgTrabajadorId,
        "categoriaId": "3"
    };
    $.ajax({
        type: "POST",
        url: "api/asg-objetivos-buscar",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (data, status) {
            // hay que mostrarlo en la zona de datos
            loadTablaObjetivosF(data);
        },
        error: errorAjax
    });
}

function prepareValidateF() {
    var opciones = {
        rules: {
            cmbObjetivosF: { required: true },
            txtPorObjetivoF: { required: true, min: 0, max: 99 },
            txtMinNumF: { required: true },
            txtMaxNumF: { required: true },
            txtPesoVariableF: { required: true, min: 0, max: 99 }
        },
        // Messages for form validation
        // Lo hacemos con un  fichero externo
        
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    };
    $("#frmFuncional").validate(opciones);
}

function datosOKF() {
    var opciones = $("#frmFuncional").validate().settings;
    // modificamos requerimiento según el tipo
    var objetivo = vm.objetivoF();
    if (objetivo != null) {
        opciones.rules.cmbObjetivosF.required = false;
        switch (objetivo.tipo.tipoId) {
            case 0:
                // Si / no
                opciones.rules.txtMinNumF.required = false;
                opciones.rules.txtMaxNumF.required = false;
                opciones.rules.txtPorObjetivoF.required = false;
                break;
            case 1:
                // Porcentual
                opciones.rules.txtMinNumF.required = false;
                opciones.rules.txtMaxNumF.required = false;
                opciones.rules.txtPorObjetivoF.required = true;
                break;
            case 2:
                // Numérico
                opciones.rules.txtMinNumF.required = true;
                opciones.rules.txtMaxNumF.required = true;
                opciones.rules.txtPorObjetivoF.required = false;
                break;
            case 3:
                // Ligado a desempeño.
                opciones.rules.txtMinNumF.required = false;
                opciones.rules.txtMaxNumF.required = false;
                opciones.rules.txtPorObjetivoF.required = false;
                break;
        }
    } else {
        opciones.rules.cmbObjetivosF.required = true;
    }
    // -- 
    if (vm.asPrimaF() == null || vm.asPrimaF() == "") {
        vm.asPrimaF(0);
    }
    if (vm.asPrimaF() > 0 && vm.asPesoVariableF() > 0) {
        // mensaje de confirmación
        var mens = "No puede usar simultáneamente prima y variable.";
        $.SmartMessageBox({
            title: "<i class='fa fa-info'></i> Mensaje",
            content: mens,
            buttons: '[Aceptar]'
        }, function (ButtonPressed) {
            return false;
        });
    } else {
        return $('#frmFuncional').valid();
    }
}

function aceptarF() {
    var mf = function () {
        if (!datosOKF())
            return;
        var data = {
            asgObjetivo: {
                "asgObjetivoId": 0,
                "asgTrabajador": {
                    "asgTrabajadorId": asgTrabajadorId
                },
                "objetivo": {
                    "objetivoId": vm.objetivoF().objetivoId
                },
                "asSn": null,
                "asPorObjetivo": vm.asPorObjetivoF(),
                "asMinNum": vm.asMinNumF(),
                "asMaxNum": vm.asMaxNumF(),
                "asPesoVariable": vm.asPesoVariableF(),
                "asPrima": vm.asPrimaF(),
                "comentarios": vm.comentariosF()
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
                buscaCargaObjetivosF();
            },
            error: errorAjax
        });
    };
    return mf;
}

function initTablaObjetivosF() {
    tablaCarro = $('#dt_asgObjetivoF').dataTable({
        bPaginate: false,
        bFilter: false,
        bInfo: false,
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_asgObjetivoF'), breakpointDefinition);
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
            },  
            {
                data: "asgObjetivoId",
                render: function (data, type, row) {
                    return detalleObjetivo(row);
                }
            }, 
            {
                data: "comentarios"
            },
            {
                data: "asPesoVariable",
                render: function (data, type, row) {
                    return detalleRetribucion(row, "F");
                }
            },
         {
                data: "asgObjetivoId",
                render: function (data, type, row) {
                    var bt1 = "<button type='button' class='btn btn-circle btn-danger' onclick='deleteObjetivoF(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                    var html = "<div class='pull-right'>" + bt1 + "</div>";
                    return html;
                }
            }]
    });
}

function loadTablaObjetivosF(data) {
    var dt = $('#dt_asgObjetivoF').dataTable();
    if (data !== null && data.length === 0) {
        //mostrarMensajeSmart('No se han encontrado registros');
        //$("#tbAsgObjetivoF").hide();
    } else {
        dt.fnClearTable();
        dt.fnAddData(data);
        dt.fnDraw();
        $("#tbAsgObjetivoF").show();
    }
}

function deleteObjetivoF(id) {
    // eliminar la valiodación
    // $("#frmPuertaAcceso").valid();
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
                    buscaCargaObjetivosF();
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
        // they are loaded from an external file
        

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
    // -- 
    if (vm.asPrimaO() == null || vm.asPrimaO() == "") {
        vm.asPrimaO(0);
    }
    if (vm.asPrimaO() > 0 && vm.asPesoVariableO() > 0) {
        // mensaje de confirmación
        var mens = "No puede usar simultáneamente prima y variable.";
        $.SmartMessageBox({
            title: "<i class='fa fa-info'></i> Mensaje",
            content: mens,
            buttons: '[Aceptar]'
        }, function (ButtonPressed) {
            return false;
        });
    } else {
        return $('#frmOrganizacion').valid();
    }
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
                "asPesoVariable": vm.asPesoVariableO(),
                "asPrima": vm.asPrimaO(),
                "comentarios": vm.comentariosO()
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
        bPaginate: false,
        bFilter: false, 
        bInfo: false,
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
            },  
            {
                data: "asgObjetivoId",
                render: function (data, type, row) {
                    return detalleObjetivo(row);
                }
            }, 
            {
                data: "comentarios"
            },
            {
                data: "asPesoVariable",
                render: function (data, type, row) {
                    return detalleRetribucion(row, "O");
                }
            }]
    });
}

function loadTablaObjetivosO(data) {
    var dt = $('#dt_asgObjetivoO').dataTable();
    if (data !== null && data.length === 0) {
        //mostrarMensajeSmart('No se han encontrado registros');
        //$("#tbAsgObjetivoO").hide();
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
 * Individuales I (Individuales 2)
 *------------------------------------------------ */


function buscaCargaObjetivosI2() {
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
            loadTablaObjetivosI2(data);
        },
        error: errorAjax
    });
}


function initTablaObjetivosI2() {
    tablaCarro = $('#dt_asgObjetivoI2').dataTable({
        bPaginate: false,
        bFilter: false,
        bInfo: false,
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_asgObjetivoI2'), breakpointDefinition);
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
            },  
            {
                data: "asgObjetivoId",
                render: function (data, type, row) {
                    return detalleObjetivo(row);
                }
            }, 
            {
                data: "comentarios"
            },
            {
                data: "asPesoVariable",
                render: function (data, type, row) {
                    return detalleRetribucion(row, "I");
                }
            }]
    });
}

function loadTablaObjetivosI2(data) {
    var dt = $('#dt_asgObjetivoI2').dataTable();
    if (data !== null && data.length === 0) {
        //mostrarMensajeSmart('No se han encontrado registros');
        //$("#tbAsgObjetivoI2").hide();
    } else {
        dt.fnClearTable();
        dt.fnAddData(data);
        dt.fnDraw();
        $("#tbAsgObjetivoI2").show();
    }
}




/*------------------------------------------------
 * Funciones I (Individuales)
 *------------------------------------------------ */

function loadObjetivosI() {
    // enviar la consulta por la red (AJAX)
    var data = {
        "evaluadorId": trabajador.trabajadorId
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
            txtPesoVariableI: { required: true, min: porMinIndividual, max: porMaxIndividual }
        },
        // Messages for form validation
        // Ahora lo hace con un fichero externo

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
    // -- 
    if (vm.asPrimaI() == null || vm.asPrimaI() == "") {
        vm.asPrimaI(0);
    }
    if (vm.asPrimaI() > 0 && vm.asPesoVariableI() > 0) {
        // mensaje de confirmación
        var mens = "No puede usar simultáneamente prima y variable.";
        $.SmartMessageBox({
            title: "<i class='fa fa-info'></i> Mensaje",
            content: mens,
            buttons: '[Aceptar]'
        }, function (ButtonPressed) {
            return false;
        });
    } else {
        return $('#frmIndividual').valid();
    }
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
                "asPesoVariable": vm.asPesoVariableI(),
                "asPrima": vm.asPrimaI(),
                "comentarios": vm.comentariosI()
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
        bPaginate: false,
        bFilter: false,
        bInfo: false,
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
            },  
            {
                data: "asgObjetivoId",
                render: function (data, type, row) {
                    return detalleObjetivo(row);
                }
            }, 
            {
                data: "comentarios"
            },
            {
                data: "asPesoVariable",
                render: function (data, type, row) {
                    return detalleRetribucion(row, "I");
                }
            },
            {
                data: "asgObjetivoId",
                render: function (data, type, row) {
                    var bt1 = "<button type='button' class='btn btn-circle btn-danger' onclick='deleteObjetivoI(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
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
        //$("#tbAsgObjetivoI").hide();
    } else {
        dt.fnClearTable();
        dt.fnAddData(data);
        dt.fnDraw();
        $("#tbAsgObjetivoI").show();
    }
}

function deleteObjetivoI(id) {
    // eliminar la valiodación
    //$("#frmIndividual").valid();
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



function cambioComboPA(){
    var mf = function (){
        //alert("Cambio PA: " + JSON.stringify(vm.objetivoPA()));
        // se mira el caso en función del tipo
        switch (vm.objetivoPA().tipo.tipoId) {
            case 0:
                SiNoPA();
                break;
            case 1:
                PorcentualPA()
                break;
            case 2:
                NumericoPA();
                break;
            case 3:
                SiNoPA();
                break;
        }
    }
    return mf;
}

function hidePA(){
    $("#PorObjetivoPA").show();
    $("#MaxNumPA").show();
    $("#MinNumPA").show();
    $("#PesoVariablePA").show();
    $("#ComentariosPA").show();
    $("#AceptarPA").show();
    
    $("#PorObjetivoPA").css("visibility", "hidden");
    $("#MaxNumPA").css("visibility","hidden");
    $("#MinNumPA").css("visibility","hidden");
    $("#PesoVariablePA").css("visibility", "hidden");
    $("#ComentariosPA").css("visibility", "hidden");
    $("#AceptarPA").css("visibility","hidden");
}

function PorcentualPA(){
    // borramos los anteriores
    hidePA();
    // mostramos los que nos interesa
    $("#PorObjetivoPA").css("visibility", "visible");
    $("#ComentariosPA").css("visibility", "visible");
    $("#AceptarPA").css("visibility","visible");
    // el peso variable siempre es 0 y oculto
    vm.asPesoVariablePA(0);
}

function NumericoPA() {
    // borramos los anteriores
    hidePA();
    // mostramos los que nos interesa
    $("#MaxNumPA").css("visibility","visible");
    $("#MinNumPA").css("visibility", "visible");
    $("#ComentariosPA").css("visibility", "visible");
    $("#AceptarPA").css("visibility","visible");
    // el peso variable siempre es 0 y oculto
    vm.asPesoVariablePA(0);
}

function SiNoPA() {
    // borramos los anteriores
    hidePA();
    // mostramos los que nos interesa
    $("#ComentariosPA").css("visibility", "visible");
    $("#AceptarPA").css("visibility","visible");
    // el peso variable siempre es 0 y oculto
    vm.asPesoVariablePA(0);
}



function cambioComboF() {
    var mf = function () {
        //alert("Cambio O: " + JSON.stringify(vm.objetivoO()));
        // se mira el caso en función del tipo
        switch (vm.objetivoF().tipo.tipoId) {
            case 0:
                SiNoF();
                break;
            case 1:
                PorcentualF()
                break;
            case 2:
                NumericoF();
                break;
            case 3:
                SiNoF();
                break;
        }
    }
    return mf;
}

function hideF() {
    $("#PorObjetivoF").show();
    $("#MaxNumF").show();
    $("#MinNumF").show();
    $("#PesoVariableF").show();
    $("#PrimaF").show();
    $("#ComentariosF").show();
    $("#AceptarF").show();
    
    $("#PorObjetivoF").css("visibility", "hidden");
    $("#MaxNumF").css("visibility", "hidden");
    $("#MinNumF").css("visibility", "hidden");
    $("#PesoVariableF").css("visibility", "hidden");
    $("#PrimaF").css("visibility", "hidden");
    $("#ComentariosF").css("visibility", "hidden");
    $("#AceptarF").css("visibility", "hidden");
}

function PorcentualF() {
    // borramos los anteriores
    hideF();
    // mostramos los que nos interesa
    $("#PorObjetivoF").css("visibility", "visible");
    $("#PesoVariableF").css("visibility", "visible");
    $("#PrimaF").css("visibility", "visible");
    $("#ComentariosF").css("visibility", "visible");
    $("#AceptarF").css("visibility", "visible");
}

function NumericoF() {
    // borramos los anteriores
    hideF();
    // mostramos los que nos interesa
    $("#MaxNumF").css("visibility", "visible");
    $("#MinNumF").css("visibility", "visible");
    $("#PesoVariableF").css("visibility", "visible");
    $("#PrimaF").css("visibility", "visible");
    $("#ComentariosF").css("visibility", "visible");
    $("#AceptarF").css("visibility", "visible");

}

function SiNoF() {
    // borramos los anteriores
    hideF();
    // mostramos los que nos interesa
    $("#PesoVariableF").css("visibility", "visible");
    $("#PrimaF").css("visibility", "visible");
    $("#ComentariosF").css("visibility", "visible");
    $("#AceptarF").css("visibility", "visible");
}




function cambioComboO() {
    var mf = function () {
        //alert("Cambio O: " + JSON.stringify(vm.objetivoO()));
        // se mira el caso en función del tipo
        switch (vm.objetivoO().tipo.tipoId) {
            case 0:
                SiNoO();
                break;
            case 1:
                PorcentualO()
                break;
            case 2:
                NumericoO();
                break;
            case 3:
                SiNoO();
                break;
        }
    }
    return mf;
}

function hideO() {
    $("#PorObjetivoO").show();
    $("#MaxNumO").show();
    $("#MinNumO").show();
    $("#PesoVariableO").show();
    $("#PrimaO").show();
    $("#ComentariosO").show();
    $("#AceptarO").show();

    $("#PorObjetivoO").css("visibility", "hidden");
    $("#MaxNumO").css("visibility", "hidden");
    $("#MinNumO").css("visibility", "hidden");
    $("#PesoVariableO").css("visibility", "hidden");
    $("#PrimaO").css("visibility", "hidden");
    $("#ComentariosO").css("visibility", "hidden");
    $("#AceptarO").css("visibility", "hidden");
}

function PorcentualO() {
    // borramos los anteriores
    hideO();
    // mostramos los que nos interesa
    $("#PorObjetivoO").css("visibility", "visible");
    $("#PesoVariableO").css("visibility", "visible");
    $("#PrimaO").css("visibility", "visible");
    $("#ComentariosO").css("visibility", "visible");
    $("#AceptarO").css("visibility", "visible");
}

function NumericoO() {
    // borramos los anteriores
    hideO();
    // mostramos los que nos interesa
    $("#MaxNumO").css("visibility", "visible");
    $("#MinNumO").css("visibility", "visible");
    $("#PesoVariableO").css("visibility", "visible");
    $("#PrimaO").css("visibility", "visible");
    $("#ComentariosO").css("visibility", "visible");
    $("#AceptarO").css("visibility", "visible");

}

function SiNoO() {
    // borramos los anteriores
    hideO();
    // mostramos los que nos interesa
    $("#PesoVariableO").css("visibility", "visible");
    $("#PrimaO").css("visibility", "visible");
    $("#ComentariosO").css("visibility", "visible");
    $("#AceptarO").css("visibility", "visible");
}



function cambioComboI() {
    var mf = function () {
        //alert("Cambio I: " + JSON.stringify(vm.objetivoI()));
        // se mira el caso en función del tipo
        switch (vm.objetivoI().tipo.tipoId) {
            case 0:
                SiNoI();
                break;
            case 1:
                PorcentualI()
                break;
            case 2:
                NumericoI();
                break;
            case 3:
                SiNoI();
                break;
        }
    }
    return mf;
}

function hideI() {
    $("#PorObjetivoI").show();
    $("#MaxNumI").show();
    $("#MinNumI").show();
    $("#PesoVariableI").show();
    $("#PrimaI").show();
    $("#ComentariosI").show();
    $("#AceptarI").show();

    $("#PorObjetivoI").css("visibility", "hidden");
    $("#MaxNumI").css("visibility", "hidden");
    $("#MinNumI").css("visibility", "hidden");
    $("#PesoVariableI").css("visibility", "hidden");
    $("#PrimaI").css("visibility", "hidden");
    $("#ComentariosI").css("visibility", "hidden");
    $("#AceptarI").css("visibility", "hidden");
}

function PorcentualI() {
    // borramos los anteriores
    hideI();
    // mostramos los que nos interesa
    $("#PorObjetivoI").css("visibility", "visible");
    $("#PesoVariableI").css("visibility", "visible");
    $("#PrimaI").css("visibility", "visible");
    $("#ComentariosI").css("visibility", "visible");
    $("#AceptarI").css("visibility", "visible");
}

function NumericoI() {
    // borramos los anteriores
    hideI();
    // mostramos los que nos interesa
    $("#MaxNumI").css("visibility", "visible");
    $("#MinNumI").css("visibility", "visible");
    $("#PesoVariableI").css("visibility", "visible");
    $("#PrimaI").css("visibility", "visible");
    $("#ComentariosI").css("visibility", "visible");
    $("#AceptarI").css("visibility", "visible");
}

function SiNoI() {
    // borramos los anteriores
    hideI();
    // mostramos los que nos interesa
    $("#PesoVariableI").css("visibility", "visible");
    $("#PrimaI").css("visibility", "visible");
    $("#ComentariosI").css("visibility", "visible");
    $("#AceptarI").css("visibility", "visible");
}

function detalleRetribucion(data, tipo) {
    var html = "";
    if (data.asPesoVariable > 0) {
        if (tipo == "F") {
            html = numeral(data.asPesoVariable).format('#,###,##0.00') + "% del variable funcional";
        } else {
            html = numeral(data.asPesoVariable).format('#,###,##0.00') + "% del variable";
        }
    }
    if (data.asPrima > 0) {
        html = "Prima de " + numeral(data.asPrima).format('#,###,##0.00') + "€";
    }
    return html;
}