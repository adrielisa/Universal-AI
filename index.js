const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3005;

// Middleware
app.use(bodyParser.json());

// Conexión a MySQL Alwaysdata
const db = mysql.createPool({
    host: 'mysql-adrielisa.alwaysdata.net',
    user: 'TU_USUARIO',
    password: 'TU_PASSWORD',
    database: 'adrielisa_ia'
});
console.log('✅ Conectado a MySQL Alwaysdata');

// Ruta para registrar usuario
app.post('/register', async (req, res) => {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) return res.status(400).json({ error: 'Faltan datos' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)`;

    db.query(query, [nombre, email, hashedPassword], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al registrar', detalle: err });
        res.json({ mensaje: 'Usuario registrado', userId: results.insertId });
    });
});

// Ruta para login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Faltan datos' });

    db.query(`SELECT * FROM usuarios WHERE email = ?`, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Error en base de datos' });
        if (results.length === 0) return res.status(401).json({ error: 'Usuario no encontrado' });

        const usuario = results[0];
        const valid = await bcrypt.compare(password, usuario.password);
        if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

        res.json({ mensaje: 'Login exitoso', userId: usuario.id });
    });
});

// Ruta para obtener todos los usuarios
app.get('/users', (req, res) => {
    db.query(`SELECT id, nombre, email FROM usuarios`, (err, rows) => {
        if (err) return res.status(500).json({ error: 'Error al consultar usuarios' });
        res.json({ usuarios: rows });
    });
});

// Ruta para obtener usuario por ID
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    db.query(`SELECT id, nombre, email FROM usuarios WHERE id = ?`, [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al consultar usuario' });
        if (results.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({ usuario: results[0] });
    });
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

// Servir OpenAPI
app.get('/openapi.yaml', (req, res) => {
    res.type('text/yaml').send(openAPISpec);
});

// Servidor escuchando
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
