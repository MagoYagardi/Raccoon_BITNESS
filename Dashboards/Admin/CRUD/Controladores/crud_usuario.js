// Array to hold user data
let users = [];
let table; // Declare table variable

$(document).ready(function() {
    initializeDataTable(); // Initialize DataTable
    fetchUsers(); // Fetch users after the table is initialized
});

// Function to initialize DataTable
function initializeDataTable() {
    // Ensure that the table is destroyed before re-initializing
    if ($.fn.DataTable.isDataTable('#userTable')) {
        $('#userTable').DataTable().clear().destroy();
    }

    // Initialize DataTable with desired options
    table = $('#userTable').DataTable({
        "paging": true, // Enable pagination
        "searching": true, // Enable searching
        "pageLength": 10, // Default number of entries to show
        "destroy": true, // Allow the table to be destroyed and re-initialized
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json" // Spanish language file
        },
        "order": [], // Reset ordering
        "responsive": true, // Make the table responsive
        "autoWidth": false // Disable auto width to manage column widths manually
    });
}

// Function to populate the user table
function populateUserTable() {
    // Clear existing data in DataTable
    table.clear();

    // Add new user data to DataTable
    users.forEach(user => {
        table.row.add([
            user.id_usuario,
            user.email,
            user.nombre,
            user.ci,
            user.altura,
            user.rol,
            `
            <button class="btn btn-warning btn-sm" onclick="openEditUserModal(${user.id_usuario})">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="confirmDeleteUser(${user.id_usuario})">Eliminar</button>
            `
        ]);
    });

    // Draw the DataTable with updated data
    table.draw();
}

// Function to fetch users from the server
async function fetchUsers() {
    try {
        const response = await fetch('../modelos/crud_usuario.php', {
            method: 'GET',
        });
        const data = await response.json();
        if (data.success !== false) {
            users = data.users;
            populateUserTable();
        } else {
            console.error(data.message);
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// Function to handle adding a user
document.getElementById("userForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const newUser = {
        email: document.getElementById("email").value,
        nombre: document.getElementById("nombre").value,
        ci: document.getElementById("ci").value,
        altura: document.getElementById("altura").value,
        password: document.getElementById("password").value,
        rol: document.getElementById("rol").value
    };

    try {
        const response = await fetch('../modelos/crud_usuario.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        });
        const data = await response.json();
        if (data.success) {
            users.push({...newUser, id_usuario: users.length + 1}); // Assign a temporary ID
            populateUserTable();
            Swal.fire('Usuario agregado', 'El usuario ha sido agregado exitosamente', 'success');
            document.getElementById("userForm").reset(); // Reset the form
                        $('#addUserModal').modal('hide'); // Cierra el modal de agregar usuario
        } else {
            console.error(data.message);
        }
    } catch (error) {
        console.error('Error adding user:', error);
    }
});

function openEditUserModal(userId) {
    console.log("Abriendo modal para el usuario con ID:", userId); // Verifica el ID del usuario
    const usuario = users.find(u => u.id_usuario === userId);
    if (usuario) {
        document.getElementById("editUserId").value = usuario.id_usuario;
        document.getElementById("editEmail").value = usuario.email;
        document.getElementById("editNombre").value = usuario.nombre;
        document.getElementById("editCI").value = usuario.ci;
        document.getElementById("editAltura").value = usuario.altura;
        document.getElementById("editRol").value = usuario.rol;
        console.log("Mostrando modal de edición"); // Verifica si llega a esta línea
        $('#editUserModal').modal('show'); // Muestra el modal
    } else {
        console.error("Usuario no encontrado");
    }
}

// Function to handle editing a user
document.getElementById("editUserForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const actualizarUsuario = {
        id_usuario: document.getElementById("editUserId").value,
        email: document.getElementById("editEmail").value,
        nombre: document.getElementById("editNombre").value,
        ci: document.getElementById("editCI").value,
        altura: document.getElementById("editAltura").value,
        rol: document.getElementById("editRol").value,
    };

    try {
        const response = await fetch('../modelos/crud_usuario.php', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(actualizarUsuario),
        });
        const data = await response.json();
        if (data.success) {
            // Fetch users again to refresh the table
            await fetchUsers(); 
            Swal.fire('Usuario actualizado', 'El usuario ha sido actualizado exitosamente', 'success');
            $('#editUserModal').modal('hide'); // Close the modal
        } else {
            console.error(data.message);
        }
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
    }
});

// Function to confirm user deletion with SweetAlert2
function confirmDeleteUser(userId) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esto.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch('../modelos/crud_usuario.php', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id_usuario: userId }),
                });
                const data = await response.json();
                if (data.success) {
                    users = users.filter(u => u.id_usuario !== userId);
                    populateUserTable();
                    Swal.fire('Eliminado', 'El usuario ha sido eliminado.', 'success');
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    });
}

// Fetch users on page load
fetchUsers();
