import {sWorldUpdate} from "./World-Sinks-FRP";
import {S} from "utils/Utils";
import {Cell, TimerSystem, TimerSystemImpl, StreamSink, Operational, Stream} from "sodiumjs";

export const sTick = 
    sWorldUpdate.map(({frameTs}) => frameTs);

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


//Sends an event after the Cell's value (in ms) both on init and subsequent changes
//If the value is < 0 it won't be sent
//
export interface Alarm {
    ts:number;
    cancel: () => void;
}

//Creates a stream which fires after the seconds in cTime
//Including re-firing when cTime changes
//Note that the actual time of firing is n, but it is filtered and mapped
//According to the tick time, for the sake of consistency
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
