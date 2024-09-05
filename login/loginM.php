<?php
require_once __DIR__ . '/../config/conexion.php';
require_once __DIR__ . '/../modelos/user.php';

session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $conexion = new Conexion();
    $db = $conexion->getConexion();

    $user = new User($db);
    $user->email = $email;
    $user->password = $password;

    if ($user->login()) {
        $_SESSION['user_id'] = $user->id;
        $_SESSION['user_role'] = $user->role;
        header("Location: dashboard.php");
        exit;
    } else {
        echo "Email o contraseña incorrectos.";
    }
}
?>
