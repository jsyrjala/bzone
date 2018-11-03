export class Screen {

    private clientId: string;

    constructor(clientId: string) {
        this.clientId = clientId
    }

    public updatePlayers(players: any[]) {
        const elem: any = document.querySelector('#player-info')
        const playerInfo = players.map((player: any) => {
            const color = `rgb(${player.color.r*255},${player.color.g*255},${player.color.b*255})`
            if (player.id == this.clientId) {
                // this is me
                return `<div style="color: ${color}"><strong>${player.name}: ${player.score}</strong></div>`
            }

            return `<div style="color: ${color}">${player.name}: ${player.score}</div>`
        }).join('')
        elem.innerHTML = playerInfo
    }
}