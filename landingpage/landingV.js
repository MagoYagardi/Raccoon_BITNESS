
//modal registro

$(document).ready(function() {
    var modal = $('#modal');
    var btn = $('#btn-registro');
    var span = $('#closeButton');
    var modalBody = $('#modalBody');

    // Abre el modal y carga el contenido de registro.html
    btn.on('click', function() {
        modal.show();
        modalBody.load('../registro/registroV.html'); // Carga el contenido de registro.html en el contenedor del modal
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

$(document).ready(function() {
    // Obtener la URL actual
    const currentPath = window.location.pathname;
  
    // Iterar sobre todos los enlaces dentro de 'nav a'
    $('nav a').each(function() {
      const linkPath = $(this).attr('href');
  
      // Verificar si el enlace coincide con la URL actual
      if (currentPath.includes(linkPath)) {
        // Quitar la clase 'active' de cualquier otro enlace
        $('nav a').removeClass('active');
  
        // Añadir la clase 'active' al enlace actual
        $(this).addClass('active');
      }
    });
  });


// subrayado

const activePage = window.location.pathname;

$("nav a").each(function() { // each para jquery, forEach para vanilla
    // `this` hace referencia al elemento actual en la iteración
    if (this.href.includes(`${activePage}`)) {
        $(this).addClass('active');
    }
});
