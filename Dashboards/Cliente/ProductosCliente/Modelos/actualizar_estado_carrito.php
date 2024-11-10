<?php
// Incluir la conexión a la base de datos
include '../../../../config/conexion.php';

try {
    // Obtener los datos del cuerpo de la solicitud
    $data = json_decode(file_get_contents('php://input'), true);

    // Verificar que los datos necesarios estén presentes
    if (isset($data['id_carrito']) && isset($data['estado'])) {
        $id_carrito = $data['id_carrito'];
        $estado = $data['estado'];

        // Preparar la consulta SQL para actualizar el estado del carrito
        $query = "UPDATE CARRITO SET estado = :estado WHERE id_carrito = :id_carrito";
        $stmt = $conn->prepare($query);

        // Vincular los parámetros
        $stmt->bindParam(':estado', $estado, PDO::PARAM_INT);
        $stmt->bindParam(':id_carrito', $id_carrito, PDO::PARAM_INT);

        // Ejecutar la consulta
        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al actualizar el estado del carrito.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Datos insuficientes para realizar la actualización.']);
    }
} catch (PDOException $e) {
    // Capturar cualquier error de PDO y devolver el mensaje
    echo json_encode(['success' => false, 'message' => 'Error en la base de datos: ' . $e->getMessage()]);
}
?>
