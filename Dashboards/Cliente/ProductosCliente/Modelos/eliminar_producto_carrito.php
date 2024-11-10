<?php
// Establecer cabeceras para aceptar solicitudes de tipo JSON
header('Content-Type: application/json');

// Obtener los datos de la solicitud POST
$inputData = json_decode(file_get_contents('php://input'), true);

// Verificar si se han recibido los parámetros necesarios
if (!isset($inputData['idCarrito']) || !isset($inputData['idProducto'])) {
    echo json_encode(['error' => 'Faltan parámetros necesarios']);
    http_response_code(400); // Solicitud incorrecta
    exit();
}

$idCarrito = $inputData['idCarrito'];
$idProducto = $inputData['idProducto'];

// Incluir el archivo de conexión a la base de datos
// Asegúrate de tener una base de datos configurada y la conexión preparada
include('../../../../config/conexion.php');

try {
    // Verificar que el carrito existe
    $query = "SELECT * FROM CARRITO WHERE id_carrito = :idCarrito";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':idCarrito', $idCarrito, PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() === 0) {
        echo json_encode(['error' => 'Carrito no encontrado']);
        http_response_code(404); // No encontrado
        exit();
    }

    // El carrito existe, ahora eliminar el producto
    $query = "DELETE FROM Contiene WHERE id_carrito_FK = :idCarrito AND id_producto_FK = :idProducto";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':idCarrito', $idCarrito, PDO::PARAM_INT);
    $stmt->bindParam(':idProducto', $idProducto, PDO::PARAM_INT);
    $stmt->execute();

    // Verificar si el producto fue eliminado
    if ($stmt->rowCount() > 0) {
        // Comprobar si el carrito tiene productos restantes
        $query = "SELECT COUNT(*) FROM Contiene WHERE id_carrito_FK = :idCarrito";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':idCarrito', $idCarrito, PDO::PARAM_INT);
        $stmt->execute();
        $rowCount = $stmt->fetchColumn();

        // Si no hay más productos en el carrito, cambiar el estado del carrito a "cancelado"
        if ($rowCount === 0) {
            // Actualizar el estado del carrito a 3 (cancelado)
            $query = "UPDATE CARRITO SET estado = 3 WHERE id_carrito = :idCarrito";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':idCarrito', $idCarrito, PDO::PARAM_INT);
            $stmt->execute();
            echo json_encode(['message' => 'Carrito vacío, estado cambiado a cancelado']);
        } else {
            echo json_encode(['message' => 'Producto eliminado correctamente']);
        }
    } else {
        echo json_encode(['error' => 'No se encontró el producto en el carrito']);
        http_response_code(404); // No encontrado
    }
} catch (PDOException $e) {
    // En caso de error con la base de datos
    echo json_encode(['error' => 'Error al procesar la solicitud: ' . $e->getMessage()]);
    http_response_code(500); // Error interno del servidor
}

// Cerrar la conexión
$conn = null;
?>
