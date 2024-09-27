<?php
session_start();
require_once '../config/conexion.php'; // Asegúrate de tener una conexión a la base de datos en este archivo

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre_usuario = $_POST['nombre_usuario'];
    $correo = $_POST['correo'];
    $contrasena = $_POST['contrasena'];
    $confirmar_contrasena = $_POST['confirmar_contrasena'];

    if ($contrasena !== $confirmar_contrasena) {
        echo json_encode(['status' => 'error', 'message' => 'Las contraseñas no coinciden.']);
        exit;
    }

    // Verificar si el correo ya está registrado
    $stmt = $pdo->prepare("SELECT * FROM USUARIO WHERE correo = ?");
    $stmt->execute([$correo]);
    if ($stmt->fetch(PDO::FETCH_ASSOC)) {
        echo json_encode(['status' => 'error', 'message' => 'El correo ya está registrado.']);
        exit;
    }

    // Hashear la contraseña
    $hashed_contrasena = password_hash($contrasena, PASSWORD_BCRYPT);

    // Insertar el nuevo usuario en la base de datos
    $stmt = $pdo->prepare("INSERT INTO USUARIO (nombre_usuario, correo, contrasena, rol) VALUES (?, ?, ?, ?)");
    $rol = 'cliente'; // Asigna un rol por defecto o ajusta según tu lógica
    if ($stmt->execute([$nombre_usuario, $correo, $hashed_contrasena, $rol])) {
        $_SESSION['usuario_id'] = $pdo->lastInsertId();
        $_SESSION['correo'] = $correo;
        $_SESSION['rol'] = $rol; // Asigna el rol del nuevo usuario

        echo json_encode(['status' => 'success', 'message' => 'Registro exitoso.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error en el registro.']);
    }
}
?>
