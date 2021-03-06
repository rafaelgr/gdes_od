﻿/*-------------------------------------------------------------------------- 
ejercicioDetalle.js
Funciones js par la página EjercicioDetalle.html
---------------------------------------------------------------------------*/
var ejercicioId = 0; 
function initForm() {
    // comprobarLogin();
    // de smart admin
    pageSetUp();
    //
    // $.datepicker.setDefaults($.datepicker.regional['es']);
    //
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
        monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio','julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
        monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun','jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
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
    

    getVersionFooter();
    vm = new admData();
    ko.applyBindings(vm);
    // asignación de eventos al clic
    $("#btnAceptar").click(aceptar());
    $("#btnSalir").click(salir());
    $("#frmEjercicio").submit(function () {
        return false;
    });

    ejercicioId = gup('EjercicioId');
    if (ejercicioId != 0) {
        var data = {
            ejercicioId: ejercicioId
        }
        // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: "/api/ejercicios/" + ejercicioId,
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
        vm.ejercicioId(0);
    }
}

function admData() {
    var self = this;
    self.ejercicioId = ko.observable();
    self.nombre = ko.observable();
    self.fechaInicio = ko.observable();
    self.fechaFinal = ko.observable();
    self.porPuertaAcceso = ko.observable();
    self.porOrganizacion = ko.observable();
    self.porIndividual = ko.observable();
    self.porMinIndividual = ko.observable();
    self.porMaxIndividual = ko.observable();
}

function loadData(data) {
    vm.ejercicioId(data.ejercicioId);
    vm.nombre(data.nombre);
    vm.fechaInicio(moment(data.fechaInicio).format("DD/MM/YYYY"));
    vm.fechaFinal(moment(data.fechaFinal).format("DD/MM/YYYY"));
    vm.porPuertaAcceso(data.porPuertaAcceso);
    vm.porOrganizacion(data.porOrganizacion);
    vm.porIndividual(data.porIndividual);
    vm.porMinIndividual(data.porMinIndividual);
    vm.porMaxIndividual(data.porMaxIndividual);
}

function datosOK() {
    $('#frmEjercicio').validate({
        rules: {
            txtNombre: { required: true },
            txtFechaInicio: { required: true, date: true },
            txtFechaFinal: { required: true, date: true, greaterThanDate: "#txtFechaInicio"},
            txtPorPuertaAcceso: { required: true, number: true },
            txtPorOrganizacion: { required: true, number: true },
            txtPorIndividual: { required: true, number: true },
            txtPorMinIndividual: { required: true, number: true, min:0, max:99 },
            txtPorMaxIndividual: { required: true, number: true, min: 0, max: 99, greaterThanNumber: "#txtPorMinIndividual" }
        },
        // Messages for form validation
        // ahora se obtinene desde un fichero de mensajes
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    $.validator.methods.date = function (value, element) {
        return this.optional(element) || moment(value, "DD/MM/YYYY").isValid();
    }
    return $('#frmEjercicio').valid();
}

function aceptar() {
    var mf = function () {
        if (!datosOK())
            return;
        // control de fechas 
        var fecha1, fecha2;
        if (moment(vm.fechaInicio(), "DD/MM/YYYY").isValid())
            fecha1 = moment(vm.fechaInicio(), "DD/MM/YYYY").format("YYYY-MM-DD");
        if (moment(vm.fechaFinal(), "DD/MM/YYYY").isValid())
            fecha2 = moment(vm.fechaFinal(), "DD/MM/YYYY").format("YYYY-MM-DD");
        var data = {
            ejercicio: {
                "ejercicioId": vm.ejercicioId(),
                "fechaInicio": fecha1,
                "fechaFinal": fecha2,
                "nombre": vm.nombre(),
                "porPuertaAcceso": vm.porPuertaAcceso(),
                "porOrganizacion": vm.porOrganizacion(),
                "porIndividual": vm.porIndividual(),
                "porMinIndividual": vm.porMinIndividual(),
                "porMaxIndividual": vm.porMaxIndividual()
            }
        };
        if (ejercicioId == 0) {
            $.ajax({
                type: "POST",
                url: "api/ejercicios",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "EjercicioGeneral.html?EjercicioId=" + vm.ejercicioId();
                    window.open(url, '_self');
                },
                error: errorAjax
            });
        } else {
            $.ajax({
                type: "PUT",
                url: "api/ejercicios/" + ejercicioId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "EjercicioGeneral.html?EjercicioId=" + vm.ejercicioId();
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
        var url = "EjercicioGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}