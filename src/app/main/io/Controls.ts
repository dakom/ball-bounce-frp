import {
    Camera,
    createMat4,
    getCameraProjection,
    GltfScene
} from "pure3d";
import * as setupOrbitControls from "orbit-controls";
import {mat4} from "gl-matrix";

export const createControls = (camera:Camera) => {
    const orbitControls = setupOrbitControls({
        position: camera.position,
        target: Float64Array.from([0,0,-2]) 
    });

    orbitControls.enable();

    const updateCamera = ():Camera => {
        orbitControls.update();
        const view = mat4.lookAt(createMat4() as any, 
            orbitControls.position, 
            orbitControls.direction, 
            orbitControls.up
        );

        //this usually isn't needed, but it helps to debug
        const projection = getCameraProjection(camera); 

        return Object.assign({}, camera, {
            position: orbitControls.position, 
            view, 
            projection
        })
    }

    return {updateCamera};
}
