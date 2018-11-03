import io from 'socket.io-client'

export class Network {
    private clientId;
    private socket;
    private url;

    private player;

    constructor(url: string, clientId: string, player: any) {
        this.clientId = clientId
        this.url = url
        this.player = player
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