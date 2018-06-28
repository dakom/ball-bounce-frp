import {
    GLTF_ORIGINAL,
    GltfIblExtensionName,
    Camera,
    GltfLightsExtensionName
} from "pure3d";
import {createSkybox} from "../io/renderers/skybox/Skybox";
import {Future} from "fluture";
import {S} from "utils/Utils";

export const addGltfExtensions = () => { 

    const addExtension = (name:string) => (meta:any) => (gltf:GLTF_ORIGINAL):GLTF_ORIGINAL => 
        Object.assign({}, gltf, {
            extensionsUsed:
                gltf.extensionsUsed
                    ?   gltf.extensionsUsed.concat([name])
                    :   [name],
                extensions:
                    gltf.extensions
                    ?   Object.assign({}, gltf.extensions, {
                            [name]: meta
                        })
                    :   {
                            [name]: meta
                        }
        });

    const addIbl = (gltf:GLTF_ORIGINAL) => {
        const meta = {
            path: "static/world/world.json",
            settings: {
                scaleDiffBaseMR: Float64Array.from([0.0, 0.0, 0.0, 0.0]),
                scaleFGDSpec: Float64Array.from([0.0, 0.0, 0.0, 0.0]),
                scaleIBLAmbient: Float64Array.from([1.0, 1.0, 0.0, 0.0]),
            }
        }

        return addExtension (GltfIblExtensionName) (meta) (gltf);
    }


    const addLights = (gltf:GLTF_ORIGINAL) => {
        const meta = {
            lights: [

                {
                    "color": [
                        1.0,
                        1.0,
                        1.0
                    ],
                    "type": "ambient"
                },
                {
                    "spot": {
                        "innerConeAngle": 0.785398163397448,
                        "outerConeAngle": 1.57079632679,
                    },
                    "color": [
                        1.0,
                        1.0,
                        1.0
                    ],
                    "type": "spot"
                },
                {
                    "color": [
                        .2,
                        .2,
                        .2
                    ],
                    "type": "directional"
                }
            ]
        }


        gltf.nodes.push({
            "extensions" : {
                "KHR_lights" : {
                    "light" : 1
                }
            }
        },
        {
            "extensions" : {
                "KHR_lights" : {
                    "light" : 2
                }
            }
        }
        )

        if(gltf.scenes) {
            gltf.scenes[0].nodes.push(gltf.nodes.length-1)
           
            if(!gltf.scenes[0].extensions) {
                gltf.scenes[0].extensions = {}
            }

            Object.assign(gltf.scenes[0].extensions, {
                "KHR_lights": {
                    "light": 0
                }
            });
        }

        return addExtension (GltfLightsExtensionName) (meta) (gltf);
    }

    return S.pipe([
        addIbl,
        //addLights
    ])
    
}
