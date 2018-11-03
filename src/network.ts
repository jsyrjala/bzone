import io from 'socket.io-client'
import { Screen } from './ui'
import Renderer from "./renderer";

export class Network {
    private clientId;
    private socket;
    private url;

    private player;
    private screen: Screen;
    private gameStarted: boolean = false
    private renderer: Renderer

    constructor(url: string, clientId: string, player: any, screen: Screen) {
        this.clientId = clientId
        this.url = url
        this.player = player
        this.screen = screen

    }

    init(renderer: Renderer) {
        console.log('network: initialize')
        this.renderer = renderer
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
            // TODO renderer.createPlayers
            this.renderer.createPlayers(msg.players)
            this.screen.updatePlayers(msg.players)
        })

        this.socket.on('tankState', (msg: any) => {
            this.renderer.updatePlayer(msg)
        })

        this.socket.on('projectile', (msg: any) => {
            console.log('projectile', msg)
            //this.renderer.createProjectile(msg)
        })
    }

    sendState(player: any) {
        const tank = player.tank
        if (!this.gameStarted) {
            return
        }
        if (player.clientId != this.clientId){
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

    sendProjectile(projectile: any) {
        this.socket.emit('projectile', {
            clientId: this.clientId,
            body: {
                position: projectile.mesh.position,
                rotation: projectile.mesh.rotation,
            }
        })
    }

}