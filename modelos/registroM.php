<?php
include '../config/conexion.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nombre_usuario = $_POST['nombre_usuario'];
    $correo = $_POST['correo'];
    $contrasena = $_POST['contrasena'];

    // Validar campos vacíos
    if (empty($nombre_usuario) || empty($correo) || empty($contrasena)) {
        echo json_encode(['status' => 'error', 'message' => 'Todos los campos son obligatorios.']);
        exit();
    }

    // Verificar si el correo ya está registrado
    $query = $conn->prepare("SELECT * FROM USUARIO WHERE email = :correo");
    $query->bindParam(':correo', $correo);
    $query->execute();

    if ($query->rowCount() > 0) {
        echo json_encode(['status' => 'error', 'message' => 'El correo ya está registrado']);
        exit();
    }

    // Hash de la contraseña
    $hash_password = password_hash($contrasena, PASSWORD_BCRYPT);

    // Insertar nuevo usuario
    $query = $conn->prepare("INSERT INTO USUARIO (email, contraseña, nombre, rol) VALUES (:correo, :contrasena, :nombre_usuario, 'cliente')");
    $query->bindParam(':correo', $correo);
    $query->bindParam(':contrasena', $hash_password);
    $query->bindParam(':nombre_usuario', $nombre_usuario);

    if ($query->execute()) {
        // Iniciar sesión automáticamente después del registro
        session_start();
        $_SESSION['usuario'] = $nombre_usuario;
        $_SESSION['email'] = $correo;

        // Enviar respuesta JSON
        echo json_encode(['status' => 'success', 'message' => 'Registro exitoso']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error al registrar el usuario']);
    }
}
?>
