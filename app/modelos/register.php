<?php
require_once __DIR__ . '/../config/conexion.php';
require_once __DIR__ . '/../modelos/user.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $password = $_POST['password'];
    $confirmPassword = $_POST['confirmPassword'];

    // Validaciones básicas
    if (empty($email) || empty($password) || empty($confirmPassword)) {
        echo json_encode(["success" => false, "message" => "Todos los campos son obligatorios."]);
        exit;
    }

    if ($password !== $confirmPassword) {
        echo json_encode(["success" => false, "message" => "Las contraseñas no coinciden."]);
        exit;
    }

    $conexion = new Conexion();
    $db = $conexion->getConexion();

    $user = new User($db);
    $user->email = $email;
    $user->password = password_hash($password, PASSWORD_DEFAULT); // Encripta la contraseña
    $user->role = 'cliente'; // Asigna el rol por defecto

    if ($user->emailExists()) {
        echo json_encode(["success" => false, "message" => "El email ya está registrado."]);
    } else {
        if ($user->create()) {
            echo json_encode(["success" => true, "message" => "Registro exitoso."]);
        } else {
            echo json_encode(["success" => false, "message" => "Error al registrar el usuario."]);
        }
    }
}
?>
