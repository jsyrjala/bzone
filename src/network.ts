import io from 'socket.io-client'
import { Screen } from './ui'

export class Network {
    private clientId;
    private socket;
    private url;

    private player;
    private screen: Screen;

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

        this.socket.on('color', (msg: any) => {
            console.log('color', msg)
        })

        this.socket.on('errorMessage', (msg: any) => {
            console.log('errorMessage', msg)
        })

        this.socket.on('playerDisconnected', (msg: any) => {
            console.log('player disconnected', msg)
        })

        this.socket.on('start', (msg: any) => {
            console.log('game starting', msg)
            this.screen.updatePlayers(msg.players)
            const elem = document.querySelector('#player-info')
            const playerInfo = msg.players.map((player: any) => {
                const color = `rgb(${player.color.r*255},${player.color.g*255},${player.color.b*255})`
                if (player.id == this.clientId) {
                    // this is me
                    return `<div style="color: ${color}"><strong>${player.name}: ${player.score}</strong></div>`
                }

                return `<div style="color: ${color}">${player.name}: ${player.score}</div>`
            }).join('')
            elem.innerHTML = playerInfo
        })
    }

    sendState(tank: any) {
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