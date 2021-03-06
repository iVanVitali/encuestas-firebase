/**
 * Created by webcoder on 9/3/17.
 */
    'use strict';

    var app1 = angular.module('encApp', []);

    app1.controller('UsuarioController', function($scope, $timeout) {

        var auth = encuestaApp.auth();

        auth.onAuthStateChanged(function(user) {
            if (user) {
                $timeout(function () {
                    $scope.nombre = user.displayName;
                });
            }
        });
    });



$(document).ready(function () {

    var auth = encuestaApp.auth();
    var index = "index.html";

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

});
