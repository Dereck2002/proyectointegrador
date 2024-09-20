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

// LOGIN: Verificar si es médico o paciente, y devolver los datos
if ($method == 'POST' && isset($_GET['action']) && $_GET['action'] == 'login') {
    $username = $input['username'];
    $password = $input['password'];

    // Verificar en la tabla de médicos
    $stmt = $mysqli->prepare("SELECT * FROM medico WHERE email_medico = ? AND clave_medico = ?");
    $stmt->bind_param("ss", $username, $password);
    $stmt->execute();
    $result = $stmt->get_result();
    $medico = $result->fetch_assoc();
    
    if ($medico) {
        // Si el médico existe, devolver su información
        echo json_encode([
            "success" => true,
            "role" => "medico",
            "cod_medico" => $medico['cod_medico']
        ]);
    } else {
        // Si no es un médico, verificar en la tabla de pacientes (usuarios)
        $stmt = $mysqli->prepare("SELECT * FROM usuario WHERE email_usuario = ? AND clave_usuario = ?");
        $stmt->bind_param("ss", $username, $password);
        $stmt->execute();
        $result = $stmt->get_result();
        $paciente = $result->fetch_assoc();

        if ($paciente) {
            // Si el paciente existe, devolver su información
            echo json_encode([
                "success" => true,
                "role" => "paciente",
                "cod_usuario" => $paciente['cod_usuario']
            ]);
        } else {
            // Si no es ni médico ni paciente
            echo json_encode(["success" => false, "message" => "Credenciales incorrectas."]);
        }
    }
    
    $stmt->close();
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
    $nombre = $input['nom_usuario'];
    $apellido = $input['ape_usuario'];
    $telefono = $input['telefono_usuario'];
    $email = $input['email_usuario'];
    $clave = $input['clave_usuario'];

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
    $id = $input['cod_usuario'];
    $nombre = $input['nom_usuario'];
    $apellido = $input['ape_usuario'];
    $telefono = $input['telefono_usuario'];
    $email = $input['email_usuario'];
    $clave = $input['clave_usuario'];

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

// AGREGAR SIGNOS
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
// AGREGAR MEDICAMENTO
if ($method == 'POST' && isset($_GET['action']) && $_GET['action'] == 'addMedicamento') {
    $medicamento = $input['medicamento'];
    $dosis = $input['dosis'];
    $tiempo = $input['tiempo'];
    $cod_usuario = $input['cod_usuario'];
    $cod_medico = $input['cod_medico'];

    // Validar que todos los campos no estén vacíos
    if (!empty($medicamento) && !empty($dosis) && !empty($tiempo) && !empty($cod_usuario) && !empty($cod_medico)) {
        $stmt = $mysqli->prepare("INSERT INTO medicina (medicamento, dosis, tiempo, cod_usuario, cod_medico) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssii", $medicamento, $dosis, $tiempo, $cod_usuario, $cod_medico);
        
        if ($stmt->execute()) {
            echo json_encode(["message" => "Medicamento agregado exitosamente."]);
        } else {
            echo json_encode(["message" => "Error al agregar el medicamento."]);
        }

        $stmt->close();
    } else {
        echo json_encode(["message" => "Error: Faltan campos requeridos."]);
    }
}



// ENVIAR MENSAJE
if ($method == 'POST' && isset($_GET['action']) && $_GET['action'] == 'sendMessage') {
    $mensaje = $input['contenido'];
    $cod_medico = $input['cod_medico'];
    $cod_usuario = $input['cod_usuario'];

    $stmt = $mysqli->prepare("INSERT INTO mensaje (mensaje, cod_medico, cod_usuario) VALUES (?, ?, ?)");
    $stmt->bind_param("sii", $mensaje, $cod_medico, $cod_usuario);
    
    if ($stmt->execute()) {
        echo json_encode(["message" => "Mensaje enviado exitosamente."]);
    } else {
        echo json_encode(["message" => "Error al enviar el mensaje."]);
    }

    $stmt->close();
}

// LISTAR MENSAJES DEL USUARIO LOGUEADO
if ($method == 'GET' && isset($_GET['action']) && $_GET['action'] == 'listMessages') {
    $user_id = $_GET['user_id'];  // ID del usuario logueado
    $role = $_GET['role'];  // Rol del usuario ('medico' o 'paciente')

    // Dependiendo del rol, buscar mensajes donde el usuario esté involucrado
    if ($role === 'medico') {
        $query = "SELECT m.*, u.nom_usuario, u.ape_usuario FROM mensaje m 
                  JOIN usuario u ON m.cod_usuario = u.cod_usuario
                  WHERE m.cod_medico = ?";
    } else if ($role === 'paciente') {
        $query = "SELECT m.*, med.nom_medico, med.ape_medico FROM mensaje m 
                  JOIN medico med ON m.cod_medico = med.cod_medico
                  WHERE m.cod_usuario = ?";
    }

    $stmt = $mysqli->prepare($query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $mensajes = [];

    while ($row = $result->fetch_assoc()) {
        $mensajes[] = $row;
    }

    echo json_encode($mensajes);
    $stmt->close();
}

// LISTAR MÉDICOS
if ($method == 'GET' && isset($_GET['action']) && $_GET['action'] == 'listMedicos') {
    $query = "SELECT cod_medico, nom_medico, ape_medico FROM medico";
    $result = $mysqli->query($query);
    $medicos = [];

    while ($row = $result->fetch_assoc()) {
        $medicos[] = $row;
    }

    echo json_encode($medicos);
}

// LISTAR PACIENTES
if ($method == 'GET' && isset($_GET['action']) && $_GET['action'] == 'listPacientes') {
    $query = "SELECT cod_usuario, nom_usuario, ape_usuario FROM usuario";
    $result = $mysqli->query($query);
    $pacientes = [];

    while ($row = $result->fetch_assoc()) {
        $pacientes[] = $row;
    }

    echo json_encode($pacientes);
}

// Cerrar la conexión a la base de datos
$mysqli->close();
?>
