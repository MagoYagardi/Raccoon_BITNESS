<?php

session_start();
require_once '../config/conexion.php'; // Asegúrate de tener una conexión a la base de datos en este archivo

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $correo = $_POST['correo'];
    $contrasena = $_POST['contrasena'];

    // Buscar el usuario en la base de datos
    $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE correo = ?");
    $stmt->execute([$correo]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($usuario) {
        // Verificar si la contraseña está hasheada con password_hash
        if (password_verify($contrasena, $usuario['contrasena'])) {
            $_SESSION['usuario_id'] = $usuario['id'];
            $_SESSION['correo'] = $usuario['correo'];
            $_SESSION['rol'] = $usuario['rol']; // Asegúrate de tener un campo rol en la base de datos

            echo json_encode(['status' => 'success', 'rol' => $usuario['rol']]);
        } else {
            // Verificar si la contraseña está hasheada con SHA2
            $sha2_hash = hash('sha256', $contrasena);
            if ($sha2_hash === $usuario['contrasena']) {
                $_SESSION['usuario_id'] = $usuario['id'];
                $_SESSION['correo'] = $usuario['correo'];
                $_SESSION['rol'] = $usuario['rol']; // Asegúrate de tener un campo rol en la base de datos

                echo json_encode(['status' => 'success', 'rol' => $usuario['rol']]);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Correo o contraseña incorrectos.']);
            }
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Correo o contraseña incorrectos.']);
    }
}
?>
