$(document).ready(function () {
    $.ajax({
        url: 'landingM.php',  // Asegúrate que esta ruta sea correcta
        method: 'GET',
        dataType: 'json',
        success: function (suscripciones) {
            if (suscripciones.length === 6) {
                // Llenar las cartas con los datos obtenidos
                actualizarCartas(suscripciones);
            } else {
                console.error('Datos insuficientes o incorrectos:', suscripciones);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error al cargar las suscripciones:', textStatus, errorThrown);
        }
    });

    function actualizarCartas(suscripciones) {
        // Carta 1: ids 1 y 2
        $('#categoria1').text(suscripciones[0].categoria_sus);
        $('#precioMensual1').text(suscripciones[0].precio_sus);
        $('#descripcion1').text(suscripciones[0].descripcion_sus);
        $('#precioAnual1').text(suscripciones[1].precio_sus);

        // Carta 2: ids 3 y 4
        $('#categoria2').text(suscripciones[2].categoria_sus);
        $('#precioMensual2').text(suscripciones[2].precio_sus);
        $('#descripcion2').text(suscripciones[2].descripcion_sus);
        $('#precioAnual2').text(suscripciones[3].precio_sus);

        // Carta 3: ids 5 y 6
        $('#categoria3').text(suscripciones[4].categoria_sus);
        $('#precioMensual3').text(suscripciones[4].precio_sus);
        $('#descripcion3').text(suscripciones[4].descripcion_sus);
        $('#precioAnual3').text(suscripciones[5].precio_sus);
    }
});

