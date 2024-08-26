from flask import Flask, request, jsonify

app = Flask(__name__)

# Ruta para verificar usuario
@app.route('/api/verify_user', methods=['POST'])
def verify_user():
    data = request.get_json()
    id = data.get('id')
    password = data.get('password')

    if not id or not password:
        return jsonify({'valid': False}), 400

    # Leer el archivo de registros y verificar el ID y la contraseña
    try:
        with open('registros.txt', 'r') as file:
            lines = file.readlines()
            for line in lines:
                file_id, file_password = line.strip().split(',')
                if file_id == id and file_password == password:
                    return jsonify({'valid': True})

    except FileNotFoundError:
        return jsonify({'valid': False}), 500

    return jsonify({'valid': False})

if __name__ == '__main__':
    app.run(port=5000)
