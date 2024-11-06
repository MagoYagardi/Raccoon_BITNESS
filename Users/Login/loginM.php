<?php 
include '../../config/conexion.php';

if($_SERVER['REQUEST_METHOD'] == 'POST') {
    $correo = $_POST['correo'];
    $contrasena = $_POST['contrasena'];

    // Validar campos vacíos
    if (empty($correo) || empty($contrasena)) {
        echo json_encode(['status' => 'error', 'message' => 'Todos los campos son obligatorios']);
        exit();
    }

    // Buscar el usuario por correo
    $query = $conn->prepare("SELECT * FROM USUARIO WHERE email = :correo");
    $query->bindParam(':correo', $correo);
    $query->execute();
    $usuario = $query->fetch(PDO::FETCH_ASSOC);

    if ($usuario) {
        // Verificar si la contraseña está hasheada con password_hash (por ejemplo, bcrypt)
        if (password_verify($contrasena, $usuario['contraseña'])) {
            iniciarSesion($usuario);
        } else {
            // Verificar si la contraseña está hasheada con SHA2
            $sha2_hash = hash('sha256', $contrasena);
            if ($sha2_hash === $usuario['contraseña']) {
                iniciarSesion($usuario);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Correo o contraseña incorrectos.']);
            }
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Correo o contraseña incorrectos.']);
    }
}

function iniciarSesion($usuario) {
    session_start();
    $_SESSION['usuario'] = $usuario['nombre'];
    $_SESSION['email'] = $usuario['email'];
    $_SESSION['rol'] = $usuario['rol'];

    // Redirigir según el rol
    echo json_encode(['status' => 'success', 'rol' => $usuario['rol']]);
}
