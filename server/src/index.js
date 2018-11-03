const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const uuid = require('uuid/v4')

const clients = {}
const availableColors = [
  {r: 1, g: 0.5, b: 1},
  {r: 0, g: 1, b: 1},
  {r: 1, g: 1, b: 1},
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
  const serverClientId = uuid()

  console.log('User connected', serverClientId);
  socket.on('disconnect', (error) => {
    console.log('User disconnected', error);
    // remove from waiting list
    const waitingClient = playersWaiting.filter((client) => client.socket === socket)[0]
    if (waitingClient) {
      console.log('Removed player was in waiting list')
      const index = playersWaiting.indexOf(waitingClient)
      playersWaiting.splice(index, 1);
      socket.emit('wait', {
        playersWaiting: playersWaiting.length,
        maxPlayers: maxGamePlayers,
      })
    } else {
      console.log('Disconnected player not in waiting list')
    }

    // remove from client list
    const client = Object.values(clients).filter(client => client.socket === socket)[0]
    if (client) {
      delete clients[client.id]
    }

    const game = games[client.gameId]
    if (game) {
      game.clients.forEach(gameClient => {
        if (gameClient.id === client.id) {
          return
        }
        gameClient.socket.emit('playerDisconnected', {
          player: client.player
        })
      })
    }

  });

  socket.on('hello', (msg) => {
    console.log('User hello', msg)
    const client = msg
    client.player.score = 0
    client.player.color = availableColors[Object.keys(playersWaiting).length]
    client.id = serverClientId
    client.player.clientId = client.clientId
    client.socket = socket
    clients[client.id] = client

    playersWaiting.push(client)

    if (playersWaiting.length == maxGamePlayers) {
      console.log('Game starting', playersWaiting)
      const game = {
        id: uuid(),
        clients: playersWaiting
      }

      game.clients.forEach(client => client.gameId = game.id)
      games[game.id] = game
      console.log('Start game', game.id)

      // randomize locations
      game.clients.filter(client => {
        client.socket.emit('start', {
          players: game.clients.map(client => client.player)
        })
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

  const sendToOtherGameParticipants = (event, msg) => {
    const client = clients[serverClientId]
    if (!client) {
      return
    }
    const game = games[client.gameId]
    if (!game) {
      return
    }
    game.clients.forEach(otherClient => {
      if (otherClient.clientId !== client.clientId) {
        otherClient.socket.emit(event, msg)
      }
    })
  }

  const sendToAllGameParticipants = (event, msg) => {
    const client = clients[serverClientId]
    if (!client) {
      return
    }
    const game = games[client.gameId]
    if (!game) {
      return
    }
    game.clients.forEach(otherClient => {
      otherClient.socket.emit(event, msg)
    })
  }

  socket.on('tankState', msg => {
    sendToOtherGameParticipants('tankState', msg)
  })

  socket.on('newProjectile', msg => {
    sendToOtherGameParticipants('newProjectile', msg)
  })

  socket.on('scoreUpdate', msg => {
    sendToAllGameParticipants('scoreUpdate', msg)
  })

});