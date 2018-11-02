import * as BABYLON from 'babylonjs';
import Scene = BABYLON.Scene;
import Color3 = BABYLON.Color3;
import Vector3 = BABYLON.Vector3;

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

    const projectile = BABYLON.Mesh.MergeMeshes([head, body]);
    projectile.material = material
    projectile.position = tank.body.position.clone()
    projectile.position.y = 0.9

    projectile.rotation.y = tank.body.rotation.y + tank.turret.rotation.y
    projectile.rotation.z = Math.PI / 2
    return projectile;
}