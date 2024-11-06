<?php
include '../../../../config/conexion.php';

header('Content-Type: application/json');

// Obtener datos de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

// Verificar el método HTTP
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET': // Obtener todos los productos
        try {
            $query = "SELECT id_producto, id_sucursal, nombre, precio, descripcion, stock FROM PRODUCTO";
            $stmt = $conn->prepare($query);
            $stmt->execute();
            $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['success' => true, 'productos' => $productos]);
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Error al obtener los productos: ' . $e->getMessage()]);
        }
        break;

    case 'POST': // Insertar o actualizar producto
        $id_producto = isset($data['id_producto']) ? $data['id_producto'] : null;
        $id_sucursal = $data['id_sucursal'];
        $nombre = $data['nombre'];
        $precio = $data['precio'];
        $descripcion = $data['descripcion'];
        $stock = $data['stock'];

        // Validar que todos los datos sean válidos
        if (empty($id_sucursal) || empty($nombre) || !is_numeric($precio) || !is_numeric($stock)) {
            echo json_encode(['success' => false, 'message' => 'Datos inválidos.']);
            exit();
        }

        // Validar que la sucursal exista
        try {
            $sucursalQuery = "SELECT COUNT(*) FROM SUCURSAL WHERE id_sucursal = ?";
            $stmt = $conn->prepare($sucursalQuery);
            $stmt->execute([$id_sucursal]);
            $sucursalExists = $stmt->fetchColumn();

            if (!$sucursalExists) {
                echo json_encode(['success' => false, 'message' => 'La sucursal no existe.']);
                exit();
            }

            if ($id_producto) { // Actualizar
                $stmt = $conn->prepare("UPDATE PRODUCTO SET id_sucursal = ?, nombre = ?, precio = ?, descripcion = ?, stock = ? WHERE id_producto = ?");
                if ($stmt->execute([$id_sucursal, $nombre, $precio, $descripcion, $stock, $id_producto])) {
                    echo json_encode(['success' => true, 'message' => 'Producto actualizado correctamente.']);
                } else {
                    echo json_encode(['success' => false, 'message' => 'Error al actualizar el producto.']);
                }
            } else { // Insertar nuevo producto
                $stmt = $conn->prepare("INSERT INTO PRODUCTO (id_sucursal, nombre, precio, descripcion, stock) VALUES (?, ?, ?, ?, ?)");
                $stmt->execute([$id_sucursal, $nombre, $precio, $descripcion, $stock]);
                echo json_encode(['success' => true, 'message' => 'Producto creado correctamente.']);
            }
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Error al procesar la solicitud: ' . $e->getMessage()]);
        }
        break;

        case 'DELETE': // Eliminar producto
            if (isset($data['id_producto'])) {
                $id_producto = $data['id_producto'];
                try {
                    $stmt = $conn->prepare("DELETE FROM PRODUCTO WHERE id_producto = ?");
                    if ($stmt->execute([$id_producto])) {
                        echo json_encode(['success' => true, 'message' => 'Producto eliminado correctamente.']);
                    } else {
                        echo json_encode(['success' => false, 'message' => 'Error al eliminar el producto.']);
                    }
                } catch (PDOException $e) {
                    echo json_encode(['success' => false, 'message' => 'Error al eliminar el producto: ' . $e->getMessage()]);
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'ID del producto no proporcionado.']);
            }
            break;
        

    default:
        echo json_encode(['success' => false, 'message' => 'Método no soportado.']);
        break;
}
