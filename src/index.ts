import Renderer from "./renderer";
import {Network} from "./network";
import uuidv4 from 'uuid/v4'

// mute
const clientId = uuidv4()
const url = 'http://localhost:3000'
const player = {
    name: 'pelle'
}
const network = new Network(url, clientId, player)
network.init()
const renderer = new Renderer(network);
renderer.initialize(document.getElementById('render-canvas') as HTMLCanvasElement);
