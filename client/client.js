const { io } = require("socket.io-client");

const TOKEN = "PASTE_JWT_TOKEN_HERE";
const RECEIVER_ID = "PASTE_OTHER_USER_ID";

const socket = io("http://localhost:5000", {
  auth: {
    token: TOKEN
  },
  transports: ["websocket"]
});

// --- DEBUG EVENTS ---
socket.on("connect", () => {
  console.log("Connected to socket server");
});

socket.on("connect_error", (err) => {
  console.log("Connection error:", err.message);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

// chat event 
socket.on("receiveMessage", (msg) => {
  console.log("Received:", msg.message);
});

socket.on("messageSent", (msg) => {
  console.log("Sent:", msg.message);
});

socket.on("onlineUsers", (users) => {
  console.log("Online users:", users);
});

socket.on("chatHistory", (messages) => {
  console.log("Chat History:");
  messages.forEach(m => {
    console.log(`${m.sender} -> ${m.message}`);
  });
});

// send message
setTimeout(() => {
  console.log("Sending message...");
  socket.emit("sendMessage", {
    receiverId: RECEIVER_ID,
    message: "Hello from Node client"
  });
}, 3000);

// chat history
setTimeout(() => {
  console.log("Fetching chat history...");
  socket.emit("getMessages", {
    userId: RECEIVER_ID
  });
}, 6000);
