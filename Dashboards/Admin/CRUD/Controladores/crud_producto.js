// Array to hold product data
let productos = [];

// Function to populate the product table
function populateProductTable() {
    const productList = document.getElementById("productList");
    productList.innerHTML = ""; // Clear the table

    productos.forEach(producto => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${producto.id_producto}</td>
            <td>${producto.nombre}</td>
            <td>${producto.precio}</td>
            <td>${producto.descripcion}</td>
            <td>${producto.stock}</td>
            <td>${producto.id_sucursal}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="openEditProductModal(${producto.id_producto})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="confirmDeleteProduct(${producto.id_producto})">Eliminar</button>
            </td>
        `;
        productList.appendChild(row);
    });
}

// Function to fetch products from the server
async function fetchProducts() {
    try {
        const response = await fetch('../modelos/crud_producto.php', {
            method: 'GET',
        });
        const data = await response.json();
        if (data.success !== false) {
            productos = data.productos;
            populateProductTable();
        } else {
            console.error(data.message);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Function to handle adding a product
document.getElementById("productForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const newProduct = {
        id_sucursal: document.getElementById("idSucursalProducto").value,
        nombre: document.getElementById("nombreProducto").value,
        precio: document.getElementById("precioProducto").value,
        descripcion: document.getElementById("descripcionProducto").value,
        stock: document.getElementById("stockProducto").value
    };

    try {
        const response = await fetch('../modelos/crud_producto.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProduct),
        });
        const data = await response.json();
        if (data.success) {
            // Fetch products again to refresh the table
            fetchProducts(); 
            Swal.fire('Producto agregado', 'El producto ha sido agregado exitosamente', 'success');
            document.getElementById("productForm").reset(); // Reset the form
            $('#addProductModal').modal('hide'); // Close the modal
        } else {
            console.error(data.message);
        }
    } catch (error) {
        console.error('Error adding product:', error);
    }
});

// Function to open edit product modal
function openEditProductModal(productId) {
    const producto = productos.find(p => p.id_producto === productId);
    
    if (producto) {
        document.getElementById("editProductId").value = producto.id_producto;
        document.getElementById("editNombreProducto").value = producto.nombre;
        document.getElementById("editPrecioProducto").value = producto.precio;
        document.getElementById("editDescripcionProducto").value = producto.descripcion;
        document.getElementById("editStockProducto").value = producto.stock;
        document.getElementById("editIdSucursalProducto").value = producto.id_sucursal;
        $('#editProductModal').modal('show');
    }
}

// Function to handle editing a user
document.getElementById("editUserForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const updatedUser = {
        id_usuario: document.getElementById("editUserId").value,
        email: document.getElementById("editEmail").value,
        nombre: document.getElementById("editNombre").value,
        ci: document.getElementById("editCI").value,
        altura: document.getElementById("editAltura").value,
        rol: document.getElementById("editRol").value
    };

    try {
        const response = await fetch('../modelos/crud_usuario.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUser),
        });
        const data = await response.json();
        if (data.success) {
            // Fetch users again to refresh the table
            fetchUsers(); 
            Swal.fire('Usuario actualizado', 'El usuario ha sido actualizado exitosamente', 'success');
            $('#editUserModal').modal('hide'); // Close the modal
        } else {
            console.error(data.message);
        }
    } catch (error) {
        console.error('Error updating user:', error);
    }
});


// Function to confirm deletion of a product
function confirmDeleteProduct(productId) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esta acción",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch('../modelos/crud_producto.php', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id_producto: productId }), // Pass the ID in the body
                });
                const data = await response.json();
                if (data.success) {
                    // Fetch products again to refresh the table
                    fetchProducts(); 
                    Swal.fire('Producto eliminado', 'El producto ha sido eliminado exitosamente', 'success');
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    });
}


// Initialize the product table by fetching data when the page loads
document.addEventListener("DOMContentLoaded", fetchProducts);
