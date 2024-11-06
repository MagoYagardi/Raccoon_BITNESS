<?php
session_start();
if (!isset($_SESSION['usuario']) || $_SESSION['rol'] !== 'admin') {
    header("Location: ../../../../Pages/Landing/landingV.html");
    exit();
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Admin</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        .sidebar {
            height: 100%;
            width: 250px;
            position: fixed;
            top: 0;
            left: 0;
            background-color: #4B2C8D;
            color: #F2E65B;
            padding-top: 20px;
            box-shadow: 2px 0 5px rgba(0,0,0,0.5);
        }
        .sidebar a {
            padding: 15px 20px;
            text-decoration: none;
            font-size: 18px;
            color: #F2E65B;
            display: block;
            transition: background-color 0.3s;
        }
        .sidebar a:hover {
            background-color: #3A1A4C;
            color: #FFD700;
        }
        .content {
            margin-left: 250px;
            padding: 30px;
            background-color: #EAEAEA;
            min-height: 100vh;
            transition: margin-left 0.3s;
        }
        h1 {
            color: #4B2C8D;
            font-size: 2.5rem;
            margin-bottom: 20px;
        }
        p {
            color: #4B2C8D;
            font-size: 1.2rem;
        }
        .btn-danger {
            background-color: #FF3B5B;
            color: #FFFFFF;
            font-weight: bold;
        }
        .btn-danger:hover {
            background-color: #C62839;
            transition: background-color 0.3s;
        }
        .btn {
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <div class="sidebar">
        <a href="admin.php">Inicio</a>
        <a href="gestion_usuarios.php">Gestión de Usuarios</a>
        <a href="gestion_productos.php">Gestión de Productos</a>
        <a href="gestion_suscripciones.html">Gestión de Suscripciones</a>
        <a href="gestion_sucursales.php">Gestión de Sucursales</a>
        <a href="gestion_clases.php">Gestión de Clases</a>
        <a href="gestion_facturacion.php">Ver Facturación</a>
        <a href="../../../../Users/Sesiones/logout.php" class="btn btn-danger">Cerrar Sesión</a>
    </div>

    <div class="content">
        <div class="container">
            <h1>Bienvenido al Panel de Administración</h1>
            <p>Como administrador, puedes gestionar todos los aspectos del sistema.</p>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>