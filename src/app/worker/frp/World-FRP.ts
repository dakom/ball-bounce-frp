import {Stream, StreamSink, Cell} from "sodiumjs";
import {Camera, GltfScene} from "pure3d";
import {sWorldUpdate} from "./World-Sinks-FRP";
import {S} from "utils/Utils";
import {setCamera, updateTransforms} from "actions/World-Actions";
import {createBallFrp} from "./Ball-FRP";
import {World} from "types/World-Types";

type WorldUpdate = (world:World) => World;

const mergeUpdates = (left:WorldUpdate, right:WorldUpdate) =>
   (world:World) => left(right(world));

export const createWorldFrp = (initialScenes:Array<GltfScene>) => {
    //const cBall = new Cell(S.I);
    const sPhysics = createBallFrp(initialScenes[0].nodes[0]);


    return sWorldUpdate
        .map(setCamera)
        .merge(sPhysics, mergeUpdates)
        .accum({scenes: initialScenes}, (fn, world) => fn(world))
        .map(world => updateTransforms(world)); 
}

