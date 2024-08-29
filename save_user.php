<?php
// Ruta al archivo de registros
$archivoRegistros = 'registros.txt';

// Verifica si se ha enviado un nuevo usuario mediante POST
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['new_user'])) {
    $nuevoUsuario = trim($_POST['new_user']);

    // Abre el archivo en modo de añadir (append)
    $archivo = fopen($archivoRegistros, 'a');
    
    if ($archivo) {
        // Añade el nuevo usuario al archivo
        fwrite($archivo, $nuevoUsuario . "\n");
        fclose($archivo);

        // Respuesta exitosa
        echo "success";
    } else {
        // Error al abrir el archivo
        http_response_code(500);
        echo "error";
    }
} else {
    // Respuesta en caso de que no se envíe un nuevo usuario correctamente
    http_response_code(400);
    echo "Invalid request";
}
?>