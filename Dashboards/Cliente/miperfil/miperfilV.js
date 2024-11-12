

$(document).ready(function() {

        // Array simulando datos de la base de datos
        const userData = {
            profilePhoto: 'entrenador1-pf.png',
            name: 'CRIS ALLEN',
            description: '180 KG EN BANCA y desarrollador backend',
            badgeImage: 'elo.png',
            progress: 69,
            protein: 80,
            carbs: 65,
            fats: 50,
            muscleImages: ['pecho.png', 'espalda.png', 'pierna.png', 'box.png']
        };
        


    // Array simulando eventos preexistentes
    const preloadedEvents = [
        { title: 'Clase de Yoga', start: '2024-11-10' },
        { title: 'Entrenamiento de fuerza', start: '2024-11-12' }
    ];

        // Cargar datos de perfil
        $('#profile-photo').attr('src', userData.profilePhoto);
        $('#user-name').text(userData.name);
        $('#user-description').text(userData.description);
        $('#badge-image').attr('src', userData.badgeImage);
        $('#circle-progress').text(`${userData.progress}%`);
    
        // Llenar barras de progreso
        $('#protein-bar').css('width', `${userData.protein}%`);
        $('#carbs-bar').css('width', `${userData.carbs}%`);
        $('#fats-bar').css('width', `${userData.fats}%`);
    
        // Cargar imágenes de músculos
        userData.muscleImages.forEach((imgSrc, index) => {
            $(`#muscle-${index + 1} img`).attr('src', imgSrc);
        });



    // Inicializar FullCalendar
    let calendarEl = document.getElementById('calendar');
    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        droppable: true,
        events: preloadedEvents,
        dateClick: function(info) {
            $('#event-modal').show();
            $('#event-form').off('submit').on('submit', function(e) {
                e.preventDefault();
                let title = $('#event-title').val();
                if (title) {
                    calendar.addEvent({
                        title: title,
                        start: info.dateStr,
                        allDay: true
                    });

                    // Enviar POST al servidor
                    fetch('/ruta-del-servidor', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ title, date: info.dateStr })
                    })
                    .then(response => response.json())
                    .then(data => console.log('Evento guardado:', data))
                    .catch(error => console.error('Error al guardar:', error));

                    $('#event-title').val('');
                    $('#event-modal').hide();
                }
            });
        }
    });
    calendar.render();

    // Manejadores de arrastrar y soltar
    $('.muscle-box').on('dragstart', function(e) {
        $(this).addClass('dragging');
        e.originalEvent.dataTransfer.setData('text', $(this).text());
    });

    $('.muscle-box').on('dragend', function() {
        $(this).removeClass('dragging');
    });

    calendarEl.addEventListener('dragover', function(e) {
        e.preventDefault();
    });

    calendarEl.addEventListener('drop', function(e) {
        e.preventDefault();
        $('#event-modal').show();
    });

    // Manejo del modal
    $('.close').on('click', function() {
        $('#event-modal').hide();
    });
});
