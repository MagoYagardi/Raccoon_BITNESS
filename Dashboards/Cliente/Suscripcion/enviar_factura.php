<?php
// Incluir la configuración de conexión a la base de datos
include '../../../config/conexion.php';
require 'paga.php'; // Incluir archivo que registra la suscripción y devuelve los datos necesarios
require('../../../vendor/autoload.php');
require('../../../vendor/setasign/fpdf/fpdf.php');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Asegúrate de que tu servidor esté configurado para aceptar solicitudes JSON
header('Content-Type: application/json');

// Obtener la entrada JSON
$input = file_get_contents('php://input');

// Decodificar el JSON en un array asociativo
$data = json_decode($input, true);

// Comprobar si la decodificación fue exitosa
if (json_last_error() === JSON_ERROR_NONE) {
    // Guardar los datos en variables
    $id_sucursal = $data['id_sucursal'];
    $id_usuario = $data['id_usuario'];
    $id_suscripcion = $data['id_suscripcion'];
    $fecha_inicio = $data['fecha_inicio'];
    $fecha_fin = $data['fecha_fin'];

    try {
        // Consultar información de la Sucursal
        $sucursalQuery = "SELECT telefono, calle, ciudad FROM SUCURSAL WHERE id_sucursal = :id_sucursal";
        $stmt = $conn->prepare($sucursalQuery); // Cambié $pdo a $conn
        $stmt->bindParam(':id_sucursal', $id_sucursal, PDO::PARAM_INT);
        $stmt->execute();
        $sucursal = $stmt->fetch(PDO::FETCH_ASSOC);

        // Consultar información del Usuario
        $usuarioQuery = "SELECT ci, nombre FROM USUARIO WHERE id_usuario = :id_usuario";
        $stmt = $conn->prepare($usuarioQuery); // Cambié $pdo a $conn
        $stmt->bindParam(':id_usuario', $id_usuario, PDO::PARAM_INT);
        $stmt->execute();
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

        // Consultar información de la Suscripción
        $suscripcionQuery = "SELECT categoria_sus, duracion_sus, precio_sus FROM SUSCRIPCION WHERE id_suscripcion = :id_suscripcion";
        $stmt = $conn->prepare($suscripcionQuery); // Cambié $pdo a $conn
        $stmt->bindParam(':id_suscripcion', $id_suscripcion, PDO::PARAM_INT);
        $stmt->execute();
        $suscripcion = $stmt->fetch(PDO::FETCH_ASSOC);

        // Devolver una respuesta con los datos consultados
        echo json_encode([
            'status' => 'success',
            'message' => 'Datos guardados correctamente.',
            'sucursal' => $sucursal,
            'usuario' => $usuario,
            'suscripcion' => $suscripcion
        ]);

    } catch (PDOException $e) {
        // Manejo de errores en consultas
        echo json_encode(['status' => 'error', 'message' => 'Error en la consulta: ' . $e->getMessage()]);
    }
} else {
    // Manejo de errores si JSON no se puede decodificar
    echo json_encode(['status' => 'error', 'message' => 'Error al decodificar JSON.']);
}

// Crear una nueva clase que extiende FPDF
class PDF extends FPDF {
    function SimpleRect($x, $y, $w, $h, $style = '') {
        // Método para crear un rectángulo simple
        $this->SetLineWidth(0.3);
        $this->SetFillColor(255, 255, 255);
        $this->SetDrawColor(0, 0, 0);
        $this->Rect($x, $y, $w, $h, $style); // Dibujar el rectángulo
    }
}

// Crear una nueva instancia de PDF
$pdf = new PDF();
$pdf->AddPage();
$pdf->SetFont('Arial', '', 12);

// Datos de la empresa
// Cargar la imagen del logo
$pdf->Image('../../../assets/img/BITnessGYM_isologo.png', 10, 10, 60); // Ruta, posición X, Y, y ancho 

// Crear un rectángulo simple para los datos de la empresa
$pdf->SimpleRect(10, 50, 60, 60); // X, Y, Ancho, Alto

