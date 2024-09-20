//validaciones de registro

$(document).ready(function() {
    // Función para validar el correo electrónico
    function isValidEmail(email) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Función para validar la contraseña (mínimo 8 caracteres y al menos un número)
    function isValidPassword(password) {
        var passwordRegex = /^(?=.*[0-9]).{8,}$/;
        return passwordRegex.test(password);
    }

    // Validar correo electrónico
    $('input[name="correo"]').on('focusout', function() {
        var email = $(this).val();
        if (!isValidEmail(email)) {
            $(".EmailError").text("Por favor ingresa un correo válido.").css("visibility", "visible");
            $(this).css("border-bottom", "2px solid red");
        } else {
            $(".EmailError").css("visibility", "hidden");
            $(this).css("border-bottom", "2px solid green");
        }
    });

    // Validar contraseña
    $('input[name="Password"]').on('focusout', function() {
        var password = $(this).val();
        if (password.length === 0) {
            $(".PasswordError").text("La contraseña es requerida.").css("visibility", "visible");
            $(this).css("border-bottom", "2px solid red");
        } else if (!isValidPassword(password)) {
            $(".PasswordError").text("La contraseña debe tener al menos 8 caracteres y un número.").css("visibility", "visible");
            $(this).css("border-bottom", "2px solid red");
        } else {
            $(".PasswordError").css("visibility", "hidden");
            $(this).css("border-bottom", "2px solid green");
        }
    });

    // Validar confirmación de contraseña
    $('input[placeholder="Confirmar Contraseña"]').on('focusout', function() {
        var confirmPassword = $(this).val();
        var password = $('input[name="contrasena"]').val();
        if (confirmPassword !== password) {
            $(".ConfirmPasswordError").text("Las contraseñas no coinciden.").css("visibility", "visible");
            $(this).css("border-bottom", "2px solid red");
        } else {
            $(".ConfirmPasswordError").css("visibility", "hidden");
            $(this).css("border-bottom", "2px solid green");
        }
    });

    // Validar si los campos están vacíos al tabular fuera
    $('input[name="nombre_usuario"]').on('focusout', function() {
        if ($(this).val().length === 0) {
            $(".NombreUserError").text("El nombre es requerido.").css("visibility", "visible");
            $(this).css("border-bottom", "2px solid red");
        } else {
            $(".NombreUserError").css("visibility", "hidden");
            $(this).css("border-bottom", "2px solid green");
        }
    });

    // Resetear el error cuando el usuario empieza a escribir
    $('input').on('input', function() {
        $(this).next('.error-message').css('visibility', 'hidden');
        $(this).css("border-bottom", "2px solid green");
    });
});
