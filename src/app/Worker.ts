import {initWorker, MESSAGE, S} from "utils/Utils";
import {sWorldUpdate} from "frp/World-Sinks-FRP";
import {createWorldFrp} from "frp/World-FRP";
import {WorkerCommands} from "types/Worker-Types";
import {sBallStart_Sink, sBallStop_Sink} from "frp/Ball-Sinks-FRP";


initWorker().fork(
    console.error,
    worker => {
        worker.addEventListener(MESSAGE, (e:MessageEvent) => {
            switch(e.data.cmd) {
                case WorkerCommands.TICK:
                    sWorldUpdate.send({frameTs: e.data.frameTs, camera: e.data.camera});
                    break;
                case WorkerCommands.WORLD_START:
                    createWorldFrp(e.data.scenes)
                        .listen(world => {
                           worker.postMessage({cmd: WorkerCommands.RENDER, scenes: world.scenes}); 
                        })
                    break;
                case WorkerCommands.BALL_START:
                    sBallStart_Sink.send(null);
                    break;

                case WorkerCommands.BALL_STOP:
                    sBallStop_Sink.send(null);
                    break;
            }
        });
    }
);


