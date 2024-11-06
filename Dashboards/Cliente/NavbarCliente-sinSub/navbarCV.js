
// cargar el navbar en el contenedor
$(document).ready(() => {
    $("#navbar-container").load("../NavbarCliente-sinSub/navbarCV.html");
  });



// subrayado del navbar
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
        $(".nav-border").addClass("scrolled");

    } else {
        $(".navbar").removeClass("scrolled");
        $(".navbar-links").removeClass("scrolled");
        $(".nav-border").removeClass("scrolled");
    }
  });





