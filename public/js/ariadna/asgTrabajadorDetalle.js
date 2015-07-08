/*-------------------------------------------------------------------------- 
asgTrabajadorDetalle.js
Funciones js par la página AsgTrabajadorDetalle.html
---------------------------------------------------------------------------*/
var asgTrabajadorId = 0; 
function initForm() {
    // comprobarLogin();
    // de smart admin
    pageSetUp();
    
    $.validator.addMethod("greaterThanDate", 
        function (value, element, params) {
        var fv = moment(value, "DD/MM/YYYY").format("YYYY-MM-DD");
        var fp = moment($(params).val(), "DD/MM/YYYY").format("YYYY-MM-DD");
        if (!/Invalid|NaN/.test(new Date(fv))) {
            return new Date(fv) > new Date(fp);
        }
        return isNaN(value) && isNaN($(params).val()) 
            || (Number(value) > Number($(params).val()));
    }, 'La fecha final debe ser mayor que la inicial.');
    
    $.validator.addMethod("greaterThanNumber", 
        function (value, element, params) {
        return isNaN(value) && isNaN($(params).val()) 
            || (Number(value) > Number($(params).val()));
    }, 'El valor mínimo supera al máximo.');
    
    
    $.datepicker.regional['es'] = {
        closeText: 'Cerrar',
        prevText: '&#x3C;Ant',
        nextText: 'Sig&#x3E;',
        currentText: 'Hoy',
        monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
        monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
        dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
        dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
        dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
        weekHeader: 'Sm',
        dateFormat: 'dd/mm/yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
    };
    
    
    $.datepicker.setDefaults($.datepicker.regional['es']);
    // 
    getVersionFooter();
    vm = new asgTrabajadorData();
    ko.applyBindings(vm);
    // asignación de eventos al clic
    $("#btnAceptar").click(aceptar());
    $("#btnSalir").click(salir());
    $("#frmAsgTrabajador").submit(function () {
        return false;
    });
    
    $("#cmbEjercicios").change(cambioEjercicio());

    asgTrabajadorId = gup('AsgTrabajadorId');
    if (asgTrabajadorId != 0) {
        var data = {
            asgTrabajadorId: asgTrabajadorId
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
                loadData(data);
            },
            error: errorAjax
        });
    } else {
        // se trata de un alta ponemos el id a cero para indicarlo.
        vm.asgTrabajadorId(0);
        loadTrabajadores(-1);
        loadEjercicios(-1);
        loadPaises(-1);
        loadUnidades(-1);
        loadAreas(-1);
        loadEmpresas(-1);
        loadPuestos(-1);
        loadEvaluadoresF(-1);
        loadEvaluadoresI(-1);
    }
}

function asgTrabajadorData() {
    var self = this;
    self.asgTrabajadorId = ko.observable();
    self.trabajador = ko.observable();
    self.ejercicio = ko.observable();
    self.nombre = ko.observable();
    self.pais = ko.observable();
    self.unidad = ko.observable();
    self.area = ko.observable();
    self.puesto = ko.observable();
    self.fijo = ko.observable();
    self.variable = ko.observable();
    self.variableF = ko.observable();
    self.dFecha = ko.observable();
    self.hFecha = ko.observable();
    self.evaluadorF = ko.observable();
    self.evaluadorI = ko.observable()
    self.empresa = ko.observable()
    // soporte de combos
    self.posiblesTrabajadores = ko.observableArray([]);
    self.posiblesEjercicios = ko.observableArray([]);
    self.posiblesPaises = ko.observableArray([]);
    self.posiblesUnidades = ko.observableArray([]);
    self.posiblesAreas = ko.observableArray([]);
    self.posiblesPuestos = ko.observableArray([]);
    self.posiblesEvaluadoresF = ko.observableArray([]);
    self.posiblesEvaluadoresI = ko.observableArray([]);
    self.posiblesEmpresas = ko.observableArray([]);
    // valores escogidos
    self.strabajadorId = ko.observable();
    self.sejercicioId = ko.observable();
    self.spaisId = ko.observable();
    self.sunidadId = ko.observable();
    self.sareaId = ko.observable();
    self.spuestoId = ko.observable();
    self.sievaluadorId = ko.observable();
    self.sfevaluadorId = ko.observable();
    self.sempresaId = ko.observable();
}

