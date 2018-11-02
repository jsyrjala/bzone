
const STATE: any = {}
const observers: any = {}
const playerKeys: any = {}

const keyDownHandler = (event: KeyboardEvent) => {
    // ArrowUp
    STATE[event.code] = true
    if (observers[event.code]) {
        observers[event.code]()
    }
}

export const getKeyboardState = (tank: any) => {
    const keys = playerKeys[tank.id]
    return {
        left: STATE[keys.left],
        right: STATE[keys.right],
        forward: STATE[keys.forward],
        backward: STATE[keys.backward],
    }
}

const keyUpHandler = (event: KeyboardEvent) => {
    STATE[event.code] = false
}

const register = (tank: any, shootCode: string,
                  leftCode: string, rightCode: string,
                  forwardCode: string, backwardCode: string) => {
    observers[shootCode] = () => tank.shoot()
    playerKeys[tank.id] = {
        left: leftCode,
        right: rightCode,
        forward: forwardCode,
        backward: backwardCode,
    }
}

export const initKeyboard = (tanks: any[]) => {
    console.log('initKeyboard')
    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);

    register(tanks[0], 'ShiftLeft',
        'KeyA', 'KeyD',
        'KeyW', 'KeyS')

    register(tanks[1], 'ShiftRight',
        'ArrowLeft', 'ArrowRight',
        'ArrowUp', 'ArrowDown')
}
