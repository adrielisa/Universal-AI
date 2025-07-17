// Backend sencillo con Node.js, Express y SQLite para login y registro

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3005;

// Middlewares
app.use(bodyParser.json());

// Base de datos SQLite persistente
const db = mysql.createPool({
    host: 'mysql-adrielisa.alwaysdata.net',
    user: 'TU_USUARIO',
    password: 'TU_PASSWORD',
    database: 'adrielisa_ia'
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

// Ruta para obtener todos los usuarios (sin passwords)
app.get('/users', (req, res) => {
    db.all(`SELECT id, nombre, email FROM usuarios`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Error al consultar usuarios' });
        res.json({ usuarios: rows });
    });
});

// Ruta para obtener un usuario específico por ID
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    db.get(`SELECT id, nombre, email FROM usuarios WHERE id = ?`, [id], (err, row) => {
        if (err) return res.status(500).json({ error: 'Error al consultar usuario' });
        if (!row) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({ usuario: row });
    });
});

// Levantar servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

// OpenAPI Spec para conexión IA
const openAPISpec = `
openapi: 3.1.0
info:
  title: API Universal Backend
  version: 1.0.0
servers:
  - url: https://universal-ai-production.up.railway.app

paths:
  /register:
    post:
      summary: Registrar un nuevo usuario
      operationId: crearUsuario
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                nombre:
                  type: string
                email:
                  type: string
                password:
                  type: string
      responses:
        '200':
          description: Usuario creado correctamente

  /login:
    post:
      summary: Iniciar sesión
      operationId: loginUsuario
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                password:
                  type: string
      responses:
        '200':
          description: Login exitoso

`;

// Endpoint para servir el OpenAPI
app.get('/openapi.yaml', (req, res) => {
    res.type('text/yaml').send(openAPISpec);
});
