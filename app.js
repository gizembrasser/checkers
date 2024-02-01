const express = require("express");
const http = require("http");
const { Server } = require("socket.io");


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    origin: 'http://localhost:3000'
});

// Set static folder
app.use(express.static("public"));

// Multiplayer setup (unfinished)
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // ...

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });

});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.use((req, res) => {
    res.status(404);
    res.send(`<h1>Error 404: resource not found</h1>`)
});

server.listen(3000, () => {
    console.log("Server is listening on port 3000");
});