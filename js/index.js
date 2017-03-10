/**
 * Created by webcoder on 10/3/17.
 */
$(document).ready(function () {
    'use strict';

    const auth = encuestaApp.auth();

    var home = "home.html";

    function redirect(ruta) {
        location.assign(ruta);
    }

    auth.onAuthStateChanged(function(user) {
        if (user) {
            redirect(home);
        }
    });

});