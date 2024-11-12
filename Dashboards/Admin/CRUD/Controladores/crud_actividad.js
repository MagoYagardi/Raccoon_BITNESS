$(document).ready(function() {
    // Inicializar DataTable con opciones personalizadas en español
    var table = $('#tablaActividad').DataTable({
        paging: true,
        searching: true,
        ordering: true,
        info: true,
        language: { 
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros por página",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "No hay datos disponibles en esta tabla",
            "sInfo": "Mostrando _START_ a _END_ de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando 0 a 0 de 0 registros",
            "sInfoFiltered": "(filtrado de _MAX_ registros en total)",
            "sSearch": "Buscar:",
            "oPaginate": {
                "sFirst": "Primero",
                "sPrevious": "Anterior",
                "sNext": "Siguiente",
                "sLast": "Último"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
        },
        columnDefs: [
            { orderable: false, targets: 3 } // Deshabilitar la ordenación en la columna de acciones
        ]
    });

    // Función para obtener las actividades y llenar la tabla
    function cargarActividades() {
        $.ajax({
            url: '../Modelos/crud_actividad.php', // Archivo PHP que procesa la solicitud GET
            method: 'GET',
            success: function(response) {
                if (response.actividades) {
                    table.clear();

                    response.actividades.forEach(function(actividad) {
                        const row = [
                            actividad.id_actividad,
                            actividad.hora_inicio,
                            actividad.hora_fin,
                            actividad.dia,
                            `<button class="btn btn-warning" onclick="editarActividad(${actividad.id_actividad})">Editar</button>
                             <button class="btn btn-danger" onclick="eliminarActividad(${actividad.id_actividad})">Eliminar</button>`
                        ];
                        table.row.add(row).draw();
                    });
                } else {
                    Swal.fire('Error', 'No se encontraron actividades.', 'error');
                }
            },
            error: function() {
                Swal.fire('Error', 'Error al cargar las actividades.', 'error');
            }
        });
    }

    // Llamada inicial para cargar las actividades cuando se carga la página
    cargarActividades();

    $(document).ready(function() {
        // Manejo del evento de submit del formulario de agregar actividad y clase
        $('#activityClassForm').submit(function(event) {
            event.preventDefault();
    
            // Recopilar datos del formulario
            const actividadData = {
                horaInicio: $('#actividadHoraInicio').val(),
                horaFin: $('#actividadHoraFin').val(),
                dia: $('#actividadDia').val(),
                claseNombre: $('#claseNombre').val() // Asegúrate de que este campo exista en el formulario
            };
    
            // Validar que todos los campos están llenos
            if (!actividadData.horaInicio || !actividadData.horaFin || !actividadData.dia || !actividadData.claseNombre) {
                Swal.fire('Error', 'Todos los campos son obligatorios.', 'error');
                return;
            }
    
            // Enviar datos al servidor a través de AJAX
            $.ajax({
                url: '../Modelos/crud_actividad.php',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(actividadData),
                success: function(response) {
                    if (response.success) {
                        // Ocultar el modal y resetear el formulario
                        $('#addActivityAndClassModal').modal('hide');
                        $('#activityClassForm')[0].reset();
    
                        // Recargar la tabla de actividades
                        cargarActividades();
                        Swal.fire('Éxito', 'Actividad y clase agregadas correctamente.', 'success');
                    } else {
                        Swal.fire('Error', 'No se pudo agregar la actividad y la clase.', 'error');
                    }
                },
                error: function() {
                    Swal.fire('Error', 'Hubo un problema al conectar con el servidor.', 'error');
                }
            });
        });
    });

    // Función para eliminar una actividad
    window.eliminarActividad = function(id) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: '../Modelos/crud_actividad.php',
                    method: 'DELETE',
                    contentType: 'application/json',
                    data: JSON.stringify({ id: id }),
                    success: function(response) {
                        if (response.success) {
                            cargarActividades();
                            Swal.fire('Eliminado', 'La actividad ha sido eliminada.', 'success');
                        } else {
                            Swal.fire('Error', response.message, 'error');
                        }
                    },
                    error: function() {
                        Swal.fire('Error', 'Hubo un error al eliminar la actividad.', 'error');
                    }
                });
            }
        });
    };
});
