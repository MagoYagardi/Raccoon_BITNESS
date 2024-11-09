$(document).ready(function() {
    $('#facturaTable').DataTable({
        "ajax": "../Modelos/crud_factura.php",
        "columns": [
            { "data": "id_factura" },
            { "data": "id_carrito" },
            { "data": "id_suscripcion" },
            { "data": "fecha_emision" },
            { "data": "total" },
            { "data": "fecha_pago" },
            { "data": "metodo_pago" },
            {
                "data": null,
                "render": function(data, type, row) {
                    return `
                        <button class="btn btn-danger btn-sm" onclick="eliminarFactura(${row.id_factura})"><i class="fas fa-trash-alt"></i></button>
                        <button class="btn btn-primary btn-sm" onclick="descargarPDF(${row.id_factura})"><i class="fas fa-file-download"></i></button>
                        <button class="btn btn-secondary btn-sm" onclick="imprimirPDF(${row.id_factura})"><i class="fas fa-print"></i></button>
                    `;
                }
            }
        ],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
        },
        "paging": true,
        "searching": true
    });
});

function eliminarFactura(id_factura) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede deshacer.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '../Modelos/crud_factura.php',
                type: 'POST',
                data: { id_factura: id_factura },
                success: function(response) {
                    $('#facturaTable').DataTable().ajax.reload();
                    Swal.fire('Eliminado', 'La factura ha sido eliminada.', 'success');
                }
            });
        }
    });
}

function descargarPDF(id_factura) {
    window.location.href = `../Modelos/crud_factura.php?id_factura=${id_factura}`;
}

function imprimirPDF(id_factura) {
    window.open(`../Modelos/crud_factura.php?id_factura=${id_factura}`, '_blank');
}