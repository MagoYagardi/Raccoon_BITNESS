<?php
include '../../../../config/conexion.php'; 

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    obtenerFacturas();
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['accion'])) {
    $accion = $_POST['accion'];
    if ($accion === 'eliminar') {
        eliminarFactura($_POST['id_factura']);
    }
}

function obtenerFacturas() {
    global $conn; 
    try {
        $stmt = $conn->query("SELECT id_factura, id_carrito, id_suscripcion, fecha_emision, total, fecha_pago, metodo_pago FROM FACTURA");
        $facturas = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['data' => $facturas]);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Error al obtener las facturas: ' . $e->getMessage()]);
    }
}

function eliminarFactura($id_factura) {
    global $conn;
    try {
        $stmt = $conn->prepare("DELETE FROM FACTURA WHERE id_factura = :id_factura");
        $stmt->bindParam(':id_factura', $id_factura, PDO::PARAM_INT);
        $stmt->execute();
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Error al eliminar la factura: ' . $e->getMessage()]);
    }
}
?>
