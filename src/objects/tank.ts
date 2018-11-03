import * as BABYLON from 'babylonjs';
import Scene = BABYLON.Scene;
import Material = BABYLON.Material;
import {Color3} from 'babylonjs';
import Vector3 = BABYLON.Vector3;
import {createProjectileFromTank} from "./projectile";
import {Network} from "../network";


const B = BABYLON
let tankId: number = 1
// TODO do grouping with parent relation ship.
// Now there is a single mesh that can have only one material

const createBody = (scene: Scene, material: Material) => {
    const body = BABYLON.MeshBuilder.CreateBox("body", {height: 0.4, width: 2.2, depth: 1.1}, scene)
    body.material = material
    body.position.y = 0.4

    const trackMaterial = new BABYLON.StandardMaterial('tracksMaterial', scene);
    trackMaterial.diffuseColor = new B.Color3(0,0,0)
    trackMaterial.ambientColor = new B.Color3(0,0,0)

    const tracks = BABYLON.MeshBuilder.CreateBox("tracks", {height: 0.5, width: 2, depth: 1}, scene)
    tracks.material = trackMaterial
    tracks.position.y = -0.2

    tracks.parent = body
    return body
}

const createBarrel = (scene: Scene, material: Material) => {
    const barrel = BABYLON.Mesh.CreateCylinder('barrel', 0.65, 0.2, 0.2,
        12, 2, scene)
    barrel.material = material
    barrel.position.x = -0.7
    barrel.position.y = 0.8
    barrel.rotation.z = -3.14/2
    return barrel
}

const createTurret = (scene: Scene, material: Material) => {
    const barrel = BABYLON.Mesh.CreateCylinder('tower', 2, 0.8, 1,
        12, 4, scene)
    barrel.material = material
    barrel.position.x = 0.3
    barrel.position.y = -0.3
    return barrel
}

export const createTank = (name: string, network: Network, scene: Scene, position: Vector3, rotation: Vector3, color: Color3) => {
    const shootingSound = new BABYLON.Sound("50_cal", "assets/50_cal.wav", scene);
    const clickSound = new BABYLON.Sound("click", "assets/click.wav", scene);
    const tankMaterial = new BABYLON.StandardMaterial(name + 'tankMaterial', scene);
    tankMaterial.diffuseColor = color
    tankMaterial.ambientColor = color

    const turret = createTurret(scene, tankMaterial)

    const body = createBody(scene, tankMaterial)

    const barrel = createBarrel(scene, tankMaterial)

    //const merged = BABYLON.Mesh.MergeMeshes([body, turret, barrel]);
    body.position.z = position.z
    body.position.x = position.x

    body.rotation.y = rotation.y

    barrel.parent = turret
    turret.parent = body

    body.checkCollisions = true;

    let lastShot: any = null
    const tank = {
        id: tankId++,
        name: name,
        body: body,
        dead: false,
        turret: turret,
        barrel: barrel,
        color: color,
        projectiles: ([] as any[]),
        score: 0,
        die: () => {
            tank.dead = true
            tankMaterial.diffuseColor = Color3.Gray()
            tankMaterial.ambientColor = Color3.Black()
        },
        canShoot: () => {
            const now = Date.now()
            const reloadSpeed = 600
            if (!lastShot || lastShot + reloadSpeed < now) {
                lastShot = now
                return true
            }
            return false
        },
        shoot: () => {
            if (tank.canShoot()) {
                const projectile = createProjectileFromTank(scene, tank)
                tank.attachProjectile(projectile, true)
            } else {
                clickSound.play()
            }
        },
        attachProjectile: (projectile: any, notifyOthers: boolean = false) => {
            tank.projectiles.push(projectile)
            notifyOthers && network.sendNewProjectile(projectile)
            shootingSound.play()
        }
    }

    return tank
}
