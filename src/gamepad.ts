import * as _ from 'lodash'

// https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
const getState = (gp: Gamepad) => {
    return {
        buttons: gp.buttons.map(button => button.pressed),
        axes: _.clone(gp.axes),
    }
}

const gamePadFound = (gp: Gamepad) => {
    console.info("Gamepad connected at index %d: %s. %d buttons, %d axes.",
        gp.index, gp.id,
        gp.buttons.length, gp.axes.length)
    const buttonsElem: any = document.querySelector('#buttons')
    const axesElem: any = document.querySelector('#axes')
    function showGamepad() {
        const state = getState(gp)
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