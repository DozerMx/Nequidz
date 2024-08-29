<?php
// Ruta al archivo de registros
$archivoRegistros = 'registros.txt';

// Verifica si se ha enviado un nuevo usuario mediante POST
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['new_user'])) {
    $nuevoUsuario = trim($_POST['new_user']);
    list($id, $nombre, $dispositivo) = explode(',', $nuevoUsuario);

    $contenidoActual = file_get_contents($archivoRegistros);
    $lineas = explode("\n", trim($contenidoActual));
    
    $usuarioExiste = false;
    $contenidoActualizado = "";

    foreach ($lineas as $linea) {
        if (strpos($linea, "$id,") === 0) {
            $usuarioExiste = true;
            $contenidoActualizado .= "$id,$nombre,$dispositivo\n";  // Actualizar dispositivo
        } else {
            $contenidoActualizado .= "$linea\n";
        }
    }

    if (!$usuarioExiste) {
        $contenidoActualizado .= "$nuevoUsuario\n";
    }

    if (file_put_contents($archivoRegistros, $contenidoActualizado)) {
        echo "success";
    } else {
        http_response_code(500);
        echo "error";
    }
} else {
    http_response_code(400);
    echo "Invalid request";
}
?>
