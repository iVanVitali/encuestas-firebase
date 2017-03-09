/**
 * Created by webcoder on 7/3/17.
 */
$(document).ready(function () {
    'use strict';

    /*
        COMIENZO Firebase
     */
    var configuracion = {
        apiKey: "AIzaSyAaV33Xv8iAPzBhCoeZvKQsFEVQhNxICek",
        authDomain: "encuesta-ryv.firebaseapp.com",
        databaseURL: "https://encuesta-ryv.firebaseio.com",
        storageBucket: "encuesta-ryv.appspot.com",
        messagingSenderId: "384093119454"
    };
    var encuestaApp = firebase.initializeApp(configuracion);
    /*
        Reglas de escritura:
     {
         "rules": {
         ".read": "auth != null",
         ".write": "auth != null"
         }
     }
     */

    function agregarEncuesta(ruta, encuesta) {
        var refEncuesta = encuestaApp.database().ref().child(ruta);

        refEncuesta.push(encuesta);
    }


    //var encuestaVihRef = encuestaApp.database().ref().child('encuesta-vih');
    //var encuestaVihRef = encuestaApp.database().ref('encuesta-vih').orderByChild('pregunta2/respuesta').equalTo('Si');
    //var encuestaVihRef = encuestaApp.database().ref('encuesta-vih').orderByChild('sexo').equalTo('Femenino');

    //var encuestaVihRef = encuestaApp.database().ref('encuesta-vih').orderByChild('sexo').equalTo('Femenino');

    //encuestaVihRef.on('value', snap => console.log(snap.val()));


    //var encuestaVihRef = encuestaApp.database().ref('encuesta-vih').orderByChild('pregunta1');
    //encuestaVihRef.on('value', snap => console.log(snap.numChildren()));

    // FIN Firebase



    /*
        COMIENZO Procesar el barrio ingresado con la api de Google
     */
    var placeSearch, autocomplete;
    var componentForm = {
        locality: 'long_name',
        sublocality_level_1: 'long_name',
        administrative_area_level_2: 'short_name',
        administrative_area_level_1: 'short_name',
        country: 'long_name'
    };

    function initAutocomplete() {
        // Create the autocomplete object, restricting the search to geographical
        // location types.
        autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
            {types: ['geocode']});

        // When the user selects an address from the dropdown, populate the address
        // fields in the form.
        autocomplete.addListener('place_changed', fillInAddress);
    }

    // [START region_fillform]
    function fillInAddress() {
        // Get the place details from the autocomplete object.
        var place = autocomplete.getPlace();
        var barrioCaba = false;
        var tipoDireccion = "sublocality_level_1";

        // Verificar si sublocality_level_1 esta presente
        for (var i = 0; i < place.address_components.length; i++) {
            if (place.address_components[i].types[0] === 'sublocality_level_1') {
                barrioCaba = true;
            }
        }

        // Asignar el tipo de direccion
        if(barrioCaba) {
            tipoDireccion = "sublocality_level_1";
        } else {
            tipoDireccion = "locality";
        }

        // Get each component of the address from the place details
        // and fill the corresponding field on the form.
        for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];

            if (componentForm[addressType] && addressType === tipoDireccion) {
                var val = place.address_components[i][componentForm[addressType]];
                $('input[name=barrio]').attr('value', val);
            }
        }
    }

// [END region_fillform]

// [START region_geolocation]
// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
    function geolocate() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var geolocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                var circle = new google.maps.Circle({
                    center: geolocation,
                    radius: position.coords.accuracy
                });
                autocomplete.setBounds(circle.getBounds());
            });
        }
    }

    // Inicializar la Api de Google para autocompletar el barrio
    initAutocomplete();
    // Disparar Evento cuando el focus esta sobre el campo autocomplete
    $("#autocomplete").on('focus', geolocate());

// [END region_geolocation]
// FIN Procesar el barrio ingresado con la api de Google

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

        var error = {};
        var ruta = "encuesta-vih";

        // Obtener los datos
        var email = $("input[name=email]").val();
        var sexo = $("input[name=sexo]:checked");
        var edad = $("input[name=edad]").val();
        var estadoCivil = $("input[name=ecivil]:checked");
        var estudios = $("input[name=instruccion]:checked");
        var ocupacion = $("input[name=ocupacion]").val();
        var barrio = $("input[name=barrio]").val();
        var cp = $("input[name=cp]").val();


        if(email.length > 0) {
            encuestaVih['correo'] = email;
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
            error['mensaje'] = "Falta completar el sexo de la persona encuestada";
        } else {
            encuestaVih['sexo'] = sexo.val();
        }


        /* -- Cargar encuesta y Guardar en Firebase si no hay Errores -- */

        // Si No hay errores
        if($.isEmptyObject(error)) {
            // Cargar preguntas en la encuesta
            encuestaVih['pregunta1'] = pregunta1;
            encuestaVih['pregunta2'] = pregunta2;
            encuestaVih['pregunta3'] = pregunta3;
            encuestaVih['pregunta4'] = pregunta4;
            encuestaVih['pregunta5'] = pregunta5;
            encuestaVih['pregunta6'] = pregunta6;
            encuestaVih['pregunta7'] = pregunta7;
            encuestaVih['pregunta8'] = pregunta8;

            //agregarEncuesta(ruta, encuestaVih);

            console.log(encuestaVih);
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

    /*
    // Evento para mostrar los motivos de la pregunta 3 segun la respuesta de Si o No
    $('#pregunta4 input[name=respuesta4]').on('click', function () {
        var respuesta4 = this.value;

        // Respuesta positiva
        if(respuesta4 === "Si") {
            // Deshabilitar motivos de la respuesta NO
            $('input[name=motivo42]').each(function () {
                var elemento = this;
                $(elemento).attr('disabled', true);
            });
        } else if(respuesta4 === "Aveces") {

        // Deshabilitar motivos de la respuesta NO
            $('input[name=motivo42]').each(function () {
                var elemento = this;
                $(elemento).attr('disabled', true);
            });
        } else {

            // Habilitar los motivos de la respuesta No
            $('input[name=motivo42]').each(function () {
                var elemento = this;
                $(elemento).attr('disabled', false);
            });
        }
        console.log(respuesta4);
    });
    */
});