// Posicionar el cursor para escribir los datos de la empresa dentro del rectángulo
$pdf->SetXY(10, 40); // Ajustar posición dentro del rectángulo
$pdf->Ln(11); // Salto de línea
$pdf->SetFont('Arial', 'B', 12); // Establecer fuente en negrita
$pdf->Cell(100, 7, '  Telefono:', 0, 'L');
$pdf->SetFont('Arial', '', 12); // Volver a la fuente normal para el contenido
$pdf->Cell(100, 7, ' ' . $sucursal['telefono'], 0, 1, 'L');
$pdf->Ln(5); // Salto de línea
$pdf->SetFont('Arial', 'B', 12); // Establecer fuente en negrita para "Dirección"
$pdf->Cell(100, 7, '  Direccion:', 0, 'L');
$pdf->SetFont('Arial', '', 12); // Volver a la fuente normal para el contenido
$pdf->Cell(100, 7, ' ' . $sucursal['calle'], 0, 1, 'L');
$pdf->Ln(4); // Salto de línea
$pdf->SetFont('Arial', 'B', 12); // Establecer fuente en negrita para "Montevideo"
$pdf->Cell(100, 7, ' ' . $sucursal['ciudad'], 0, 'L');
$pdf->Ln(4); // Salto de línea
$pdf->Cell(100, 7, '  Sucursal: ' . $id_sucursal, 0, 'L'); // Aquí también puedes hacer que "Sucursal" esté en negrita si lo deseas.
$pdf->SetFont('Arial', '', 12); // Volver a la fuente normal después de los datos

// Posicionar la tabla de información a la derecha de los datos de la empresa
$margenDerecha = 80; // Ajusta este valor para desplazar más a la derecha si es necesario
$pdf->SetXY($margenDerecha, 10); // Definir posición para empezar al lado de los datos de la empresa

// Celda para RUT con fondo gris y negrita
$pdf->SetFont('Arial', 'B', 12);
$pdf->SetFillColor(200, 200, 200); // Fondo gris para títulos
$pdf->Cell(120, 10, 'R.U.T.', 1, 1, 'C', true);
$pdf->SetFont('Arial', '', 12); // Cambiar a fuente normal para los datos
$pdf->SetX($margenDerecha);
$pdf->Cell(120, 10, '000000000', 1, 1, 'C');

// Celda para Tipo CFE con fondo gris y negrita
$pdf->SetFont('Arial', 'B', 12);
$pdf->SetX($margenDerecha);
$pdf->Cell(120, 10, 'Tipo CFE', 1, 1, 'C', true);
$pdf->SetFont('Arial', '', 12); // Cambiar a fuente normal
$pdf->SetX($margenDerecha);
$pdf->Cell(120, 10, 'e-Factura', 1, 1, 'C');

// Serie, Número, Forma de Pago y Moneda
$pdf->SetFont('Arial', 'B', 12);
$pdf->SetX($margenDerecha);
$pdf->Cell(120, 10, '  Serie          Numero             Forma de Pago         Moneda    ', 1, 1, 'L', true);
$pdf->SetFont('Arial', '', 12);
$pdf->SetX($margenDerecha);
$pdf->MultiCell(120, 10, "     A              0000399                  Contado                 UYU | 1", 1, 'L');

// Fechas de comprobante y vencimiento
$pdf->SetFont('Arial', 'B', 12);
$pdf->SetX($margenDerecha);
$pdf->Cell(120, 10, '         Fecha Comprobante                Fecha Vencimiento  ', 1, 1, 'L', true);
$pdf->SetFont('Arial', '', 12);
$pdf->SetX($margenDerecha);
$pdf->MultiCell(120, 10, "              23-09-2024                                  30-09-2024", 1, 'L');

