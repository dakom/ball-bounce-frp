import {Quadratic, } from "./Quadratic";

/* 
 * CORE
 */
//missing displacement, get velocity
export const Kinematic1 = (v0:number) => (acc:number) => (t:number) =>{
    const v = v0 + acc * t;
    return v;
}

//missing acceleration, get displacement
export const Kinematic2 = (v0:number) => (v:number) => (t:number) => {
    const dx = ((v + v0)/2) * t;
    return dx;
}

//missing final velocity, get displacement
export const Kinematic3 = (v0:number) => (acc:number) => (t:number) => {
    const dx = ((.5 * acc) * (t * t)) + (v0 * t);
    return dx;
}

//missing time, get final velocity
export const Kinematic4 = (v0:number) => (acc:number) => (dx:number) => {
    const vSquared = (v0 * v0) + 2 * acc * dx;
    return Math.sqrt(vSquared);
}

/*
 * HELPERS (building off core)
 */

//missing final velocity (K3), get time
//note - it's quadratic and returns the positive root 
export const Kinematic5 = (v0:number) => (acc:number) => (dx:number) => {
    const [root1, root2] = Quadratic (.5 * acc) (v0) (-dx);

    return Math.max(root1, root2);
}

//missing time (K4), get displacement
export const Kinematic6 = (v0:number) => (acc:number) => (v:number) => {
    return ((v0 * v0) - (v * v))/(2 * acc) * -1;
}

//missing displacement (K1), get time
export const Kinematic7 = (v0: number) => (acc:number) => (v:number) => {
    return v / (v0 + acc); 
}
