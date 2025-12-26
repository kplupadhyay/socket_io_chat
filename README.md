# Real-time Chat App with Socket.io and JWT Authentication

This is a real-time chat app built with Node.js, Express, MongoDB, Socket.io, and JWT authentication. Users can register, log in, send real-time messages, and fetch chat history. Features include hashed password authentication, JWT-based login, real-time messaging, online user tracking, and REST API support. Requirements: Node.js v16+, MongoDB instance (local or cloud), npm or yarn.

**Setup & Run**
- Clone the repository: `git clone <repository_url> && cd <repository_folder>`
- Install dependencies: `npm install`
- Create a `.env` file with:

- Start the server: `npm run start` (Server runs at `http://localhost:5000`)

**Register a User**
- Endpoint: `POST /api/auth/register`
- Body: `{"username": "your_username", "password": "your_password"}`
- Response: `{"userId": "<user_id>", "username": "your_username"}`

**Login a User**
- Endpoint: `POST /api/auth/login`
- Body: `{"username": "your_username", "password": "your_password"}`
- Response: `{"token": "<jwt_token>", "userId": "<user_id>"}`

**Socket.io Events**
- Connect & authenticate: 
```javascript
const socket = io("http://localhost:5000",{auth:{token:"<JWT_TOKEN>"},transports:["websocket"]});
