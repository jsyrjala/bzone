import io from 'socket.io-client'
import { Screen } from './ui'

export class Network {
    private clientId;
    private socket;
    private url;

    private player;
    private screen: Screen;
    private gameStarted: boolean = false

    constructor(url: string, clientId: string, player: any, screen: Screen) {
        this.clientId = clientId
        this.url = url
        this.player = player
        this.screen = screen

    }

    init() {
        console.log('network: initialize')
        this.socket = io(this.url)

        this.socket.on('connect', () => {
            console.log('Connected to server')
            this.socket.emit('hello', {
                clientId: this.clientId,
                player: this.player,
            })
        })

        this.socket.on('errorMessage', (msg: any) => {
            console.log('errorMessage', msg)
        })

        this.socket.on('playerDisconnected', (msg: any) => {
            console.log('player disconnected', msg)
        })

        this.socket.on('start', (msg: any) => {
            console.log('game starting', msg)
            this.gameStarted = true
            this.screen.updatePlayers(msg.players)
        })
    }

    sendState(tank: any) {
        if (!this.gameStarted) {
            return
        }
        this.socket.emit('tankState', {
            clientId: this.clientId,
            body: {
                position: tank.body.position,
                rotation: tank.body.rotation,
            },
            turret: {
                rotation: tank.turret.rotation
            }
        })
    }

}