// Script para consultar la base de datos
const sqlite3 = require('sqlite3').verbose();

// Conectar a la base de datos (necesitas usar un archivo persistente)
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error al conectar:', err.message);
        return;
    }
    console.log('Conectado a SQLite');
});

// Función para consultar todos los usuarios
function consultarUsuarios() {
    return new Promise((resolve, reject) => {
        db.all("SELECT id, nombre, email FROM usuarios", [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

// Función para consultar un usuario por ID
function consultarUsuarioPorId(id) {
    return new Promise((resolve, reject) => {
        db.get("SELECT id, nombre, email FROM usuarios WHERE id = ?", [id], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

// Función para consultar por email
function consultarUsuarioPorEmail(email) {
    return new Promise((resolve, reject) => {
        db.get("SELECT id, nombre, email FROM usuarios WHERE email = ?", [email], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

// Función principal
async function main() {
    try {
        console.log('\n=== CONSULTA DE BASE DE DATOS ===\n');
        
        // Consultar todos los usuarios
        const usuarios = await consultarUsuarios();
        console.log('📋 Todos los usuarios:');
        console.table(usuarios);
        
        // Si hay usuarios, consultar el primero por ID
        if (usuarios.length > 0) {
            const primerUsuario = await consultarUsuarioPorId(usuarios[0].id);
            console.log('\n👤 Usuario por ID:');
            console.log(primerUsuario);
        }
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        db.close();
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    main();
}

module.exports = { consultarUsuarios, consultarUsuarioPorId, consultarUsuarioPorEmail };
