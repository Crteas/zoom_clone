import http from "http";
import WebSocket from "ws";
import express from "express";

const PORT = 9500;

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => {
  console.log(`http://localhost:${PORT}`);
};

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

//fake db
const sockets = [];

//socket은 서버와 브라우저 사이의 연결

wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "Anon";
  console.log("Connected to Browser 🐱‍🏍");
  socket.on("close", () => console.log("Disconneted to Browser ✖"));
  socket.on("message", (msg) => {
    const message = JSON.parse(msg);
    switch (message.type) {
      case "new_message":
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket.nickname}: ${message.payload}`)
        );
        break;
      case "nickname":
        socket["nickname"] = message.payload;
        break;
    }
  });
});

server.listen(PORT, handleListen);
