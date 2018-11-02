
const STATE: any = {}
const observers: any = {}


const keyDownHandler = (event: KeyboardEvent) => {
    STATE[event.code] = true
    if (observers[event.code]) {
        observers[event.code]()
    }
}

const keyUpHandler = (event: KeyboardEvent) => {
    STATE[event.code] = false
}

export const initKeyboard = (tanks: any[]) => {
    console.log('initKeyboard')
    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);

    observers['ShiftLeft'] = () => tanks[0].shoot()

    observers['ShiftRight'] = () => tanks[1].shoot()


}
