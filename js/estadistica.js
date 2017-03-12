/**
 * Created by webcoder on 11/3/17.
 */


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

    var app = angular.module('encuestaApp', []);

    app.controller('VihController', function($scope, $timeout) {
        var encuestaRyVRef = encuestaApp.database().ref();
        var encuestaVihRef = encuestaRyVRef.child('encuesta-vih');
        var encuestasVih = encuestaVihRef.child('encuestas');

        var usuariosRef = encuestaRyVRef.child('usuarios');


        encuestasVih.on('value', function (snap) {
            $timeout(function () {
                $scope.numeroEncuestas = snap.numChildren();
                //console.log(snap.numChildren());
            });
        });

        usuariosRef.once('value', function (snap) {
            $timeout(function () {
                $scope.usuarios = snap.val();
                //console.log(snap.val());
            });
        });

    });
