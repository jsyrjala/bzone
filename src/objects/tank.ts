import * as BABYLON from 'babylonjs';
import Scene = BABYLON.Scene;
import Material = BABYLON.Material;
import {Color3} from 'babylonjs';
import Vector3 = BABYLON.Vector3;


const B = BABYLON


const createBody = (scene: Scene, material: Material) => {
    const barrel = BABYLON.Mesh.CreateCylinder('cylinder1', 4.11, 1, 1, 6, 2, scene)
    barrel.material = material
    return barrel
}

const createBarrel = (scene: Scene, material: Material) => {
    const barrel = BABYLON.Mesh.CreateCylinder('cylinder1', 4.11, 1, 1, 6, 2, scene)
    barrel.material = material
    return barrel
}

export const createTank = (scene: Scene, position: Vector3, color: Color3) => {
    const tankMaterial = new BABYLON.StandardMaterial("tankMaterial", scene);
    tankMaterial.diffuseColor = color
    tankMaterial.specularColor = new BABYLON.Color3(1, 1, 1);
    // tankMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
    tankMaterial.ambientColor = new BABYLON.Color3(0.1, 0.1, 0.1);


    // const barrel = createBarrel(scene, tankMaterial)

    const body = createBarrel(scene, tankMaterial)
    body.position = position
    return body
}
