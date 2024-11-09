$(document).ready(function () {
    // Array de entrenadores con detalles
    const trainers = [
        { 
            name: "Entrenador 1", 
            photo: "../../../assets/img/deadlift.jpg", 
            details: "Detalles del Entrenador 1",
            specialty: "Pesas",
            carouselImages: ["../../../assets/img/deadlift.jpg", "../../../assets/img/carlitox.webp"]
        },
        { 
            name: "Carlitox", 
            photo: "../../../assets/img/carlitox.webp", 
            details: "HUOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOLLAAAA",
            specialty: "Calistenia",
            carouselImages: ["../../../assets/img/carlitox.webp"]
        },
        // Agrega más entrenadores según sea necesario
    ];

    let currentCarouselIndex = 0;

    // Función para renderizar las tarjetas de entrenadores
    function renderCards() {
        $('.card-container').empty(); // Limpiar el contenedor
        trainers.forEach((trainer, index) => {
            const card = $(`
                <div class="card" data-index="${index}">
                    <img src="${trainer.photo}" alt="${trainer.name}">
                    <div class="card-name">${trainer.name}</div>
                    <div class="card-icon">⭐</div>
                </div>
            `);
            $('.card-container').append(card);
        });
    }

    // Función para filtrar las tarjetas por nombre o detalles
    function filterCards() {
        const query = $('#filter').val().toLowerCase();
        $('.card').each(function () {
            const name = $(this).find('.card-name').text().toLowerCase();
            $(this).toggle(name.includes(query));
        });
    }

    // Función para mostrar el perfil de un entrenador seleccionado
    function showProfile(index) {
        const trainer = trainers[index];
        
        // Actualizar los datos de perfil
        $('#profile-name').text(trainer.name);
        $('#profile-specialty').text(trainer.specialty);
        $('#profile-details').text(trainer.details);
        $('#profile-photo').attr('src', trainer.photo);
        
        // Cargar imágenes del carrusel
        currentCarouselIndex = 0;
        loadCarouselImages(trainer.carouselImages);
        
        // Mostrar la sección de perfil
        $('.profile-section').show();
    }

    // Función para cargar las imágenes del carrusel
    function loadCarouselImages(images) {
        $('#carousel-images').empty(); // Limpiar el contenedor del carrusel
        images.forEach((image, index) => {
            const imgElement = $(`<img src="${image}" class="carousel-image" data-index="${index}">`);
            if (index !== currentCarouselIndex) {
                imgElement.hide(); // Ocultar imágenes no activas
            }
            $('#carousel-images').append(imgElement);
        });
    }

    // Función para avanzar al siguiente imagen del carrusel
    function showNextImage() {
        const images = $('#carousel-images img');
        $(images[currentCarouselIndex]).hide(); // Ocultar imagen actual
        currentCarouselIndex = (currentCarouselIndex + 1) % images.length; // Incrementar índice
        $(images[currentCarouselIndex]).show(); // Mostrar la siguiente imagen
    }

    // Función para retroceder al imagen anterior del carrusel
    function showPrevImage() {
        const images = $('#carousel-images img');
        $(images[currentCarouselIndex]).hide(); // Ocultar imagen actual
        currentCarouselIndex = (currentCarouselIndex - 1 + images.length) % images.length; // Decrementar índice
        $(images[currentCarouselIndex]).show(); // Mostrar la imagen anterior
    }

    // Eventos
    $('#filter').on('input', filterCards); // Filtrar tarjetas en tiempo real

    $('.card-container').on('click', '.card', function () {
        const index = $(this).data('index');
        showProfile(index); // Mostrar perfil al hacer clic en una tarjeta
    });

    $('#next').on('click', showNextImage); // Evento de botón para siguiente imagen del carrusel
    $('#prev').on('click', showPrevImage); // Evento de botón para imagen anterior del carrusel

    // Inicializar la página con las tarjetas de entrenadores
    renderCards();
});




/*Array trainers:

Contiene un listado de objetos que representan a los entrenadores. Cada objeto incluye name (nombre del entrenador), photo (foto de perfil), details (detalles o descripción del entrenador), specialty (especialidad del entrenador), y carouselImages (imágenes para el carrusel).
renderCards():

Renderiza dinámicamente las tarjetas de los entrenadores en la sección de cards usando los datos del array trainers.
Por cada entrenador, genera una tarjeta con su foto, nombre, e ícono de estrella.
filterCards():

Filtra las tarjetas en tiempo real según el texto ingresado en el campo de búsqueda (#filter).
Oculta las tarjetas que no coinciden con el criterio de búsqueda.
showProfile(index):

Muestra el perfil del entrenador seleccionado.
Actualiza el nombre, especialidad, detalles, y foto de perfil del entrenador en la sección de perfil.
Llama a loadCarouselImages() para cargar las imágenes del carrusel para ese entrenador.
loadCarouselImages(images):

Carga las imágenes proporcionadas en el contenedor del carrusel (#carousel-images).
Solo muestra la imagen correspondiente al índice actual (currentCarouselIndex) y oculta las demás.
showNextImage():

Cambia a la siguiente imagen en el carrusel.
Oculta la imagen actual, incrementa el índice, y muestra la siguiente imagen.
showPrevImage():

Cambia a la imagen anterior en el carrusel.
Oculta la imagen actual, decrementa el índice, y muestra la imagen anterior.
Eventos:

Filtro de búsqueda (#filter): Llama a filterCards() en cada cambio de entrada para filtrar tarjetas en tiempo real.
Click en tarjeta (.card): Llama a showProfile() con el índice de la tarjeta seleccionada para mostrar el perfil del entrenador correspondiente.
Botones de carrusel (#next y #prev): Llama a showNextImage() y showPrevImage() para navegar por las imágenes del carrusel.
 */