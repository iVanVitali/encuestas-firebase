/**
 * Created by webcoder on 11/3/17.
 */

$(document).ready(function () {
    'use strict';

    var auth = encuestaApp.auth();

    var home = "home.html";

    function redirect(ruta) {
        location.assign(ruta);
    }

    function limpiarFormulario() {
        $("input[type=email]").val("");
    }

    auth.onAuthStateChanged(function(user) {
        if (user) {
            redirect(home);
        }
    });


    function enviarEnlaceRestablecerContrasena(correo) {

        auth.sendPasswordResetEmail(correo).then(function() {
            // Email sent.
            console.log('se envio erl correo correctamente!');
        }, function(error) {
            // An error happened.
            if(error.code === "auth/user-not-found") {
                error.message = "No hay usuario registrado con la direccion del correo electronico ingresada";
            }
            // Mostrar el mensaje de error
            $.notify(" " + error.message, {
                type: "danger",
                delay: 4000,
                animation: true,
                animationType: "drop",
                icon: "close",
                close: true
            });
            //console.log(error);
        });


        /*
        var usuario = encuestaApp.auth().currentUser;
        // Actualizar el nombre del usuario registrado
        usuario.updateEmail(correo).then(function() {
            // Mostrar la notificacion de exito
            $.notify(" Se actualizo el correo del perfil con exito!", {
                type: "success",
                delay: 4000,
                animation: true,
                animationType: "drop",
                icon: "check",
                close: true
            });
        }, function(error) {
            // Mostrar el mensaje de error
            $.notify(" " + error.message, {
                type: "danger",
                delay: 4000,
                animation: true,
                animationType: "drop",
                icon: "close",
                close: true
            });
            console.log(error);
        });
        console.log(usuario);
        */
    }

    $("#enviar-correo").on('submit', function () {
        event.preventDefault();

        var correo = $("#correo").val();
        var patron = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
        var error = {};

        if(correo != "") {
            if(!correo.match(patron)) {
                error.code = 2;
                error.mensaje = " La direccion del correo es invalido, escribi una direccion valida!";
            }

        } else {
            error.code = 1;
            error.mensaje = " Ingrese una direccion de correo electronico!";
        }

        if($.isEmptyObject(error)) {
            // modificar el nombre del usuario
            enviarEnlaceRestablecerContrasena(correo);
            limpiarFormulario();
        } else {
            // Mostrar el mensaje de error
            $.notify(error.mensaje, {
                type: "danger",
                delay: 4000,
                animation: true,
                animationType: "drop",
                icon: "close",
                close: true
            });

            limpiarFormulario();
        }

    });

});