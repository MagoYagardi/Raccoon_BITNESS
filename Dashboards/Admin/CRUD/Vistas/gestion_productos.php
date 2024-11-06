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
    <title>Gestión de Productos</title>
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
            <h1>Gestión de Productos</h1>
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#addProductModal">
                Agregar Producto
            </button>
            
            <!-- Modal para agregar producto -->
            <div class="modal fade" id="addProductModal" tabindex="-1" aria-labelledby="addProductModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="addProductModalLabel">Agregar Producto</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form id="productForm">
                                <div class="mb-3">
                                    <label for="nombreProducto" class="form-label">Nombre</label>
                                    <input type="text" class="form-control" id="nombreProducto" required>
                                </div>
                                <div class="mb-3">
                                    <label for="precioProducto" class="form-label">Precio</label>
                                    <input type="number" step="0.01" class="form-control" id="precioProducto" required>
                                </div>
                                <div class="mb-3">
                                    <label for="descripcionProducto" class="form-label">Descripción</label>
                                    <textarea class="form-control" id="descripcionProducto" required></textarea>
                                </div>
                                <div class="mb-3">
                                    <label for="stockProducto" class="form-label">Stock</label>
                                    <input type="number" class="form-control" id="stockProducto" required>
                                </div>
                                <div class="mb-3">
                                    <label for="idSucursalProducto" class="form-label">ID Sucursal</label>
                                    <input type="number" class="form-control" id="idSucursalProducto" required>
                                </div>
                                <button type="submit" class="btn btn-primary">Agregar Producto</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <table class="table table-bordered mt-4" id="productTable">
                <thead>
                    <tr>
                        <th>ID Producto</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Descripción</th>
                        <th>Stock</th>
                        <th>ID Sucursal</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody id="productList">
                    <!-- Los productos se cargarán aquí dinámicamente -->
                </tbody>
            </table>
        </div>
    </div>

    <!-- Modal para editar producto -->
    <div class="modal fade" id="editProductModal" tabindex="-1" aria-labelledby="editProductModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editProductModalLabel">Editar Producto</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="editProductForm">
                        <input type="hidden" id="editProductId">
                        <div class="mb-3">
                            <label for="editNombreProducto" class="form-label">Nombre</label>
                            <input type="text" class="form-control" id="editNombreProducto" required>
                        </div>
                        <div class="mb-3">
                            <label for="editPrecioProducto" class="form-label">Precio</label>
                            <input type="number" step="0.01" class="form-control" id="editPrecioProducto" required>
                        </div>
                        <div class="mb-3">
                            <label for="editDescripcionProducto" class="form-label">Descripción</label>
                            <textarea class="form-control" id="editDescripcionProducto" required></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="editStockProducto" class="form-label">Stock</label>
                            <input type="number" class="form-control" id="editStockProducto" required>
                        </div>
                        <div class="mb-3">
                            <label for="editIdSucursalProducto" class="form-label">ID Sucursal</label>
                            <input type="number" class="form-control" id="editIdSucursalProducto" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Actualizar Producto</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal para confirmar eliminación -->
    <div class="modal fade" id="deleteProductModal" tabindex="-1" aria-labelledby="deleteProductModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="deleteProductModalLabel">Eliminar Producto</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p>¿Estás seguro de que deseas eliminar este producto?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-danger" id="confirmDeleteProduct">Eliminar</button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="../Controladores/crud_producto.js"></script>
</body>
</html>
