import {
    createWebGlRenderer,
    PerspectiveCameraSettings,
    CameraKind,
    getCameraProjection,
    createMat4
} from "pure3d";
import {mat4} from "gl-matrix";
import { S } from "utils/Utils";
import {parallel, Future} from "fluture";
import {fetchImage} from "fluture-loaders";
import {Root} from "dom/components/Root-Component";
import * as React from "react";
import * as ReactDOM from "react-dom";

export const prepReact = (worker:any) => {

    const div = document.createElement("div");
    div.style.position = "absolute";
    div.style.top = "0px";
    div.style.left = "0px";
    document.getElementById("app").appendChild(div);

    ReactDOM.render(<Root worker={worker} />, div);
}

export const prepCanvas = () => {
    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.top = "0px";
    canvas.style.left = "0px";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.backgroundColor = "#2a2a2a";

    document.getElementById("app").appendChild(canvas);

    return canvas;
}

export const prepRenderer = (canvas:HTMLCanvasElement) => {
        const renderer = createWebGlRenderer({
            canvas,
            version: 1
        });
        renderer.gl.clearColor(0.2, 0.2, 0.2, 1.0);

        renderer.resize({ width: window.innerWidth, height: window.innerHeight });

        return renderer;
}

export const prepCamera = () => {
    const settings:PerspectiveCameraSettings = {
        kind: CameraKind.PERSPECTIVE,
        yfov: 45.0 * Math.PI / 180,
        aspectRatio: window.innerWidth / window.innerHeight,
        znear: .01,
        zfar: 1000
    }

    const position = Float64Array.from([0,0,5]);
    const cameraLook = Float64Array.from([0,0,0]);
    const cameraUp = Float64Array.from([0,1,0]);
   
    const projection = getCameraProjection(settings); 

    const view = mat4.lookAt(createMat4() as any, position as any, cameraLook as any,cameraUp as any);

    return {
        ...settings,
        position,
        view,
        projection
    }
}




