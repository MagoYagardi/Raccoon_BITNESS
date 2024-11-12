<?php
// Conexión a la base de datos
include '../../../../config/conexion.php'; 

// Función para asegurar que la hora tenga el formato correcto (HH:MM:SS)
function agregarSegundos($hora) {
    // Verificar que la hora esté en el formato HH:MM
    if (preg_match("/^([0-1]?[0-9]|2[0-3]):([0-5]?[0-9])$/", $hora)) {
        // Si la hora ya tiene los segundos, retornamos tal cual
        if (strpos($hora, ':') !== false && substr_count($hora, ':') == 2) {
            return $hora;
        }
        // Si no tiene los segundos, los agregamos
        return $hora . ':00';
    } else {
        return false;  // Devuelve false si el formato no es válido
    }
}

// Obtener los datos enviados en el cuerpo de la solicitud
$data = json_decode(file_get_contents("php://input"), true);

// Verificar si se han recibido los datos necesarios
if (empty($data)) {
    echo json_encode(['success' => false, 'message' => 'No se recibieron datos']);
    exit();
}

// Verificar que todos los campos necesarios estén presentes
if (!isset($data['id_actividad'], $data['hora_inicio'], $data['hora_fin'], $data['dia'])) {
    echo json_encode(['success' => false, 'message' => 'Faltan campos requeridos']);
    exit();
}

// Validar la actividad
$idActividad = $data['id_actividad'];
$horaInicio = agregarSegundos($data['hora_inicio']);
$horaFin = agregarSegundos($data['hora_fin']);
$dia = $data['dia'];

// Verificar si el formato de hora es válido
if ($horaInicio === false || $horaFin === false) {
    echo json_encode(['success' => false, 'message' => "El campo 'hora_inicio' o 'hora_fin' no tiene el formato correcto (HH:MM)"]);
    exit();
}

// Verificar si la hora de inicio es anterior a la hora de fin
if (strtotime($horaInicio) >= strtotime($horaFin)) {
    echo json_encode(['success' => false, 'message' => "La hora de inicio debe ser anterior a la hora de fin"]);
    exit();
}

// Actualizar la actividad en la tabla ACTIVIDAD
$query = "UPDATE ACTIVIDAD SET hora_inicio = :horaInicio, hora_fin = :horaFin, dia = :dia WHERE id_actividad = :id_actividad";
$stmt = $conn->prepare($query);
$stmt->bindParam(':horaInicio', $horaInicio, PDO::PARAM_STR);
$stmt->bindParam(':horaFin', $horaFin, PDO::PARAM_STR);
$stmt->bindParam(':dia', $dia, PDO::PARAM_STR);
$stmt->bindParam(':id_actividad', $idActividad, PDO::PARAM_INT);

// Ejecutar la consulta
if ($stmt->execute()) {
    // Si la actualización fue exitosa
    echo json_encode(['success' => true]);
} else {
    // Si hay un error al ejecutar la consulta
    echo json_encode(['success' => false, 'message' => 'Error al actualizar la actividad', 'errorInfo' => $stmt->errorInfo()]);
}
?>
