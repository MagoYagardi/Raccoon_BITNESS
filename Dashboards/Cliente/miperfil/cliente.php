<?php
session_start();

// Verificar si el usuario está autenticado y si es cliente
if (!isset($_SESSION['usuario']) || $_SESSION['rol'] !== 'cliente') {
    header("Location: ../../Pages/Landing/landingV.html");
    exit();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Página Cliente</title>
    <link rel="stylesheet" href="cliente.css">
</head>
<body>

    <div class="container">
        <div class="welcome-message">
            <?php echo "Bienvenido, " . $_SESSION['email']; ?>
        </div>
        <h1>Panel de Usuario</h1>
        <p>Aquí puedes gestionar tu cuenta, ver tu información personal y más. Explora todas las funcionalidades disponibles para mejorar tu experiencia.</p>
        
        <!-- Botón de cierre de sesión -->
        <a href="../../Users/Sesiones/logout.php">Cerrar Sesión</a>
    </div>

</body>
</html>
