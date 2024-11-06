<?php
// Aquí se manejará todo lo relacionado con la suscripción mediante la relación Paga de Cliente a Suscripción
include '../../../../config/conexion.php';

header('Content-Type: application/json');

// Obtener datos de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

// Verificar el método HTTP
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET': // Obtener todas las suscripciones
        try {
            $query = "SELECT id_suscripcion_FK, id_usuario_FK, fecha_inicio, fecha_fin FROM Paga";
            $stmt = $conn->prepare($query);
            $stmt->execute();
            $suscripciones = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['success' => true, 'suscripciones' => $suscripciones]);
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Error al obtener las suscripciones: ' . $e->getMessage()]);
        }
        break;

    case 'PUT': // Actualizar una suscripción
        if (isset($data['id_suscripcion_FK']) && isset($data['id_usuario_FK']) && isset($data['fecha_inicio']) && isset($data['fecha_fin'])) {
            try {
                $query = "UPDATE Paga SET id_usuario_FK = :id_usuario_FK, fecha_inicio = :fecha_inicio, fecha_fin = :fecha_fin WHERE id_suscripcion_FK = :id_suscripcion_FK";
                $stmt = $conn->prepare($query);
                $stmt->bindParam(':id_suscripcion_FK', $data['id_suscripcion_FK']);
                $stmt->bindParam(':id_usuario_FK', $data['id_usuario_FK']);
                $stmt->bindParam(':fecha_inicio', $data['fecha_inicio']);
                $stmt->bindParam(':fecha_fin', $data['fecha_fin']);
                $stmt->execute();
                echo json_encode(['success' => true, 'message' => 'Suscripción actualizada correctamente']);
            } catch (PDOException $e) {
                echo json_encode(['success' => false, 'message' => 'Error al actualizar la suscripción: ' . $e->getMessage()]);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Datos incompletos para actualizar']);
        }
        break;

    case 'DELETE': // Eliminar una suscripción
        if (isset($data['id_suscripcion_FK'])) {
            try {
                $query = "DELETE FROM Paga WHERE id_suscripcion_FK = :id_suscripcion_FK";
                $stmt = $conn->prepare($query);
                $stmt->bindParam(':id_suscripcion_FK', $data['id_suscripcion_FK']);
                $stmt->execute();
                echo json_encode(value: ['success' => true, 'message' => 'Suscripción eliminada correctamente']);
            } catch (PDOException $e) {
                echo json_encode(['success' => false, 'message' => 'Error al eliminar la suscripción: ' . $e->getMessage()]);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'ID de suscripción no especificado']);
        }
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Método no soportado']);
        break;
}

?>