import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import dotenv from "dotenv";


dotenv.config();

const port = process.env.PORT || 3001;
const app = express();

// Create server and Socket.IO server
const server = createServer(app);

// CORS setup
const io = new Server(server, {
    cors: {
        origin: "https://chatting-app-frontend-wigx.onrender.com/",  // Frontend URL
        methods: ["GET", "POST"],
        credentials: true,
    }
});

// Middleware for CORS
app.use(cors({
    origin: "https://chatting-app-frontend-wigx.onrender.com/",  // Frontend URL
    methods: ["GET", "POST"],
    credentials: true,
}));

// Simple route to check server
app.get("/", (req, res) => {
    res.send("Hello world!");
});

// Authentication (dummy check)
// const user = true;  // Assume authenticated for now
// io.use((socket, next) => {
//     if (user) {
//         next();
//     } else {
//         next(new Error("Authentication error"));
//     }
// });

// Handling user connections and messages
io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    // Join room event
    socket.on("join-room", (room) => {
        socket.join(room);
        // console.log(`${socket.id} joined room ${room}`);
    });

    // Message event - broadcast to room
    socket.on("message", ({ message, room }) => {
        // console.log(`Message from ${socket.id}: ${message} to room: ${room}`);
        socket.to(room).emit("recive-message", { message });  // Emit(Send) message to all in room excluding sender
    });

    // User disconnect event
    socket.on("disconnect", () => {
        console.log("User Disconnected:", socket.id);
    });
});

// Start server
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
