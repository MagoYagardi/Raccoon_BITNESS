<?php 

/*
class Conexion {
    private $host = "localhost";
    private $dbname = "BITness_GYM";
    private $username = "root";
    private $password = "";
    public $conn;

    public function getConexion() {
        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->dbname, $this->username, $this->password);
            $this->conn->exec("set names utf8");
        } catch(PDOException $exception) {
            echo "Error de conexión: " . $exception->getMessage();
        }
        return $this->conn;
        }
    }
*/

$conexion = mysqli_connect("localhost","root","","BITness_GYM","3306");
$conexion->set_charset("utf8");

if($conexion) {
    echo 'se pudo conectar';
} else {
    echo 'NO se pudo conectar';
}

?>