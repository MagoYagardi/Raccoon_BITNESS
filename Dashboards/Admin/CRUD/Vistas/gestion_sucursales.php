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
    <title>Gestión de Sucursales</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
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
            max-width: 1200px;
            margin: auto;
            background-color: white;
            border: 6px solid #7E70C2;
            padding: 20px;
        }

        .modal-body label {
            color: #000000;
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
            color: #000000 !important;
        }

        h5 {
            color: #000000;
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
            <h1>Gestión de Sucursales</h1>
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#addBranchModal">
                Agregar Sucursal
            </button>
            
            <!-- Modal para agregar sucursal -->
            <div class="modal fade" id="addBranchModal" tabindex="-1" aria-labelledby="addBranchModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="addBranchModalLabel">Agregar Sucursal</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form id="branchForm">
                                <div class="mb-3">
                                    <label for="branchName" class="form-label">Nombre</label>
                                    <input type="text" class="form-control" id="branchName" required>
                                </div>
                                <div class="mb-3">
                                    <label for="branchStreet" class="form-label">Calle</label>
                                    <input type="text" class="form-control" id="branchStreet" required>
                                </div>
                                <div class="mb-3">
                                    <label for="branchLocality" class="form-label">Localidad</label>
                                    <input type="text" class="form-control" id="branchLocality" required>
                                </div>
                                <div class="mb-3">
                                    <label for="branchCity" class="form-label">Ciudad</label>
                                    <input type="text" class="form-control" id="branchCity" required>
                                </div>
                                <div class="mb-3">
                                    <label for="branchPostalCode" class="form-label">Código Postal</label>
                                    <input type="text" class="form-control" id="branchPostalCode" required>
                                </div>
                                <div class="mb-3">
                                    <label for="branchPhone" class="form-label">Teléfono</label>
                                    <input type="tel" class="form-control" id="branchPhone" required>
                                </div>
                                <div class="mb-3">
                                    <label for="branchOpeningHour" class="form-label">Horario de Apertura</label>
                                    <input type="time" class="form-control" id="branchOpeningHour" required>
                                </div>
                                <div class="mb-3">
                                    <label for="branchClosingHour" class="form-label">Horario de Cierre</label>
                                    <input type="time" class="form-control" id="branchClosingHour" required>
                                </div>
                                <div class="mb-3">
                                    <label for="branchLatitud" class="form-label">Latitud</label>
                                    <input type="float" class="form-control" id="branchLatitud" required>
                                </div>
                                <div class="mb-3">
                                    <label for="branchLongitud" class="form-label">Longitud</label>
                                    <input type="float" class="form-control" id="branchLongitud" required>
                                </div>
                                <button type="submit" class="btn btn-primary">Agregar Sucursal</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <table class="table table-bordered mt-4" id="branchTable">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Calle</th>
                        <th>Localidad</th>
                        <th>Ciudad</th>
                        <th>Código Postal</th>
                        <th>Teléfono</th>
                        <th>Horario Apertura</th>
                        <th>Horario Cierre</th>
                        <th>Latitud</th>
                        <th>Longitud</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody id="branchList">
                    <!-- Las sucursales se cargarán aquí dinámicamente -->
                </tbody>
            </table>
        </div>
    </div>

    <!-- Modal para Editar Sucursal -->
    <div class="modal fade" id="editBranchModal" tabindex="-1" aria-labelledby="editBranchModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editBranchModalLabel">Editar Sucursal</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="editBranchForm">
                        <input type="hidden" id="editBranchId">
                        <div class="mb-3">
                            <label for="editNombre" class="form-label">Nombre</label>
                            <input type="text" class="form-control" id="editNombre" required>
                        </div>
                        <div class="mb-3">
                            <label for="editCalle" class="form-label">Calle</label>
                            <input type="text" class="form-control" id="editCalle" required>
                        </div>
                        <div class="mb-3">
                            <label for="editLocalidad" class="form-label">Localidad</label>
                            <input type="text" class="form-control" id="editLocalidad" required>
                        </div>
                        <div class="mb-3">
                            <label for="editCiudad" class="form-label">Ciudad</label>
                            <input type="text" class="form-control" id="editCiudad" required>
                        </div>
                        <div class="mb-3">
                            <label for="editCodigoPostal" class="form-label">Código Postal</label>
                            <input type="text" class="form-control" id="editCodigoPostal" required>
                        </div>
                        <div class="mb-3">
                            <label for="editTelefono" class="form-label">Teléfono</label>
                            <input type="tel" class="form-control" id="editTelefono" required>
                        </div>
                        <div class="mb-3">
                            <label for="editHorarioApertura" class="form-label">Horario de Apertura</label>
                            <input type="time" class="form-control" id="editHorarioApertura" required>
                        </div>
                        <div class="mb-3">
                            <label for="editHorarioCierre" class="form-label">Horario de Cierre</label>
                            <input type="time" class="form-control" id="editHorarioCierre" required>
                        </div>
                        <div class="mb-3">
                            <label for="editLatitud" class="form-label">Latitud</label>
                            <input type="float" class="form-control" id="editLatitud" required>
                        </div>
                        <div class="mb-3">
                            <label for="editLongitud" class="form-label">Longitud</label>
                            <input type="float" class="form-control" id="editLongitud" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Actualizar Sucursal</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js"></script>
    <script src="../Controladores/crud_sucursal.js"></script>
</body>
</html>
