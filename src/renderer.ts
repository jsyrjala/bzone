import * as BABYLON from 'babylonjs';
import {gamepadState, AXES} from './gamepad';
import {createTank} from './objects/tank';
import {createProjectile} from './objects/projectile';
import _ from 'lodash'

const B = BABYLON

export default class Renderer {
    private _canvas?: HTMLCanvasElement;
    private _engine?: BABYLON.Engine;
    private _scene?: BABYLON.Scene;
    private counter = 1
    private camera: BABYLON.UniversalCamera
    private positionElem = document.querySelector('#position')
    private rotationElem = document.querySelector('#rotation')
    private objs: Array<any> = []
    private shootingSound;
    private tanks = []

    createScene(canvas: HTMLCanvasElement, engine: BABYLON.Engine) {
        this._canvas = canvas;

        this._engine = engine;

        // This creates a basic Babylon Scene object (non-mesh)
        const scene = new BABYLON.Scene(engine);
        this._scene = scene;
        // This creates and positions a free camera (non-mesh)
        const camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(0, 1, -10), scene);
        this.camera = camera
        // This targets the camera to scene origin
        // camera.setTarget(BABYLON.Vector3.Zero());

        camera.position = new B.Vector3(0,3,-20)

        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 1), scene);
        light.intensity = 1;

        /// OBJECTS

        const pos1 = new B.Vector3(-2, 0, 0)
        const tankColor1 = new BABYLON.Color3(1, 0.5, 1);
        const tank1 = createTank('t1', scene, pos1, tankColor1)
        this.tanks.push(tank1)

        const pos2 = new B.Vector3(2, 0 , 0)
        const tankColor2 = new BABYLON.Color3(0, 1, 1);
        const tank2 = createTank('t2', scene, pos2, tankColor2)
        tank2.body.rotation.y = -2

        this.tanks.push(tank2)


        // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
        const ground = BABYLON.Mesh.CreateGround("ground1", 16, 16, 22, scene);
        const grass0 = new BABYLON.StandardMaterial("grass0", scene);
        grass0.diffuseTexture = new BABYLON.Texture("assets/texture1.png", scene);
        ground.material = grass0

        this.shootingSound = new BABYLON.Sound("50_cal", "assets/50_cal.wav", scene);

        console.log(ground, this._canvas, this._engine)
    }


    gamepadControl(tank: any) {
        const state = gamepadState();
        if (!state) {
            return
        }

        const ly = gamepadState().axes[AXES.LEFT_Y]
        const lx = gamepadState().axes[AXES.LEFT_X]

        const ry = gamepadState().axes[AXES.RIGHT_Y]
        const rx = gamepadState().axes[AXES.RIGHT_X]

        // control tank
        tank.body.rotation.y += lx / 40

        let speed = ly

        // reversing is slower
        if (speed > 0) {
            speed /= 2
        }

        tank.body.position.x += speed / 10 * Math.cos(tank.body.rotation.y)
        tank.body.position.z += -speed / 10 * Math.sin(tank.body.rotation.y)

        // rotate turret
        tank.turret.rotation.y += rx / 20

        // any button shoots
        const buttonPressed = _.find(state.buttons, (x: any) => x)

        if (tank.canShoot() && buttonPressed) {
            const projectile = createProjectile(this._scene, tank)
            tank.projectiles.push(projectile)
            this.shootingSound.play()
        }

        if (!buttonPressed) {
            tank.shooting = false
        }
    }

    showCameraInfo() {
        this.positionElem.innerHTML = '' +
            'x: ' + this.camera.position.x.toFixed(2) +
            ', y: ' + this.camera.position.y.toFixed(2) +
            ', z: ' + this.camera.position.z.toFixed(2)

        this.rotationElem.innerHTML = '' +
            'x: ' + this.camera.rotation.x.toFixed(2) +
            ', y: ' + this.camera.rotation.y.toFixed(2) +
            ', z: ' + this.camera.rotation.z.toFixed(2)
    }


    moveProjectiles(tank: any, tanks: any[]) {
        tank.projectiles.forEach((projectile: any) => {
            const speed = -1.2
            const mesh = projectile.mesh
            mesh.position.x += speed / 10 * Math.cos(mesh.rotation.y)
            mesh.position.z += -speed / 10 * Math.sin(mesh.rotation.y)
        })
        // kill bullets after 5 seconds
        const maxAge = 5
        const limit = Date.now() - maxAge * 1000
        tank.projectiles = tank.projectiles.map((projectile: any) => {
            if (projectile.created < limit) {
                projectile.mesh.dispose()
                return null
            }
            return projectile
        }).filter((x: any) => x)
    }

    loop() {
        this.counter ++
        const tank = this.tanks[0]

        this.gamepadControl(tank)

        this.showCameraInfo()

        this.tanks.forEach(tank => this.moveProjectiles(tank, this.tanks))
    }

    initialize(canvas: HTMLCanvasElement) {
        const w: any = window
        w.HOT_SWAP_COUNTER = w.HOT_SWAP_COUNTER+1 || 0
        console.info('Hot swap counter', w.HOT_SWAP_COUNTER)
        const engine = new BABYLON.Engine(canvas, true);
        this.createScene(canvas, engine);

        this._scene.registerAfterRender(() => this.loop())
        engine.runRenderLoop(() => {
            this._scene.render();
        });

        window.addEventListener('resize', () => {
            engine.resize();
        });
    }
}
