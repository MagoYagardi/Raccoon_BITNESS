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
    <title>Gestión de Usuarios</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="../estilos/admin1.css">
    <style>
        /* Estilos para el sidebar */
        .sidebar {
            height: 100%;
            width: 250px;
            position: fixed;
            top: 0;
            left: 0;
            background-color: #3E0D56;
            color: #FFD500;
            padding-top: 20px;
        }

        .sidebar a {
            padding: 10px 15px;
            text-decoration: none;
            font-size: 16px;
            color: #FFD500;
            display: block;
        }

        .sidebar a:hover {
            background-color: #26141D;
            color: #FFD500;
        }

        .welcome-background {
            margin-left: 250px;
            padding: 20px;
            background-color: white;
            min-height: 100vh;
        }

        .welcome-container {
            max-width: 1000px;
            margin: auto;
            background-color: white;
            border: 6px solid #7E70C2;

        }

        .modal-body label {
            color: #000000; /* Cambia los títulos de los campos (labels) a negro */
        }

        h1 {
            color: #3E0D56;
        }

        button {
            background-color: #B44DF2;
            color: #FFFFFF;
            margin-bottom: 20px;
        }

        button:hover {
            background-color: #7E70C2;
        }

        table {
            width: 100%;
            background-color: black;
            
        }

        thead {
            border: 1px solid black;
            border-radius: 3px;

        }

        th {
            color: #FFFFFF;
            text-align: center;
        }

        td {
            background-color: white;
            text-align: center;
        }

        .modal-header {
            background-color: #B44DF2;
            color: #FFFFFF;
        }

        .modal-title {
            color: #000000 !important; /* Forzamos el color negro */
        }

        h5 {
            color: #000000; /* Cambia los títulos h5 a negro */
        }


        .modal-body {
            background-color: #F2F2F2;
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

    <div class="welcome-background">
        <div class="welcome-container">
            <h1>Gestión de Usuarios</h1>
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#addUserModal">
                Agregar Usuario
            </button>
            
            <!-- Modal para agregar usuario -->
            <div class="modal fade" id="addUserModal" tabindex="-1" aria-labelledby="addUserModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="addUserModalLabel">Agregar Usuario</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form id="userForm">
                                <div class="mb-3">
                                    <label for="email" class="form-label">Email</label>
                                    <input type="email" class="form-control" id="email" required>
                                </div>
                                <div class="mb-3">
                                    <label for="nombre" class="form-label">Nombre</label>
                                    <input type="text" class="form-control" id="nombre" required>
                                </div>
                                <div class="mb-3">
                                    <label for="ci" class="form-label">CI</label>
                                    <input type="text" class="form-control" id="ci" required>
                                </div>
                                <div class="mb-3">
                                    <label for="altura" class="form-label">Altura (cm)</label>
                                    <input type="number" class="form-control" id="altura" required>
                                </div>
                                <div class="mb-3">
                                    <label for="password" class="form-label">Contraseña</label>
                                    <input type="password" class="form-control" id="password" required>
                                </div>
                                <div class="mb-3">
                                    <label for="rol" class="form-label">Rol</label>
                                    <select class="form-select" id="rol" required>
                                        <option value="admin">Administrador</option>
                                        <option value="cliente">Cliente</option>
                                        <option value="entrenador">Entrenador</option>
                                        <option value="contable">Contable</option>
                                    </select>
                                </div>
                                <button type="submit" class="btn btn-primary">Agregar Usuario</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <table class="table table-bordered mt-4" id="userTable">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Nombre</th>
                        <th>CI</th>
                        <th>Altura (cm)</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody id="userList">
                    <!-- Los usuarios se cargarán aquí dinámicamente -->
                </tbody>
            </table>
        </div>
    </div>

    <!-- Modal para editar usuario -->
    <div class="modal fade" id="editUserModal" tabindex="-1" aria-labelledby="editUserModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editUserModalLabel">Editar Usuario</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="editUserForm">
                        <input type="hidden" id="editUserId">
                        <div class="mb-3">
                            <label for="editEmail" class="form-label">Email</label>
                            <input type="email" class="form-control" id="editEmail" required>
                        </div>
                        <div class="mb-3">
                            <label for="editNombre" class="form-label">Nombre</label>
                            <input type="text" class="form-control" id="editNombre" required>
                        </div>
                        <div class="mb-3">
                            <label for="editCI" class="form-label">CI</label>
                            <input type="text" class="form-control" id="editCI" required>
                        </div>
                        <div class="mb-3">
                            <label for="editAltura" class="form-label">Altura (cm)</label>
                            <input type="number" class="form-control" id="editAltura" required>
                        </div>
                        <div class="mb-3">
                            <label for="editPassword" class="form-label">Contraseña (opcional, dejar vacío si no se desea cambiar)</label>
                            <input type="password" class="form-control" id="editPassword">
                        </div>
                        <div class="mb-3">
                            <label for="editRol" class="form-label">Rol</label>
                            <select class="form-select" id="editRol" required>
                                <option value="admin">Administrador</option>
                                <option value="cliente">Cliente</option>
                                <option value="entrenador">Entrenador</option>
                                <option value="contable">Contable</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary">Actualizar Usuario</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal para confirmar eliminación -->
    <div class="modal fade" id="deleteUserModal" tabindex="-1" aria-labelledby="deleteUserModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="deleteUserModalLabel">Eliminar Usuario</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p>¿Estás seguro de que deseas eliminar este usuario?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-danger" id="confirmDeleteButton">Eliminar</button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="../Controladores/crud_usuario.js"></script>
</body>
</html>