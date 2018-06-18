import MyWorker = require('worker-loader!./Worker');
import { WebGlConstants } from "pure3d";
import { getCompileFlags, loadWorker, S, MESSAGE, } from "utils/Utils";
import {prepRenderer, prepCanvas, prepCamera, prepReact} from "./main/init/Init-Prep";
import {loadAssets} from "./main/init/Init-Loader";
import {makeOutput} from "./main/io/Output";
import {createControls} from "./main/io/Controls";
import {sLoadingFinished} from "frp/Init-Sinks-FRP";
import {WorkerCommands} from "./types/Worker-Types";

const {buildMode, buildVersion, isProduction} = getCompileFlags();
console.log(`%c Ball Bounce FRP ${buildVersion} (productionMode: ${isProduction})`, 'color: #4286f4; font-size: large; font-family: "Comic Sans MS", cursive, sans-serif');

/*
 * Everything here is generic boilerplate... the details are in the imports
 */

const worker:Worker = new (MyWorker as any)();


loadWorker(worker)
    .chain(worker => {
        const canvas = prepCanvas();
        const renderer = prepRenderer(canvas);
        prepReact(worker);
    
        return loadAssets(renderer)
            .map(obj => Object.assign({}, obj, {canvas, renderer, worker}))
    })
    .fork(
        console.error,
        ({worker, ...props}) => {
            let readyForUpdate = false;

            const camera = prepCamera();
            const controls = createControls(camera);
            const output = makeOutput({camera, ...props});

            worker.addEventListener(MESSAGE, (e:MessageEvent) => {
                switch(e.data.cmd) {
                    case WorkerCommands.RENDER: 
                        output(e.data.scenes);
                        readyForUpdate = true;
                }
            });

            const tick = (frameTs:number) => {
                if(readyForUpdate) {
                    readyForUpdate = false;
                    worker.postMessage({
                        cmd: WorkerCommands.TICK, 
                        frameTs, 
                        camera: controls.updateCamera()
                    });
                }

                requestAnimationFrame(tick);
            }

            requestAnimationFrame(tick);


            worker.postMessage({
                cmd: WorkerCommands.WORLD_START,
                scenes: props.gltfBridges.map(bridge => bridge.getOriginalScene(camera) (0))
            });

            sLoadingFinished.send(null);
        }
    );



