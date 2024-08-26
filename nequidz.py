import telebot

# Inicializa el bot con el token correspondiente
TOKEN = '6849672627:AAEy3hMS-jjVXl65wWt3421TfOFryRMvk5M'
bot = telebot.TeleBot(TOKEN)

# Variable temporal para almacenar datos entre comandos
temp_data = {}

# Ruta a los archivos de interés
JS_FILE_PATH = '/storage/emulated/0/Nequi/script.js'
REGISTROS_FILE_PATH = '/storage/emulated/0/Nequi/registros.txt'

# Comando /start para iniciar la conversación
@bot.message_handler(commands=['start'])
def send_welcome(message):
    bot.reply_to(message, '¡Bienvenido! Usa /generar para crear un nuevo ID y contraseña.')

# Comando /generar para comenzar el proceso de generación
@bot.message_handler(commands=['generar'])
def request_id(message):
    bot.reply_to(message, 'Introduzca la ID a guardar:')
    bot.register_next_step_handler(message, process_id)

def process_id(message):
    temp_data['id'] = message.text
    bot.reply_to(message, 'Introduzca la contraseña a guardar:')
    bot.register_next_step_handler(message, process_password)

def process_password(message):
    temp_data['password'] = message.text
    update_js_file(temp_data['id'], temp_data['password'])
    update_registros_file(temp_data['id'], temp_data['password'])
    bot.reply_to(message, 'ID y contraseña guardados exitosamente.')

def update_js_file(id_value, password_value):
    with open(JS_FILE_PATH, 'r+') as file:
        lines = file.readlines()
        # Buscar el lugar en el script JS donde guardar los valores
        for i, line in enumerate(lines):
            if "const storedIdsAndKeys =" in line:
                lines[i+1] = f'    "{id_value}": "{password_value}",\n'
                break
        # Sobrescribir el archivo JS
        file.seek(0)
        file.writelines(lines)

def update_registros_file(id_value, password_value):
    with open(REGISTROS_FILE_PATH, 'a') as file:
        file.write(f'ID: {id_value}, Contraseña: {password_value}\n')

if __name__ == '__main__':
    bot.polling(none_stop=True)