/*
 * The approach here divides into two major ideas:
 * 1. The position of the ball can be described via a pure function of f(t) = y (i.e. no integration)
 * 2. That pure function must be re-generated upon collision
 *
 * The rest of the implementation details are about answering the required questions to support that
 * For example, when does the impact happen, what velocity does the ball have when it does, etc.
 */

//Imports
import {lambda2, Transaction, CellSink, Operational,  Cell, StreamSink, StreamLoop, CellLoop} from "sodiumjs";
import {Camera, GltfScene, GltfNode} from "pure3d";
import {S, Maybe, Kinematic3, Kinematic4, Kinematic5, Kinematic7} from "utils/Utils";
import {World} from "types/World-Types";
import {setBallTranslationY} from "actions/World-Actions";
import {sTick, mapStreamTick, alarmUpdates} from "./Time-FRP";
import {sBallStart_Sink, sBallStop_Sink} from "./Ball-Sinks-FRP";
import * as L from "partial.lenses";

//Types
type BallPhysics = Partial<{ 
    h:number;
    t0: number;
    getPosition: (t:number) => number;
    nextBounceTime:number;
}>

interface BallPhysicsDrop extends BallPhysics {
    y: number;
}

interface BallPhysicsBounce extends BallPhysics {
    v: number;
}

//Main logic
export const createBallFrp = (node:GltfNode) => {

    const cBall:Cell<Maybe<BallPhysics>> = Transaction.run(() => {
        //When BallPhysics changes, BounceAlarm changes 
        //Yet when BounceAlarm changes, BallPhysics changes
        //Thankfully this is easily handled with a CellLoop
        const cPhysicsLoop = new CellLoop<Maybe<BallPhysics>>();

        //If BallPhysics is Nothing, alarm will not fire
        const sBounceAlarm = alarmUpdates( 
            cPhysicsLoop
                .map(S.maybe (-1) (phys => phys.nextBounceTime * 1000))
        );

        //Theoretically, bounce alarms that fire when the ball is inactive
        //Won't actually do any harm
        //But for the sake of completeness, the code below will also cancel the alarms
        //Since the alarm is non-existant before the first firing, it needs to be bypassed
        const cBounceAlarm = sBounceAlarm.map(S.Just).hold(S.Nothing);

        //Things that change BallPhysics:
        //  * BounceAlarm changing
        //  * sBallStart_Sink (button press)
        //  * sBallStop_Sink (button press)
        //Notably, time itself does _not_ change the physics (e.g. this stuff is very efficient)
        cPhysicsLoop.loop(
            mapStreamTick(sBallStart_Sink).snapshot3(cBounceAlarm, cPhysicsLoop, ({ts}, mBounceAlarm, mPhysics) => {
                S.map(bounceAlarm => bounceAlarm.cancel()) (mBounceAlarm);
                return S.Just(createInitialPhysics (ts) (node));
            })
            .orElse(sBallStop_Sink.snapshot(cBounceAlarm, (_, mBounceAlarm) => {
                S.map(bounceAlarm => bounceAlarm.cancel()) (mBounceAlarm);
                return S.Nothing;
            }))
            .orElse(sBounceAlarm.snapshot(cPhysicsLoop, (alarm, mPhys) => 
                S.map (phys => onBounce (alarm.ts) (phys)) (mPhys)     
            ))
            .hold(S.Nothing)
        );

        return cPhysicsLoop;
    })

    //theoretically we could update much more frequently, and render separately
    //but requestAnimationFrame is the most consistent way of getting a constant frequency in JS
    //this decision is actually reflected throughout the code e.g. mapStreamTick()
    const sBallUpdates =
        sTick.snapshot(cBall, (t, mBall) => 
            S.maybe
                (S.I)
                (({t0, getPosition}:BallPhysics) => 
                    (world:World) =>
                        setBallTranslationY
                            (getPosition((t - t0) / 1000))
                            (world)
                )
                (mBall)
        );

    return sBallUpdates;
}

//Hardcoded physics values
const GRAVITY = -9.81;
const RESTITUTION = .8;

//Hardcoded point of impact
const BOTTOM = -0.903; 

//Lenses
const HEIGHT = "h";
const VELOCITY = "v";
const GET_POSITION = "getPosition"
const NEXT_BOUNCE_TIME = "nextBounceTime";
const START_TIME = "t0";

//Helper to set a lens based on function which gets the object
const setLens = <T,V>(lens:any) => (fn:(obj:T) => V) => (obj:T):T =>
    L.set (lens) (fn(obj)) (obj);

//Initial Physics - just a drop until impact
//The starting input is a plain GltfNode
//createInitialPhysics :: Int -> GltfNode -> BallPhysicsDrop
const createInitialPhysics = (now:number) =>
    S.pipe([
        (node:GltfNode) => ({y: node.transform.trs.translation[1]}),

        setLens (HEIGHT)
                ((phys:BallPhysicsDrop) => phys.y - BOTTOM),

        setLens (GET_POSITION)
                ((phys:BallPhysicsDrop) => (t:number) => phys.y + Kinematic3(0) (GRAVITY) (t)),

        setLens (NEXT_BOUNCE_TIME)
                ((phys:BallPhysicsDrop) => Kinematic5 (0) (GRAVITY) (-phys.h)),

        setLens (START_TIME)
                (() => now),
    ]) 

//Bounce Physics - graphs like a parabola from start to end.
//The starting input may be from a drop or bounce (e.g. anything with height)
//It is assumed that the input is currently at BOTTOM 
//onBounce :: Int -> BallPhysics -> BallPhysicsBounce
const onBounce = (now:number) => 
    S.pipe([
        setLens (HEIGHT) 
                ((phys:BallPhysics) => phys.h * RESTITUTION),

        setLens (VELOCITY) 
                ((phys:BallPhysics) => Kinematic4 (0) (-GRAVITY) (phys.h)),

        setLens (GET_POSITION) 
                ((phys:BallPhysicsBounce) => (t:number) => BOTTOM + Kinematic3 (phys.v) (GRAVITY) (t)),

        setLens (NEXT_BOUNCE_TIME) 
                ((phys:BallPhysicsBounce) => Kinematic7 (0) (-GRAVITY) (phys.v) * 2),

        setLens (START_TIME)
                (() => now),
    ]); 
