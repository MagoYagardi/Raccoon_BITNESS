<?php


include '../config/conexion.php';

$nombre = $_POST['NombreUser'];
$correo = $_POST['Email'];
$password = $_POST['Password'];

$query = "INSERT INTO USUARIO(nombre, email, contraseña)
          VALUES('$nombre', '$correo', '$password')";

$ejecutar = mysqli_query($conexion, $query);

if($ejecutar) {
    echo '<script>
        alert("Registro exsitoso");
        window.location = "../dashboardC/dashboard.html";
    
    
    
    </script>';

}














?>
