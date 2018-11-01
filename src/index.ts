import * as BABYLON from 'babylonjs';
const B = BABYLON

export default class Renderer {
    private _canvas?: HTMLCanvasElement;
    private _engine?: BABYLON.Engine;
    private _scene?: BABYLON.Scene;
    private counter = 1
    private camera: BABYLON.UniversalCamera
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


        var myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);

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

        this.camera.position.x=Math.sin(this.counter/10.0)
        this.camera.position.z=Math.sin(this.counter/23.0 + 8) - 10

    }

    initialize(canvas: HTMLCanvasElement) {
        window.HOT_SWAP_COUNTER= window.HOT_SWAP_COUNTER+1 || 0
        console.info('start', window.HOT_SWAP_COUNTER)
        const engine = new BABYLON.Engine(canvas, true);
        this.createScene(canvas, engine);

        this._scene.registerAfterRender(() => this.loop())
        engine.runRenderLoop(() => {
            this._scene.render();
        });

        window.addEventListener('resize', function () {
            engine.resize();
        });
    }
}

const renderer = new Renderer();
renderer.initialize(document.getElementById('render-canvas') as HTMLCanvasElement);
