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

// LOGIN: Verificar si es administrador, médico o paciente
if ($method == 'POST' && isset($_GET['action']) && $_GET['action'] == 'login') {
    $username = $input['username'];
    $password = $input['password'];

    // Verificar en la tabla de administradores
    $stmt = $mysqli->prepare("SELECT * FROM administrador WHERE email_medico = ? AND clave_medico = ?");
    $stmt->bind_param("ss", $username, $password);
    $stmt->execute();
    $result = $stmt->get_result();
    $admin = $result->fetch_assoc();

    if ($admin) {
        echo json_encode([
            "success" => true,
            "role" => 'administrador',
            "cod_admin" => $admin['cod_medico_admin']  // Enviar cod_medico_admin como cod_admin
        ]);
    } else {
        // Verificar en la tabla de médicos
        $stmt = $mysqli->prepare("SELECT * FROM medico WHERE email_medico = ? AND clave_medico = ?");
        $stmt->bind_param("ss", $username, $password);
        $stmt->execute();
        $result = $stmt->get_result();
        $medico = $result->fetch_assoc();
        
        if ($medico) {
            echo json_encode([
                "success" => true,
                "role" => 'medico',
                "cod_medico" => $medico['cod_medico']  // Enviar cod_medico
            ]);
        } else {
            // Verificar en la tabla de pacientes
            $stmt = $mysqli->prepare("SELECT * FROM usuario WHERE email_usuario = ? AND clave_usuario = ?");
            $stmt->bind_param("ss", $username, $password);
            $stmt->execute();
            $result = $stmt->get_result();
            $paciente = $result->fetch_assoc();

            if ($paciente) {
                echo json_encode([
                    "success" => true,
                    "role" => 'paciente',
                    "cod_usuario" => $paciente['cod_usuario']
                ]);
            } else {
                echo json_encode(["success" => false, "message" => "Credenciales incorrectas."]);
            }
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



// AGREGAR MENSAJE (SendMessage)
if ($method == 'POST' && isset($_GET['action']) && $_GET['action'] == 'sendMessage') {
    $input = json_decode(file_get_contents('php://input'), true);

    // Verificar que se haya enviado el contenido del mensaje
    if (isset($input['mensaje']) && isset($input['cod_medico']) && isset($input['cod_usuario'])) {
        $mensaje = $input['mensaje'];
        $cod_medico = $input['cod_medico'];
        $cod_usuario = $input['cod_usuario'];

        // Preparar la consulta para insertar el mensaje en la base de datos
        $stmt = $mysqli->prepare("INSERT INTO mensaje (mensaje, cod_medico, cod_usuario) VALUES (?, ?, ?)");
        $stmt->bind_param("sii", $mensaje, $cod_medico, $cod_usuario);
        
        if ($stmt->execute()) {
            echo json_encode(["message" => "Mensaje enviado exitosamente."]);
        } else {
            echo json_encode(["message" => "Error al enviar el mensaje: " . $stmt->error]);
        }

        $stmt->close();
    } else {
        echo json_encode(["message" => "Faltan campos obligatorios."]);
    }
}


// Actualizar mensaje
if ($_SERVER['REQUEST_METHOD'] === 'PUT' && isset($_GET['action']) && $_GET['action'] == 'updateMensaje') {
    // Leer los datos JSON enviados en la solicitud PUT
    $input = json_decode(file_get_contents("php://input"), true);
    
    $id_mensaje = isset($input['id']) ? intval($input['id']) : null;
    $nuevo_mensaje = isset($input['mensaje']) ? $input['mensaje'] : null;

    // Verificar que los datos necesarios están presentes
    if ($id_mensaje && $nuevo_mensaje) {
        $stmt = $mysqli->prepare("UPDATE mensaje SET mensaje = ? WHERE id = ?");
        $stmt->bind_param('si', $nuevo_mensaje, $id_mensaje);
        
        if ($stmt->execute()) {
            echo json_encode(["message" => "Mensaje actualizado exitosamente."]);
        } else {
            echo json_encode(["message" => "Error al actualizar el mensaje: " . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(["message" => "Datos incompletos para actualizar el mensaje."]);
    }
}

// Eliminar mensaje
if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['action']) && $_GET['action'] == 'deleteMensaje') {
    // Leer los datos JSON enviados en la solicitud DELETE
    $input = json_decode(file_get_contents("php://input"), true);

    $id_mensaje = isset($input['id']) ? intval($input['id']) : null;

    // Verificar que el ID del mensaje está presente
    if ($id_mensaje) {
        $stmt = $mysqli->prepare("DELETE FROM mensaje WHERE id = ?");
        $stmt->bind_param('i', $id_mensaje);
        
        if ($stmt->execute()) {
            echo json_encode(["message" => "Mensaje eliminado exitosamente."]);
        } else {
            echo json_encode(["message" => "Error al eliminar el mensaje: " . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(["message" => "ID del mensaje no proporcionado."]);
    }
}

// LISTAR MENSAJES DEL USUARIO LOGUEADO
if ($method == 'GET' && isset($_GET['action']) && $_GET['action'] == 'listMessages') {
    $user_id = $_GET['user_id'];  // ID del usuario logueado
    $role = $_GET['role'];  // Rol del usuario ('medico', 'paciente', o 'administrador')

    if ($role === 'medico') {
        // Mensajes enviados o recibidos por el médico
        $query = "SELECT m.*, u.nom_usuario, u.ape_usuario FROM mensaje m 
                  JOIN usuario u ON m.cod_usuario = u.cod_usuario
                  WHERE m.cod_medico = ?";
    } else if ($role === 'paciente') {
        // Mensajes enviados o recibidos por el paciente
        $query = "SELECT m.*, med.nom_medico, med.ape_medico FROM mensaje m 
                  JOIN medico med ON m.cod_medico = med.cod_medico
                  WHERE m.cod_usuario = ?";
    } else if ($role === 'administrador') {
        // Si es administrador, obtener todos los mensajes relacionados con el administrador
        $query = "SELECT m.*, u.nom_usuario, u.ape_usuario, med.nom_medico, med.ape_medico 
                  FROM mensaje m
                  LEFT JOIN usuario u ON m.cod_usuario = u.cod_usuario
                  LEFT JOIN medico med ON m.cod_medico = med.cod_medico
                  WHERE m.cod_admin = ? OR m.cod_usuario IS NOT NULL OR m.cod_medico IS NOT NULL";
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
    $cedula = $input['cedula'];
    $nombre = $input['nom_medico'];
    $apellido = $input['ape_medico'];
    $telefono = $input['telefono_medico'];
    $email = $input['email_medico'];
    $clave = $input['clave_medico'];
    $especialidad = $input['espe_medico'];

    $stmt = $mysqli->prepare("INSERT INTO medico (cedula, nom_medico, ape_medico, telefono_medico, email_medico, clave_medico, espe_medico) 
                              VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssss", $cedula, $nombre, $apellido, $telefono, $email, $clave, $especialidad);
    
    if ($stmt->execute()) {
        echo json_encode(["message" => "Médico agregado exitosamente."]);
    } else {
        echo json_encode(["message" => "Error al agregar el médico."]);
    }

    $stmt->close();
}

// ACTUALIZAR MÉDICO
if ($method == 'PUT' && isset($_GET['action']) && $_GET['action'] == 'editMedico') {
    $id = $input['cod_medico'];
    $cedula = $input['cedula'];
    $nombre = $input['nom_medico'];
    $apellido = $input['ape_medico'];
    $telefono = $input['telefono_medico'];
    $email = $input['email_medico'];
    $clave = $input['clave_medico'];
    $especialidad = $input['espe_medico'];

    $stmt = $mysqli->prepare("UPDATE medico SET cedula = ?, nom_medico = ?, ape_medico = ?, telefono_medico = ?, email_medico = ?, clave_medico = ?, espe_medico = ? 
                              WHERE cod_medico = ?");
    $stmt->bind_param("sssssssi", $cedula, $nombre, $apellido, $telefono, $email, $clave, $especialidad, $id);
    
    if ($stmt->execute()) {
        echo json_encode(["message" => "Médico actualizado exitosamente."]);
    } else {
        echo json_encode(["message" => "Error al actualizar el médico."]);
    }

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

// ELIMINAR MÉDICO
if ($method == 'DELETE' && isset($_GET['action']) && $_GET['action'] == 'deleteMedico') {
    $cod_medico = $input['cod_medico'];

    $stmt = $mysqli->prepare("DELETE FROM medico WHERE cod_medico = ?");
    $stmt->bind_param("i", $cod_medico);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Médico eliminado exitosamente."]);
    } else {
        echo json_encode(["message" => "Error al eliminar el médico."]);
    }

    $stmt->close();
}

// AGREGAR ADMINISTRADOR
if ($method == 'POST' && isset($_GET['action']) && $_GET['action'] == 'addAdmin') {
    $cedula = $input['cedula'];
    $nombre = $input['nom_medico'];
    $apellido = $input['ape_medico'];
    $telefono = $input['telefono_medico'];
    $email = $input['email_medico'];
    $clave = $input['clave_medico'];
    $especialidad = $input['espe_medico'];

    $stmt = $mysqli->prepare("INSERT INTO administrador (cedula, nom_medico, ape_medico, telefono_medico, email_medico, clave_medico, espe_medico) 
                              VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssss", $cedula, $nombre, $apellido, $telefono, $email, $clave, $especialidad);
    
    if ($stmt->execute()) {
        echo json_encode(["message" => "Administrador agregado exitosamente."]);
    } else {
        echo json_encode(["message" => "Error al agregar el administrador."]);
    }

    $stmt->close();
}

// LISTAR ADMINISTRADORES
if ($method == 'GET' && isset($_GET['action']) && $_GET['action'] == 'listAdmins') {
    $query = "SELECT cod_medico_admin, nom_medico, ape_medico FROM administrador";
    $result = $mysqli->query($query);
    $administradores = [];

    while ($row = $result->fetch_assoc()) {
        $administradores[] = $row;
    }

    echo json_encode($administradores);
}

// OBTENER PERFIL DEL ADMINISTRADOR
if ($method == 'GET' && isset($_GET['action']) && $_GET['action'] == 'getPerfilAdmin' && isset($_GET['cod_admin'])) {
    $cod_admin = $_GET['cod_admin'];
    
    $stmt = $mysqli->prepare("SELECT cod_medico_admin AS cod_admin, nom_medico AS nom_usuario, ape_medico AS ape_usuario, telefono_medico AS telefono_usuario, email_medico AS email_usuario, clave_medico AS clave_usuario FROM administrador WHERE cod_medico_admin = ?");
    $stmt->bind_param("i", $cod_admin);
    $stmt->execute();
    
    $result = $stmt->get_result();
    $admin = $result->fetch_assoc();
    
    echo json_encode($admin);
    $stmt->close();
}


}




// Cerrar la conexión a la base de datos
$mysqli->close();
?>
