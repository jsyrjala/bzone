import * as _ from 'lodash'
import {minValue} from "./util";

// https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
const readState = (gp: Gamepad) => {
    return {
        buttons: gp.buttons.map(button => button.pressed),
        axes: gp.axes.map(axe => minValue(axe, 0.01)),
    }
}

let STATE: any

const gamePadFound = (gp: Gamepad) => {
    console.info("Gamepad connected at index %d: %s. %d buttons, %d axes.",
        gp.index, gp.id,
        gp.buttons.length, gp.axes.length)
    const buttonsElem: any = document.querySelector('#buttons')
    const axesElem: any = document.querySelector('#axes')
    function showGamepad() {
        const state = readState(gp)
        STATE = state
        buttonsElem.innerHTML = 'Buttons: ' + state.buttons.map((button, index) => {
            return index + ': ' + button
        }).join(', ')

        axesElem.innerHTML = 'Axes: ' + state.axes.map((axe, index) => {
            return index + ': ' + axe.toFixed(3)
        }).join(', ')
        requestAnimationFrame(showGamepad)
    }

    requestAnimationFrame(showGamepad)
}

export const gamepadState = () => STATE

const pollGamePad = (callback: Function) => {
    let interval: any = undefined

    const searchGamePad = () => {
        const gamepads = navigator.getGamepads()
        const gamepad = _.find(Object.values(gamepads), _.identity)
        if (gamepad) {
            callback(gamepad)
            clearInterval(interval)
        }
    }

    interval = setInterval(searchGamePad, 500)
    setTimeout(searchGamePad, 0)
}

export const initGamePad = () => {
    pollGamePad(gamePadFound)
}

export const AXES = {
    LEFT_Y: 1,
    LEFT_X: 0,
    RIGHT_Y: 2,
    RIGHT_X: 5
}