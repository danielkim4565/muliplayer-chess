const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const PORT = process.env.PORT || 3001;

const app = express();
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("send_move", (data) => {
        socket.broadcast.to(data.roomCode).emit("receive_move", data);
    })

    socket.on("create_room", () => {
        const newCode = generateCode(5);
        socket.join(newCode);
        io.in(newCode).emit("receive_initial_data", {roomCode: newCode, board: "", side: {long: "white", short: "w"}});        
    })

    socket.on("join_room", (data) => {
        socket.join(data.roomCode);
        io.to(data.socketId).emit("receive_initial_data", {roomCode: data.roomCode, side: {long: "black", short: "b"}})
        socket.broadcast.in(data.roomCode).emit("want_room_data", {requestingSocket: data.socketId});
    })

    socket.on("send_room_data", (data) => {
        const mySide = (data.side.short === "w" ?  {short: "b", long: "black"} : {short: "w", long: "white"})
        io.to(data.requestingSocket).emit("receive_room_data", {board: data.board, side: mySide});
        //io.to(data.requestingSocket).emit("receive_move", {move: data.board});
    })
})

server.listen(PORT, () => {
    console.log("server is running")
})

const generateCode = length => {
    return Array(length).fill('x').join('').replace(/x/g, () => {
        return String.fromCharCode(Math.floor(Math.random() * 26) + 65)
    })
}