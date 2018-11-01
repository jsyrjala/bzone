import {initGamePad} from './gamepad'
import Renderer from "./renderer";

initGamePad()

const renderer = new Renderer();
renderer.initialize(document.getElementById('render-canvas') as HTMLCanvasElement);
