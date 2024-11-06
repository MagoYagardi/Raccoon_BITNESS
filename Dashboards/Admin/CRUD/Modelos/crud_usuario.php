<?php
include '../../../../config/conexion.php';

header('Content-Type: application/json');

// Obtener datos de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

// Verificar el método HTTP
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET': // Obtener todos los usuarios
        try {
            $query = "SELECT id_usuario, email, nombre, ci, altura, rol FROM USUARIO";
            $stmt = $conn->prepare($query);
            $stmt->execute();
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['users' => $users]);
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

        case 'PUT': // Actualizar usuario
            if (isset($data['id_usuario'])) { 
                $id_usuario = $data['id_usuario'];
                $email = $data['email'];
                $nombre = $data['nombre'];
                $ci = $data['ci'];
                $altura = $data['altura'];
                $rol = $data['rol'];
        
                // Validar que todos los datos sean válidos, excepto la contraseña
                if (empty($id_usuario) || empty($email) || empty($nombre) || empty($ci) || empty($altura) || empty($rol)) {
                    echo json_encode(['success' => false, 'message' => 'Datos inválidos.']);
                    exit();
                }
        
                try {
                    // Verificar si el email ya existe en otro usuario
                    $stmt = $conn->prepare("SELECT COUNT(*) FROM USUARIO WHERE email = ? AND id_usuario != ?");
                    $stmt->execute([$email, $id_usuario]);
                    $count = $stmt->fetchColumn();
        
                    if ($count > 0) {
                        echo json_encode(['success' => false, 'message' => 'El email ya está en uso por otro usuario.']);
                        exit();
                    }
        
                    // Actualizar sin modificar la contraseña
                    $query = "UPDATE USUARIO SET email = ?, nombre = ?, ci = ?, altura = ?, rol = ? WHERE id_usuario = ?";
                    $params = [$email, $nombre, $ci, $altura, $rol, $id_usuario];
        
                    // Verificar si se proporcionó una nueva contraseña
                    if (!empty($data['password'])) {
                        $password = password_hash($data['password'], PASSWORD_DEFAULT);
                        $query = "UPDATE USUARIO SET email = ?, nombre = ?, ci = ?, altura = ?, rol = ?, contraseña = ? WHERE id_usuario = ?";
                        $params = [$email, $nombre, $ci, $altura, $rol, $password, $id_usuario];
                    }
        
                    $stmt = $conn->prepare($query);
                    if ($stmt->execute($params)) {
                        echo json_encode(['success' => true, 'message' => 'Usuario actualizado correctamente.']);
                    } else {
                        echo json_encode(['success' => false, 'message' => 'Error al actualizar el usuario.']);
                    }
                } catch (PDOException $e) {
                    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'ID de usuario no proporcionado.']);
            }
            break;
        
    case 'POST': // Insertar nuevo usuario
        $email = $data['email'];
        $password = password_hash($data['password'], PASSWORD_DEFAULT);
        $nombre = $data['nombre'];
        $ci = $data['ci'];
        $altura = $data['altura'];
        $rol = $data['rol'];

        // Validar que todos los datos sean válidos
        if (empty($email) || empty($nombre) || empty($ci) || empty($altura) || empty($rol)) {
            echo json_encode(['success' => false, 'message' => 'Datos inválidos.']);
            exit();
        }

        try {
            $stmt = $conn->prepare("INSERT INTO USUARIO (email, contraseña, nombre, ci, altura, rol) VALUES (:email, :password, :nombre, :ci, :altura, :rol)");
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':password', $password);
            $stmt->bindParam(':nombre', $nombre);
            $stmt->bindParam(':ci', $ci);
            $stmt->bindParam(':altura', $altura);
            $stmt->bindParam(':rol', $rol);
            $stmt->execute();
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    case 'DELETE': // Eliminar usuario
        if (isset($data['id_usuario'])) {
            $id_usuario = $data['id_usuario'];

            // Validar ID de usuario
            if (empty($id_usuario) || !is_numeric($id_usuario)) {
                echo json_encode(['success' => false, 'message' => 'ID de usuario inválido.']);
                exit();
            }

            try {
                $stmt = $conn->prepare("DELETE FROM USUARIO WHERE id_usuario = ?");
                if ($stmt->execute([$id_usuario])) {
                    echo json_encode(['success' => true, 'message' => 'Usuario eliminado correctamente.']);
                } else {
                    echo json_encode(['success' => false, 'message' => 'Error al eliminar el usuario.']);
                }
            } catch (Exception $e) {
                echo json_encode(['success' => false, 'message' => 'Error en la base de datos: ' . $e->getMessage()]);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'ID de usuario no proporcionado.']);
        }
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Método no soportado.']);
        break;
}
?>
