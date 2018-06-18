import {Future} from "fluture";
import {WorkerCommands} from "types/Worker-Types";

export const MESSAGE = "message";

/*
 * these loaders resolve _after_ communication is established
 */
//Loaded by main thread 
export const loadWorker = (worker:any) => Future<any, Worker>((reject, resolve) => {
    const onInitial = (e: MessageEvent) => {
        if(e.data.cmd === WorkerCommands.READY) {
            worker.removeEventListener(MESSAGE, onInitial);
            resolve(worker);
        }
    }
    worker.addEventListener(MESSAGE, onInitial);

    worker.postMessage({ cmd: WorkerCommands.INIT});
});

//Loaded by worker thread
export const initWorker = () => Future<any, any>((reject, resolve) => {

    const onInitial = (e: MessageEvent) => {
        console.log(e);

        if(e.data.cmd === WorkerCommands.INIT) {
            (self as any).removeEventListener(MESSAGE, onInitial);
            (self as any).postMessage({cmd: WorkerCommands.READY});
            resolve(self);
        }
    }
    (self as any).addEventListener(MESSAGE, onInitial);
});

