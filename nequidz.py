import telebot
from telebot import types
import sqlite3
from datetime import datetime

# Token del bot
TOKEN = '6849672627:AAEy3hMS-jjVXl65wWt3421TfOFryRMvk5M'
bot = telebot.TeleBot(TOKEN)

# Ruta de la base de datos
DB_PATH = '/storage/emulated/0/Nequi/users.db'

# Conectar a la base de datos
def connect_db():
    conn = sqlite3.connect(DB_PATH)
    return conn, conn.cursor()

# Crear la tabla de usuarios si no existe
def create_table():
    conn, cursor = connect_db()
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        password TEXT NOT NULL,
        created_at TEXT NOT NULL
    )
    ''')
    conn.commit()
    conn.close()

create_table()

# Función para agregar un nuevo usuario
def add_user(user_id, password):
    conn, cursor = connect_db()
    created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute('INSERT INTO users (id, password, created_at) VALUES (?, ?, ?)', (user_id, password, created_at))
    conn.commit()
    conn.close()

# Función para listar todos los usuarios
def list_users():
    conn, cursor = connect_db()
    cursor.execute('SELECT id, password, created_at FROM users')
    users = cursor.fetchall()
    conn.close()
    return users

# Función para verificar un usuario
def verify_user(user_id, password):
    conn, cursor = connect_db()
    cursor.execute('SELECT * FROM users WHERE id=? AND password=?', (user_id, password))
    exists = cursor.fetchone() is not None
    conn.close()
    return exists

# Función para agregar un usuario a la lista negra
def blacklist_user(user_id):
    conn, cursor = connect_db()
    cursor.execute('DELETE FROM users WHERE id=?', (user_id,))
    conn.commit()
    conn.close()

# Comando /start
@bot.message_handler(commands=['start'])
def send_welcome(message):
    bot.reply_to(message, 'Usa /generar para crear un ID y CONTRASEÑA')

# Comando /generar
@bot.message_handler(commands=['generar'])
def handle_generate(message):
    msg = bot.reply_to(message, 'Introduce el ID:')
    bot.register_next_step_handler(msg, process_id)

def process_id(message):
    user_id = message.text
    msg = bot.reply_to(message, 'Introduce la contraseña:')
    bot.register_next_step_handler(msg, process_password, user_id)

def process_password(message, user_id):
    password = message.text
    add_user(user_id, password)
    bot.reply_to(message, f'ID y contraseña guardados correctamente.\nFecha de creación: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}')

# Comando /registros
@bot.message_handler(commands=['registros'])
def handle_registros(message):
    users = list_users()
    if users:
        response = 'Registros de usuarios:\n'
        for user in users:
            response += f'ID: {user[0]}, Contraseña: {user[1]}, Fecha: {user[2]}\n'
        bot.reply_to(message, response)
    else:
        bot.reply_to(message, 'No hay registros.')

# Comando /blacklist
@bot.message_handler(commands=['blacklist'])
def handle_blacklist(message):
    try:
        user_id = message.text.split()[1]
        blacklist_user(user_id)
        bot.reply_to(message, f'Usuario {user_id} ha sido agregado a la lista negra.')
    except IndexError:
        bot.reply_to(message, 'Por favor, proporciona un ID para agregar a la lista negra.')

# Inicio del bot
if __name__ == "__main__":
    bot.polling(none_stop=True)