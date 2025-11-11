//Node Server which will handle socket.io connection
// const io = require("socket.io")(8000)
const app = require("express");
const { Server } = require("socket.io");
// Create the socket.io server with CORS options
const io = new Server(8000, {
    cors: {
        origin: ["http://127.0.0.1:5500", "http://localhost:5500"], // allow both
        methods: ["GET", "POST"],
    }
});

const users = {};

io.on("connection", socket => {
    socket.on('new-user-joined', name => {
        console.log("New User:", name);
        users[socket.id] = name; //appends the name of user in users object 
        socket.broadcast.emit('user-joined', name); //sends to all other users except the one who joined
    });
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
        //sends to all other users except the one who sent the message
    });
    socket.on('receive', message => {
        console.log("Message received:", message);
    });
    socket.on('disconnect', () => {
        const userName = users[socket.id];
        if (userName) {
            console.log("User disconnected:", userName);
            socket.broadcast.emit('left', userName);
            delete users[socket.id];
        }
    });
    socket.on('typing', () => {
        socket.broadcast.emit('typing', { name : users[socket.id] });
    });
});
console.log("Socket.IO server running on http://localhost:8000");
