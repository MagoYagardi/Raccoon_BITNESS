<?php
// Obtener los datos enviados en formato JSON
$data = json_decode(file_get_contents('php://input'), true);

// Verificar si los parámetros necesarios han sido enviados
if (isset($data['idCarrito'], $data['idProducto'], $data['cantidad'])) {
    $idCarrito = $data['idCarrito'];
    $idProducto = $data['idProducto'];
    $cantidad = $data['cantidad'];

    // Validar la cantidad (asegurarse de que sea un número entero positivo)
    if (filter_var($cantidad, FILTER_VALIDATE_INT) === false || $cantidad <= 0) {
        echo json_encode(['error' => 'Cantidad no válida']);
        exit;
    }

    // Conectar a la base de datos usando PDO
    include '../../../../config/conexion.php'; // Asegúrate de que el archivo de conexión configure PDO correctamente en $pdo

    try {
        // Paso 1: Obtener el precio del producto
        $queryPrecio = "SELECT precio FROM Producto WHERE id_producto = :id_producto";
        $stmtPrecio = $conn->prepare($queryPrecio);
        $stmtPrecio->bindParam(':id_producto', $idProducto, PDO::PARAM_INT);
        $stmtPrecio->execute();
        $rowPrecio = $stmtPrecio->fetch(PDO::FETCH_ASSOC);

        // Verificar si se encontró el precio del producto
        if (!$rowPrecio) {
            echo json_encode(['error' => 'Producto no encontrado']);
            exit;
        }

        $precio = $rowPrecio['precio'];

        // Paso 2: Actualizar la cantidad del producto en la tabla 'Contiene'
        $query = "UPDATE Contiene SET cantidad = :cantidad WHERE id_carrito_FK = :id_carrito AND id_producto_FK = :id_producto";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':cantidad', $cantidad, PDO::PARAM_INT);
        $stmt->bindParam(':id_carrito', $idCarrito, PDO::PARAM_INT);
        $stmt->bindParam(':id_producto', $idProducto, PDO::PARAM_INT);
        $stmt->execute();

        // Verificar si la actualización fue exitosa
        if ($stmt->rowCount() > 0) {
            // Paso 3: Calcular el precio total de este producto basado en la nueva cantidad
            $precioTotalProducto = $cantidad * $precio;

            // Paso 4: Recalcular la cantidad total de productos en el carrito
            $queryTotalProductos = "SELECT SUM(cantidad) AS cant_productos FROM Contiene WHERE id_carrito_FK = :id_carrito";
            $stmtTotal = $conn->prepare($queryTotalProductos);
            $stmtTotal->bindParam(':id_carrito', $idCarrito, PDO::PARAM_INT);
            $stmtTotal->execute();
            $row = $stmtTotal->fetch(PDO::FETCH_ASSOC);
            $totalProductos = $row['cant_productos'];

            // Paso 5: Recalcular el precio total del carrito
            $queryTotalCarrito = "SELECT SUM(cantidad * precio) AS total_carrito FROM Contiene c
                                  JOIN Producto p ON c.id_producto_FK = p.id_producto
                                  WHERE c.id_carrito_FK = :id_carrito";
            $stmtTotalCarrito = $conn->prepare($queryTotalCarrito);
            $stmtTotalCarrito->bindParam(':id_carrito', $idCarrito, PDO::PARAM_INT);
            $stmtTotalCarrito->execute();
            $rowCarrito = $stmtTotalCarrito->fetch(PDO::FETCH_ASSOC);
            $totalCarrito = $rowCarrito['total_carrito'];

            // Paso 6: Actualizar el campo 'cant_productos' y 'precio_total' en la tabla 'CARRITO'
            $queryActualizarCarrito = "UPDATE CARRITO SET cant_productos = :cant_productos, precio_total = :precio_total WHERE id_carrito = :id_carrito";
            $stmtActualizar = $conn->prepare($queryActualizarCarrito);
            $stmtActualizar->bindParam(':cant_productos', $totalProductos, PDO::PARAM_INT);
            $stmtActualizar->bindParam(':precio_total', $totalCarrito, PDO::PARAM_STR);
            $stmtActualizar->bindParam(':id_carrito', $idCarrito, PDO::PARAM_INT);
            $stmtActualizar->execute();

            // Verificar si se actualizó correctamente
            if ($stmtActualizar->rowCount() > 0) {
                echo json_encode(['success' => true, 'message' => 'Producto actualizado correctamente, cantidad total de productos y precio total actualizados']);
            } else {
                echo json_encode(['error' => 'No se pudo actualizar el total de productos o el precio total en el carrito']);
            }
        } else {
            echo json_encode(['error' => 'No se pudo actualizar el producto o no hubo cambios']);
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
    }

} else {
    // Si faltan parámetros
    echo json_encode(['error' => 'Faltan parámetros necesarios']);
}
?>
