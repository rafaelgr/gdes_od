/*-------------------------------------------------------------------------- 
paisDetalle.js
Funciones js par la página PaisDetalle.html
---------------------------------------------------------------------------*/
var adminId = 0; 
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
    $("#frmPais").submit(function () {
        return false;
    });

    adminId = gup('PaisId');
    if (adminId != 0) {
        var data = {
            paisId: adminId
        }
        // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: "/api/paises/" + adminId,
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
        vm.paisId(0);
    }
}

function admData() {
    var self = this;
    self.paisId = ko.observable();
    self.nombre = ko.observable();
    self.login = ko.observable();
    self.password = ko.observable();
    self.email = ko.observable();
}

function loadData(data) {
    vm.paisId(data.paisId);
    vm.nombre(data.nombre);
    vm.login(data.login);
    vm.password(data.password);
    vm.email(data.email);
}

function datosOK() {
    // antes de la validación de form hay que verificar las password
    if ($('#txtPassword1').val() !== "") {
        // si ha puesto algo, debe coincidir con el otro campo
        if ($('#txtPassword1').val() !== $('#txtPassword2').val()) {
            mostrarMensajeSmart('Las contraseñas no coinciden');
            return false;
        }
        vm.password($("#txtPassword1").val());
    } else {
        vm.password("");
    }
    // controlamos que si es un alta debe dar una contraseña.
    if (vm.paisId() === 0 && $('#txtPassword1').val() === ""){
        mostrarMensajeSmart('Debe introducir una contraseña en el alta');
        return false;
    }
    $('#frmPais').validate({
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
    return $('#frmPais').valid();
}

function aceptar() {
    var mf = function () {
        if (!datosOK())
            return;
        var data = {
            pais: {
                "paisId": vm.paisId(),
                "login": vm.login(),
                "email": vm.email(),
                "nombre": vm.nombre(),
                "password": vm.password()
            }
        };
        if (adminId == 0) {
            $.ajax({
                type: "POST",
                url: "api/paises",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "PaisGeneral.html?PaisId=" + vm.paisId();
                    window.open(url, '_self');
                },
                error: errorAjax
            });
        } else {
            $.ajax({
                type: "PUT",
                url: "api/paises/" + adminId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "PaisGeneral.html?PaisId=" + vm.paisId();
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
        var url = "PaisGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}