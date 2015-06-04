/*-------------------------------------------------------------------------- 
trabajadorDetalle.js
Funciones js par la página TrabajadorDetalle.html
---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataTrabajadores;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};


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
    initTablaTrabajadores();
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
                cargarEvaluados(vm.trabajadorId());
            },
            error: errorAjax
        });
    } else {
        // se trata de un alta ponemos el id a cero para indicarlo.
        vm.trabajadorId(0);
        // y ocultamos el campo adicional en alta
        loadColectivos(-1);
    }
}

function admData() {
    var self = this;
    self.trabajadorId = ko.observable();
    self.nombre = ko.observable();
    self.dni = ko.observable();
    self.login = ko.observable();
    self.password = ko.observable();
    self.evaluador = ko.observable();
    self.posiblesTrabajadores = ko.observableArray([]);
    self.posiblesColectivos = ko.observableArray([]);
    self.trabajadorEvaluado = ko.observable();
    self.colectivo = ko.observable();
    self.scolectivoId = ko.observable();
}

function loadData(data) {
    vm.trabajadorId(data.trabajadorId);
    vm.nombre(data.nombre);
    vm.dni(data.dni);
    vm.login(data.login);
    vm.password(data.password);
    vm.evaluador(data.evaluador);
    vm.colectivo(data.colectivo);
    loadColectivos(data.colectivo.colectivoId);
    if (data.evaluador == 1) {
        $("#flEvaluados").show();
    }
}

function datosOK() {
    $('#frmTrabajador').validate({
        rules: {
            txtNombre: { required: true },
            txtDni: { required: true },
            cmbColectivos: {required: true}
        },
        // Messages for form validation
        messages: {
            txtNombre: {required: 'Introduzca el nombre'},
            txtDni: { required: 'Introduzca el dni' },
            cmbColectivos: {required: 'Introduzca un colectivo'}
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
                "dni": vm.dni(),
                "login": vm.login(),
                "password": vm.password(),
                "evaluador": vm.evaluador(),
                "colectivo": {
                    "colectivoId": vm.scolectivoId()
                }
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

function loadColectivos(colectivoId){
    $.ajax({
        type: "GET",
        url: "api/colectivos",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            vm.posiblesColectivos(data);
            vm.scolectivoId(colectivoId);
        },
        error: errorAjax
    });
}


function cargarEvaluados(id){
    // cargar la tabla con un único valor que es el que corresponde.
    // cargar la tabla con un único valor que es el que corresponde.
    var data = {
        trabajadorId: id
    }
    // hay que buscar ese elemento en concreto
    $.ajax({
        type: "POST",
        url: "api/asg-trabajador-evaluador-buscar",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (data, status) {
            // hay que mostrarlo en la zona de datos
            loadTablaTrabajadores(data);
        },
        error: errorAjax
    });

    // hay que buscar ese elemento en concreto
    //$.ajax({
    //    type: "POST",
    //    url: "api/evaluados-buscar",
    //    dataType: "json",
    //    contentType: "application/json",
    //    data: JSON.stringify(buscar),
    //    success: function (data, status) {
    //        // hay que mostrarlo en la zona de datos
    //        //var data2 = [data];
    //        loadTablaTrabajadores(data);
    //    },
    //    error: errorAjax
    //});
}

function initTablaTrabajadores() {
    tablaCarro = $('#dt_trabajador').dataTable({
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_trabajador'), breakpointDefinition);
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
        data: dataTrabajadores,
        columns: [{
                data: "trabajador.nombre"
            }, {
                data: "ejercicio.nombre"
            }, {
                data: "pais.nombre"
            }, {
                data: "unidad.nombre"
            }]
    });
}

function loadTablaTrabajadores(data) {
    var dt = $('#dt_trabajador').dataTable();
    if (data !== null && data.length === 0) {
        dt.fnClearTable();
        dt.fnDraw();
    } else {
        dt.fnClearTable();
        dt.fnAddData(data);
        dt.fnDraw();
    }
}
