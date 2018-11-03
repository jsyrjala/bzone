import Renderer from "./renderer";
import {Network} from "./network";
import uuidv4 from 'uuid/v4'
import _ from 'lodash'
import {Screen} from './ui'

let playerName = _.shuffle([
    'Alpha',
    'Bravo',
    'Charlie',
    'Delta',
    'Echo',
    'Foxtrot',
    'Golf',
    'Hotel',
    'India',
    'Juliett',
    'Kilo',
    'Lima',
    'Mike',
    'November',
    'Oscar',
    'Papa',
    'Quebec',
    'Romeo',
    'Sierra',
    'Tango',
    'Uniform',
    'Victor',
    'Whiskey',
    'X-ray',
    'Yankee',
    'Zulu',
])[0]

const m = location.search.match(/name=(\w+)/)
if (m) {
    playerName = m[1]
}

// mute
const clientId = uuidv4()

const url = 'http://localhost:3000'
const screen = new Screen(clientId)

const player = {
    name: playerName
}
const network = new Network(url, clientId, player, screen)
network.init()
const renderer = new Renderer(network, screen);
renderer.initialize(document.getElementById('render-canvas') as HTMLCanvasElement);
