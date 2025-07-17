# Universal-AI Backend

Simple backend with Node.js, Express and SQLite for login and registration system.

## Features

- 🔐 Authentication system with login and registration
- 🗄️ In-memory SQLite database
- 🔒 Password encryption with bcrypt
- 🚀 REST API with Express.js

## Installation

1. Clone the repository:
```bash
git clone https://github.com/adrielisa/Universal-AI.git
cd Universal-AI
```

2. Install dependencies:
```bash
npm install
```

3. Run the server:
```bash
node index.js
```

The server will be available at `http://localhost:3005`

## Endpoints

### POST /register
Register a new user.

**Body:**
```json
{
  "nombre": "John Doe",
  "email": "john@example.com",
  "password": "mypassword123"
}
```

### POST /login
Authenticate an existing user.

**Body:**
```json
{
  "email": "john@example.com",
  "password": "mypassword123"
}
```

## Dependencies

- express: Web framework for Node.js
- sqlite3: SQLite database
- bcrypt: Password encryption
- body-parser: Middleware for parsing JSON

## Technologies

- Node.js
- Express.js
- SQLite
- bcrypt
