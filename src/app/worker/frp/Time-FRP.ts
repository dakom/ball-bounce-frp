import {sWorldUpdate} from "./World-Sinks-FRP";
import {S} from "utils/Utils";
import {Cell, TimerSystem, TimerSystemImpl, StreamSink, Operational, Stream} from "sodiumjs";

export interface Alarm {
    ts:number;
    cancel: () => void;
}

//tick on worker side is driven by requestAnimationFrame on the main side
export const sTick = 
    sWorldUpdate.map(({frameTs}) => frameTs);

//simple way to filter out functions that shouldn't fire until first tick
//currently just for local use in mapStreamTick but could have more purposes
const cMaybeTick = sTick.map(S.Just).hold(S.Nothing);

//Allows mixing in a timestamp to a stream
//Only fires after first tick (e.g. no bogus placeholder values)
export const mapStreamTick = <T>(sSource:Stream<T>):Stream<T & {ts: number}> => 
    sSource.snapshot(cMaybeTick, (source, mTick) =>
        S.map
            (ts => Object.assign({}, source, {ts}))
            (mTick)
    )
    .filter (S.isJust)
    .map (S.maybe (undefined) (S.I));



//Creates a stream which fires after the seconds in cTime (if time is <0, it's not fired)
//Will re-fire when cTime changes
//Note that the actual time of firing is n, but it is filtered and mapped by frame tick
export const alarmUpdates = (cTime:Cell<number>) => {
    const sSink = new StreamSink<{cancel: () => void}>();

    let timerId = null;

    const cancel = () => {
        if(timerId !== null) {
            clearTimeout(timerId);
            timerId = null;
        }
    }

    cTime.listen(n => {
        cancel();

        if(n >= 0) {
            timerId = setTimeout(() => sSink.send({cancel}), n);
        }
    });

    return mapStreamTick(sSink);
}
