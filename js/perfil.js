/**
 * Created by webcoder on 11/3/17.
 */
$(document).ready(function () {
    'use strict';

    var auth = encuestaApp.auth();

    var index = "index.html";
    var home = "home.html";
    var login = "ingresar.html";

    function redirect(ruta) {
        location.assign(ruta);
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
            var nombreUsuario = user.displayName;
            var correoUsuario = user.email;

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

            mostrarNombrePerfil(nombreUsuario);
            mostrarCorreoPerfil(correoUsuario);
        } else {
            redirect(index);
        }
    });

    function mostrarNombrePerfil(nombre) {
        $("#nombrePerfil").text(nombre);
    }
    function mostrarCorreoPerfil(correo) {
        $("#correoPerfil").text(correo);
    }

});