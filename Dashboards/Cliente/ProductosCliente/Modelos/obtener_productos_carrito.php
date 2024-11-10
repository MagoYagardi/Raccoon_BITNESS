<?php
header('Content-Type: application/json');
// Conectar a la base de datos
require '../../../../config/conexion.php';

// Asegurarse de que id_carrito esté presente
$id_carrito = $_GET['id_carrito'] ?? null;

if (!$id_carrito) {
    echo json_encode(["error" => "id_carrito no especificado"]);
    exit;
}

// Definir la consulta SQL para obtener los productos del carrito y calcular el precio total
$query = "SELECT p.id_producto, p.nombre, p.precio, p.imagen_url, c.cantidad,
                 (p.precio * c.cantidad) AS precio_total_producto
          FROM Contiene c
          JOIN PRODUCTO p ON c.id_producto_FK = p.id_producto
          WHERE c.id_carrito_FK = :id_carrito";

$stmt = $conn->prepare($query);
$stmt->bindParam(':id_carrito', $id_carrito, PDO::PARAM_INT);
$stmt->execute();
$result = $stmt->fetchAll(PDO::FETCH_ASSOC);

$productos = [];
$precio_total = 0;

// Recorre cada fila de resultados y añade al array de productos, calculando el precio total
foreach ($result as $row) {
    $precio_total += $row['precio_total_producto']; // Sumar el precio total del producto
    $productos[] = [
        'id_producto' => $row['id_producto'],
        'nombre' => $row['nombre'],
        'precio' => $row['precio'],
        'imagen_url' => $row['imagen_url'],
        'cantidad' => $row['cantidad']
    ];    
}

// Enviar la respuesta como JSON, incluyendo el precio total
echo json_encode(["productos" => $productos, "precio_total" => $precio_total]);
?>
