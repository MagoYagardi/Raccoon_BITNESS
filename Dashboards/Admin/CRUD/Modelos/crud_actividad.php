<?php
include '../../../../config/conexion.php'; 

header('Content-Type: application/json');

// Leer la solicitud HTTP y determinar el método
$method = $_SERVER['REQUEST_METHOD'];

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

// Procesar la solicitud según el método
switch ($method) {
    case 'GET':
        // Obtener todas las actividades o una específica si se proporciona un ID
        if (isset($_GET['id'])) {
            $id = $_GET['id'];
            $query = "SELECT * FROM ACTIVIDAD WHERE id_actividad = :id";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        } else {
            $query = "SELECT * FROM ACTIVIDAD";
            $stmt = $conn->prepare($query);
        }

        $stmt->execute();
        $actividades = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if ($actividades) {
            echo json_encode(['actividades' => $actividades]);
        } else {
            echo json_encode(['error' => 'No se encontraron actividades']);
        }
        break;

    case 'POST':
        // Crear una nueva actividad y clase
        $data = json_decode(file_get_contents("php://input"), true);
        if ($data) {
            // Aseguramos el formato de hora (HH:MM:SS)
            $horaInicio = agregarSegundos($data['horaInicio']);
            $horaFin = agregarSegundos($data['horaFin']);
            
            // Verificar si el formato de hora es válido
            if ($horaInicio === false || $horaFin === false) {
                echo json_encode(['success' => false, 'message' => 'Formato de hora inválido']);
                break;
            }
            
            $dia = $data['dia'];
            $claseNombre = $data['claseNombre'];

            // Insertar la actividad en la tabla ACTIVIDAD
            $queryActividad = "INSERT INTO ACTIVIDAD (hora_inicio, hora_fin, dia) VALUES (:horaInicio, :horaFin, :dia)";
            $stmtActividad = $conn->prepare($queryActividad);
            $stmtActividad->bindParam(':horaInicio', $horaInicio, PDO::PARAM_STR);
            $stmtActividad->bindParam(':horaFin', $horaFin, PDO::PARAM_STR);
            $stmtActividad->bindParam(':dia', $dia, PDO::PARAM_STR);

            // Transacción para asegurar la integridad de los datos
            $conn->beginTransaction();

            if ($stmtActividad->execute()) {
                // Obtener el ID de la actividad recién insertada
                $idActividad = $conn->lastInsertId();

                // Insertar en la tabla CLASE el nombre y el id_actividad
                $queryClase = "INSERT INTO CLASE (id_actividad, nombre) VALUES (:idActividad, :claseNombre)";
                $stmtClase = $conn->prepare($queryClase);
                $stmtClase->bindParam(':idActividad', $idActividad, PDO::PARAM_INT);
                $stmtClase->bindParam(':claseNombre', $claseNombre, PDO::PARAM_STR);

                if ($stmtClase->execute()) {
                    // Si ambas inserciones fueron exitosas, hacer commit
                    $conn->commit();
                    echo json_encode(['success' => true]);
                } else {
                    // Si la inserción en CLASE falla, hacer rollback
                    $conn->rollBack();
                    echo json_encode(['success' => false, 'message' => 'Error al agregar la clase']);
                }
            } else {
                // Si la inserción en ACTIVIDAD falla, hacer rollback
                $conn->rollBack();
                echo json_encode(['success' => false, 'message' => 'Error al agregar la actividad']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Datos inválidos']);
        }
        break;
        
    case 'PUT':
        // Editar una actividad existente
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
            echo json_encode(['success' => false, 'message' => 'Error al actualizar la actividad', 'errorInfo' => $stmt->errorInfo()]);
        }
        break;
    
    case 'DELETE':
        // Eliminar una actividad existente
        $data = json_decode(file_get_contents("php://input"), true);
        if ($data && isset($data['id'])) {
            $id = $data['id'];

            $query = "DELETE FROM ACTIVIDAD WHERE id_actividad = :id";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);

            if ($stmt->execute()) {
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al eliminar la actividad']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Datos inválidos']);
        }
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Método no permitido']);
        break;
}

// Cerrar la conexión PDO
$conn = null;
?>
