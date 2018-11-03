const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const uuid = require('uuid/v4')

const clients = {}
const availableColors = [
  {r: 1, g: 0.5, b: 1},
  {r: 0, g: 1, b: 1},
]

const games = {}

const maxGamePlayers = 2
let playersWaiting = []

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});

io.on('connection', (socket) => {
  console.log('User connected');
  socket.on('disconnect', (error) => {
    console.log('User disconnected', error);
    // remove from players waiting
    const client = playersWaiting.filter((client) => client.socket === socket)[0]
    if (client) {
      console.log('Removed player was in waiting list')
      const index = playersWaiting.indexOf(client)
      playersWaiting.splice(index, 1);
      socket.emit('wait', {
        playersWaiting: playersWaiting.length,
        maxPlayers: maxGamePlayers,
      })
    } else {
      console.log('Disconnected player not in waiting list')
    }

  });
});

io.on('connection', (socket) => {
  socket.on('hello', (msg) => {
    console.log('User hello', msg)
    const client = msg
    client.player.score = 0
    client.player.color = availableColors[Object.keys(playersWaiting).length]
    client.socket = socket

    playersWaiting.push(client)

    if (playersWaiting.length == maxGamePlayers) {
      console.log('Game starting', playersWaiting)
      const game = {
        id: uuid(),
        clients: playersWaiting
      }
      games[game.id] = game
      console.log('Start game', game.id)

      socket.emit('start', {
        players: game.clients.map(client => client.player)
      })

      playersWaiting = []
    } else {
      console.log(`Waiting for players ${playersWaiting.length}/${maxGamePlayers}. ` +
        `Total games running ${Object.keys(games).length}`)
      socket.emit('wait', {
        playersWaiting: playersWaiting.length,
        maxPlayers: maxGamePlayers,
      })
    }
  });

  socket.on('tankState', msg => {
    // console.log('tankState', msg)
  })
});