
const STATE: any = {}
const observers: any = {}
const playerKeys: any = {}

const controlSets = [
    {
        shootCode: 'ShiftLeft',
        leftCode: 'KeyA', rightCode: 'KeyD',
        forwardCode: 'KeyW', backwardCode: 'KeyS'},
    {
        shootCode: 'ShiftRight',
        leftCode: 'ArrowLeft', rightCode: 'ArrowRight',
        forwardCode: 'ArrowUp', backwardCode: 'ArrowDown'
    }
]

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

const register = (tank: any, controlSet: any) => {
    observers[controlSet.shootCode] = () => tank.shoot()
    playerKeys[tank.id] = {
        left: controlSet.leftCode,
        right: controlSet.rightCode,
        forward: controlSet.forwardCode,
        backward: controlSet.backwardCode,
    }
}

export const initKeyboard = (tanks: any[]) => {
    console.log('initKeyboard')
    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);

    for (let i = 0; i < tanks.length && i < controlSets.length; i ++) {
        register(tanks[i], controlSets[i])
    }
}
