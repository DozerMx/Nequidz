<?php
// Ruta al archivo de registros
$archivoRegistros = 'registros.txt';

// Verifica si se han enviado los registros actualizados mediante POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Lee los registros enviados en formato JSON
    $registrosJson = file_get_contents('php://input');
    
    // Decodifica los registros JSON a un arreglo PHP
    $registros = json_decode($registrosJson, true);

    if (json_last_error() === JSON_ERROR_NONE) {
        // Abre el archivo en modo de escritura (sobrescribe el contenido)
        $archivo = fopen($archivoRegistros, 'w');

        if ($archivo) {
            // Recorre los registros y escribe cada uno en el archivo
            foreach ($registros as $registro) {
                $linea = implode(',', $registro) . "\n";
                fwrite($archivo, $linea);
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
        // Error en el formato JSON
        http_response_code(400);
        echo "Invalid JSON format";
    }
} else {
    // Respuesta en caso de que no se envíen datos correctamente
    http_response_code(400);
    echo "Invalid request";
}
?>
