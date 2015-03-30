/*-------------------------------------------------------------------------- 
trabajadorDetalle.js
Funciones js par la página TrabajadorDetalle.html
---------------------------------------------------------------------------*/
var trabajadorId = 0; 
function initForm() {
    // comprobarLogin();
    // de smart admin
    pageSetUp();
    // 
    getVersionFooter();
    vm = new admData();
    ko.applyBindings(vm);
    // asignación de eventos al clic
    $("#btnAceptar").click(aceptar());
    $("#btnSalir").click(salir());
    $("#frmTrabajador").submit(function () {
        return false;
    });

    trabajadorId = gup('TrabajadorId');
    if (trabajadorId != 0) {
        var data = {
            trabajadorId: trabajadorId
        }
        // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: "/api/trabajadores/" + trabajadorId,
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
        vm.trabajadorId(0);
    }
}

function admData() {
    var self = this;
    self.trabajadorId = ko.observable();
    self.nombre = ko.observable();
    self.dni = ko.observable();
}

function loadData(data) {
    vm.trabajadorId(data.trabajadorId);
    vm.nombre(data.nombre);
    vm.dni(data.dni);
}

function datosOK() {
    $('#frmTrabajador').validate({
        rules: {
            txtNombre: { required: true },
            txtDni: { required: true }
        },
        // Messages for form validation
        messages: {
            txtNombre: {required: 'Introduzca el nombre'},
            txtDni: {required: 'Introduzca el dni'}
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    return $('#frmTrabajador').valid();
}

function aceptar() {
    var mf = function () {
        if (!datosOK())
            return;
        var data = {
            trabajador: {
                "trabajadorId": vm.trabajadorId(),
                "nombre": vm.nombre(),
                "dni": vm.dni()
            }
        };
        if (trabajadorId == 0) {
            $.ajax({
                type: "POST",
                url: "api/trabajadores",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "TrabajadorGeneral.html?TrabajadorId=" + vm.trabajadorId();
                    window.open(url, '_self');
                },
                error: errorAjax
            });
        } else {
            $.ajax({
                type: "PUT",
                url: "api/trabajadores/" + trabajadorId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "TrabajadorGeneral.html?TrabajadorId=" + vm.trabajadorId();
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
        var url = "TrabajadorGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}