// RUT Comprador y Cliente
$pdf->SetFont('Arial', 'B', 12);
$pdf->SetX($margenDerecha);
$pdf->Cell(120, 10, '               RUT Comprador                     Cliente', 1, 1, 'L', true);
$pdf->SetFont('Arial', '', 12);
$pdf->SetX($margenDerecha);
$pdf->MultiCell(120, 10, "                  " . $usuario['ci'] . "                        " . $usuario['nombre'], 1, 'L');

// Continúa con la tabla de productos debajo de la sección de empresa y datos importantes
$pdf->Ln(20); // Espacio entre la tabla y la sección anterior

// Tabla de conceptos (cabecera)
$pdf->SetFont('Arial', 'B', 12);
$pdf->Cell(40, 10, 'CONCEPTO', 1, 0, 'C', true);
$pdf->Cell(30, 10, 'CANTIDAD', 1, 0, 'C', true);
$pdf->Cell(40, 10, 'P/UNITARIO', 1, 0, 'C', true);
$pdf->Cell(40, 10, 'DESCUENTO', 1, 0, 'C', true);
$pdf->Cell(40, 10, 'TOTAL', 1, 1, 'C', true);

// Detalle de productos/servicios (valores de la tabla)
$pdf->SetFont('Arial', '', 12);
$pdf->Cell(40, 10, 'Producto/Servicio', 1, 0, 'C');
$pdf->Cell(30, 10, '1', 1, 0, 'C'); // Cantidad
$pdf->Cell(40, 10, number_format($suscripcion['precio_sus'], 2, ',', '.'), 1, 0, 'C');
$pdf->Cell(40, 10, '0', 1, 0, 'C'); // Descuento
$pdf->Cell(40, 10, number_format($suscripcion['precio_sus'], 2, ',', '.'), 1, 1, 'C');

// Saltar espacio
$pdf->Ln(5);

// Total final
$pdf->SetFont('Arial', 'B', 14);
$pdf->Cell(190, 10, 'TOTAL A PAGAR: USD '. number_format($suscripcion['precio_sus'], 2, ',', '.'), 0, 1, 'R');

// Espacio antes del pie de página
$pdf->Ln(50);

// Añadir una línea larga antes del pie de página
$pdf->SetDrawColor(0, 0, 0); // Color negro
$pdf->Line(10, $pdf->GetY(), 200, $pdf->GetY()); // Dibuja una línea horizontal larga

// Pie de página con detalles adicionales
$pdf->SetFont('Arial', 'I', 10);
$pdf->Cell(0, 10, 'Puede verificar comprobante en: www.dgi.gub.uy', 0, 1, 'L');
$pdf->Cell(0, 10, 'Condiciones de pago: Contado', 0, 1, 'L');
$pdf->Cell(0, 10, 'CAE nro. 90212345678', 0, 1, 'L');
$pdf->Cell(0, 10, 'Fecha de vencimiento CAE:', 0, 1, 'R');
$pdf->Cell(0, 10, '11-12-2024   ', 0, 1, 'R');

// Obtener el contenido del PDF como cadena
$pdfContent = $pdf->Output('', 'S');

// Configurar PHPMailer
$mail = new PHPMailer(true);
try {
    // Configuración del servidor
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'bitnessgym@gmail.com'; // Tu email
    $mail->Password = 'efsq nojc wefa qrhe'; // Contraseña o contraseña de aplicación
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    // Remitente y destinatario
    $mail->setFrom('bitnessgym@gmail.com', 'BITness GYM');
    $mail->addAddress('cfedericoalen@gmail.com', 'Cristian Alen');

    // Contenido del correo
    $mail->isHTML(true);
    $mail->Subject = 'Factura de compra';
    $mail->Body    = 'Adjunto encontrarás tu factura en PDF.';

    // Adjuntar el PDF
    $mail->addStringAttachment($pdfContent, 'factura.pdf', 'base64', 'application/pdf');

    // Enviar el correo
    $mail->send();
    echo 'Factura enviada correctamente';
} catch (Exception $e) {
    echo "Error al enviar la factura: {$mail->ErrorInfo}";
}

?>