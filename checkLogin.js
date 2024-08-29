const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
    const { id, password } = JSON.parse(event.body);

    // Ruta al archivo de registros
    const filePath = path.resolve(__dirname, '../registros.txt');
    const registros = fs.readFileSync(filePath, 'utf-8').split('\n').filter(line => line);

    let responseMessage = "Acceso denegado";
    let updatedRegistros = registros.slice();

    registros.forEach((line, index) => {
        const [userId, userPassword, dispositivos] = line.split(',');

        if (userId === id && userPassword === password) {
            const dispositivosCount = dispositivos ? dispositivos.split('|').length : 0;

            if (dispositivosCount < 1) { // Permitir solo un dispositivo
                responseMessage = "Acceso permitido";
                updatedRegistros[index] = `${userId},${userPassword},dispositivo_1`; // Aquí podrías agregar un identificador de dispositivo real
            } else {
                responseMessage = "Ya hay un dispositivo conectado";
            }
        }
    });

    // Escribir los cambios en registros.txt
    fs.writeFileSync(filePath, updatedRegistros.join('\n'));

    return {
        statusCode: 200,
        body: JSON.stringify({ message: responseMessage })
    };
};