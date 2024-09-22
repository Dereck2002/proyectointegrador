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

// LOGIN: Verificar si es médico, administrador o paciente, y devolver los datos
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
        // Si el médico existe, verificar si es administrador o solo médico
        $role = ($medico['rol'] === 'administrador') ? 'administrador' : 'medico';
        echo json_encode([
            "success" => true,
            "role" => $role,
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


// LISTAR PACIENTES
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] == 'listPacientes') {
    $query = "SELECT cod_usuario, cedula, nom_usuario, ape_usuario, telefono_usuario, email_usuario FROM usuario";
    $result = $mysqli->query($query);
    $patients = [];

    while ($row = $result->fetch_assoc()) {
        $patients[] = $row;
    }

    echo json_encode($patients);
}


// AGREGAR PACIENTE
if ($method == 'POST' && isset($_GET['action']) && $_GET['action'] == 'addPatient') {
    $cedula = $input['cedula'];
    $nombre = $input['nom_usuario'];
    $apellido = $input['ape_usuario'];
    $telefono = $input['telefono_usuario'];
    $email = $input['email_usuario'];
    $clave = $input['clave_usuario'];

    $stmt = $mysqli->prepare("INSERT INTO usuario (cedula, nom_usuario, ape_usuario, telefono_usuario, email_usuario, clave_usuario) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $cedula, $nombre, $apellido, $telefono, $email, $clave);
    
    if ($stmt->execute()) {
        echo json_encode(["message" => "Paciente agregado exitosamente."]);
    } else {
        echo json_encode(["message" => "Error al agregar el paciente."]);
    }

    $stmt->close();
}

// ACTUALIZAR PACIENTE
if ($method == 'PUT' && isset($_GET['action']) && $_GET['action'] == 'editPatient') {
    $id = $input['cod_usuario'];
    $cedula = $input['cedula'];
    $nombre = $input['nom_usuario'];
    $apellido = $input['ape_usuario'];
    $telefono = $input['telefono_usuario'];
    $email = $input['email_usuario'];
    $clave = $input['clave_usuario'];

    $stmt = $mysqli->prepare("UPDATE usuario SET cedula = ?, nom_usuario = ?, ape_usuario = ?, telefono_usuario = ?, email_usuario = ?, clave_usuario = ? WHERE cod_usuario = ?");
    $stmt->bind_param("ssssssi", $cedula, $nombre, $apellido, $telefono, $email, $clave, $id);
    
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

// LISTAR SIGNOS VITALES POR PACIENTE
if ($method == 'GET' && isset($_GET['action']) && $_GET['action'] == 'listSignos' && isset($_GET['cod_usuario'])) {
    $cod_usuario = $_GET['cod_usuario'];
    
    $stmt = $mysqli->prepare("SELECT * FROM signos WHERE cod_usuario = ?");
    $stmt->bind_param("i", $cod_usuario);
    $stmt->execute();
    
    $result = $stmt->get_result();
    $signos = [];

    while ($row = $result->fetch_assoc()) {
        $signos[] = $row;
    }

    echo json_encode($signos);
    $stmt->close();
}

// ACTUALIZAR SIGNO VITAL
if ($method == 'PUT' && isset($_GET['action']) && $_GET['action'] == 'updateSigno') {
    $input = json_decode(file_get_contents('php://input'), true);

    $precion = $input['precion'];
    $glucosa = $input['glucosa'];
    $peso = $input['peso'];
    $glicemia = $input['glicemia'];
    $pulso = $input['pulso'];
    $temperatura = $input['temperatura'];
    $cod_signos = $input['cod_signos'];

    $stmt = $mysqli->prepare("UPDATE signos SET precion = ?, glucosa = ?, peso = ?, glicemia = ?, pulso = ?, temperatura = ? WHERE cod_signos = ?");
    $stmt->bind_param("iiiiiii", $precion, $glucosa, $peso, $glicemia, $pulso, $temperatura, $cod_signos);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Signo vital actualizado exitosamente."]);
    } else {
        echo json_encode(["message" => "Error al actualizar el signo vital."]);
    }

    $stmt->close();
}

// ELIMINAR SIGNO VITAL
if ($method == 'DELETE' && isset($_GET['action']) && $_GET['action'] == 'deleteSigno' && isset($_GET['cod_signos'])) {
    $cod_signos = $_GET['cod_signos'];

    $stmt = $mysqli->prepare("DELETE FROM signos WHERE cod_signos = ?");
    $stmt->bind_param("i", $cod_signos);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Signo vital eliminado exitosamente."]);
    } else {
        echo json_encode(["message" => "Error al eliminar el signo vital."]);
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

// LISTAR MEDICAMENTOS POR PACIENTE
if ($method == 'GET' && isset($_GET['action']) && $_GET['action'] == 'listMedicamentos' && isset($_GET['cod_usuario'])) {
    $cod_usuario = $_GET['cod_usuario'];
    
    $stmt = $mysqli->prepare("SELECT * FROM medicina WHERE cod_usuario = ?");
    $stmt->bind_param("i", $cod_usuario);
    $stmt->execute();
    
    $result = $stmt->get_result();
    $medicamentos = [];

    while ($row = $result->fetch_assoc()) {
        $medicamentos[] = $row;
    }

    echo json_encode($medicamentos);
    $stmt->close();
}


// ACTUALIZAR MEDICAMENTO
if ($method == 'PUT' && isset($_GET['action']) && $_GET['action'] == 'updateMedicamento') {
    $input = json_decode(file_get_contents('php://input'), true);

    $medicamento = $input['medicamento'];
    $dosis = $input['dosis'];
    $tiempo = $input['tiempo'];
    $cod_medicina = $input['cod_medicina'];

    $stmt = $mysqli->prepare("UPDATE medicina SET medicamento = ?, dosis = ?, tiempo = ? WHERE cod_medicina = ?");
    $stmt->bind_param("sssi", $medicamento, $dosis, $tiempo, $cod_medicina);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Medicamento actualizado exitosamente."]);
    } else {
        echo json_encode(["message" => "Error al actualizar el medicamento."]);
    }

    $stmt->close();
}

// ELIMINAR MEDICAMENTO
if ($method == 'DELETE' && isset($_GET['action']) && $_GET['action'] == 'deleteMedicamento' && isset($_GET['cod_medicina'])) {
    $cod_medicina = $_GET['cod_medicina'];

    $stmt = $mysqli->prepare("DELETE FROM medicina WHERE cod_medicina = ?");
    $stmt->bind_param("i", $cod_medicina);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Medicamento eliminado exitosamente."]);
    } else {
        echo json_encode(["message" => "Error al eliminar el medicamento."]);
    }

    $stmt->close();
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

// OBTENER PERFIL DEL USUARIO
if ($method == 'GET' && isset($_GET['action']) && $_GET['action'] == 'getPerfil' && isset($_GET['cod_usuario'])) {
    $id = $_GET['cod_usuario'];

    $stmt = $mysqli->prepare("SELECT cod_usuario, cedula, nom_usuario, ape_usuario, telefono_usuario, email_usuario, clave_usuario FROM usuario WHERE cod_usuario = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    echo json_encode($user);

    $stmt->close();
}

// OBTENER PERFIL DEL DOCTOR
if ($method == 'GET' && isset($_GET['action']) && $_GET['action'] == 'getPerfilMedico' && isset($_GET['cod_medico'])) {
    $id = $_GET['cod_medico'];

    $stmt = $mysqli->prepare("SELECT cod_medico, cedula, nom_medico AS nom_usuario, ape_medico AS ape_usuario, telefono_medico AS telefono_usuario, email_medico AS email_usuario, clave_medico AS clave_usuario FROM medico WHERE cod_medico = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $doctor = $result->fetch_assoc();

    echo json_encode($doctor);

    $stmt->close();
}

// ACTUALIZAR PERFIL CON IMAGEN
if ($method == 'POST' && isset($_GET['action']) && $_GET['action'] == 'updateProfileWithImage') {
    $rol = $_POST['rol']; // 'medico' o 'paciente'
    $id = $_POST['id'];

    // Verificar si se subió una imagen
    if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['imagen']['tmp_name'];
        $fileName = $_FILES['imagen']['name'];
        
        // Ruta absoluta del directorio de subida en el servidor
        $uploadFileDir = './uploads/';
        
        // Verificar si el directorio 'uploads' existe, si no, crear uno
        if (!is_dir($uploadFileDir)) {
            mkdir($uploadFileDir, 0777, true);  // Crear la carpeta con permisos de escritura
        }

        // Ruta completa en el servidor para guardar la imagen
        $dest_path = $uploadFileDir . $fileName;

        // Mover la imagen subida al directorio de destino
        if (move_uploaded_file($fileTmpPath, $dest_path)) {
            // Ruta relativa para acceder a la imagen desde el navegador
            $relativePath = '/uploads/' . $fileName;

            if ($rol === 'medico') {
                // Actualizar imagen del médico en la base de datos con la ruta relativa
                $stmt = $mysqli->prepare("UPDATE medico SET imagen_medico = ? WHERE cod_medico = ?");
                $stmt->bind_param('si', $relativePath, $id);
            } else {
                // Actualizar imagen del paciente en la base de datos con la ruta relativa
                $stmt = $mysqli->prepare("UPDATE usuario SET imagen_usuario = ? WHERE cod_usuario = ?");
                $stmt->bind_param('si', $relativePath, $id);
            }

            if ($stmt->execute()) {
                echo json_encode(["message" => "Perfil actualizado exitosamente."]);
            } else {
                echo json_encode(["message" => "Error al actualizar el perfil."]);
            }

            $stmt->close();
        } else {
            echo json_encode(["message" => "Error al mover la imagen al directorio de destino."]);
        }
    } else {
        echo json_encode(["message" => "No se ha seleccionado una imagen."]);
    }

    // RECUPERAR CONTRASEÑA AUTOMÁTICAMENTE (SIN ROL MANUAL)
if ($method == 'POST' && isset($_GET['action']) && $_GET['action'] == 'resetPassword') {
    $cedula = $input['cedula'];
    $email = $input['email'];
    $new_password = password_hash($input['new_password'], PASSWORD_DEFAULT); // Encriptar nueva contraseña

    // Buscar primero en la tabla de médicos
    $stmt = $mysqli->prepare("SELECT * FROM medico WHERE cedula = ? AND email_medico = ?");
    $stmt->bind_param('ss', $cedula, $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $medico = $result->fetch_assoc();

    if ($medico) {
        // Si es un médico, actualizamos su contraseña
        $stmt = $mysqli->prepare("UPDATE medico SET clave_medico = ? WHERE cod_medico = ?");
        $stmt->bind_param('si', $new_password, $medico['cod_medico']);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Contraseña de médico actualizada correctamente."]);
        } else {
            echo json_encode(["message" => "Error al actualizar la contraseña del médico."]);
        }
    } else {
        // Si no es médico, buscar en la tabla de pacientes (usuarios)
        $stmt = $mysqli->prepare("SELECT * FROM usuario WHERE cedula = ? AND email_usuario = ?");
        $stmt->bind_param('ss', $cedula, $email);
        $stmt->execute();
        $result = $stmt->get_result();
        $paciente = $result->fetch_assoc();

        if ($paciente) {
            // Si es un paciente, actualizamos su contraseña
            $stmt = $mysqli->prepare("UPDATE usuario SET clave_usuario = ? WHERE cod_usuario = ?");
            $stmt->bind_param('si', $new_password, $paciente['cod_usuario']);
            if ($stmt->execute()) {
                echo json_encode(["message" => "Contraseña de paciente actualizada correctamente."]);
            } else {
                echo json_encode(["message" => "Error al actualizar la contraseña del paciente."]);
            }
        } else {
            echo json_encode(["message" => "Cédula o email incorrectos."]);
        }
    }

    $stmt->close();
}

// AGREGAR MÉDICO
if ($method == 'POST' && isset($_GET['action']) && $_GET['action'] == 'addMedico') {
    $input = json_decode(file_get_contents('php://input'), true);

    // Verificar los valores recibidos
    error_log(print_r($input, true));  // Depuración: imprime los valores recibidos en los logs del servidor

    $cedula = $input['cedula'] ?? null;
    $nombre = $input['nom_medico'] ?? null;
    $apellido = $input['ape_medico'] ?? null;
    $telefono = $input['telefono_medico'] ?? null;
    $email = $input['email_medico'] ?? null;
    $clave = $input['clave_medico'] ?? null;
    $especialidad = $input['espe_medico'] ?? null;
    $rol = $input['rol'] ?? 'medico';

    // Verificar si todos los campos están presentes
    if ($cedula && $nombre && $apellido && $telefono && $email && $clave && $especialidad && $rol) {
        $stmt = $mysqli->prepare("INSERT INTO medico (cedula, nom_medico, ape_medico, telefono_medico, email_medico, clave_medico, espe_medico, rol) 
                                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssssss", $cedula, $nombre, $apellido, $telefono, $email, $clave, $especialidad, $rol);
        
        if ($stmt->execute()) {
            echo json_encode(["message" => "Médico agregado exitosamente."]);
        } else {
            echo json_encode(["message" => "Error al agregar el médico: " . $stmt->error]);
        }

        $stmt->close();
    } else {
        echo json_encode(["message" => "Faltan campos obligatorios."]);
    }
}

// ACTUALIZAR MÉDICO
if ($method == 'PUT' && isset($_GET['action']) && $_GET['action'] == 'editMedico') {
    $id = $input['cod_medico'];  // Se espera que el código del médico sea enviado en el JSON
    $cedula = $input['cedula'];
    $nombre = $input['nom_medico'];
    $apellido = $input['ape_medico'];
    $telefono = $input['telefono_medico'];
    $email = $input['email_medico'];
    $clave = $input['clave_medico'];
    $especialidad = $input['espe_medico'];
    $rol = $input['rol'];

    // Preparar consulta de actualización
    $stmt = $mysqli->prepare("UPDATE medico SET cedula = ?, nom_medico = ?, ape_medico = ?, telefono_medico = ?, email_medico = ?, clave_medico = ?, espe_medico = ?, rol = ? 
                              WHERE cod_medico = ?");
    $stmt->bind_param("ssssssssi", $cedula, $nombre, $apellido, $telefono, $email, $clave, $especialidad, $rol, $id);
    
    if ($stmt->execute()) {
        echo json_encode(["message" => "Médico actualizado exitosamente."]);
    } else {
        echo json_encode(["message" => "Error al actualizar el médico."]);
    }

    $stmt->close();
}


if ($method == 'PUT' && isset($_GET['action']) && $_GET['action'] == 'updateMedico') {
    // Leer los datos JSON enviados en la solicitud
    $input = json_decode(file_get_contents('php://input'), true);

    $cedula = isset($input['cedula']) ? intval($input['cedula']) : null;
    $nombre = $input['nom_medico'] ?? null;
    $apellido = $input['ape_medico'] ?? null;
    $telefono = $input['telefono_medico'] ?? null;
    $email = $input['email_medico'] ?? null;
    $clave = $input['clave_medico'] ?? null;
    $especialidad = $input['espe_medico'] ?? null;
    $rol = $input['rol'] ?? 'medico';
    $cod_medico = $input['cod_medico'] ?? null; // ID del médico que se va a actualizar
    $imagen = $input['imagen_medico'] ?? null;

    if ($cedula && $nombre && $apellido && $telefono && $email && $clave && $especialidad && $rol && $cod_medico) {
        // Consulta de actualización
        $stmt = $mysqli->prepare("UPDATE medico SET cedula = ?, nom_medico = ?, ape_medico = ?, telefono_medico = ?, email_medico = ?, clave_medico = ?, espe_medico = ?, rol = ?, imagen_medico = ? WHERE cod_medico = ?");
        if ($stmt) {
            $stmt->bind_param('issssssssi', $cedula, $nombre, $apellido, $telefono, $email, $clave, $especialidad, $rol, $imagen, $cod_medico);
            if ($stmt->execute()) {
                echo json_encode(["message" => "Médico actualizado exitosamente."]);
            } else {
                echo json_encode(["message" => "Error al actualizar el médico: " . $stmt->error]);
            }
            $stmt->close();
        } else {
            echo json_encode(["message" => "Error en la consulta SQL: " . $mysqli->error]);
        }
    } else {
        echo json_encode(["message" => "Faltan campos requeridos."]);
    }
}


}




// Cerrar la conexión a la base de datos
$mysqli->close();
?>
