$(document).ready(function () {
    let selectedTask = null;
    let currentDayColumn = null;
  
    // Selección de tarea
    $('.task-btn').on('click', function () {
      selectedTask = $(this).data('task');
      $('#delete').removeClass('active');
    });
  
    // Activar modo de eliminación
    $('#delete').on('click', function () {
      selectedTask = null;
      $(this).toggleClass('active');
    });
  
    // Al hacer clic en una columna de día
    $('.day-column').on('click', function () {
      if (selectedTask) {
        currentDayColumn = $(this);
        $('#timeModal').css('display', 'flex');
      }
    });
  
    // Guardar actividad con hora y tamaño dinámico
    $('#saveTime').on('click', function () {
      const startTime = $('#startTime').val();
      const endTime = $('#endTime').val();
  
      if (startTime && endTime) {
        const startHour = parseTime(startTime);
        const endHour = parseTime(endTime);
        const top = (startHour - 6) * 50; // Posición vertical en px
        const height = (endHour - startHour) * 50;
  
        const activityBlock = $(`
          <div class="activity-block" style="top: ${top}px; height: ${height}px; background-color: ${getTaskColor(selectedTask)};">
            ${selectedTask} (${startTime} - ${endTime})
          </div>
        `);
  
        currentDayColumn.append(activityBlock);
      }
  
      $('#timeModal').hide();
    });
  
    // Cerrar el modal
    $('#closeModal').on('click', function () {
      $('#timeModal').hide();
    });
  
    // Parsear tiempo a formato numérico para cálculo
    function parseTime(time) {
      const [hours, minutes] = time.split(':').map(Number);
      return hours + minutes / 60;
    }
  
    // Obtener el color de la tarea
    function getTaskColor(task) {
      switch (task) {
        case 'gimnasio': return '#FF6F61';
        case 'estudio': return '#FFD700';
        case 'television': return '#7FFFD4';
        case 'amigos': return '#9370DB';
        case 'trabajo': return '#4682B4';
        default: return '#FFFFFF';
      }
    }
  });
  