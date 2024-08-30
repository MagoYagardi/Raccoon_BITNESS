<?php

require_once __DIR__ . '/../config/conexion.php';

class User {
    private $conn;
    private $table_name = "USUARIO";

    public $id;
    public $email;
    public $password;
    public $role;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Crear nuevo usuario
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " (email, password, role) VALUES (:email, :password, :role)";
        $stmt = $this->conn->prepare($query);
    
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':password', $this->password);
        $stmt->bindParam(':role', $this->role);
    
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }    

    // Verificar si el email ya está registrado
    public function emailExists() {
        $query = "SELECT id, password, role FROM " . $this->table_name . " WHERE email = :email LIMIT 0,1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $this->email);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->id = $row['id'];
            $this->password = $row['password'];
            $this->role = $row['role'];

            return true;
        }

        return false;
    }

    public function login() {
        if ($this->emailExists()) {
            if (password_verify($this->password, $this->password)) {
                return true;
            }
        }
        return false;
    }
    
}
?>
