import {quat} from "gl-matrix";
import * as L from "partial.lenses";
import {GltfScene, Camera, NumberArray, gltf_updateNodeTransforms} from "pure3d";
import {World} from "types/World-Types";
import {S} from "utils/Utils";

//Lenses
const NODES = "nodes";
const TRANSFORM = "transform";
const TRS = "trs";
const TRANSLATION = "translation";
const CAMERA = "camera";
const SCENES = "scenes";

//Functions - triggered from FRP
export const setCamera = ({camera}:{camera: Camera}) => (world:World):World => 
    mapScenes (L.set(CAMERA) (camera)) (world);

export const setBallTranslationY = (n:number) => (world:World):World => {
    return L.set([SCENES, 0, NODES, 0, TRANSFORM, TRS, TRANSLATION, 1]) (n) (world);
}

//Additional functions
export const updateTransforms = (world:World):World => {
    return mapScenes
        (scene => L.set 
            (NODES)
            (gltf_updateNodeTransforms 
                ({
                    updateLocal: true,
                    updateModel: true,
                    updateView: true,
                    camera: scene.camera
                })
                (scene.nodes)
            )
            (scene)
        )
        (world);
}

//Internal helpers

const mapScenes = (fn:(scene:GltfScene) => GltfScene) => (world:World):World => 
    L.set   
        (SCENES) 
        (S.map
            (fn)
            (world.scenes)
        )
        (world);
