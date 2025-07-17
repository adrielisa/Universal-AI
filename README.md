# IA-Universal Backend

Backend sencillo con Node.js, Express y SQLite para sistema de login y registro.

## Características

- 🔐 Sistema de autenticación con login y registro
- 🗄️ Base de datos SQLite en memoria
- 🔒 Encriptación de contraseñas con bcrypt
- 🚀 API REST con Express.js

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/ia-universal-backend.git
cd ia-universal-backend
```

2. Instala las dependencias:
```bash
npm install
```

3. Ejecuta el servidor:
```bash
node index.js
```

El servidor estará disponible en `http://localhost:3005`

## Endpoints

### POST /register
Registra un nuevo usuario.

**Body:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "password": "mipassword123"
}
```

### POST /login
Autentica un usuario existente.

**Body:**
```json
{
  "email": "juan@ejemplo.com",
  "password": "mipassword123"
}
```

## Dependencias

- express: Framework web para Node.js
- sqlite3: Base de datos SQLite
- bcrypt: Encriptación de contraseñas
- body-parser: Middleware para parsear JSON

## Tecnologías

- Node.js
- Express.js
- SQLite
- bcrypt
