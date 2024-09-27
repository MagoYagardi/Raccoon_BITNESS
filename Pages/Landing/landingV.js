
//modal registro

$(document).ready(function() {
    var modal = $('#modal');
    var btn = $('#btn-registro');
    var span = $('#closeButton');
    var modalBody = $('#modalBody');

    // Abre el modal y carga el contenido de registro.html
    btn.on('click', function() {
        modal.show();
        modalBody.load('registroV.php'); // Carga el contenido de registro.html en el contenedor del modal
    });

    // Cierra el modal
    span.on('click', function() {
        modal.hide();
        modalBody.empty(); // Limpia el contenido del modal
    });

    // Cierra el modal si el usuario hace clic fuera del contenido del modal
    $(window).on('click', function(event) {
        if ($(event.target).is(modal)) {
            modal.hide();
            modalBody.empty(); // Limpia el contenido del modal
        }
    });
});



//navbar  navegation

// subrayado

$(document).ready(function() {
    const activePage = window.location.pathname;
    
    $('.navbar-links').each(function() {
        const linkPath = $(this).attr('href');
        
        // Asegúrate de que la comparación sea correcta
        if (activePage.includes(linkPath)) {
            $('.navbar-links').removeClass('active'); // Elimina la clase de todos los enlaces
            $(this).addClass('active'); // Añade la clase solo al enlace actual
        }
    });
});

// navbar scrolled

$(window).on("scroll", () => {

    if (window.scrollY > 0) {
        $(".navbar").addClass("scrolled");
        $(".navbar-links").addClass("scrolled");

    } else {
        $(".navbar").removeClass("scrolled");
        $(".navbar-links").removeClass("scrolled");
    }
  });