function loadData(data) {
    vm.asgTrabajadorId(data.asgTrabajadorId);
    vm.nombre(data.nombre);
    vm.trabajador(data.trabajador);
    vm.ejercicio(data.ejercicio);
    vm.pais(data.pais);
    vm.unidad(data.unidad);
    vm.area(data.area);
    vm.puesto(data.puesto);
    vm.fijo(data.fijo);
    vm.variable(data.variable);
    vm.variableF(data.variableF);
    vm.dFecha(moment(data.dFecha).format("DD/MM/YYYY"));
    vm.hFecha(moment(data.hFecha).format("DD/MM/YYYY"));
    vm.empresa(data.empresa);
    loadTrabajadores(data.trabajador.trabajadorId);
    loadEjercicios(data.ejercicio.ejercicioId);
    loadPaises(data.pais.paisId);
    loadUnidades(data.unidad.unidadId);
    loadAreas(data.area.areaId);
    loadPuestos(data.puesto.puestoId);
    loadEvaluadoresF(data.evaluadorF.trabajadorId);
    loadEvaluadoresI(data.evaluadorI.trabajadorId);
    loadEmpresas(data.empresa.empresaId);
}

function loadTrabajadores(trabajadorId){
    $.ajax({
        type: "GET",
        url: "/api/trabajadores",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status){
            vm.posiblesTrabajadores(data);
            vm.strabajadorId(trabajadorId);
        },
        error: errorAjax
    });
}

function loadEvaluadoresF(trabajadorId) {
    $.ajax({
        type: "GET",
        url: "/api/evaluadores",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            vm.posiblesEvaluadoresF(data);
            vm.sfevaluadorId(trabajadorId);
        },
        error: errorAjax
    });
}

function loadEvaluadoresI(trabajadorId) {
    $.ajax({
        type: "GET",
        url: "/api/evaluadores",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            vm.posiblesEvaluadoresI(data);
            vm.sievaluadorId(trabajadorId);
        },
        error: errorAjax
    });
}


function loadEjercicios(ejercicioId) {
    $.ajax({
        type: "GET",
        url: "/api/ejercicios",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            vm.posiblesEjercicios(data);
            vm.sejercicioId(ejercicioId);
        },
        error: errorAjax
    });
}

function loadPaises(paisId) {
    $.ajax({
        type: "GET",
        url: "/api/paises",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            vm.posiblesPaises(data);
            vm.spaisId(paisId);
        },
        error: errorAjax
    });
}

function loadUnidades(unidadId) {
    $.ajax({
        type: "GET",
        url: "/api/unidades",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            vm.posiblesUnidades(data);
            vm.sunidadId(unidadId);
        },
        error: errorAjax
    });
}

function loadAreas(areaId) {
    $.ajax({
        type: "GET",
        url: "/api/areas",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            vm.posiblesAreas(data);
            vm.sareaId(areaId);
        },
        error: errorAjax
    });
}

function loadEmpresas(empresaId) {
    $.ajax({
        type: "GET",
        url: "/api/empresas",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            vm.posiblesEmpresas(data);
            vm.sempresaId(empresaId);
        },
        error: errorAjax
    });
}

function loadPuestos(puestoId) {
    $.ajax({
        type: "GET",
        url: "/api/puestos",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            vm.posiblesPuestos(data);
            vm.spuestoId(puestoId);
        },
        error: errorAjax
    });
}

