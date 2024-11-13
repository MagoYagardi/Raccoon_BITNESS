$(document).ready(function () {
    // Array de entrenadores con detalles
    const trainers = [
        { 
            name: "Entrenador 1", 
            photo: "entrenador1-pf.png", 
            details: "Detalles del Entrenador 1",
            specialty: "Pesas",
            carouselImages: ["entrenador1.png", "entrenador.png"]
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

    // Función para avanzar al siguiente imagen del carrusel con animación
    function showNextImage() {
        const images = $('#carousel-images img');
        $(images[currentCarouselIndex]).fadeOut(300, function () { // Desvanecer la imagen actual
            currentCarouselIndex = (currentCarouselIndex + 1) % images.length; // Incrementar índice
            $(images[currentCarouselIndex]).fadeIn(300); // Desvanecer la siguiente imagen
        });
    }

    // Función para retroceder al imagen anterior del carrusel con animación
    function showPrevImage() {
        const images = $('#carousel-images img');
        $(images[currentCarouselIndex]).fadeOut(300, function () { // Desvanecer la imagen actual
            currentCarouselIndex = (currentCarouselIndex - 1 + images.length) % images.length; // Decrementar índice
            $(images[currentCarouselIndex]).fadeIn(300); // Desvanecer la imagen anterior
        });
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
