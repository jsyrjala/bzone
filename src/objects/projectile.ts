import * as BABYLON from 'babylonjs';
import Scene = BABYLON.Scene;

// color: Color3, position: Vector3, rotation: Vector3) => {
export const createProjectile = (scene: Scene, tank: any) => {
    const material = new BABYLON.StandardMaterial(name + 'projectileMaterial', scene);
    material.diffuseColor = tank.color
    material.ambientColor = tank.color


    const head = BABYLON.Mesh.CreateCylinder('projectileHead', 0.3, 0, 0.15,
        12, 2, scene)

    head.position.y = 0.25
    const body = BABYLON.Mesh.CreateCylinder('projectileBody', 0.2, 0.15, 0.15,
        12, 2, scene)

    const projectile = BABYLON.Mesh.MergeMeshes([head, body]) || ({} as any);
    projectile.material = material

    // TODO wrong starting position in some rotations, should be in ref to turret
    projectile.position = tank.body.position.clone()

    // TODO should add tanks speed to bullet
    projectile.position.y = 0.9
    projectile.position.x += 0

    projectile.rotation.y = tank.body.rotation.y + tank.turret.rotation.y
    projectile.rotation.z = Math.PI / 2

    const particleSystem = new BABYLON.ParticleSystem("particles", 1000, scene);
    //particleSystem.disposeOnStop = true;
    //particleSystem.emitter = projectile.position
    particleSystem.particleTexture = new BABYLON.Texture("assets/flare.png", scene);
    particleSystem.minSize = 0.05;
    particleSystem.maxSize = 0.2;
    // Life time of each particle (random between...
    particleSystem.minLifeTime = 0.00;
    particleSystem.maxLifeTime = 0.5;

    // particleSystem.addColorGradient(0, new BABYLON.Color4(1, 1, 1, 0));
    // particleSystem.addColorGradient(1.0, new BABYLON.Color4(0, 0, 0, 1));

    // particleSystem.direction1 = projectile.rotation
    // particleSystem.direction2 = projectile.rotation

    // particleSystem.addVelocityGradient(0, 0.5);
    // Emission rate

    /*
    var coneEmitter = new BABYLON.ConeParticleEmitter(2, 0.1);
    coneEmitter.radiusRange = 1;
    coneEmitter.heightRange = 1;

    particleSystem.particleEmitterType = coneEmitter;
*/

    particleSystem.createPointEmitter(new BABYLON.Vector3(-1, 4, 2), new BABYLON.Vector3(1, 4, -2));

    particleSystem.emitRate = 500;

    particleSystem.emitter = projectile
    particleSystem.start()

    return {
        mesh: projectile,
        created: Date.now(),
        dispose: () => {
            console.log('displosing projectile')
            particleSystem.emitter = projectile.position.clone()
            particleSystem.stop();
            projectile.dispose()

        },
        move: () => {
            const speed = -1.2
            projectile.position.x += speed / 10 * Math.cos(projectile.rotation.y)
            projectile.position.z += -speed / 10 * Math.sin(projectile.rotation.y)
        }
    };
}