function datosOK() {
    $('#frmAsgTrabajador').validate({
        rules: {
            cmbTrabajadores: { required: true },
            cmbEjercicios: { required: true },
            cmbPaises: { required: true },
            cmbUnidades: { required: true },
            cmbAreas: { required: true },
            cmbEmpresas: { required: true },
            cmbPuestos: { required: true },
            cmbEvaluadorF: { required: true },
            cmbEvaluadorI: { required: true },
            txtFijo: { required: true, number:true, min:0, max:99999999},
            txtVariable: { required: true, number: true, min: 0, max: 99 },
            txtVariableF: { required: true, number: true, min: 0, max: 99 },
            txtFechaInicio: { required: true, date: true },
            txtFechaFinal: { required: true, date: true, greaterThanDate: "#txtFechaInicio" }
        },
        // Messages for form validation
        messages: {
            cmbTrabajadores: {required: 'Seleccione una categoría'},
            cmbEjercicios: { required: 'Seleccione un ejercicio' },
            cmbPaises: { required: 'Seleccione un pais' },
            cmbUnidades: { required: 'Seleccione una unidad' },
            cmbAreas: { required: 'Seleccione un area' },
            cmbEmpresas: { required: 'Seleccione una empresa' },
            cmbPuestos: { required: 'Seleccione un puesto' },
            cmbEvaluadorF: { required: 'Seleccione un evaluador funcional' },
            cmbEvaluadorI: { required: 'Seleccione un evaluador individual' },
            txtFijo: { required: "Introduzca un fijo", min:"Valor incorrecto", max:"Valor incorrecto" },
            txtVariable: { required: "Introduzca un variable", min: "Valor incorrecto", max: "Valor incorrecto" },
            txtVariableF: { required: "Introduzca un variable", min: "Valor incorrecto", max: "Valor incorrecto" }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    $.validator.methods.date = function (value, element) {
        return this.optional(element) || moment(value, "DD/MM/YYYY").isValid();
    }
    if ($("#txtAsgTrabajador").val() == "") {
        // si no han rellenado el nombre le generamos uno
        vm.nombre($('#cmbTrabajadores option:selected').text() + " [" + $('#cmbEjercicios option:selected').text() + "]");
    }

    return $('#frmAsgTrabajador').valid();
}

function aceptar() {
    var mf = function () {
        if (!datosOK())
            return;
        // control de fechas 
        var fecha1, fecha2;
        if (moment(vm.dFecha(), "DD/MM/YYYY").isValid())
            fecha1 = moment(vm.dFecha(), "DD/MM/YYYY").format("YYYY-MM-DD");
        if (moment(vm.hFecha(), "DD/MM/YYYY").isValid())
            fecha2 = moment(vm.hFecha(), "DD/MM/YYYY").format("YYYY-MM-DD");
        var data = {
            asgTrabajador: {
                "asgTrabajadorId": vm.asgTrabajadorId(),
                "nombre": vm.nombre(),
                "trabajador": {
                    "trabajadorId": vm.strabajadorId()
                },
                "ejercicio": {
                    "ejercicioId": vm.sejercicioId()
                },
                "pais": {
                    "paisId": vm.spaisId()
                },
                "unidad": {
                    "unidadId": vm.sunidadId()
                },
                "area": {
                    "areaId": vm.sareaId()
                },
                "puesto": {
                    "puestoId": vm.spuestoId()
                },
                "evaluadorF": {
                    "trabajadorId": vm.sfevaluadorId()
                },
                "evaluadorI": {
                    "trabajadorId": vm.sievaluadorId()
                },
                "empresa": {
                    "empresaId": vm.sempresaId()
                },
                "fijo": vm.fijo(),
                "variable": vm.variable(),
                "variableF": vm.variableF(),
                "dFecha": fecha1,
                "hFecha": fecha2
            }
        };
        if (asgTrabajadorId == 0) {
            $.ajax({
                type: "POST",
                url: "api/asg-trabajadores",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // Nos volvemos al general
                    var url = "AsgTrabajadorGeneral.html?AsgTrabajadorId=" + data.asgTrabajadorId;
                    window.open(url, '_self');
                },
                error: errorAjax
            });
        } else {
            $.ajax({
                type: "PUT",
                url: "api/asg-trabajadores/" + asgTrabajadorId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // Nos volvemos al general
                    var url = "AsgTrabajadorGeneral.html?AsgTrabajadorId=" + data.asgTrabajadorId;
                    window.open(url, '_self');
                },
                error: errorAjax
            });
        }
    };
    return mf;
}

function salir() {
    var mf = function () {
        var url = "AsgTrabajadorGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}

function cambioEjercicio() {
    var mf = function () {
        // cargar la tabla con un único valor que es el que corresponde.
        var data = {
            id: vm.sejercicioId()
        }
        // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: "api/ejercicios/" + vm.sejercicioId(),
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                vm.dFecha(moment(data.fechaInicio).format("DD/MM/YYYY"));
                vm.hFecha(moment(data.fechaFinal).format("DD/MM/YYYY"));
            },
            error: errorAjax
        });
    };
    return mf;
}