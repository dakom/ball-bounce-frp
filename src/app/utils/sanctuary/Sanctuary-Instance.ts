import {Maybe} from "./Sanctuary-Typings";

import {create, env} from 'sanctuary';

const checkTypes = false; //process.env.BUILD_TYPE !== 'build';

export const S = create({checkTypes, env});

const mapMaybe = <A>(f:((a:A) => any)) => (m:Maybe<A>):Maybe<A> => S.map(f) (m);