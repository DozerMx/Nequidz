from flask import Flask, request, jsonify

app = Flask(__name__)

# Ruta para verificar el ID y la contraseña
@app.route('/api/verify_user', methods=['POST'])
def verify_user():
    data = request.get_json()
    user_id = data.get('id')
    password = data.get('password')

    try:
        # Lee el archivo registros.txt
        with open('/storage/emulated/0/Nequi/registros.txt', 'r') as file:
            for line in file:
                stored_id, stored_password = line.strip().split(',')
                if stored_id == user_id and stored_password == password:
                    return jsonify(valid=True)
        return jsonify(valid=False)
    except Exception as e:
        return jsonify(valid=False, error=str(e))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)