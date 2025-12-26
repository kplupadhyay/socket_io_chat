const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Message = require("../models/Message");

const onlineUsers = new Map();

module.exports = (io) => {

  // Socket authentication
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("Authentication required"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", async (socket) => {
    // Set user online
    onlineUsers.set(socket.userId, socket.id);
    await User.findByIdAndUpdate(socket.userId, { online: true });

    io.emit("onlineUsers", Array.from(onlineUsers.keys()));

    socket.on("sendMessage", async ({ receiverId, message }) => {
      if (!receiverId || !message) return;

      const newMessage = await Message.create({
        sender: socket.userId,
        receiver: receiverId,
        message
      });

      const receiverSocketId = onlineUsers.get(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", newMessage);
      }

      socket.emit("messageSent", newMessage);
    });

    // fetch chat history 
    socket.on("getMessages", async ({ userId }) => {
      const messages = await Message.find({
        $or: [
          { sender: socket.userId, receiver: userId },
          { sender: userId, receiver: socket.userId }
        ]
      }).sort({ createdAt: 1 });

      socket.emit("chatHistory", messages);
    });

    socket.on("disconnect", async () => {
      onlineUsers.delete(socket.userId);
      await User.findByIdAndUpdate(socket.userId, { online: false });

      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });
  });
};
