/* ---------------------------------------------------------------
   sim.js — tiny canvas-simulation manager for emote4d.com.
   Handles DPR sizing, pause-when-offscreen, and reduced motion.
   Motion only where it carries meaning; stillness is a feature.
   --------------------------------------------------------------- */

export const reducedMotion =
  typeof matchMedia !== "undefined" &&
  matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * makeSim(canvas, { render, renderStill, init, fps, dprCap })
 *
 * render(ctx, t, dt, view)  — one frame; t/dt ms; view {W,H,DPR} CSS px
 * renderStill(ctx, view)    — composed end-state drawn once under
 *                             prefers-reduced-motion (falls back to render)
 * init(view)                — optional, after every resize
 *
 * Pauses offscreen (IntersectionObserver) and resizes with its box.
 * Returns { view, redraw, destroy } — redraw() draws a single still
 * frame on demand (used for user-driven updates under reduced motion).
 */
export function makeSim(canvas, opts) {
  const { render, renderStill, init, fps = 60, dprCap = 1.75 } = opts;
  const ctx = canvas.getContext("2d");
  const view = { W: 0, H: 0, DPR: 1 };
  const interval = 1000 / fps;
  let raf = 0;
  let onScreen = false;
  let last = 0;
  let t0 = 0;

  function still() {
    ctx.setTransform(view.DPR, 0, 0, view.DPR, 0, 0);
    ctx.clearRect(0, 0, view.W, view.H);
    (renderStill || ((c, v) => render(c, 0, 16, v)))(ctx, view);
  }

  function resize() {
    const r = canvas.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    view.DPR = Math.min(window.devicePixelRatio || 1, dprCap);
    canvas.width = Math.max(1, Math.round(r.width * view.DPR));
    canvas.height = Math.max(1, Math.round(r.height * view.DPR));
    view.W = r.width;
    view.H = r.height;
    if (init) init(view);
    if (reducedMotion) still();
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (!t0) {
      t0 = now;
      last = now;
      return;
    }
    if (now - last < interval - 1) return;
    const dt = Math.min(50, now - last);
    last = now;
    ctx.setTransform(view.DPR, 0, 0, view.DPR, 0, 0);
    render(ctx, now - t0, dt, view);
  }

  function play() {
    if (raf || reducedMotion || !onScreen) return;
    last = 0;
    t0 = 0;
    raf = requestAnimationFrame(frame);
  }
  function pause() {
    cancelAnimationFrame(raf);
    raf = 0;
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  const io = new IntersectionObserver(
    (entries) => {
      onScreen = entries[0].isIntersecting;
      onScreen ? play() : pause();
    },
    { rootMargin: "80px" }
  );
  io.observe(canvas);

  resize();
  if (reducedMotion) still();

  return {
    view,
    redraw: still,
    destroy() {
      pause();
      ro.disconnect();
      io.disconnect();
    },
  };
}

/* ----------------------- shared pose model ---------------------
   17 joints, (x, y) interleaved, in units of figure height.
   y is height above the ground plane. Joint order:
   0 head, 1 neck, 2 rSho, 3 lSho, 4 rElb, 5 lElb, 6 rWri,
   7 lWri, 8 hipC, 9 rHip, 10 lHip, 11 rKne, 12 lKne,
   13 rAnk, 14 lAnk, 15 rToe, 16 lToe.
   --------------------------------------------------------------- */

export const BONES = [
  [0, 1], [1, 2], [1, 3], [2, 4], [4, 6], [3, 5], [5, 7],
  [1, 8], [8, 9], [8, 10],
  [9, 11], [11, 13], [13, 15],
  [10, 12], [12, 14], [14, 16],
];

/* walk cycle — 8 keyframes, right heel-strike at frame 0 */
export const WALK = [
  [0.025,0.927, 0.012,0.842, 0.015,0.814, -0.015,0.814,
   -0.040,0.655, 0.050,0.655, -0.095,0.520, 0.100,0.535,
   0.000,0.512, 0.022,0.517, -0.022,0.507,
   0.080,0.290, -0.050,0.310, 0.150,0.030, -0.150,0.060,
   0.235,0.030, -0.075,0.020],
  [0.025,0.937, 0.012,0.852, 0.015,0.824, -0.015,0.824,
   -0.025,0.660, 0.030,0.660, -0.060,0.510, 0.065,0.520,
   0.000,0.522, 0.022,0.527, -0.022,0.517,
   0.040,0.285, 0.020,0.340, 0.080,0.020, -0.060,0.120,
   0.165,0.005, 0.000,0.085],
  [0.025,0.945, 0.012,0.860, 0.015,0.832, -0.015,0.832,
   0.005,0.662, 0.005,0.662, 0.010,0.500, 0.012,0.502,
   0.000,0.530, 0.022,0.535, -0.022,0.525,
   0.000,0.280, 0.080,0.330, 0.000,0.020, 0.060,0.110,
   0.085,0.005, 0.125,0.085],
  [0.025,0.937, 0.012,0.852, 0.015,0.824, -0.015,0.824,
   0.030,0.660, -0.025,0.658, 0.060,0.515, -0.058,0.512,
   0.000,0.522, 0.022,0.527, -0.022,0.517,
   -0.040,0.285, 0.100,0.300, -0.090,0.030, 0.140,0.050,
   -0.010,0.005, 0.225,0.045],
  [0.025,0.927, 0.012,0.842, 0.015,0.814, -0.015,0.814,
   0.050,0.655, -0.040,0.655, 0.100,0.535, -0.095,0.520,
   0.000,0.512, 0.022,0.517, -0.022,0.507,
   -0.050,0.310, 0.080,0.290, -0.150,0.060, 0.150,0.030,
   -0.075,0.020, 0.235,0.030],
  [0.025,0.937, 0.012,0.852, 0.015,0.824, -0.015,0.824,
   0.030,0.660, -0.025,0.660, 0.065,0.520, -0.060,0.510,
   0.000,0.522, 0.022,0.527, -0.022,0.517,
   0.020,0.340, 0.040,0.285, -0.060,0.120, 0.080,0.020,
   0.000,0.085, 0.165,0.005],
  [0.025,0.945, 0.012,0.860, 0.015,0.832, -0.015,0.832,
   0.005,0.662, 0.005,0.662, 0.012,0.502, 0.010,0.500,
   0.000,0.530, 0.022,0.535, -0.022,0.525,
   0.080,0.330, 0.000,0.280, 0.060,0.110, 0.000,0.020,
   0.125,0.085, 0.085,0.005],
  [0.025,0.937, 0.012,0.852, 0.015,0.824, -0.015,0.824,
   -0.025,0.658, 0.030,0.660, -0.058,0.512, 0.060,0.515,
   0.000,0.522, 0.022,0.527, -0.022,0.517,
   0.100,0.300, -0.040,0.285, 0.140,0.050, -0.090,0.030,
   0.225,0.045, -0.010,0.005],
];

/* fall — 5 keyframes: buckle, tilt, impact, collapse, settle */
export const FALL = [
  [-0.040,0.800, -0.030,0.720, -0.010,0.695, -0.050,0.690,
   0.020,0.555, -0.105,0.545, 0.045,0.425, -0.140,0.420,
   0.000,0.400, 0.022,0.405, -0.022,0.395,
   0.100,0.240, -0.020,0.220, 0.040,0.040, -0.060,0.030,
   0.120,0.015, 0.020,0.010],
  [-0.200,0.580, -0.160,0.505, -0.130,0.480, -0.180,0.460,
   -0.080,0.360, -0.260,0.355, -0.050,0.240, -0.320,0.235,
   0.000,0.260, 0.020,0.270, -0.020,0.250,
   0.100,0.160, -0.040,0.130, 0.080,0.030, -0.100,0.030,
   0.150,0.010, -0.030,0.010],
  [-0.310,0.300, -0.260,0.260, -0.230,0.250, -0.270,0.210,
   -0.160,0.180, -0.330,0.140, -0.120,0.080, -0.380,0.050,
   -0.020,0.140, 0.000,0.150, -0.040,0.130,
   0.100,0.100, 0.020,0.080, 0.180,0.040, 0.060,0.030,
   0.250,0.020, 0.120,0.010],
  [-0.400,0.070, -0.330,0.080, -0.300,0.100, -0.300,0.050,
   -0.210,0.130, -0.200,0.040, -0.120,0.150, -0.100,0.030,
   -0.010,0.080, 0.000,0.100, -0.010,0.060,
   0.120,0.110, 0.110,0.050, 0.230,0.090, 0.220,0.040,
   0.300,0.080, 0.290,0.030],
  [-0.410,0.060, -0.340,0.070, -0.310,0.090, -0.310,0.050,
   -0.220,0.120, -0.210,0.040, -0.130,0.140, -0.110,0.030,
   -0.010,0.070, 0.000,0.090, -0.010,0.050,
   0.120,0.100, 0.110,0.050, 0.230,0.080, 0.220,0.040,
   0.300,0.070, 0.290,0.030],
];

const smooth = (f) => f * f * (3 - 2 * f);

/** Sample a looping keyframe cycle at phase u in [0,1) into `out` (34 floats). */
export function sampleLoop(frames, u, out) {
  const n = frames.length;
  const p = ((u % 1) + 1) % 1;
  const idx = p * n;
  const k = Math.floor(idx) % n;
  const f = smooth(idx - Math.floor(idx));
  const A = frames[k];
  const B = frames[(k + 1) % n];
  for (let i = 0; i < 34; i++) out[i] = A[i] + (B[i] - A[i]) * f;
}

/** Sample a non-looping sequence at progress u in [0,1] into `out`. */
export function sampleSeq(frames, u, out) {
  const n = frames.length;
  const p = Math.min(1, Math.max(0, u));
  const idx = p * (n - 1);
  const k = Math.min(n - 2, Math.floor(idx));
  const f = smooth(idx - k);
  const A = frames[k];
  const B = frames[k + 1];
  for (let i = 0; i < 34; i++) out[i] = A[i] + (B[i] - A[i]) * f;
}

/**
 * Draw the pose as a clean skeleton.
 * pose: 34 floats; cx: ground-center x (CSS px); groundY: ground y;
 * figH: figure height in px; stroke/fill colors.
 */
export function drawSkeleton(ctx, pose, cx, groundY, figH, stroke, lineW = 3) {
  const X = (i) => cx + pose[i * 2] * figH;
  const Y = (i) => groundY - pose[i * 2 + 1] * figH;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = lineW;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (const [a, b] of BONES) {
    ctx.beginPath();
    ctx.moveTo(X(a), Y(a));
    ctx.lineTo(X(b), Y(b));
    ctx.stroke();
  }
  // head
  const hr = figH * 0.052;
  ctx.beginPath();
  ctx.arc(X(0), Y(0) - hr * 0.4, hr, 0, Math.PI * 2);
  ctx.stroke();
  // joints
  ctx.fillStyle = stroke;
  for (let i = 1; i < 17; i++) {
    ctx.beginPath();
    ctx.arc(X(i), Y(i), lineW * 0.9, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * Draw the pose as an unreadable low-res "camera" mosaic into a tiny
 * offscreen canvas, then return it. Call once per frame; cheap.
 * tiny: a small canvas (e.g. 30x22); pose in the same format.
 */
export function drawMosaic(tiny, pose, t) {
  const g = tiny.getContext("2d");
  const w = tiny.width;
  const h = tiny.height;
  // dim warm room
  g.fillStyle = "#37322b";
  g.fillRect(0, 0, w, h);
  // sensor noise
  for (let i = 0; i < 40; i++) {
    const v = 50 + ((Math.sin(i * 12.9898 + (t | 0) * 0.0007) * 43758.5453) % 1) * 14;
    g.fillStyle = `rgba(${v | 0},${(v - 4) | 0},${(v - 10) | 0},0.25)`;
    g.fillRect((i * 7) % w, (i * 5) % h, 1, 1);
  }
  // the person, as soft blocks following the pose
  const cx = w * 0.5;
  const groundY = h * 0.92;
  const figH = h * 0.78;
  const X = (i) => cx + pose[i * 2] * figH;
  const Y = (i) => groundY - pose[i * 2 + 1] * figH;
  g.strokeStyle = "#8f8576";
  g.lineCap = "round";
  for (const [a, b] of BONES) {
    g.lineWidth = a === 1 && b === 8 ? 3.4 : 2.2;
    g.beginPath();
    g.moveTo(X(a), Y(a));
    g.lineTo(X(b), Y(b));
    g.stroke();
  }
  g.fillStyle = "#9a8f7e";
  g.beginPath();
  g.arc(X(0), Y(0) - 1, 2.1, 0, Math.PI * 2);
  g.fill();
  return tiny;
}
