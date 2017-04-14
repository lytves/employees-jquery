var deps = [];
var emps = [];
var colegas = [];
var persona;
$(function () {
    var sel = $("<select>");
    //cargamos departamentos
    $.getJSON("departamentos.json", function (json) {
        $.each(json.departamentos.departamento, function (key, val) {
            deps.push(val);
            sel.append(new Option(val.nombre, val._id));
        });
        $("#sel").append(sel.html());
    });
    //cargamos empleados
    $.getJSON("empleados.json", function (json) {
        $.each(json.plantilla.empleado, function (key, val) {
            emps.push(val);
            //if ("_id" == 3) console.log(val);
            //console.log(val._id);
        });
    });
    //función de eligir departamento
    $("#sel").change(function selectDep() {
        if (emps.length > 0) {
            $("#sel option[value='0']").remove();
            colegas = [];
            var depCurrent = $(this).val();
            $.each(emps, function (key, val) {
                if (depCurrent == val._departamento) {
                    colegas.push(val);
                }
            });
            if (colegas.length > 0) {
                rellenarHeroe(colegas[0]);
                persona = colegas[0];
            }
        }
    });
    //mostramos toda la información del empleado
    function rellenarHeroe(heroe) {
        persona = heroe;
        var encontre = $.inArray(heroe, colegas);
        if (encontre > -1) {
            $("#numeroHeroe").html(encontre + 1);
            $("#cantidadColegas").html(colegas.length);
            $("#codigo").html(heroe._id);
            $("#nombre").html(heroe.nombre).append(" " + heroe.apellidos);
            $("#dep").html($("#sel :selected").text());
            $("#puesto").html(heroe.puesto);
            $("#nivel").html(heroe.niveleducacion);
            $("#sueldo").html(formatearSueldo(heroe.sueldo._base));
            $("#complemento").html(formatearSueldo(heroe.sueldo._complemento));
            getImagen(heroe._id);
            $("#emp_id").val("");
            $("#ventanilla").hide();
        }
    };
    //cargar imagen y añadir a la página
    function getImagen(id) {
        $.getJSON("imagenes/" + id + ".json", function (json) {
            var imagen = "imagenes/" + json.empleado.imagen;
            var src = $("#foto img").attr("src");
            if (!src) {
                $("<img/>").attr("src", imagen).appendTo("#foto");
            }
            else $("#foto img").attr("src", imagen);
        });
    }
    //formatear sueldo
    function formatearSueldo(num) {
        num = parseInt(num);
        return num.toLocaleString('es-ES', {
            style: 'currency'
            , currency: 'EUR'
        });
    };
    //listar los empleados-2
    $(".navegacion .style2").click(function () {
        if (persona) {
            var encontre = $.inArray(persona, colegas);
            switch (this.id) {
            case "pag1":
                if (encontre != 0) rellenarHeroe(colegas[0]);
                break;
            case "pag2":
                if ((encontre - 1) >= 0) rellenarHeroe(colegas[encontre - 1]);
                break;
            case "pag3":
                if ((encontre + 1) < colegas.length) rellenarHeroe(colegas[encontre + 1]);
                break;
            case "pag4":
                if (encontre != colegas.length - 1) rellenarHeroe(colegas[colegas.length - 1]);
                break;
            }
        }
    });
    //listener de la forma input keypress Enter
    $('#emp_id').keypress(function (e) {
        if (e.which == 13) {
            e.preventDefault();
            $('input[name = emp_ad]').click();
            return false;
        }
    });
    //listener de la forma "click"
    $("#emp_ad").click(function () {
        var idNumero = parseInt($("#emp_id").val());
        if (!idNumero) {
            setMessage("Mete un número del empleado");
        }
        else if (colegas.length <= 0) {
            setMessage("Elige un departamento");
        }
        else if (idNumero < 1 || idNumero > colegas.length) {
            setMessage("No válido el número del emlpleado");
        }
        else if (idNumero >= 1 && idNumero <= colegas.length) {
            rellenarHeroe(colegas[idNumero - 1]);
        }
    });
    //mostrar un mensaje
        function setMessage(text) {
            $("#ventanilla").html(text).show("slow");
            setTimeout(function () {
                $("#ventanilla").html("").hide("slow");
            }, 5000);
            return;
        }
});