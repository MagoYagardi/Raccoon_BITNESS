document.querySelector('.log-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const correo = e.target.querySelector('input[name="correo"]').value;
    const contrasena = e.target.querySelector('input[name="contrasena"]').value;

    try {
        const response = await fetch('../modelos/loginM.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ correo, contrasena })
        });

        const result = await response.json();

        if (result.status === 'success') {
            // Redirigir según el rol
            switch (result.rol) {
                case 'admin':
                    window.location.href = '../vistas/admin.php';
                    break;
                case 'cliente':
                    window.location.href = '../vistas/cliente.php';
                    break;
                case 'entrenador':
                    window.location.href = '../vistas/entrenador.php';
                    break;
                default:
                    alert('Rol de usuario no reconocido');
            }
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error en la conexión');
    }
});

document.querySelector('.registro-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre_usuario = e.target.querySelector('input[name="nombre_usuario"]').value;
    const correo = e.target.querySelector('input[name="correo"]').value;
    const contrasena = e.target.querySelector('input[name="contrasena"]').value;
    const confirmar_contrasena = e.target.querySelector('input[name="confirmar_contrasena"]').value;

    if (contrasena !== confirmar_contrasena) {
        alert('Las contraseñas no coinciden.');
        return;
    }

    try {
        const response = await fetch('../modelos/registroM.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ nombre_usuario, correo, contrasena, confirmar_contrasena })
        });

        const result = await response.json();

        alert(result.message);

        if (result.status === 'success') {
            // Redirigir automáticamente después del registro
            window.location.href = '../vistas/cliente.php';
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error en la conexión');
    }
});
