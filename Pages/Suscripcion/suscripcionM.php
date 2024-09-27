<?php
require 'vendor/autoload.php';  // Stripe SDK

\Stripe\Stripe::setApiKey('sk_test_YOUR_SECRET_KEY');  // Reemplaza con tu clave secreta de Stripe

// Recibir los datos del cliente
$data = json_decode(file_get_contents('php://input'), true);
$location = $data['location'];
$subscription = $data['subscription'];
$userId = $data['userId'];

try {
    // Crear un PaymentIntent en Stripe
    $paymentIntent = \Stripe\PaymentIntent::create([
        'amount' => calcularMonto($subscription['price']),  // Convertir a centavos
        'currency' => 'usd',
        'metadata' => [
            'userId' => $userId,
            'location' => $location['name'],
            'subscription' => $subscription['name']
        ],
    ]);

    // Enviar el PaymentIntent al frontend
    echo json_encode(['clientSecret' => $paymentIntent->client_secret]);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

function calcularMonto($precio) {
    // Eliminar cualquier carácter no numérico y convertir a centavos
    return (int)(preg_replace('/[^0-9]/', '', $precio) * 100);
}
8