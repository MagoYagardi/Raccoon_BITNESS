let sucursales = []; // Declarando sucursales a un alcance más alto

// Función para cargar sucursales desde el servidor
async function fetchBranches() {
    try {
        const response = await fetch('../Modelos/crud_sucursal.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        const branchList = document.getElementById("branchList");
        branchList.innerHTML = ''; // Limpiar la lista antes de agregar nuevos elementos



        sucursales = data.sucursales; // Asignar sucursales obtenidas a la variable

        console.log(sucursales);

        sucursales.forEach(branch => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${branch.id_sucursal}</td>
                <td>${branch.nombre}</td>
                <td>${branch.calle}</td>
                <td>${branch.localidad}</td>
                <td>${branch.ciudad}</td>
                <td>${branch.codigo_postal}</td>
                <td>${branch.telefono}</td>
                <td>${branch.horario_apertura}</td>
                <td>${branch.horario_cierre}</td>
                <td>${branch.latitud}</td>
                <td>${branch.longitud}</td>
                <td>
                    <button class="btn btn-warning" onclick="openEditBranchModal(${branch.id_sucursal})">Editar</button>
                    <button class="btn btn-danger" onclick="deleteBranch(${branch.id_sucursal})">Eliminar</button>
                </td>
            `;
            branchList.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar las sucursales:', error);
    }
}

// Función para manejar el envío del formulario para agregar una sucursal
document.getElementById("branchForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Evita el envío predeterminado del formulario

    const newBranch = {
        branch: { // Ajustar el formato para que coincida con la estructura esperada por el backend
            nombre: document.getElementById("branchName").value,
            calle: document.getElementById("branchStreet").value,
            localidad: document.getElementById("branchLocality").value,
            ciudad: document.getElementById("branchCity").value,
            codigo_postal: document.getElementById("branchPostalCode").value,
            telefono: document.getElementById("branchPhone").value,
            horario_apertura: document.getElementById("branchOpeningHour").value,
            horario_cierre: document.getElementById("branchClosingHour").value,
            latitud: document.getElementById("branchLatitud").value,
            longitud: document.getElementById("branchLongitud").value
        }
    };

    try {
        const response = await fetch('../modelos/crud_sucursal.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newBranch) // Convertimos el objeto a JSON
        });

        const result = await response.json();
        
        if (result.success) {
            Swal.fire('Éxito', 'Sucursal agregada correctamente', 'success');
            fetchBranches(); // Recargar las sucursales
            $('#addBranchModal').modal('hide'); // Cerrar el modal
            document.getElementById("branchForm").reset(); // Limpiar el formulario
        } else {
            Swal.fire('Error', result.message, 'error');
        }
    } catch (error) {
        console.error('Error al agregar la sucursal:', error);
        Swal.fire('Error', 'Ocurrió un error al agregar la sucursal', 'error');
    }
});

// Función para manejar la edición de la sucursal
document.getElementById("editBranchForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Evita el envío predeterminado del formulario

    const updatedBranch = {
        branch: { // Ajustar el formato para que coincida con la estructura esperada por el backend
            id_sucursal: document.getElementById("editBranchId").value,
            nombre: document.getElementById("editNombre").value,
            calle: document.getElementById("editCalle").value,
            localidad: document.getElementById("editLocalidad").value,
            ciudad: document.getElementById("editCiudad").value,
            codigo_postal: document.getElementById("editCodigoPostal").value,
            telefono: document.getElementById("editTelefono").value,
            horario_apertura: document.getElementById("editHorarioApertura").value,
            horario_cierre: document.getElementById("editHorarioCierre").value,
            latitud: document.getElementById("editLatitud").value,
            longitud: document.getElementById("editLongitud").value,
        }
    };

    try {
        const response = await fetch('../modelos/crud_sucursal.php', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedBranch) // Aquí se está enviando la sucursal actualizada
        });

        const data = await response.json();
        if (data.success) {
            Swal.fire('Sucursal actualizada!', '', 'success');
            fetchBranches(); // Refresca la lista de sucursales
            $('#editBranchModal').modal('hide'); // Oculta el modal
        } else {
            Swal.fire('Error', data.message, 'error');
        }
    } catch (error) {
        console.error('Error al actualizar la sucursal:', error);
        Swal.fire('Error', 'No se pudo actualizar la sucursal.', 'error');
    }
});

// Función para abrir el modal de edición con los datos de la sucursal
function openEditBranchModal(branchId) {
    const branch = sucursales.find(b => b.id_sucursal === branchId);
    if (branch) {
        document.getElementById("editBranchId").value = branch.id_sucursal;
        document.getElementById("editNombre").value = branch.nombre;
        document.getElementById("editCalle").value = branch.calle;
        document.getElementById("editLocalidad").value = branch.localidad;
        document.getElementById("editCiudad").value = branch.ciudad;
        document.getElementById("editCodigoPostal").value = branch.codigo_postal;
        document.getElementById("editTelefono").value = branch.telefono;
        document.getElementById("editHorarioApertura").value = branch.horario_apertura;
        document.getElementById("editHorarioCierre").value = branch.horario_cierre;
        document.getElementById("editLatitud").value = branch.latitud;
        document.getElementById("editLongitud").value = branch.longitud;
        $('#editBranchModal').modal('show'); // Muestra el modal de edición
    }
}

// Función para eliminar una sucursal
async function deleteBranch(branchId) {
    const confirmed = await Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás recuperar esta sucursal!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (confirmed.isConfirmed) {
        try {
            const response = await fetch('../modelos/crud_sucursal.php', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id_sucursal: branchId }) // Pasar el ID de sucursal
            });

            const result = await response.json();
            if (result.success) {
                Swal.fire('Sucursal eliminada!', '', 'success');
                fetchBranches(); // Refresca la lista de sucursales
            } else {
                Swal.fire('Error', result.message, 'error');
            }
        } catch (error) {
            console.error('Error al eliminar la sucursal:', error);
            Swal.fire('Error', 'No se pudo eliminar la sucursal.', 'error');
        }
    }
}

// Cargar las sucursales al cargar la página
document.addEventListener("DOMContentLoaded", fetchBranches);
