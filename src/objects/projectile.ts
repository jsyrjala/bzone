import * as BABYLON from 'babylonjs';
import Scene = BABYLON.Scene;
import Color3 = BABYLON.Color3;
import Vector3 = BABYLON.Vector3;

export const createProjectileFromTank = (scene: Scene, tank: any) => {
    return createProjectileObject(scene, tank.color,
        tank.body.position.clone(), tank.body.rotation.add(tank.turret.rotation))
}

export const createProjectileObject = (scene: Scene, color: Color3, position: Vector3, rotation: Vector3) => {
    const material = new BABYLON.StandardMaterial(name + 'projectileMaterial', scene);
    material.diffuseColor = color
    material.ambientColor = color

    const head = BABYLON.Mesh.CreateCylinder('projectileHead', 0.3, 0, 0.15,
        12, 2, scene)

    head.position.y = 0.25
    const body = BABYLON.Mesh.CreateCylinder('projectileBody', 0.2, 0.15, 0.15,
        12, 2, scene)

    const projectile = BABYLON.Mesh.MergeMeshes([head, body]) || ({} as any);
    projectile.material = material

    // TODO wrong starting position in some rotations, should be in ref to turret
    projectile.position = position

    // TODO should add tanks speed to bullet
    projectile.position.y = 0.9
    projectile.position.x += 0

    projectile.rotation.y = rotation.y
    projectile.rotation.z = Math.PI / 2

    // some sparks
    const particleSystem = new BABYLON.ParticleSystem("particles", 1000, scene);

    particleSystem.particleTexture = new BABYLON.Texture("assets/flare.png", scene);
    particleSystem.minSize = 0.05;
    particleSystem.maxSize = 0.2;

    particleSystem.minLifeTime = 0.00;
    particleSystem.maxLifeTime = 0.5;

    particleSystem.createPointEmitter(new BABYLON.Vector3(-1, 4, 2).negate(),
        new BABYLON.Vector3(1, 4, -2).negate());

    particleSystem.emitRate = 500;

    particleSystem.emitter = projectile
    particleSystem.start()

    return {
        mesh: projectile,
        created: Date.now(),
        dispose: () => {
            console.log('displosing projectile')
            particleSystem.emitter = projectile.position
            particleSystem.stop();
            projectile.dispose()
            // show particles after projectile hits, so wait a while
            // before removing particles
            setTimeout(() => particleSystem.dispose(), 2000)
        },
        move: () => {
            const speed = -1.2
            projectile.position.x += speed / 10 * Math.cos(projectile.rotation.y)
            projectile.position.z += -speed / 10 * Math.sin(projectile.rotation.y)
        }
    };
}