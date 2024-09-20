document.addEventListener('DOMContentLoaded', () => {
    // Elementos del menú
    const dashboard = document.getElementById('dashboard');
    const manageUsers = document.getElementById('manageUsers');
    const manageClasses = document.getElementById('manageClasses');
    const manageProducts = document.getElementById('manageProducts');
    const viewReports = document.getElementById('viewReports');

    // Secciones del contenido
    const inicioSection = document.getElementById('inicioSection');
    const manageUsersSection = document.getElementById('manageUsersSection');
    const manageClassesSection = document.getElementById('manageClassesSection');
    const manageProductsSection = document.getElementById('manageProductsSection');
    const viewReportsSection = document.getElementById('viewReportsSection');

    // Botones de acción para gestionar usuarios
    const addUserBtn = document.getElementById('addUser');
    const updateUserBtn = document.getElementById('updateUser');
    const listUsersBtn = document.getElementById('listUsers');
    const deleteUserBtn = document.getElementById('deleteUser');

    // Función para mostrar solo una sección y ocultar las demás
    function showSection(section) {
        // Ocultar todas las secciones
        [inicioSection, manageUsersSection, manageClassesSection, manageProductsSection, viewReportsSection].forEach(sec => sec.style.display = 'none');
        
        // Mostrar la sección seleccionada
        section.style.display = 'block';
    }

    // Eventos para el menú lateral
    dashboard.addEventListener('click', () => showSection(inicioSection));
    manageUsers.addEventListener('click', () => showSection(manageUsersSection));
    manageClasses.addEventListener('click', () => showSection(manageClassesSection));
    manageProducts.addEventListener('click', () => showSection(manageProductsSection));
    viewReports.addEventListener('click', () => showSection(viewReportsSection));

    // Inicialmente mostrar el dashboard
    showSection(inicioSection);

    // Funciones para gestionar usuarios (simulación)

    // Función para agregar usuario
    addUserBtn.addEventListener('click', () => {
        const userName = prompt("Ingrese el nombre del nuevo usuario:");
        const userEmail = prompt("Ingrese el correo del nuevo usuario:");
        const userRole = prompt("Ingrese el rol del nuevo usuario (admin, entrenador, cliente):");

        if (userName && userEmail && userRole) {
            // Aquí iría la llamada AJAX para agregar el usuario en el servidor
            alert(`Usuario agregado: ${userName} (${userEmail}) como ${userRole}`);
        } else {
            alert("Todos los campos son obligatorios.");
        }
    });

    // Función para actualizar usuario
    updateUserBtn.addEventListener('click', () => {
        const userId = prompt("Ingrese el ID del usuario a actualizar:");
        const newUserName = prompt("Ingrese el nuevo nombre del usuario:");
        const newUserEmail = prompt("Ingrese el nuevo correo del usuario:");
        const newUserRole = prompt("Ingrese el nuevo rol del usuario (admin, entrenador, cliente):");

        if (userId && newUserName && newUserEmail && newUserRole) {
            // Aquí iría la llamada AJAX para actualizar el usuario en el servidor
            alert(`Usuario actualizado: ${newUserName} (${newUserEmail}) como ${newUserRole}`);
        } else {
            alert("Todos los campos son obligatorios.");
        }
    });

    // Función para listar usuarios
    listUsersBtn.addEventListener('click', () => {
        // Aquí iría la llamada AJAX para obtener la lista de usuarios del servidor
        const mockUsers = [
            { id: 1, name: 'Admin1', email: 'admin1@example.com', role: 'admin' },
            { id: 2, name: 'Entrenador1', email: 'entrenador1@example.com', role: 'entrenador' },
            { id: 3, name: 'Cliente1', email: 'cliente1@example.com', role: 'cliente' }
        ];

        const userTable = document.getElementById('userTable');
        userTable.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

        mockUsers.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    <button class="action-btn" onclick="alert('Actualizando usuario ${user.id}')">Editar</button>
                    <button class="action-btn" onclick="alert('Eliminando usuario ${user.id}')">Borrar</button>
                </td>
            `;
            userTable.appendChild(row);
        });
    });

    // Función para borrar usuario
    deleteUserBtn.addEventListener('click', () => {
        const userId = prompt("Ingrese el ID del usuario a borrar:");
        
        if (userId) {
            // Aquí iría la llamada AJAX para borrar el usuario en el servidor
            alert(`Usuario con ID ${userId} ha sido borrado.`);
        } else {
            alert("Debe ingresar un ID válido.");
        }
    });
});
