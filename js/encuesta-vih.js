/**
 * Created by webcoder on 10/3/17.
 */
$(function () {
    "use strict";

    var auth = encuestaApp.auth();

    function salir() {
        auth.signOut().then(function() {
            console.log('Usuario deslogueado!');
            unsetAppCookie;
            redirect(index);
        }, function(error) {
            // An error happened.
            console.log('Error al salir', error);
        });
    }

    auth.onAuthStateChanged(function(user) {
        if (user) {

            // Mostrar el menu del usuario logueado
            var userMenu = '<li class="dropdown">';
            userMenu += '<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">' + user.displayName + '<span class="caret"></span></a>';
            userMenu += '<ul class="dropdown-menu">';
            userMenu +=     '<li><a href="perfil.html">Pefil</a></li>';
            userMenu +=     '<li role="separator" class="divider"></li>';

            userMenu +=     '<li><a href="#" id="logoutLink">Salir</a></li>';
            userMenu += '</ul>';
            userMenu += '</li>';

            $(userMenu).appendTo('.navbar-right');
            $('#logoutLink').click(salir);
        } else {
            redirect(index);
        }
    });

    var index = "index.html";
    var home = "home.html";
    var login = "ingresar.html";
    var encuestaId;

    function redirect(ruta) {
        location.assign(ruta);
    }

    function obtenerNumeroEncuestasVih(numero) {
        console.log('numero de encuestas Vih ingresadas: ', numero);
    }

    // Evento para enviar el formulario
    $("#encuesta-vih").on('submit', function () {
        event.preventDefault();

        var encuestaVih = {};
        var pregunta1 = {};
        var pregunta2 = {};
        var pregunta3 = {};
        var pregunta4 = {};
        var pregunta5 = {};
        var pregunta6 = {};
        var pregunta7 = {};
        var pregunta8 = {};
        var encuestaPorUsuario = {};

        var error = {};
        var ruta_encuesta = "encuesta-vih/encuestas";
        var ruta_pregunta1 = "encuesta-vih/pregunta1";
        var ruta_pregunta2 = "encuesta-vih/pregunta2";
        var ruta_pregunta3 = "encuesta-vih/pregunta3";
        var ruta_pregunta4 = "encuesta-vih/pregunta4";
        var ruta_pregunta5 = "encuesta-vih/pregunta5";
        var ruta_pregunta6 = "encuesta-vih/pregunta6";
        var ruta_pregunta7 = "encuesta-vih/pregunta7";
        var ruta_pregunta8 = "encuesta-vih/pregunta8";
        var ruta_porUsuario = "encuesta-vih/porusuario";


        // Obtener los datos
        var email = $("input[name=email]").val();
        var sexo = $("input[name=sexo]:checked");
        var edad = $("input[name=edad]").val();
        var estadoCivil = $("input[name=ecivil]:checked");
        var estudios = $("input[name=instruccion]:checked");
        var ocupacion = $("input[name=ocupacion]").val();
        var barrio = $("input[name=barrio]").val();
        var cp = $("input[name=cp]").val();
        var fechaEncuesta = $("input[name=fechaEncuesta]").val();

        if(email.length > 0) {
            encuestaVih['correo'] = email;
        }

        if(fechaEncuesta.length > 0) {
            encuestaVih['fecha encuesta'] = new Date(fechaEncuesta).getTime();
        }

        if(edad.length > 0) {
            encuestaVih['edad'] = edad;
        }

        if(ocupacion.length > 0) {
            encuestaVih['ocupacion'] = ocupacion;
        }

        if(barrio.length > 0) {
            encuestaVih['barrio'] = barrio;
        }

        if(cp.length > 0) {
            encuestaVih['cp'] = cp;
        }

        /* -- Encuesta -- */



        /* -- Obtener Respuestas -- */

        // Obtener la respuesta1
        $('#pregunta1 input[type=checkbox]:checked').each(function () {
            var respuesta = this;
            pregunta1[respuesta.name] = respuesta.value;
        });

        var respuesta2 = $('#pregunta2 input[name=respuesta2]:checked');
        var respuesta3 = $('#pregunta3 input[name=respuesta3]:checked');
        var respuesta4 = $('#pregunta4 input[name=respuesta4]:checked');
        var respuesta5 = $('#pregunta5 input[name=respuesta5]:checked');
        var respuesta6 = $('#pregunta6 input[name=respuesta6]:checked');
        var respuesta8 = $('#pregunta8 input[name=respuesta8]:checked');

        // Obtener la respuesta7
        $('#pregunta7 input[type=checkbox]:checked').each(function () {
            var respuesta = this;
            pregunta7[respuesta.name] = respuesta.value;
        });



        /* -- Verificacion de preguntas respondidas -- */

        // Verificar si fue ingresada la respuesta de la pregunta 8
        if (respuesta8.length === 0) {
            error['codigo'] = 8;
            error['mensaje'] = "Falta completar la respuesta de la pregunta 8";
        } else {
            pregunta8 = obtenerRespuesta(pregunta8, respuesta8.val());
        }

        // Verificar si fue ingresada la respuesta de la pregunta 7
        if($.isEmptyObject(pregunta7)) {
            error['codigo'] = 7;
            error['mensaje'] = "Falta completar la respuesta de la pregunta 7";
        }

        // Verificar si fue ingresada la respuesta de la pregunta 6
        if (respuesta6.length === 0) {
            error['codigo'] = 6;
            error['mensaje'] = "Falta completar la respuesta de la pregunta 6";
        } else {
            pregunta6 = obtenerRespuesta(pregunta6, respuesta6.val());
        }

        // Verificar si fue ingresada la respuesta de la pregunta 5
        if (respuesta5.length === 0) {
            error['codigo'] = 5;
            error['mensaje'] = "Falta completar la respuesta de la pregunta 5";
        } else {
            pregunta5 = obtenerRespuesta(pregunta5, respuesta5.val());
        }

        // Verificar si fue ingresada la respuesta de la pregunta 4
        if (respuesta4.length === 0) {
            error['codigo'] = 4;
            error['mensaje'] = "Falta completar la respuesta de la pregunta 4";
        } else {
            if (respuesta4.val() === "No") {
                var motivo4 = $('#motivo4-no input[name=motivo4]:checked');
                if(motivo4.length === 0) {
                    error['codigo'] = 42;
                    error['mensaje'] = "Falta completar el motivo de la pregunta 4";
                } else {
                    pregunta4 = obtenerRespuesta(pregunta4, respuesta4.val());
                    pregunta4['motivo'] = motivo4.val();
                }
            } else {
                pregunta4 = obtenerRespuesta(pregunta4, respuesta4.val());
            }
        }

        // Verificar si fue ingresada la respuesta de la pregunta 3
        if(respuesta3.val() === "Si") {
            // Obtener el motivo
            var motivo31 = $('#motivo3-si input[name=motivo31]:checked');
            // Si no se ingreso el motivo
            if(motivo31.length === 0) {
                error['codigo'] = 31;
                error['mensaje'] = "Falta completar el motivo de la pregunta 3";
            } else {
                pregunta3['motivo'] = motivo31.val();
            }
            pregunta3 = obtenerRespuesta(pregunta3, respuesta3.val());

        } else  if(respuesta3.val() === "No") {
            // Obtener el motivo
            var motivo32 = $('#motivo3-no input[name=motivo32]:checked');
            // Si no se ingreso el motivo
            if(motivo32.length === 0) {
                error['codigo'] = 32;
                error['mensaje'] = "Falta completar el motivo de la pregunta 3";
                //console.log(error.mensaje);
            } else {
                pregunta3['motivo'] = motivo32.val();
            }
            pregunta3 = obtenerRespuesta(pregunta3, respuesta3.val());

        } else {
            error['codigo'] = 3;
            error['mensaje'] = "Falta completar la respuesta de la pregunta 3";
        }

        // Verificar si fue ingresada la respuesta de la pregunta 2
        if (respuesta2.length === 0) {
            error['codigo'] = 2;
            error['mensaje'] = "Falta completar la respuesta de la pregunta 2";
        } else {
            pregunta2 = obtenerRespuesta(pregunta2, respuesta2.val());
        }

        // Verificar si fue ingresada la respuesta de la pregunta 1
        if($.isEmptyObject(pregunta1)) {
            error['codigo'] = 1;
            error['mensaje'] = "Falta completar la respuesta de la pregunta 1";
        }

        // Verificar si fue ingresado el nivel de instruccion de la persona encuestada
        if (estudios.length === 0) {
            error['codigo'] = 12;
            error['mensaje'] = "Falta completar el nivel de instruccion de la persona encuestada";
        } else {
            encuestaVih['estudios'] = estudios.val();
        }

        // Verificar si fue ingresado el estado civil de la persona encuestada
        if (estadoCivil.length === 0) {
            error['codigo'] = 11;
            error['mensaje'] = "Falta completar el estado civil de la persona encuestada";
        } else {
            encuestaVih['estado civil'] = estadoCivil.val();
        }

        // Verificar si fue ingresado el sexo de la persona encuestada
        if (sexo.length === 0) {
            error['codigo'] = 10;
            error['mensaje'] = "Falta completar el genero de la persona encuestada";
        } else {
            encuestaVih['sexo'] = sexo.val();
        }


        /* -- Cargar encuesta y Guardar en Firebase si no hay Errores -- */

        // Ingresar encuesta si no hay errores
        if($.isEmptyObject(error)) {

            var user = firebase.auth().currentUser;
            var usuarioId = user.uid;

            // Cargar preguntas en la encuesta
            encuestaVih['pregunta1'] = pregunta1;
            encuestaVih['pregunta2'] = pregunta2;
            encuestaVih['pregunta3'] = pregunta3;
            encuestaVih['pregunta4'] = pregunta4;
            encuestaVih['pregunta5'] = pregunta5;
            encuestaVih['pregunta6'] = pregunta6;
            encuestaVih['pregunta7'] = pregunta7;
            encuestaVih['pregunta8'] = pregunta8;
            encuestaVih['creado'] = (new Date()).getTime();

            // Agregar el id del usuario a la encuesta
            if (user) {
                encuestaVih['usuarioId'] = usuarioId;
            } else {
                encuestaVih['usuarioId'] = "encuesta-web";
            }

            // Ingresar la encuesta a la base de datos
            agregarEncuesta(ruta_encuesta, encuestaVih, obtenerEncuestaId);

            // Completar encuestas por usuario
            encuestaPorUsuario.encuestaId = encuestaId;
            encuestaPorUsuario.creado = new Date().getTime();

            // Agregar encuesta por usuario
            agregarEncuestaPorUsuario(ruta_porUsuario, usuarioId, encuestaPorUsuario);


            // Actualizar el numoero de encuestas de Vih del usuario
            actualizarNumeroEncuestaVih('usuarios', usuarioId);

            // Agregar el id de la encuesta en las preguntas
            pregunta1.encuestaId = encuestaId;
            pregunta2.encuestaId = encuestaId;
            pregunta3.encuestaId = encuestaId;
            pregunta4.encuestaId = encuestaId;
            pregunta5.encuestaId = encuestaId;
            pregunta6.encuestaId = encuestaId;
            pregunta7.encuestaId = encuestaId;
            pregunta8.encuestaId = encuestaId;

            // Agregar el id del usuario a las preguntas
            if (user) {
                pregunta1['usuarioId'] = usuarioId;
                pregunta2['usuarioId'] = usuarioId;
                pregunta3['usuarioId'] = usuarioId;
                pregunta4['usuarioId'] = usuarioId;
                pregunta5['usuarioId'] = usuarioId;
                pregunta6['usuarioId'] = usuarioId;
                pregunta7['usuarioId'] = usuarioId;
                pregunta8['usuarioId'] = usuarioId;
            } else {
                pregunta1['usuarioId'] = "encuesta-web";
                pregunta2['usuarioId'] = "encuesta-web";
                pregunta3['usuarioId'] = "encuesta-web";
                pregunta4['usuarioId'] = "encuesta-web";
                pregunta5['usuarioId'] = "encuesta-web";
                pregunta6['usuarioId'] = "encuesta-web";
                pregunta7['usuarioId'] = "encuesta-web";
                pregunta8['usuarioId'] = "encuesta-web";
            }

            // Completar las preguntas
            completarPreguta(pregunta1, encuestaVih);
            completarPreguta(pregunta2, encuestaVih);
            completarPreguta(pregunta3, encuestaVih);
            completarPreguta(pregunta4, encuestaVih);
            completarPreguta(pregunta5, encuestaVih);
            completarPreguta(pregunta6, encuestaVih);
            completarPreguta(pregunta7, encuestaVih);
            completarPreguta(pregunta8, encuestaVih);

            // Ingresar preguntas a la base de datos
            agregarDato(ruta_pregunta1, pregunta1);
            agregarDato(ruta_pregunta2, pregunta2);
            agregarDato(ruta_pregunta3, pregunta3);
            agregarDato(ruta_pregunta4, pregunta4);
            agregarDato(ruta_pregunta5, pregunta5);
            agregarDato(ruta_pregunta6, pregunta6);
            agregarDato(ruta_pregunta7, pregunta7);
            agregarDato(ruta_pregunta8, pregunta8);

            // Mostrar la notificacion de exito
            $.notify(" La encuesta fue ingresada con exito", {
                type: "success",
                delay: 5000,
                animation: true,
                animationType: "drop",
                icon: "check-circle",
                close: true
            });
            limpiarFormulario();
        } else {
            // Mostrar Error
            $.notify(" " + error.mensaje, {
                type: "danger",
                delay: 5000,
                animation: true,
                animationType: "drop",
                icon: "exclamation-circle",
                close: true
            });
        }


    });

    function obtenerEncuestaId(encuestaKey) {
        encuestaId = encuestaKey;
        //console.log('dentro de la funcion: ', encuestaId);
    }

    function completarPreguta(pregunta, encuestaVih) {
        if("correo" in encuestaVih) {
            pregunta['correo'] = encuestaVih.correo;
        }

        if("edad" in encuestaVih) {
            pregunta['edad'] = encuestaVih.edad;
        }

        if("ocupacion" in encuestaVih) {
            pregunta['ocupacion'] = encuestaVih.ocupacion;
        }

        if("barrio" in encuestaVih) {
            pregunta['barrio'] = encuestaVih.barrio;
        }

        if("cp" in encuestaVih) {
            pregunta['cp'] = encuestaVih.cp;
        }

        if("fecha encuesta" in encuestaVih) {
            pregunta['fecha encuesta'] = encuestaVih['fecha encuesta'];
        }

        pregunta['sexo'] = encuestaVih.sexo;
        pregunta['estado civil'] = encuestaVih['estado civil'];
        pregunta['estudios'] = encuestaVih.estudios;
        pregunta.creado = new Date().getTime();
    }

    function obtenerRespuesta(pregunta, valor) {
        pregunta['respuesta'] = valor;
        return pregunta;
    }

    // Evento para mostrar los motivos de la pregunta 3 segun la respuesta de Si o No
    $('#pregunta3 input[name=respuesta3]').on('click', function () {
        var respuesta3 = this.value;

        // Respuesta positiva
        if(respuesta3 === "Si") {
            // Deshabilitar motivos de la respuesta NO
            $('input[name=motivo32]').each(function () {
                var elemento = this;
                $(elemento).attr('disabled', true);
            });

            // Habilitar los motivos de la respuesta Si
            $('input[name=motivo31]').each(function () {
                var elemento = this;
                $(elemento).attr('disabled', false);
            });
        } else {
            // Deshabilitar motivos de la respuesta SI
            $('input[name=motivo31]').each(function () {
                var elemento = this;
                $(elemento).attr('disabled', true);
            });

            // Habilitar los motivos de la respuesta No
            $('input[name=motivo32]').each(function () {
                var elemento = this;
                $(elemento).attr('disabled', false);
            });
        }
    });


    function limpiarFormulario() {
        $("input[type=text]").val("");
        $("input[type=email]").val("");
        $("input[type=number]").val("");
        $("input:checked[type=radio]").prop("checked", false);
        $("input[type=checkbox]:checked").prop('checked', false);
    }


    // Evento para mostrar los motivos de la pregunta 3 segun la respuesta de Si o No
    $('#pregunta4 input[name=respuesta4]').on('click', function () {
        var respuesta4 = this.value;

        // Respuesta positiva
        if(respuesta4 === "Si") {
            // Deshabilitar motivos de la respuesta NO
            $('input[name=motivo4]').each(function () {
                var elemento = this;
                $(elemento).attr('disabled', true);
            });
        } else if(respuesta4 === "Aveces") {

            // Deshabilitar motivos de la respuesta NO
            $('input[name=motivo4]').each(function () {
                var elemento = this;
                $(elemento).attr('disabled', true);
            });
        } else {

            // Habilitar los motivos de la respuesta No
            $('input[name=motivo4]').each(function () {
                var elemento = this;
                $(elemento).attr('disabled', false);
            });
        }
        //console.log(respuesta4);
    });

});