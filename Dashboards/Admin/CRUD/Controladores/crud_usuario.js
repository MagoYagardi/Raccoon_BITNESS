// Array to hold user data
let users = [];

// Function to populate the user table
function populateUserTable() {
    const userList = document.getElementById("userList");
    userList.innerHTML = ""; // Clear the table

    users.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${user.id_usuario}</td>
            <td>${user.email}</td>
            <td>${user.nombre}</td>
            <td>${user.ci}</td>
            <td>${user.altura}</td>
            <td>${user.rol}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="openEditUserModal(${user.id_usuario})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="confirmDeleteUser(${user.id_usuario})">Eliminar</button>
            </td>
        `;
        userList.appendChild(row);
    });
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
        } else {
            console.error(data.message);
        }
    } catch (error) {
        console.error('Error adding user:', error);
    }
});

// Function to open edit user modal
function openEditUserModal(userId) {
    const user = users.find(u => u.id_usuario === userId);
    
    if (user) {
        document.getElementById("editUserId").value = user.id_usuario;
        document.getElementById("editEmail").value = user.email;
        document.getElementById("editNombre").value = user.nombre;
        document.getElementById("editCI").value = user.ci;
        document.getElementById("editAltura").value = user.altura;
        document.getElementById("editRol").value = user.rol;
        
        Swal.fire({
            title: 'Editar Usuario',
            html: `
                <input id="editEmail" class="swal2-input" placeholder="Email" value="${user.email}">
                <input id="editNombre" class="swal2-input" placeholder="Nombre" value="${user.nombre}">
                <input id="editCI" class="swal2-input" placeholder="CI" value="${user.ci}">
                <input id="editAltura" class="swal2-input" placeholder="Altura" value="${user.altura}">
                <input id="editRol" class="swal2-input" placeholder="Rol" value="${user.rol}">
            `,
            preConfirm: () => {
                return {
                    id_usuario: userId,
                    email: document.getElementById("editEmail").value,
                    nombre: document.getElementById("editNombre").value,
                    ci: document.getElementById("editCI").value,
                    altura: document.getElementById("editAltura").value,
                    rol: document.getElementById("editRol").value,
                };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const updatedUser = result.value;
                const userIndex = users.findIndex(u => u.id_usuario === userId);

                try {
                    const response = await fetch('../modelos/crud_usuario.php', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(updatedUser),
                    });
                    const data = await response.json();
                    if (data.success) {
                        users[userIndex] = updatedUser; // Update user in array
                        populateUserTable();
                        Swal.fire('Usuario actualizado', 'El usuario ha sido actualizado exitosamente', 'success');
                    } else {
                        console.error(data.message);
                    }
                } catch (error) {
                    console.error('Error updating user:', error);
                }
            }
        });
    }
}

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
