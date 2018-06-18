[![Build Status](https://travis-ci.org/dakom/ball-bounce-frp.svg?branch=master)](https://travis-ci.org/dakom/ball-bounce-frp)

## [DEMO](https://dakom.github.io/ball-bounce-frp)

This demo uses FRP, specifically SodiumFRP, to create a bouncing ball effect.

Ball position is driven by a functional approach that works over continuous time, though time is "rasterized" (not sure the right word for this?) in a couple places:

1. The impact time for starting a new bounce - limited by the JS clock 
2. Several core functions are continuous in theory, but the real world calls them at a certain frequency - in this case driven by requestAnimationFrame (e.g. 60fps or 120fps)

One may ask - why FRP, surely an integration of delta times would work just as well?

The answer to this is yes - math is math and can be added up in numerous ways[*]. However, the _elegance_ of describing the logic via FRP brings with it some really nice approaches to structure code, which is enjoyable to program with, easy to read, and tends to eliminate entire classes of bugs due to the separation of concerns.

The bulk of the logic is in these two files, with more details in the comments: 

1. [Ball-FRP.ts](src/app/worker/frp/Ball-FRP.ts)

2. [Time-FRP.ts](src/app/worker/frp/Time-FRP.ts)

[*] Pun intended after-the-fact :P

## THREADS

The demo here goes a bit beyond the necessary and attempts to lay a foundation which can be used for much larger projects. Specifically, separating the physics into a Worker thread and freeing the main thread up to focus on rendering and IO only. 

It also provides a nice sanity check since the GLTF / Scene data resides _only_ in the worker thread after initial load. Kinda cool that it can be completely serialized like that :)

## MODELS

Environment and Cube from Khronos references

Metal sphere from [here](https://sketchfab.com/models/f7340c6b9dad4b88b84e097bcd53bcd8)
