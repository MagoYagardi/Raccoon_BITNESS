/* CONSULTAR ESTADO DE USUARIO */
// Simulaciones de estado de usuario (se pueden reemplazar por consultas reales o datos provenientes de una API)
const userLoggedIn = true;   // Cambiar a 'true' si el usuario está logueado
const userSubscribed = false; // Cambiar a 'true' si el usuario está suscrito

/* CALENDARIO SEMANAL DE ACTIVIDADES */

// Obtener los elementos del DOM que representan las tareas y botones
const breakTask = document.getElementById('break');
const gymTask = document.getElementById('gym');
const studyTask = document.getElementById('study');
const tvTask = document.getElementById('tv');
const friendsTask = document.getElementById('friends');
const workTask = document.getElementById('work');
const deselectBtn = document.getElementById('deselect');
const taskContainer = document.querySelector('.task__container');
const scheduleContainer = document.querySelector('.schedule__container');
const resetBtn = document.querySelector('.deleteBtn');
const popUp = document.querySelector('.pop-up__container');
const noBtn = document.getElementById('btn__no');
const yesBtn = document.getElementById('btn__yes');

let selectedColor, active, icon;  // Variables para el color seleccionado, si la tarea está activa y el icono

// Event Listeners para las diferentes interacciones del usuario
taskContainer.addEventListener('click', selectTask);  // Para seleccionar una tarea
scheduleContainer.addEventListener('click', setColors);  // Para asignar el color seleccionado a una celda del calendario
deselectBtn.addEventListener('click', resetTasks);  // Para deseleccionar tareas activas
resetBtn.addEventListener('click', openPopup);  // Para abrir el popup de confirmación al borrar tareas
noBtn.addEventListener('click', closePopup);  // Cerrar el popup si el usuario cancela la eliminación
yesBtn.addEventListener('click', deleteTasks);  // Eliminar todas las tareas si el usuario confirma

// Función para seleccionar una tarea (asignarle un color y un ícono) (3)
function selectTask(e) {
    resetTasks();  // Resetea todas las tareas previamente seleccionadas
    taskColor = e.target.style.backgroundColor;  // Obtiene el color de la tarea seleccionada

    // Asigna el ícono y el color según la tarea seleccionada
    switch (e.target.id) {
        case 'break':
            activeTask(breakTask, taskColor);  // Activa la tarea "descanso"
            icon = '<i class="fas fa-couch"></i>';  // Ícono de descanso
            break;
        case 'gym':
            activeTask(gymTask, taskColor);  // Activa la tarea "gimnasio"
            icon = '<i class="fas fa-dumbbell"></i>';  // Ícono de gimnasio
            break;
        case 'study':
            activeTask(studyTask, taskColor);  // Activa la tarea "estudio"
            icon = '<i class="fas fa-book"></i>';  // Ícono de estudio
            break;
        case 'tv':
            activeTask(tvTask, taskColor);  // Activa la tarea "ver televisión"
            icon = '<i class="fas fa-tv"></i>';  // Ícono de televisión
            break;
        case 'friends':
            activeTask(friendsTask, taskColor);  // Activa la tarea "amigos"
            icon = '<i class="fas fa-users"></i>';  // Ícono de amigos
            break;
        case 'work':
            activeTask(workTask, taskColor);  // Activa la tarea "trabajo"
            icon = '<i class="fas fa-briefcase"></i>';  // Ícono de trabajo
            break;
        default:
            icon = '';  // Por defecto, sin ícono
    }
}

// Función para asignar colores a las celdas del calendario (4)
function setColors(e) {
    if (e.target.classList.contains('task') && active === true) {
        // Asigna el color seleccionado y el ícono a la celda del calendario
        e.target.style.backgroundColor = selectedColor;
        e.target.innerHTML = icon;
    } else if (e.target.classList.contains('fas') && active === true) {
        // Si se hace clic en el ícono dentro de una celda, también aplica el color
        e.target.parentElement.style.backgroundColor = selectedColor;
        e.target.parentElement.innerHTML = icon;
    }
}

// Función para activar una tarea (1)
function activeTask(task, color) {
    // Alterna la clase "selected" para marcar una tarea como activa
    task.classList.toggle('selected');

    if (task.classList.contains('selected')) {
        active = true;  // Marca la tarea como activa
        selectedColor = color;  // Almacena el color de la tarea seleccionada
        return selectedColor;
    } else {
        active = false;  // Si no está seleccionada, desactiva la tarea
    }
}

// Función para resetear las tareas seleccionadas (2)
function resetTasks() {
    const allTasks = document.querySelectorAll('.task__name');  // Selecciona todas las tareas

    // Elimina la clase "selected" de todas las tareas para deseleccionarlas
    allTasks.forEach((item) => {
        item.className = 'task__name';
    });
}

// Función para borrar todas las tareas del calendario
function deleteTasks() {
    const tasks = document.querySelectorAll('.task');  // Selecciona todas las celdas del calendario

    // Limpia cada celda del calendario (elimina íconos y colores)
    tasks.forEach((item) => {
        item.innerHTML = '';
        item.style.backgroundColor = 'white';
    });

    closePopup();  // Cierra el popup de confirmación
}

// Función para abrir el popup de confirmación al eliminar tareas
function openPopup() {
    popUp.style.display = 'flex';  // Muestra el popup
}

// Función para cerrar el popup de confirmación
function closePopup() {
    popUp.style.display = 'none';  // Oculta el popup
}

/* ICONO DE ACTIVIDADES CON CARRUSEL */

// Funciones para mostrar y ocultar el botón de "Anotarse"
function showButton(element) {
    const button = element.querySelector('.btn-anotarse');  // Obtiene el botón dentro del elemento
    button.style.display = 'block';  // Muestra el botón
}

function hideButton(element) {
    const button = element.querySelector('.btn-anotarse');  // Obtiene el botón dentro del elemento
    button.style.display = 'none';  // Oculta el botón
}

// Función para manejar el clic en el botón de "Anotarse"
function handleClick(actividad) {
    if (!userLoggedIn) {
        // Si el usuario no está logueado, lo redirige al formulario de registro
        window.location.href = '../../Users/formularioV.html';
    } else if (!userSubscribed) {
        // Si el usuario no está suscrito, lo redirige a la página de suscripción
        window.location.href = '../Suscripcion/suscripcionV.html';
    } else {
        // Si está logueado y suscrito, lo redirige al formulario de pago de la actividad
        window.location.href = 'pago.html?actividad=' + actividad;
    }
}















