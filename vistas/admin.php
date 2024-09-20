<?php
session_start();

// Verificar si el usuario está autenticado y si es administrador
if (!isset($_SESSION['usuario']) || $_SESSION['rol'] !== 'admin') {
    header("Location: ../modelos/loginM.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <link rel="stylesheet" href="../estilos/admin.css">
</head>
<body>
    <div class="dashboard-container">
        <!-- Menú lateral -->
        <nav class="sidebar">
            <h2>Admin Dashboard</h2>
            <ul>
                <li><a href="#" id="dashboard">Inicio</a></li>
                <li><a href="#" id="manageUsers">Gestión de Usuarios</a></li>
                <li><a href="#" id="manageClasses">Gestión de Clases</a></li>
                <li><a href="#" id="manageProducts">Gestión de Productos</a></li>
                <li><a href="#" id="viewReports">Ver Reportes</a></li>
                <li><a href="../modelos/logout.php">Cerrar Sesión</a></li>
            </ul>
        </nav>

        <!-- Área de contenido principal -->
        <div class="main-content">
            <header class="dashboard-header">
                <h1>Bienvenido, <?php echo $_SESSION['usuario']; ?> (Admin)</h1>
            </header>

            <div id="dashboardContent">
                <!-- Sección inicial -->
                <section id="inicioSection">
                    <h2>Panel de Control</h2>
                    <p>Bienvenido al panel de administración. Usa el menú para gestionar diferentes áreas del sistema.</p>
                </section>

                <!-- Gestión de Usuarios -->
                <section id="manageUsersSection" style="display: none;">
                    <h2>Gestión de Usuarios</h2>
                    <div class="user-actions">
                        <button class="btn-action" id="addUser">Agregar Usuario</button>
                        <button class="btn-action" id="updateUser">Actualizar Usuario</button>
                        <button class="btn-action" id="listUsers">Listar Usuarios</button>
                        <button class="btn-action" id="deleteUser">Borrar Usuario</button>
                    </div>

                    <!-- Tabla de usuarios -->
                    <table class="styled-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="userTable">
                            <!-- Aquí se insertarán los usuarios vía JavaScript -->
                        </tbody>
                    </table>
                </section>

                <!-- Gestión de Clases -->
                <section id="manageClassesSection" style="display: none;">
                    <h2>Gestión de Clases</h2>
                </section>

                <!-- Gestión de Productos -->
                <section id="manageProductsSection" style="display: none;">
                    <h2>Gestión de Productos</h2>
                </section>

                <!-- Ver Reportes -->
                <section id="viewReportsSection" style="display: none;">
                    <h2>Reportes</h2>
                </section>
            </div>
        </div>
    </div>

    <script src="../controladores/admin.js"></script>
</body>
</html>
