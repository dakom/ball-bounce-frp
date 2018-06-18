[![Build Status](https://travis-ci.org/dakom/ball-bounce-frp.svg?branch=master)](https://travis-ci.org/dakom/ball-bounce-frp)

## [DEMO](https://ball-bounce-frp.netlify.com/) - _note: needs modern video card and browser like chrome_

This demo uses FRP, specifically the Typescript implementation of [SodiumFRP](https://github.com/SodiumFRP/sodium-typescript), to create a bouncing ball effect. 

It also uses [Pure3D](https://github.com/dakom/pure3d) to render it in 3D using physically-based-rendering

## MECHANICS

Ball position is driven by a functional approach that works over continuous time, though time is "rasterized" (not sure the right word for this?) in a few places:

1. The impact time for starting a new bounce - limited by the JS clock 
2. Several core functions are continuous in theory, but the real world calls them at a certain frequency - in this case driven by requestAnimationFrame (e.g. 60fps or 120fps)
3. Start/Stop events happen at a specific moment in time and need to be synced to requestAnimationFrame (same for impact time btw)


The bulk of the logic is in these two files, with more details in the comments: 

1. [Ball-FRP.ts](src/app/worker/frp/Ball-FRP.ts)

2. [Time-FRP.ts](src/app/worker/frp/Time-FRP.ts)


## THREADS

The demo here goes a bit beyond the necessary and attempts to lay a foundation which can be used for much larger projects. Specifically, separating the physics into a Worker thread and freeing the main thread up to focus on rendering and IO only. 

It also provides a nice sanity check since the GLTF / Scene data resides _only_ in the worker thread after initial load. Kinda cool that it can be completely serialized like that :)

## FRP?

One may ask - why FRP, surely an integration of delta times would work just as well?

The answer to this is "for sure!" - math is math and can be added up in numerous ways[*]. 

What FRP brings to the table is _elegance_. There's some terms around this space that are being popularized by frameworks like React - "declarative", "unidirectional flow", "separation of concerns", etc. - and those are real benefits to any project, especially at scale. 

Entire classes of bugs can be eliminated too. If all of this is new, I'd suggest reading the book [Functional Reactive Programming](https://www.manning.com/books/functional-reactive-programming) for more info - it's a great introductory text that doesn't require a background in functional programming at all, in fact most examples are in Java. It's also the de-facto guide for SodiumFRP.

[*] Pun intended after-the-fact :P

## MODELS

Environment and Cube from Khronos references

Metal sphere from [here](https://sketchfab.com/models/f7340c6b9dad4b88b84e097bcd53bcd8)
