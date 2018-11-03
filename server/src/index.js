const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const clients = {}
const availableColors = [
  {r: 1, g: 0.5, b: 1},
  {r: 0, g: 1, b: 1},
]

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

io.on('connection', (socket) => {
  socket.on('hello', (msg) => {
    const color = availableColors[Object.keys(clients).length]
    if (color) {
      clients[msg.clientId] = msg
      clients[msg.clientId][color] = color
      socket.emit('color', color)
    } else {
      socket.emit('errorMessage', {msg: 'game full'})
    }

    console.log('hello: ', msg.clientId);
  });

  socket.on('tankState', msg => {
    // console.log('tankState', msg)
  })
});