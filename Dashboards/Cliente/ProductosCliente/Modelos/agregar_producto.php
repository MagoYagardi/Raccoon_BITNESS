<?php
require '../../../../config/conexion.php';
header('Content-Type: application/json');

// Variables recibidas por GET
$id_usuario = 1; // Ejemplo hardcodeado, reemplazar con ID real del usuario
$id_producto = $_GET['id_producto'];
$cantidad = $_GET['cantidad'];

// Paso 1: Verificar que haya al menos un producto con stock disponible
$stmt = $conn->prepare("SELECT COUNT(*) AS total_productos_con_stock FROM PRODUCTO WHERE stock > 0");
$stmt->execute();
$result = $stmt->fetch();

if ($result['total_productos_con_stock'] == 0) {
    echo json_encode(['success' => false, 'message' => 'No hay productos disponibles en stock']);
    exit;
}

// Paso 2: Verificar si el usuario ya tiene un carrito activo
$stmt = $conn->prepare("SELECT id_carrito FROM CARRITO WHERE id_usuario = ? AND estado = 2"); // estado 2 = "abierto"
$stmt->execute([$id_usuario]);
$carrito = $stmt->fetch();

if ($carrito) {
    $id_carrito = $carrito['id_carrito'];
} else {
    // Si no hay carrito activo, crear uno nuevo
    $stmt = $conn->prepare("INSERT INTO CARRITO (id_usuario, estado, cant_productos, precio_total, fecha_add) 
                            VALUES (?, 2, 0, 0, NOW())");
    $stmt->execute([$id_usuario]);
    $id_carrito = $conn->lastInsertId();

    if (!$id_carrito) {
        echo json_encode(['success' => false, 'message' => 'Error al crear el carrito']);
        exit;
    }
}

// Paso 3: Verificar que el producto existe y tiene suficiente stock
$stmt = $conn->prepare("SELECT precio, stock FROM PRODUCTO WHERE id_producto = ?");
$stmt->execute([$id_producto]);
$producto = $stmt->fetch();

if (!$producto) {
    echo json_encode(['success' => false, 'message' => 'Producto no encontrado']);
    exit;
}

$precio_producto = $producto['precio'];
$stock_producto = $producto['stock'];

if ($cantidad > $stock_producto) {
    echo json_encode(['success' => false, 'message' => 'Stock insuficiente']);
    exit;
}

// Paso 4: Verificar si el producto ya está en el carrito
$stmt = $conn->prepare("SELECT cantidad FROM Contiene WHERE id_carrito_FK = ? AND id_producto_FK = ?");
$stmt->execute([$id_carrito, $id_producto]);
$productoExistente = $stmt->fetch();

if ($productoExistente) {
    // Si ya está en el carrito, actualizar la cantidad
    $nuevaCantidad = $productoExistente['cantidad'] + $cantidad;
    $stmt = $conn->prepare("UPDATE Contiene SET cantidad = ? WHERE id_carrito_FK = ? AND id_producto_FK = ?");
    $stmt->execute([$nuevaCantidad, $id_carrito, $id_producto]);
} else {
    // Si no está en el carrito, agregar el producto
    $stmt = $conn->prepare("INSERT INTO Contiene (id_carrito_FK, id_producto_FK, cantidad) VALUES (?, ?, ?)");
    $stmt->execute([$id_carrito, $id_producto, $cantidad]);
}

// Paso 5: Actualizar el total de productos y precio en el carrito
$stmt = $conn->prepare("SELECT cant_productos, precio_total FROM CARRITO WHERE id_carrito = ?");
$stmt->execute([$id_carrito]);
$carrito = $stmt->fetch();

// Aquí calculamos la nueva cantidad total y el precio total
$nuevaCantidadCarrito = $carrito['cant_productos'] + $cantidad;
$nuevoPrecioTotal = $carrito['precio_total'] + ($precio_producto * $cantidad);

// Actualizamos el carrito con los nuevos valores
$stmt = $conn->prepare("UPDATE CARRITO SET cant_productos = ?, precio_total = ? WHERE id_carrito = ?");
$stmt->execute([$nuevaCantidadCarrito, $nuevoPrecioTotal, $id_carrito]);

echo json_encode(['success' => true, 'id_carrito' => $id_carrito]);
?>
