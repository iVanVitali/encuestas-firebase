/**
 * Created by webcoder on 11/3/17.
 */

$(document).ready(function () {
    'use strict';

    var auth = encuestaApp.auth();

    var index = "index.html";

    function redirect(ruta) {
        location.assign(ruta);
    }

    function limpiarFormulario() {
        $("input[type=email]").val("");
    }

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

            $('.navbar-right').text('');
            // Mostrar el menu del usuario logueado
            var userMenu = '<li class="dropdown active">';
            userMenu += '<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">' + user.displayName + '<span class="caret"></span></a>';
            userMenu += '<ul class="dropdown-menu">';
            userMenu +=     '<li class="active"><a href="perfil.html">Pefil</a></li>';
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

    function modificarCorreoPerfil(correo) {
        var usuario = encuestaApp.auth().currentUser;
        // Actualizar el nombre del usuario registrado
        usuario.updateEmail(correo).then(function() {

            actualizarCorreoUsuario(correo, usuario.uid);
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

            if(error.code === "auth/requires-recent-login") {
                error.message = "Esta operación es sensible y requiere autenticación reciente. Inicie sesión de nuevo antes de volver a intentar esta solicitud.";
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
            console.log(error);
        });
        console.log(usuario);
    }

    $("#modificar-correo").on('submit', function () {
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
            error.mensaje = " El campo del correo electronico es requerido!";
        }

        if($.isEmptyObject(error)) {
            // modificar el nombre del usuario
            modificarCorreoPerfil(correo);
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

    function actualizarCorreoUsuario(correoUsuario, usuarioId) {
        var usuariosRef = encuestaApp.database().ref('usuarios');
        var usuarioRef = usuariosRef.child(usuarioId);

        usuarioRef.update({ correo: correoUsuario});
    }

});