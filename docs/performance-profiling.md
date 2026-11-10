# Landing page performance profiling

Use the same Chrome version, viewport, device scale factor, power mode, and page state for before and after captures. Build and serve the production app; do not profile `next dev` because development overlays, source maps, and hot reload change memory and frame costs.

```sh
npm run build
npx next start -p 3100 -H 127.0.0.1
```

Open the local production URL in Chrome. In DevTools, set a fixed viewport and device scale factor, disable extensions, close unrelated tabs, and wait for fonts and the hero intro to settle. Record the commit, Chrome version, OS, viewport, device scale factor, and whether WebGPU is available. Repeat each capture at least three times after a fresh page load and compare medians.

## Capture procedure

1. In **Performance**, enable screenshots and memory, record a 30-second idle capture on the hero, then capture pointer movement over the hero canvas.
2. Scroll through the page to the closing canvas, leave both canvas sections offscreen for 30 seconds, then return to each and capture another 30 seconds. Check that each resumes and that the other offscreen instance stays paused.
3. Exercise magnetic links, motion cards, canvas pointer splashes, orbit hover/focus, and reduced-motion mode (`Emulate CSS media feature prefers-reduced-motion`). Record frame rate, long tasks, scripting time, and dropped frames for each state.
4. In **Memory**, take heap snapshots at the same page states and inspect the JS heap separately from the browser process's tab memory in Chrome Task Manager (`Shift+Esc`). For a closer process breakdown, use `chrome://memory-internals` when available.
5. For GPU memory, inspect Chrome's **GPU** process in Task Manager and `chrome://gpu`. If your Chrome build exposes GPU allocation telemetry in `chrome://tracing`/Perfetto, capture that as well. Report GPU memory as unavailable when it is not exposed; browser Task Manager's memory column is not a GPU-memory measurement.

## Interpreting the 949 MB report

Treat a reported 949 MB as an observation about the browser tab/process until its source is identified. A JS heap snapshot measures reachable JavaScript objects, not canvas textures. Tab/process memory includes more than the JS heap, such as DOM, decoded images, compositor surfaces, and browser allocations. GPU memory is a separate allocation category and may be reported inconsistently or not at all by Chrome/platform drivers. Do not attribute the whole figure to WebGPU without a GPU-specific measurement and a controlled before/after comparison.

Compare like-for-like captures. Note the JS heap, tab/process memory, and GPU memory as separate numbers with their measurement source. A missing GPU number is not zero. Also record frame time while each canvas is visible and offscreen; reduced total tab memory alone does not establish a GPU-memory reduction.

## Recorded environment sample (capture date not recorded)

An isolated headless Chrome run against a local production build at 1440 × 900 and DPR 2 measured post-GC JS heap of 6.84 MB on initial landing load, 8.52 MB at the closing section, and 8.32 MB after returning to the top. The page had one, then two, WebGPU canvases. These values are a JS heap baseline only; headless Chrome did not provide comparable tab or GPU memory, and this was not a before/after benchmark. Full-page route navigation increased document counts through browser history caching, so those route samples cannot establish a leak. Run the procedure above in the affected Chrome session to investigate a tab memory warning.

## Historical ShapeWaves build baseline (before deferred closing-canvas mount; capture date not recorded)

Before the closing-canvas mount change, the production build emitted one 230,528-byte JavaScript chunk containing the ShapeWaves shader code. The generated HTML referenced that chunk on `/`, `/login`, `/cadastro`, and `/recuperar-senha`, and on no dashboard route. The same route references and chunk size remained after the change. These are emitted file bytes, not transferred or parsed bytes, and they do not measure GPU memory or frame performance. The closing instance now mounts when it comes within two viewport heights, so its WebGPU initialization is deferred on an initial landing-page load. Quantify the allocation and frame impact with the Chrome procedure above before changing shader quality, render resolution, or additional loading behavior.
