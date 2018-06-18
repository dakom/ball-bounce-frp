import {StreamSink} from "sodiumjs";
import {Camera} from "pure3d";

export const sWorldUpdate = new StreamSink<{frameTs: number, camera: Camera}>();
