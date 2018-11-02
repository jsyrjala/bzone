import * as BABYLON from 'babylonjs';
import Scene = BABYLON.Scene;
import Material = BABYLON.Material;
import {Color3} from 'babylonjs';
import Vector3 = BABYLON.Vector3;


const B = BABYLON


const createBody = (scene: Scene, material: Material) => {
    const body = BABYLON.MeshBuilder.CreateBox("box", {height: 1, width: 2, depth: 1}, scene)
    body.material = material
    return body
}

const createBarrel = (scene: Scene, material: Material) => {
    const barrel = BABYLON.Mesh.CreateCylinder('barrel', 0.5, 0.2, 0.2,
        12, 2, scene)
    barrel.material = material
    barrel.position.x = -0.4
    barrel.position.y = 0.8
    barrel.rotation.z = -3.14/2
    return barrel
}

const createTower = (scene: Scene, material: Material) => {
    const barrel = BABYLON.Mesh.CreateCylinder('tower', 2, 1, 1,
        12, 4, scene)
    barrel.material = material
    barrel.position.x = 0.3
    return barrel
}

export const createTank = (name: string, scene: Scene, position: Vector3, color: Color3) => {
    const tankMaterial = new BABYLON.StandardMaterial('tankMaterial', scene);
    tankMaterial.diffuseColor = color
    tankMaterial.ambientColor = color

    const tower = createTower(scene, tankMaterial)

    const body = createBody(scene, tankMaterial)

    const barrel = createBarrel(scene, tankMaterial)

    const merged = BABYLON.Mesh.MergeMeshes([body, tower, barrel]);
    merged.position = position
    return merged
}
