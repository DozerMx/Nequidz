<?php
// Ruta al archivo de registros
$archivoRegistros = 'registros.txt';

// Lee el archivo de registros
$registros = file($archivoRegistros, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
$registrosArray = array_map(function($linea) {
    return explode(',', $linea);
}, $registros);

// Verifica si se ha enviado una actualización de registros
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['registros'])) {
    $registrosActualizados = json_decode($_POST['registros'], true);
    
    // Guarda los registros actualizados en el archivo
    $archivo = fopen($archivoRegistros, 'w');
    
    if ($archivo) {
        foreach ($registrosActualizados as $registro) {
            fwrite($archivo, implode(',', $registro) . "\n");
        }
        fclose($archivo);

        // Respuesta exitosa
        echo "success";
    } else {
        // Error al abrir el archivo
        http_response_code(500);
        echo "error";
    }
} else {
    // Respuesta en caso de que no se envíe la actualización de registros correctamente
    http_response_code(400);
    echo "Invalid request";
}
?>