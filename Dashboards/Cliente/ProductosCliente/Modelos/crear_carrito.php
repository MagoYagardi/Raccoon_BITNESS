<?php
// crear_carrito.php
require '../../../../config/conexion.php';

// Establecer el tipo de contenido de la respuesta como JSON
header('Content-Type: application/json');

// Hardcodeamos el id_usuario por ahora
$id_usuario = 1; // Ejemplo hardcodeado

try {
    // Verificamos si hay al menos un producto con stock disponible en la base de datos
    $stmt = $conn->prepare("SELECT COUNT(*) AS total_productos_con_stock FROM PRODUCTO WHERE stock > 0");
    $stmt->execute();
    $result = $stmt->fetch();

    // Si no hay productos con stock disponible, no creamos el carrito
    if ($result['total_productos_con_stock'] == 0) {
        echo json_encode(['success' => false, 'message' => 'No hay productos disponibles en stock']);
        exit;
    }

    // Insertamos el carrito vacío con cant_productos y precio_total en 0
    $stmt = $conn->prepare("INSERT INTO CARRITO (id_usuario, estado, cant_productos, precio_total, fecha_add) 
                            VALUES (?, 2, 0, 0, NOW())");
    $stmt->execute([$id_usuario]);

    // Obtener el ID del carrito recién creado
    $id_carrito = $conn->lastInsertId();

    // Verificamos si el ID se generó correctamente
    if ($id_carrito) {
        echo json_encode(['success' => true, 'id_carrito' => $id_carrito]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al obtener el ID del carrito']);
    }

} catch (PDOException $e) {
    // Enviar mensaje de error si hay una excepción
    echo json_encode(['success' => false, 'message' => 'Error al crear el carrito: ' . $e->getMessage()]);
}
?>
