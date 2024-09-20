<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
header('Content-Type: application/json');

// Capturar el método HTTP
$method = $_SERVER['REQUEST_METHOD']; 

// Manejar solicitudes OPTIONS (Preflight requests)
if ($method == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Incluir archivo de configuración para conexión a la base de datos (MySQLi)
include('config.php');

// Leer los datos JSON enviados en la solicitud
$input = json_decode(file_get_contents("php://input"), true);

// LOGIN: Verificar usuario y contraseña, y devolver el rol
if ($method == 'POST' && isset($_GET['action']) && $_GET['action'] == 'login') {
    $username = $input['username'];
    $password = $input['password'];

    // Verificar usuario y contraseña usando MySQLi, cambiando de 'usuarios' a 'usuario'
    $stmt = $mysqli->prepare("SELECT * FROM usuario WHERE email_usuario = ? AND clave_usuario = ?");
    $stmt->bind_param("ss", $username, $password);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    
    if ($user) {
        // Si el login es correcto, devolver los detalles del usuario
        echo json_encode(["success" => true, "role" => "usuario", "username" => $user['email_usuario']]);
    } else {
        // Si el login falla
        echo json_encode(["success" => false, "message" => "Credenciales incorrectas."]);
    }

    $stmt->close(); // Cerrar la sentencia preparada
}

// LISTAR PACIENTES: Listar todos los pacientes
if ($method == 'GET' && isset($_GET['action']) && $_GET['action'] == 'listPatients') {
    $query = "SELECT * FROM usuario";
    $result = $mysqli->query($query);
    $patients = [];

    while ($row = $result->fetch_assoc()) {
        $patients[] = $row;
    }

    echo json_encode($patients);
}

// AGREGAR PACIENTE: Insertar un nuevo paciente
if ($method == 'POST' && isset($_GET['action']) && $_GET['action'] == 'addPatient') {
    $nombre = $input['nombre'];
    $edad = $input['edad'];
    $direccion = $input['direccion'];
    $condicion = $input['condicion'];

    $stmt = $mysqli->prepare("INSERT INTO usuario (nom_usuario, ape_usuario, telefono_usuario, email_usuario, clave_usuario) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $nombre, $apellido, $telefono, $email, $clave);
    
    if ($stmt->execute()) {
        echo json_encode(["message" => "Paciente agregado exitosamente."]);
    } else {
        echo json_encode(["message" => "Error al agregar el paciente."]);
    }

    $stmt->close();
}

// EDITAR PACIENTE: Actualizar un paciente existente
if ($method == 'PUT' && isset($_GET['action']) && $_GET['action'] == 'editPatient') {
    $id = $input['id'];
    $nombre = $input['nombre'];
    $edad = $input['edad'];
    $direccion = $input['direccion'];
    $condicion = $input['condicion'];

    $stmt = $mysqli->prepare("UPDATE usuario SET nom_usuario = ?, ape_usuario = ?, telefono_usuario = ?, email_usuario = ?, clave_usuario = ? WHERE cod_usuario = ?");
    $stmt->bind_param("sssssi", $nombre, $apellido, $telefono, $email, $clave, $id);
    
    if ($stmt->execute()) {
        echo json_encode(["message" => "Paciente actualizado exitosamente."]);
    } else {
        echo json_encode(["message" => "Error al actualizar el paciente."]);
    }

    $stmt->close();
}

// ELIMINAR PACIENTE: Eliminar un paciente por su ID
if ($method == 'DELETE' && isset($_GET['action']) && $_GET['action'] == 'deletePatient') {
    $id = $input['id'];

    $stmt = $mysqli->prepare("DELETE FROM usuario WHERE cod_usuario = ?");
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        echo json_encode(["message" => "Paciente eliminado exitosamente."]);
    } else {
        echo json_encode(["message" => "Error al eliminar el paciente."]);
    }

    $stmt->close();
}

if ($method == 'POST' && isset($_GET['action']) && $_GET['action'] == 'addSignos') {
    $precion = $input['precion'];
    $glucosa = $input['glucosa'];
    $peso = $input['peso'];
    $glicemia = $input['glicemia'];
    $pulso = $input['pulso'];
    $temperatura = $input['temperatura'];
    $cod_usuario = $input['cod_usuario'];
    $fecha = date('Y-m-d'); // Fecha actual

    $stmt = $mysqli->prepare("INSERT INTO signos (precion, glucosa, peso, glicemia, pulso, temperatura, cod_usuario, fecha) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("iiiiiiis", $precion, $glucosa, $peso, $glicemia, $pulso, $temperatura, $cod_usuario, $fecha);
    
    if ($stmt->execute()) {
        echo json_encode(["message" => "Signos vitales agregados exitosamente."]);
    } else {
        echo json_encode(["message" => "Error al agregar los signos vitales."]);
    }

    $stmt->close();
}

// Cerrar la conexión a la base de datos
$mysqli->close();
?>
