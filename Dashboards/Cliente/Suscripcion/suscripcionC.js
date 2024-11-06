$(document).ready(function () {
    const geopifyAPIKey = 'e7caa5f08f694add898e03a656bcdd51';

    const map = L.map('map').setView([-34.901112, -56.164532], 10); // Coordenadas iniciales

    L.tileLayer(`https://maps.geoapify.com/v1/tile/dark-matter/{z}/{x}/{y}.png?apiKey=${geopifyAPIKey}`, {
        attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Inicializar variables
    let selectedUbi = null; // Guardar la ubicación seleccionada
    let selectedSub = []; // Guardar las suscripciones
    let selectedPlanID = null;
    let selectedPlan = null; // Inicializar selectedPlan
    let sub = '';

    // Obtener las ubicaciones
    loadUbicaciones();

    // Obtener las suscripciones
    loadSuscripciones();

    function loadUbicaciones() {
        $.ajax({
            url: 'suscripcionM.php?type=ubicaciones',
            method: 'GET',
            dataType: 'json',
            success: function (ubicaciones) {
                ubicaciones.forEach(function (ubicacion) {
                    $('#lista-ubicaciones').append(`
                        <div class="ubicacion-item" data-id="${ubicacion.id_sucursal}" data-lat="${ubicacion.latitud}" data-lon="${ubicacion.longitud}">
                            ${ubicacion.nombre}
                        </div>
                    `);
                });
                // Manejar clics en las ubicaciones
                $('.ubicacion-item').on('click', function () {
                    const lat = $(this).data('lat');
                    const lon = $(this).data('lon');
                    const name = $(this).text();
                    const selectedUbiID = $(this).data('id'); // Obtener el ID de la ubicación

                    // Mover el mapa y agregar marcador
                    map.setView([lat, lon], 15);
                    L.marker([lat, lon]).addTo(map).bindPopup(name).openPopup();

                    // Remover la clase 'selected' de todas las ubicaciones
                    $('.ubicacion-item').removeClass('selected');

                    // Agregar la clase 'selected' al elemento clicado
                    $(this).addClass('selected');

                    // Guardar el ID de la ubicación seleccionada
                    selectedUbi = selectedUbiID;
                    console.log('Ubicación seleccionada:', selectedUbi);
                        
                    // Llama a enviarDatosSuscripcion después de seleccionar una ubicación
                    enviarDatosSuscripcion();
                });
            },
            error: function (err) {
                console.error("Error al obtener las ubicaciones:", err);
            }
        });
    }

    function loadSuscripciones() {
        $.ajax({
            url: 'suscripcionM.php?type=suscripciones',
            method: 'GET',
            dataType: 'json',
            success: function (suscripciones) {
                if (suscripciones.length === 6) {
                    selectedSub = suscripciones; // Guardar las suscripciones
                    actualizarCartas(suscripciones);
                } else {
                    console.error('Datos insuficientes o incorrectos:', suscripciones);
                }

                // Manejar clics en las suscripciones
                $('.card').on('click', function () {
                    const selectedSubID = $(this).data('tuplas'); // Obtener el ID de la ubicación

                    // Remover la clase 'selected' de todas las suscripciones
                    $('.card').removeClass('selected');

                    // Agregar la clase 'selected' al elemento clicado
                    $(this).addClass('selected');

                    // Guardar el ID de la suscripción seleccionada
                    selectedSub = selectedSubID;
                    console.log('Sub seleccionada:', selectedSub);

                    // Llama a enviarDatosSuscripcion después de seleccionar una ubicación
                    enviarDatosSuscripcion();
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Error al cargar las suscripciones:', textStatus, errorThrown);
            }
        });
    }

    function actualizarCartas(suscripciones) {
        $('#categoria1').text(suscripciones[0].categoria_sus);
        $('#precioMensual1').text(suscripciones[0].precio_sus);
        $('#descripcion1').text(suscripciones[0].descripcion_sus);
        $('#precioAnual1').text(suscripciones[1].precio_sus);

        $('#categoria2').text(suscripciones[2].categoria_sus);
        $('#precioMensual2').text(suscripciones[2].precio_sus);
        $('#descripcion2').text(suscripciones[2].descripcion_sus);
        $('#precioAnual2').text(suscripciones[3].precio_sus);

        $('#categoria3').text(suscripciones[4].categoria_sus);
        $('#precioMensual3').text(suscripciones[4].precio_sus);
        $('#descripcion3').text(suscripciones[4].descripcion_sus);
        $('#precioAnual3').text(suscripciones[5].precio_sus);
    }

    // Manejar el evento de cambio del checkbox
    $(".plan-button").change(() => {
        // Comprobar si selectedSub tiene valores
        if (selectedSub.length > 0) {
            // Asignar selectedPlan dependiendo del estado del checkbox
            if ($(".plan-button").is(":checked")) {
                selectedPlan = selectedSub[2]; // Si está activo, usar el tercer ID
                console.log("Checkbox activo. Selected plan:", selectedPlan);
            } else {
                selectedPlan = selectedSub[0]; // Si no está activo, usar el primer ID
                console.log("Checkbox no activo. Selected plan:", selectedPlan);
            }

        // Establecer selectedPlanID basado en el valor de selectedPlan
        if (selectedPlan == 1) {
            selectedPlanID = 'P-7R123779X6771773AM4K4CUA';
            sub = 1; // Asignar id_suscripcion correspondiente
        } else if (selectedPlan == 2) {
            selectedPlanID = 'P-9A2528415C724623BM4K4DLI';
            sub = 2;
        } else if (selectedPlan == 3) {
            selectedPlanID = 'P-6N209355GC179425LM4K4D5I';
            sub = 3;
        } else if (selectedPlan == 4) {
            selectedPlanID = 'P-1ET33000CM209935RM4K4EUY';
            sub = 4;
        } else if (selectedPlan == 5) {
            selectedPlanID = 'P-8XP438378P971264GM4K4FCI';
            sub = 5;
        } else if (selectedPlan == 6) {
            selectedPlanID = 'P-0R034475SG1035119M4K4FRY';
            sub = 6;
        }

                        // Disparar evento personalizado para informar al script de PayPal
                        const event = new CustomEvent('selectedPlanIDChanged', {
                            detail: {
                                newPlanID: selectedPlanID
                            }
                        });
                        window.dispatchEvent(event);
                        
            // Mostrar el ID del plan seleccionado
            console.log("Selected Plan ID:", selectedPlanID);
        } else {
            console.error("No hay suscripciones cargadas.");
        }
    });

// Escuchar el evento de suscripción exitosa
window.addEventListener('subscriptionSuccess', (event) => {
    console.log('Suscripción exitosa con ID:', event.detail.subscriptionID);
    console.log("lógica");
    
    // Llamar a la función para enviar los datos de la suscripción
    enviarDatosSuscripcion(event.detail.subscriptionID);
});

function enviarDatosSuscripcion() {
    if (selectedUbi && selectedSub.length > 0 && sub) {
        const startDate = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD
        const endDate = calculateEndDate(sub); // Función para calcular la fecha de finalización

        // Asegúrate de que las fechas sean válidas
        if (!isValidDate(startDate) || !isValidDate(endDate)) {
            console.error("Las fechas no son válidas.");
            return;
        }

        // Crear objeto con los datos a enviar
        const subscriptionData = {
            id_sucursal: selectedUbi,
            id_usuario: 1, // Usar el ID del usuario que obtuviste desde PHP
            id_suscripcion: sub,
            fecha_inicio: startDate,
            fecha_fin: endDate
        };
        
        // Consultar los datos antes de enviar
        console.log('Datos a enviar:', subscriptionData);

        // Función para enviar datos a un endpoint
        const enviarDatos = (url, data) => {
            return fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        };

        // Enviar datos a ambos endpoints
        Promise.all([
            enviarDatos('paga.php', subscriptionData),
            enviarDatos('enviar_factura.php', subscriptionData)
        ])
        .then(responses => Promise.all(responses.map(response => {
            console.log('Response from:', response.url); // Log the response URL
            return response.text(); // Use response.text() to inspect raw response
        })))
        .then(responseTexts => {
            responseTexts.forEach(text => console.log('Raw response:', text)); // Log raw responses
            return responseTexts.map(text => JSON.parse(text)); // Parse valid JSON
        })
        .then(data => {
            console.log('Respuestas del servidor:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        console.error("Faltan datos necesarios para la suscripción.");
    }
}


// Función para calcular la fecha de finalización
function calculateEndDate(sub) {
    const startDate = new Date(); // Fecha actual
    let endDate = new Date(startDate); // Copia de la fecha actual

    // Comprobar el tipo de plan según el valor de sub
    let tipoPlan;
    if (sub === 1 || sub === 3 || sub === 5) {
        tipoPlan = 'mensual'; // 1, 3, 5 son mensuales
    } else if (sub === 2 || sub === 4 || sub === 6) {
        tipoPlan = 'anual'; // 2, 4, 6 son anuales
    } else {
        console.error("ID de suscripción no válido");
        return null; // Retornar null si el ID no es válido
    }

    // Calcular la fecha de finalización según el tipo de plan
    if (tipoPlan === 'mensual') {
        endDate.setMonth(startDate.getMonth() + 1); // Añadir un mes
    } else if (tipoPlan === 'anual') {
        endDate.setFullYear(startDate.getFullYear() + 1); // Añadir un año
    }

    // Ajustar el día en caso de que no exista en el nuevo mes
    if (endDate.getDate() !== startDate.getDate()) {
        endDate.setDate(Math.min(startDate.getDate(), new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate()));
    }

    return endDate.toISOString().split('T')[0]; // Retorna la fecha en formato YYYY-MM-DD
}

// Función para validar las fechas
function isValidDate(dateString) {
    const regEx = /^\d{4}-\d{2}-\d{2}$/; // RegExp para validar el formato YYYY-MM-DD
    return dateString.match(regEx) !== null;
}
// Resto del código...

});

    
    /*
    = 'P-7R123779X6771773AM4K4CUA'; // ID del plan Estándar mensual 
        $planIdAnual = 'P-9A2528415C724623BM4K4DLI';    // ID del plan Estándar anual 
    } elseif ($cardId == 2) {
        $planIdMensual = 'P-6N209355GC179425LM4K4D5I'; // ID del plan Avanzada mensual 
        $planIdAnual = 'P-1ET33000CM209935RM4K4EUY';   // ID del plan Avanzada anual 
    } elseif ($cardId == 3) {
        $planIdMensual = 'P-8XP438378P971264GM4K4FCI'; // ID del plan Hardcore mensual 
        $planIdAnual = 'P-0R034475SG1035119M4K4FRY';   // ID del plan Hardcore anual


        const togglePlan = document.getElementById('toggle-plan');
        const preciosMensuales = document.querySelectorAll('.precio-mensual');
        const preciosAnuales = document.querySelectorAll('.precio-anual');
    
        // Agregar el evento al toggle
        togglePlan.addEventListener('change', () => {
            if (togglePlan.checked) {
                // Mostrar precios anuales y ocultar mensuales
                preciosMensuales.forEach(precio => precio.classList.add('hidden'));
                preciosAnuales.forEach(precio => precio.classList.remove('hidden'));
            } else {
                // Mostrar precios mensuales y ocultar anuales
                preciosAnuales.forEach(precio => precio.classList.add('hidden'));
                preciosMensuales.forEach(precio => precio.classList.remove('hidden'));
            }
        });
   /*
    
});



    
















/*$(document).ready(function () {------------------------------------------------------------
    $.ajax({
        url: 'suscripcionM.php',  // Asegúrate que esta ruta sea correcta
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
*/





/*
document.addEventListener('DOMContentLoaded', () => {


    let ubicacionSeleccionada = null;
    let planSeleccionado = null;
    let esAnual = false; // Por defecto es mensual

    // Escuchar cambios en la selección de ubicación
    const ubicaciones = document.querySelectorAll('#lista-ubicaciones div');
    ubicaciones.forEach(ubicacion => {
        ubicacion.addEventListener('click', () => {
            ubicacionSeleccionada = ubicacion.getAttribute('data-id');
        });
    });

    // Escuchar cambios en la selección de plan
    const tarjetas = document.querySelectorAll('.tarjeta');
    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener('click', () => {
            planSeleccionado = tarjeta.getAttribute('data-id');
        });
    });

    // Escuchar cambios en el toggle mensual/anual
    const togglePlan = document.getElementById('toggle-plan');
    togglePlan.addEventListener('change', () => {
        esAnual = togglePlan.checked; // True si es anual, False si es mensual
    });

    // Enviar las selecciones al servidor (PHP)
    const btnPagar = document.getElementById('paypal-button-container');
    btnPagar.addEventListener('click', () => {
        if (ubicacionSeleccionada && planSeleccionado) {
            const datos = {
                ubicacion: ubicacionSeleccionada,
                plan: planSeleccionado,
                esAnual: esAnual
            };

            // Enviar los datos al backend usando fetch o AJAX (jQuery)
            fetch('suscripcionM.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            }).then(response => response.json())
              .then(data => {
                // Manejar la respuesta del servidor (exito/error)
                if (data.success) {
                    console.log("Suscripción completada");
                } else {
                    console.error("Error en la suscripción");
                }
              }).catch(error => console.error('Error:', error));
        } else {
            alert("Por favor, selecciona una ubicación y un plan.");
        }
    });
});

*/


/* 
TASK CARDS

-pre form
resivir o pedir json de sucursales.php con ubicaciones y suscripciones vigentes,

-durante form
agregar al localstorage ubicacion y suscripcion seleccionada o en OnClick,
enviar json con datos del localstorage a suscrimpcionesM.php(este proseguira con el pago y hara la redireccion)


*/


