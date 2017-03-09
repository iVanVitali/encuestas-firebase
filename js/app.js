/**
 * Created by webcoder on 7/3/17.
 */
$(document).ready(function () {
    'use strict';


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

        // Obtener los datos
        var email = $("input[name=email]").val();
        var sexo = $("input[name=sexo]:checked").val();
        var edad = $("input[name=edad]").val();
        var estadoCivil = $("input[name=ecivil]:checked").val();
        var estudios = $("input[name=instruccion]:checked").val();
        var ocupacion = $("input[name=ocupacion]").val();
        var barrio = $("input[name=barrio]").val();
        var cp = $("input[name=cp]").val();


        if(email.length > 0) {
            encuestaVih['correo'] = email;
        }
        encuestaVih['sexo'] = sexo;
        if(edad.length > 0) {
            encuestaVih['edad'] = edad;
        }
        encuestaVih['estado civil'] = estadoCivil;
        encuestaVih['estudios'] = estudios;
        if(ocupacion.length > 0) {
            encuestaVih['ocupacion'] = ocupacion;
        }
        if(barrio.length > 0) {
            encuestaVih['barrio'] = barrio;
        }
        if(cp.length > 0) {
            encuestaVih['cp'] = cp;
        }

        console.log(encuestaVih);

    });

    // Evento para mostrar los motivos de la pregunta 3 segun la respuesta de Si o No
    $('input[name=respuesta3]').on('click', function () {
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

    // Evento para mostrar los motivos de la pregunta 3 segun la respuesta de Si o No
    $('input[name=respuesta4]').on('click', function () {
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

});