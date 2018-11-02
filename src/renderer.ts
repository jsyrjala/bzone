import * as BABYLON from 'babylonjs';
import {gamepadState, AXES} from './gamepad';

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

        camera.rotation = new B.Vector3(0,0.2,0)

        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 1), scene);

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;


        const myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);

        myMaterial.diffuseColor = new BABYLON.Color3(1, 0, 1);
        myMaterial.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
        myMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
        myMaterial.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);

        // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
        const sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
        sphere.position.y = 1;
        sphere.material = myMaterial
        const barrel = BABYLON.Mesh.CreateCylinder('cylinder1', 4.11, 1, 1, 6, 2, scene)
        // Move the sphere upward 1/2 its height
        barrel.translate(new B.Vector3(0,0,-1), 2)
        // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
        const ground = BABYLON.Mesh.CreateGround("ground1", 16, 16, 22, scene);

        console.log(ground, this._canvas, this._engine)
    }

    loop() {
        this.counter ++
        const state = gamepadState();
        if (!state) {
            return
        }

        // Adding stuff on button press
        if (state.buttons[0] && this.objs.length == 0){
            const barrel2 = BABYLON.Mesh.CreateCylinder('cylinder2',
                6.11, 0, 2, 6, 2,
                this._scene)
            barrel2.translate(new B.Vector3(0,0,-3), 2)
            this.objs.push(barrel2)
            console.log(barrel2)
        }

        // Removing stuff
        if (state.buttons[1] && this.objs.length > 0){
            this.objs[0].dispose()
            this.objs = []
        }

        const ly = gamepadState().axes[AXES.LEFT_Y]
        const lx = gamepadState().axes[AXES.LEFT_X]

        const ry = gamepadState().axes[AXES.RIGHT_Y]
        const rx = gamepadState().axes[AXES.RIGHT_X]

        this.camera.position.x += lx / 10
        this.camera.position.z += -ly / 10

        this.camera.rotation.y +=  rx / 100
        this.camera.rotation.x += ry / 100

        this.positionElem.innerHTML = '' +
            'x: ' + this.camera.position.x.toFixed(2) +
            ', y: ' + this.camera.position.y.toFixed(2) +
            ', z: ' + this.camera.position.z.toFixed(2)

        this.rotationElem.innerHTML = '' +
            'x: ' + this.camera.rotation.x.toFixed(2) +
            ', y: ' + this.camera.rotation.y.toFixed(2) +
            ', z: ' + this.camera.rotation.z.toFixed(2)
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
