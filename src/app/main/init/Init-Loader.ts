import {
    WebGlRenderer, 
    gltf_load,
    GLTF_ORIGINAL,
    GltfIblExtensionName,
    Camera
} from "pure3d";
import {createSkybox} from "../io/renderers/skybox/Skybox"; 
import {Future} from "fluture";
import {addGltfExtensions} from "./Init-Mixin";

export const loadAssets = (renderer:WebGlRenderer) => 
    (createSkybox (renderer) ([
        "static/world/environment/environment_right_0.jpg",
        "static/world/environment/environment_left_0.jpg",
        "static/world/environment/environment_top_0.jpg",
        "static/world/environment/environment_bottom_0.jpg",
        "static/world/environment/environment_front_0.jpg",
        "static/world/environment/environment_back_0.jpg"
    ]) as Future<any, (camera:Camera) => void>)
    .map(renderSkybox => ({renderSkybox, gltfBridges: []}))
    .chain(obj => 
        loadModel (renderer) ("static/ball/scene.gltf")
            .map(bridge => Object.assign({}, obj, {gltfBridges: obj.gltfBridges.concat([bridge])}))
    )
    .chain(obj => 
        loadModel (renderer) ("static/cube/Cube.gltf")
            .map(bridge => Object.assign({}, obj, {gltfBridges: obj.gltfBridges.concat([bridge])}))
    );

const loadModel = (renderer:WebGlRenderer) => (path:string) => 
    gltf_load({
        renderer, 
        path,
        config: { },
        mapper: addGltfExtensions()
    });


