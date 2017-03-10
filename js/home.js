/**
 * Created by webcoder on 9/3/17.
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
            var loggedIn = '<li><p class="navbar-text">' + user.displayName + '</p></li>';
            loggedIn += '<li><a href="#" id="logoutLink">Salir</a></li>';

            $(loggedIn).appendTo('.navbar-right');
            $('#logoutLink').click(salir);
        } else {
            redirect(index);
        }
    });

});