$(document).ready(function() {
  // Manejador para el envío del formulario de registro
  $('#registerForm').on('submit', function(e) {
    e.preventDefault(); // Evita el envío normal del formulario

    // Obtén los valores de los inputs
    var email = $('#email').val();
    var password = $('#password').val();
    var confirmPassword = $('#confirmPassword').val();
    var role = $('#role').val();

    // Valida los campos antes de enviarlos (opcional)
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    // Enviar los datos al script PHP
    $.ajax({
      type: 'POST',
      url: 'register.php', // Archivo PHP al que se envían los datos
      data: {
        email: email,
        password: password,
        role: role
      },
      success: function(response) {
        // Maneja la respuesta del servidor
        if (response.success) {
          $('.success-message').text('Registro exitoso.').show();
          $('.error-message').hide();
          window.location.href = 'login.php';
        } else {
          $('.error-message').text('Error: ' + response.message).show();
          $('.success-message').hide();
        }
      },
      error: function() {
        $('.error-message').text('Ocurrió un error durante el registro.').show();
      }
    });
  });
});
