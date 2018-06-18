import {
    WebGlConstants,
    GltfBridge,
    Camera,
    WebGlRenderer,
    GltfScene
} from "pure3d";
import {
    S,
} from "utils/Utils";

export interface OutputProps {
    canvas: HTMLCanvasElement;
    renderer: WebGlRenderer;
    gltfBridges: Array<GltfBridge>;
    renderSkybox: (camera:Camera) => void;
    camera:Camera;
}

export const makeOutput = 
    ({canvas, renderer, camera, gltfBridges, renderSkybox}:OutputProps) => 
    (scenes:Array<GltfScene>) => {
        const camera = scenes[0].camera; // they're all the same
        renderer.gl.clear(WebGlConstants.COLOR_BUFFER_BIT | WebGlConstants.DEPTH_BUFFER_BIT); 
        renderSkybox(camera);
        gltfBridges.forEach((bridge, idx) => bridge.renderScene(scenes[idx]));
    }
