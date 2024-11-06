$(document).ready(function() {
    // Función para cargar las suscripciones
    function cargarSuscripciones() {
        $.ajax({
            url: '../Modelos/crud_paga.php', // Reemplaza con la ruta correcta a tu archivo PHP
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                console.log(data); // Muestra la respuesta en la consola
                if (data.success) {
                    // Vaciar el cuerpo de la tabla antes de llenarlo
                    $('#subList').empty();
            
                    // Iterar sobre las suscripciones y llenarlas en la tabla
                    data.suscripciones.forEach(function(suscripcion) {
                        $('#subList').append(`
                            <tr>
                                <td>${suscripcion.id_suscripcion_FK}</td>
                                <td>${suscripcion.id_usuario_FK}</td>
                                <td>${suscripcion.fecha_inicio}</td>
                                <td>${suscripcion.fecha_fin}</td>
                                <td>
                                    <button class="btn btn-warning editar" data-id="${suscripcion.id_suscripcion}">Editar</button>
                                    <button class="btn btn-danger eliminar" data-id="${suscripcion.id_suscripcion}">Eliminar</button>
                                </td>
                            </tr>
                        `);
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.message
                    });
                }
            },            
            error: function(xhr, status, error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al cargar las suscripciones: ' + error
                });
            }
        });
    }

    // Llamar a la función para cargar las suscripciones al cargar la página
    cargarSuscripciones();
});

$(document).on('click', '.edit-button', function() {
    const id = $(this).data('id');
    // Fetch subscription details based on ID, you might need another AJAX call here
    $.ajax({
        url: '../Modelos/crud_paga.php', // Create a new endpoint to get specific subscription details
        type: 'POST',
        data: { id: id },
        dataType: 'json',
        success: function(data) {
            if (data.success) {
                $('#editSubId').val(data.subscription.id);
                $('#editIdUsuario').val(data.subscription.id_usuario_FK);
                $('#editDescripcion').val(data.subscription.fecha_inicio);
                $('#editPrecio').val(data.subscription.fecha_fin);
                $('#editSubModal').modal('show'); // Show modal
            } else {
                Swal.fire('Error', data.message, 'error');
            }
        },
        error: function(xhr, status, error) {
            console.error(error);
            Swal.fire('Error', 'Ocurrió un error al obtener los detalles de la suscripción.', 'error');
        }
    });
});
