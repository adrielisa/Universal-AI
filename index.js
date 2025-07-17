// Backend sencillo con Node.js, Express y SQLite para login y registro

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3005;

// Middlewares
app.use(bodyParser.json());

// Base de datos SQLite
const db = new sqlite3.Database(':memory:', (err) => {
    if (err) console.error(err.message);
    else console.log('Conectado a SQLite en memoria');
});

// Crear tabla usuarios
db.run(`CREATE TABLE usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    email TEXT UNIQUE,
    password TEXT
)`);

// Ruta de registro
app.post('/register', async (req, res) => {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) {
        return res.status(400).json({ error: 'Faltan datos' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)`;
    db.run(query, [nombre, email, hashedPassword], function (err) {
        if (err) return res.status(500).json({ error: 'Error al registrar' });
        res.json({ mensaje: 'Usuario registrado', userId: this.lastID });
    });
});

// Ruta de login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Faltan datos' });
    }
    db.get(`SELECT * FROM usuarios WHERE email = ?`, [email], async (err, row) => {
        if (err) return res.status(500).json({ error: 'Error en base de datos' });
        if (!row) return res.status(401).json({ error: 'Usuario no encontrado' });

        const valid = await bcrypt.compare(password, row.password);
        if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

        res.json({ mensaje: 'Login exitoso', userId: row.id });
    });
});

// Levantar servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
