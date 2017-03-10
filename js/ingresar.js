/**
 * Created by webcoder on 7/3/17.
 */
$(document).ready(function () {
    'use strict';

    /** COMIENZO Firebase **/

    const auth = encuestaApp.auth();

    // Verificar si el usuario esta logueado
    auth.onAuthStateChanged(function(user) {
        if (user) {
            redirect(home);
        } else {
            //console.log('Usuario no logueado');
        }
    });

    function loguearUsuario(email, password) {
        auth.signInWithEmailAndPassword(email, password)
            .then(function () {
                // Mostrar la notificacion de exito
                $.notify(" Ingresando!", {
                    type: "success",
                    delay: 3000,
                    animation: true,
                    animationType: "drop",
                    icon: "check fa-lg"
                });
                // Esperar 3 segundos
                window.setTimeout(function () {
                    redirect(home);
                }, 3000);
            }).catch(function (error) {
            var errorCode = error.code;
            if (errorCode == 'auth/wrong-password') {
                error.message = " La contraseña es invalida.";
            } else if(errorCode == 'auth/user-not-found') {
                error.message = " Correo electronico invalido, no hay ningun usuario registrado con este correo electronico.";
            } else {
                error.message = " " + error.message;
            }
            // Mostrar el mensaje de error
            $.notify(error.message, {
                type: "danger",
                delay: 5000,
                animation: true,
                animationType: "drop",
                icon: "close fa-lg",
                close: true
            });
        });
    }

    // FIN Firebase


    var index = "index.html";
    var home = "home.html";
    var login = "ingresar.html";

    function redirect(ruta) {
        location.assign(ruta);
    }

    // Si el documento posee el id formulario-ingreso
    if(document.getElementById("formulario-ingreso")) {

        // Validar el formulario de ingreso
        $("#formulario-ingreso").validate( {
            submitHandler: function(form) {
                // Prevenir submit
                event.preventDefault();
                // obtener los datos ingresados
                var email = $("input#email1").val();
                var password = $("input#password1").val();

                loguearUsuario(email, password);
                //redirect(home);
                //console.log("form1", email, password);
            },
            rules: {
                email1: {
                    required: true,
                    email: true
                },
                password1: {
                    required: true,
                    minlength: 6
                }
            },
            messages: {
                /*
                 password1: {
                 required: "Please provide a password",
                 minlength: "Your password must be at least 5 characters long"
                 },
                 email1: "Please enter a valid email address"
                 */
            },
            errorElement: "em",
            errorPlacement: function ( error, element ) {
                // Add the `help-block` class to the error element
                error.addClass( "help-block" );

                // Add `has-feedback` class to the parent div.form-group
                // in order to add icons to inputs
                element.parents( ".col-sm-7" ).addClass( "has-feedback" );

                if ( element.prop( "type" ) === "checkbox" ) {
                    error.insertAfter( element.parent( "label" ) );
                } else {
                    error.insertAfter( element );
                }

                // Add the span element, if doesn't exists, and apply the icon classes to it.
                if ( !element.next( "span" )[ 0 ] ) {
                    $( "<span class='glyphicon glyphicon-remove form-control-feedback'></span>" ).insertAfter( element );
                }
            },
            success: function ( label, element ) {
                // Add the span element, if doesn't exists, and apply the icon classes to it.
                if ( !$( element ).next( "span" )[ 0 ] ) {
                    $( "<span class='glyphicon glyphicon-ok form-control-feedback'></span>" ).insertAfter( $( element ) );
                }
            },
            highlight: function ( element, errorClass, validClass ) {
                $( element ).parents( ".col-sm-7" ).addClass( "has-error" ).removeClass( "has-success" );
                $( element ).next( "span" ).addClass( "glyphicon-remove" ).removeClass( "glyphicon-ok" );
            },
            unhighlight: function ( element, errorClass, validClass ) {
                $( element ).parents( ".col-sm-7" ).addClass( "has-success" ).removeClass( "has-error" );
                $( element ).next( "span" ).addClass( "glyphicon-ok" ).removeClass( "glyphicon-remove" );
            }
        });
    }

});