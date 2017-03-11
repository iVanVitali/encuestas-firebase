/**
 * Created by webcoder on 10/3/17.
 */
    /** Firebase **/

    var configuracion = {
        apiKey: "AIzaSyD_vSc4ch4UNmAM-GIgN6kQFCgMxslG31s",
        authDomain: "encuesta-ryv-dev.firebaseapp.com",
        databaseURL: "https://encuesta-ryv-dev.firebaseio.com",
        storageBucket: "encuesta-ryv-dev.appspot.com",
        messagingSenderId: "793547270104"
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

    function agregarEncuesta(ruta, encuesta, callback) {
        var encuestaVihRef = encuestaApp.database().ref(ruta);
        var pushedEncuestaVihRef = encuestaVihRef.push(encuesta);
        var encuestaId = pushedEncuestaVihRef.getKey();
        callback(encuestaId);
    }

    function agregarDato(ruta, dato) {
        var encuestaRef = encuestaApp.database().ref(ruta);
        encuestaRef.push(dato);
    }

    function obtenerCantidadEncuestasVih(ruta, callback) {
        var encuestaVihRef = encuestaApp.database().ref(ruta);
        encuestaVihRef.on('value', function(snap) {
            callback(snap.numChildren());
        });
    }

    function agregarEncuestaPorUsuario(ruta, usuarioId, encuesta) {
        var encuestaVihRef = encuestaApp.database().ref(ruta).child(usuarioId);
        encuestaVihRef.push(encuesta);
    }

    function actualizarNumeroEncuestaVih(ruta, usuarioId) {
        var usuariosRef = encuestaApp.database().ref(ruta);
        var usuarioRef = usuariosRef.child(usuarioId);
        usuarioRef.once('value', function (snap) {
            var usuario = snap.val();
            // actualizar el numero de encuestas de Vih
            usuarioRef.update({
                encuestaHiv: (usuario.encuestaHiv || 0) + 1
            }, function (error) {
                if (error) {
                    console.log('update error!', error);
                }
            });
        });
    }

    function ingresarUsuario(ruta, usuarioId, datos) {
        var usuariosRef = encuestaApp.database().ref(ruta);
        var usuarioRef = usuariosRef.child(usuarioId);
        usuarioRef.set({
            nombre: datos.nombre,
            correo: datos.correo,
            encuestaHiv: datos.encuestaHiv,
            encuestaAdicciones: datos.encuestaAdicciones,
            creado: datos.creado
        });
    }

    //var encuestaVihRef = encuestaApp.database().ref().child('encuesta-vih');
    //var encuestaVihRef = encuestaApp.database().ref('encuesta-vih').orderByChild('pregunta2/respuesta').equalTo('Si');
    //var encuestaVihRef = encuestaApp.database().ref('encuesta-vih').orderByChild('sexo').equalTo('Femenino');

    //var encuestaVihRef = encuestaApp.database().ref('encuesta-vih').orderByChild('sexo').equalTo('Femenino');

    //encuestaVihRef.on('value', snap => console.log(snap.val()));


    //var encuestaVihRef = encuestaApp.database().ref('encuesta-vih').orderByChild('pregunta1');
    //encuestaVihRef.on('value', snap => console.log(snap.numChildren()));

    // FIN Firebase