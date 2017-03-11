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

    function salir() {
        auth.signOut().then(function() {
            //console.log('Usuario deslogueado!');
            unsetAppCookie;
            redirect(index);
        }, function(error) {
            // An error happened.
            console.log('Error al salir', error);
        });
    }

    function limpiarFormulario() {
        $("input[type=text]").val("");
    }

    auth.onAuthStateChanged(function(user) {
        if (user) {
            $('.navbar-right').text('');
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


    function modificarNombrePerfil(nombre) {
        var usuario = encuestaApp.auth().currentUser;
        // Actualizar el nombre del usuario registrado
        usuario.updateProfile({
            displayName: nombre,
        }).then(function() {

            actualizarNombreUsuario(nombre, usuario.uid);

            // Mostrar la notificacion de exito
            $.notify(" Se actualizo el nombre del perfil con exito!", {
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
            // An error happened.
            console.log(error);
        });
    }

    $("#modificar-nombre").on('submit', function () {
       event.preventDefault();
       var nombre = $("#nombre").val();
       var patron = /^[a-zA-Z]+(\s*[a-zA-Z]){3,19}$/;
       var error = {};

       if(nombre != "") {
           if(!nombre.match(patron)) {
               error.code = 2;
               error.mensaje = " El campo nombre es invalido, escribi un nombre valido!";
           }

       } else {
           error.code = 1;
           error.mensaje = " El campo nombre no debe estar vacio!";
       }

       if($.isEmptyObject(error)) {
           // modificar el nombre del usuario
           modificarNombrePerfil(nombre);
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

    function actualizarNombreUsuario(nombreUsuario, usuarioId) {
        var usuariosRef = encuestaApp.database().ref('usuarios');
        var usuarioRef = usuariosRef.child(usuarioId);

        usuarioRef.update({ nombre: nombreUsuario});
    }

});