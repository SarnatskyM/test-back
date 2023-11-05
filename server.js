const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.static(__dirname + "/public"));

app.get('/api/metrics', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://monitor-sus.ru');
    res.json(ОТВЕТ)
  });


deviceCoordinates = {
  1234: { lat: 43.032018, lon: 44.674462 },
};

io.on("connection", (socket) => {
  console.log("New Websocket Connection");

  socket.on("subscribe", (device) => {
    socket.device = device;
    console.log(device);

    if (deviceCoordinates[device]) {
      console.log(deviceCoordinates[device]);
      socket.emit("newCoordinates", deviceCoordinates[device]);
    }
  });

  socket.on("coordinate", (data) => {
    setTimeout(() => {
      const newLat = data.lat;
      const newLon = data.lon - 0.0001;
      deviceCoordinates[socket.device] = { lat: newLat, lon: newLon };
      socket.broadcast.emit("newCoordinates", { lat: newLat, lon: newLon });
      socket.emit("newCoordinates", { lat: newLat, lon: newLon });
    }, 2000);
  });
});

server.listen(8008, () => {
  console.log("Server started on port 8008");
});
