/*-------------------------------------------------------------------------- 
colectivoDetalle.js
Funciones js par la página ColectivoDetalle.html
---------------------------------------------------------------------------*/
var colectivoId = 0; 
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
    $("#frmColectivo").submit(function () {
        return false;
    });

    colectivoId = gup('ColectivoId');
    if (colectivoId != 0) {
        var data = {
            colectivoId: colectivoId
        }
        // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: "/api/colectivos/" + colectivoId,
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
        vm.colectivoId(0);
    }
}

function admData() {
    var self = this;
    self.colectivoId = ko.observable();
    self.nombre = ko.observable();
}

function loadData(data) {
    vm.colectivoId(data.colectivoId);
    vm.nombre(data.nombre);
}

function datosOK() {
    $('#frmColectivo').validate({
        rules: {
            txtNombre: { required: true },
            txtLogin: { required: true },
            txtEmail: { required: true, email:true }
        },
        // Messages for form validation
        messages: {
            txtNombre: {required: 'Introduzca el nombre'},
            txtLogin: {required: 'Introduzca el login'},
            txtEmail: {required: 'Introduzca el correo', email: 'Debe usar un correo válido'}
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    return $('#frmColectivo').valid();
}

function aceptar() {
    var mf = function () {
        if (!datosOK())
            return;
        var data = {
            colectivo: {
                "colectivoId": vm.colectivoId(),
                "nombre": vm.nombre()
            }
        };
        if (colectivoId == 0) {
            $.ajax({
                type: "POST",
                url: "api/colectivos",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "ColectivoGeneral.html?ColectivoId=" + vm.colectivoId();
                    window.open(url, '_self');
                },
                error: errorAjax
            });
        } else {
            $.ajax({
                type: "PUT",
                url: "api/colectivos/" + colectivoId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "ColectivoGeneral.html?ColectivoId=" + vm.colectivoId();
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
        var url = "ColectivoGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}