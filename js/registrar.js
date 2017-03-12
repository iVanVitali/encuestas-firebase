/**
 * Created by webcoder on 9/3/17.
 */
$(document).ready(function () {
    'use strict';
    /*
     COMIENZO Firebase
     */
    var auth = encuestaApp.auth();

    function registrarUsuario(email, password, name) {
        var user = auth.createUserWithEmailAndPassword(email, password)
            .then(function (user) {

                //console.log("registrando nuevo usuario");
                //var userLoggedIn = auth.currentUser;
                var userKey = user.uid;

                var datosUsuario = {
                    "nombre": name,
                    "correo": email,
                    "encuestaVih": 0,
                    "encuestaAdicciones": 0,
                    "creado": (new Date()).getTime()
                };
                //console.log(userKey, datosUsuario);

                // Ingresar usuario
                ingresarUsuario('usuarios', userKey, datosUsuario);

                // Actualizar el nombre del usuario registrado
                user.updateProfile({
                    displayName: name,
                    photoURL: ""
                }).then(function() {
                    console.log('se actualizo el perfil del usuario con exito');
                }, function(error) {
                    // An error happened.
                    console.log(error);
                });

                // Mostrar la notificacion de exito
                $.notify(" Usted se registro con exito!", {
                    type: "success",
                    delay: 4000,
                    animation: true,
                    animationType: "drop",
                    icon: "check",
                    close: true
                });

                // Esperar 10 segundos
                window.setTimeout(function () {
                    redirect(home);
                }, 6000);
            })
            .catch(function(error) {
                // Manejar los errores
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode == 'auth/weak-password') {
                    error.message = " La contraseña es demasiado debil.";
                } else if(errorCode == 'auth/email-already-in-use') {
                    error.message = " Ya existe la cuenta con el mail ingresado.";
                }
                else if(errorCode == 'auth/invalid-email') {
                    error.message =" Debe ingresar una direccion del correo electronico valida.";
                }
                else {
                    error.message = " " + error.message;
                }

                // Mostrar el mensaje de error
                $.notify(error.message, {
                    type: "danger",
                    delay: 5000,
                    animation: true,
                    animationType: "drop",
                    icon: "close",
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

    function limpiarFormulario() {
        $("input[type=text]").val("");
        $("input[type=email]").val("");
        $("input[type=password]").val("");
        $("input").removeClass("has-success");
        $('#formulario-registro').find('span').remove();
    }

    if(document.getElementById("formulario-registro")) {

        // Validar el formulario de registro
        $("#formulario-registro").validate({
            submitHandler: function(form) {
                // Prevenir submit
                event.preventDefault();
                // obtener los datos ingresados
                var email = $("input#email").val();
                var password = $("input#password").val();
                var name = $("input#name").val();

                registrarUsuario(email, password, name);
                //limpiarFormulario();
            },
            rules: {
                name: {
                    required: true,
                    minlength: 3
                },
                email: {
                    required: true,
                    email: true
                },
                password: {
                    required: true,
                    minlength: 6
                },
                confirm_password: {
                    required: true,
                    minlength: 6,
                    equalTo: "#password"
                }
            },
            /*
             messages: {
             firstname: "Please enter your firstname",
             lastname: "Please enter your lastname"
             },
             */
            errorElement: "em",
            errorPlacement: function (error, element) {
                // Add the `help-block` class to the error element
                error.addClass( "help-block" );

                // Add `has-feedback` class to the parent div.form-group
                // in order to add icons to inputs
                element.parents( ".col-sm-7" ).addClass( "has-feedback" );

                if ( element.prop( "type" ) === "checkbox" ) {
                    error.insertAfter(element.parent("label"));
                } else {
                    error.insertAfter(element);
                }

                // Add the span element, if doesn't exists, and apply the icon classes to it.
                if (!element.next("span")[0]) {
                    $( "<span class='glyphicon glyphicon-remove form-control-feedback'></span>" ).insertAfter(element);
                }
            },
            success: function (label,element) {
                // Add the span element, if doesn't exists, and apply the icon classes to it.
                if (!$(element).next("span")[0]) {
                    $( "<span class='glyphicon glyphicon-ok form-control-feedback'></span>" ).insertAfter($(element));
                }
            },
            highlight: function (element, errorClass, validClass) {
                $(element).parents(".col-sm-7").addClass( "has-error" ).removeClass( "has-success" );
                $( element ).next( "span" ).addClass( "glyphicon-remove" ).removeClass( "glyphicon-ok" );
            },
            unhighlight: function (element, errorClass, validClass) {
                $(element).parents(".col-sm-7").addClass( "has-success" ).removeClass( "has-error" );
                $(element).next( "span" ).addClass( "glyphicon-ok" ).removeClass( "glyphicon-remove" );
            }
        });
    }

});