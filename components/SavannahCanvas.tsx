"use client";

/**
 * SavannahCanvas: the Mara at first light (or after dark), in real time.
 *
 * Raw WebGL, two passes:
 *  1. Sky + ground: a full-screen pass sharing the camera with the grass,
 *     so the horizon always lines up. Sun or moon, haze, a distant escarpment
 *     and acacias in silhouette along the horizon.
 *  2. Grass: tens of thousands of individual blades, generated once and
 *     swayed by wind in the vertex shader, back-lit at the tips by the low sun.
 *
 * `rise` (0–1, a MotionValue) lifts the camera out of the grass to reveal the
 * plains. `night` switches to starlight with a campfire glowing in the grass.
 */

import { useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import type { MotionValue } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/useMedia";

type Props = {
  rise?: MotionValue<number>;
  night?: boolean;
  fallback: StaticImageData;
  className?: string;
  priority?: boolean;
};

const COMMON = /* glsl */ `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uNight;
uniform float uCamY;
uniform float uPitch;
uniform float uFov;
uniform vec2 uMouse;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(float x){ float i = floor(x), f = fract(x); return mix(hash(vec2(i, 0.0)), hash(vec2(i + 1.0, 0.0)), f * f * (3.0 - 2.0 * f)); }

vec3 sunDir(){ return normalize(vec3(0.22, mix(0.035, 0.0, uNight), -1.0)); }
vec3 moonDir(){ return normalize(vec3(-0.35, 0.32, -1.0)); }

vec3 horizonCol(){ return mix(vec3(1.0, 0.70, 0.42), vec3(0.10, 0.10, 0.16), uNight); }
vec3 zenithCol(){ return mix(vec3(0.46, 0.55, 0.66), vec3(0.015, 0.02, 0.05), uNight); }
vec3 hazeCol(){ return mix(vec3(0.98, 0.78, 0.52), vec3(0.07, 0.07, 0.11), uNight); }
`;

// ── pass 1: sky + ground ───────────────────────────────────────────────────────
const SKY_VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;
const SKY_FRAG = /* glsl */ `
${COMMON}

// acacia silhouettes on the horizon: azimuth, scale
const int TREES = 7;
float acacia(float az, float y){
  float m = 0.0;
  for(int i = 0; i < TREES; i++){
    float fi = float(i);
    float a0 = -0.95 + fi * 0.31 + (hash(vec2(fi, 3.0)) - 0.5) * 0.18;
    float s = 0.55 + hash(vec2(fi, 7.0)) * 0.8;
    float dx = (az - a0) / s;
    // trunk
    float trunk = step(abs(dx), 0.0016) * step(y, 0.020 * s);
    // flat umbrella canopy, slightly ragged
    float cy = 0.024 * s, ch = 0.0058 * s, cw = 0.038;
    float rag = (vnoise(dx * 900.0 + fi * 13.0) - 0.5) * 0.002 * s;
    float canopy = step(pow(dx / cw, 2.0) + pow((y - cy - rag) / ch, 2.0), 1.0);
    // a smaller second tier, offset, like a real Acacia tortilis
    float dx2 = dx + 0.012 * (hash(vec2(fi, 11.0)) - 0.5) * 2.0;
    float tier = step(pow(dx2 / (cw * 0.55), 2.0) + pow((y - cy - ch * 1.25 - rag) / (ch * 0.7), 2.0), 1.0);
    // a forked trunk into the canopy
    m = max(m, max(trunk, max(canopy, tier)));
  }
  return m;
}

void main(){
  vec2 ndc = (gl_FragCoord.xy / uRes) * 2.0 - 1.0;
  float aspect = uRes.x / uRes.y;
  float t = tan(uFov * 0.5);
  vec3 d = normalize(vec3(ndc.x * t * aspect, ndc.y * t, -1.0));
  // camera → world: pitch (Rx), then yaw (Ry); must match the grass view matrix
  float cp = cos(uPitch), sp = sin(uPitch);
  d = vec3(d.x, d.y * cp - d.z * sp, d.y * sp + d.z * cp);
  float cy = cos(uMouse.x), sy = sin(uMouse.x);
  d = normalize(vec3(cy * d.x + sy * d.z, d.y, -sy * d.x + cy * d.z));

  vec3 col;
  float az = atan(d.x, -d.z);
  if(d.y > 0.0){
    float y = d.y;
    col = mix(horizonCol(), zenithCol(), pow(clamp(y * 2.2, 0.0, 1.0), 0.6));
    // sun or moon
    float sd = max(dot(d, sunDir()), 0.0);
    vec3 sunC = vec3(1.0, 0.78, 0.48);
    col += (1.0 - uNight) * (sunC * smoothstep(0.99972, 0.99991, sd) * 4.0 + sunC * pow(sd, 260.0) * 0.55 + vec3(1.0, 0.6, 0.3) * pow(sd, 14.0) * 0.2);
    float md = max(dot(d, moonDir()), 0.0);
    col += uNight * vec3(0.9, 0.92, 1.0) * (smoothstep(0.9998, 0.99992, md) * 1.4 + pow(md, 80.0) * 0.12);
    // stars + a hint of the Milky Way
    vec2 g = floor(vec2(az, y) * 420.0);
    float st = step(0.9968, hash(g)) * smoothstep(0.02, 0.2, y);
    float band = exp(-pow((az * 0.6 + y - 0.55) * 3.2, 2.0)) * 0.08;
    col += uNight * (vec3(st) * (0.6 + 0.4 * sin(uTime * 2.0 + hash(g) * 40.0)) + vec3(0.6, 0.62, 0.75) * band * (0.6 + 0.4 * hash(floor(vec2(az, y) * 80.0))));
    // escarpment on the left, hazy
    float ridge = (0.010 + 0.012 * vnoise(az * 6.0 + 2.0) + 0.006 * vnoise(az * 23.0)) * smoothstep(0.1, -0.7, az);
    if(y < ridge) col = mix(col, hazeCol() * mix(0.72, 0.5, uNight), 0.75);
    // acacias, dark against the light
    if(acacia(az, y) > 0.5) col = mix(vec3(0.06, 0.04, 0.03), hazeCol() * 0.35, 0.25 + uNight * 0.2);
  } else {
    // ground between the blades: dry red-oat grass fading into haze
    float dist = uCamY / max(-d.y, 0.0001);
    vec3 ground = mix(vec3(0.28, 0.18, 0.08), vec3(0.03, 0.03, 0.035), uNight);
    col = mix(ground, hazeCol() * mix(0.85, 0.55, uNight), smoothstep(4.0, 90.0, dist));
  }
  col += (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.02;
  gl_FragColor = vec4(col, 1.0);
}`;

// ── pass 2: grass blades ────────────────────────────────────────────────────────
const GRASS_VERT = /* glsl */ `
${COMMON}
attribute vec2 aRoot;
attribute vec4 aInfo;   // height, width, phase, yaw
attribute float aCorner; // 0 left, 1 right, 2 tip
uniform mat4 uProj;
uniform mat4 uView;
varying float vT;
varying float vDist;
varying float vSeed;
varying vec3 vWorld;

void main(){
  float h = aInfo.x, w = aInfo.y, ph = aInfo.z, yaw = aInfo.w;
  vec3 root = vec3(aRoot.x, 0.0, aRoot.y);
  vec3 side = vec3(cos(yaw), 0.0, sin(yaw)) * w * 0.5;
  vec3 p;
  if(aCorner < 0.5) p = root - side;
  else if(aCorner < 1.5) p = root + side;
  else {
    // wind: a slow swell travelling across the plain plus gusts
    float swell = sin(uTime * 1.25 + root.x * 0.28 + root.z * 0.17 + ph);
    float gust = vnoise(uTime * 0.55 + root.x * 0.05 - root.z * 0.03) * 1.6 - 0.4;
    float bend = (0.22 * swell + 0.35 * gust) * h;
    p = root + vec3(bend + sin(ph * 3.0) * 0.06 * h, h * (1.0 - 0.18 * abs(bend)), bend * 0.25);
  }
  vT = aCorner > 1.5 ? 1.0 : 0.0;
  vSeed = ph;
  vWorld = p;
  vec4 v = uView * vec4(p, 1.0);
  vDist = -v.z;
  gl_Position = uProj * v;
}`;

const GRASS_FRAG = /* glsl */ `
${COMMON}
varying float vT;
varying float vDist;
varying float vSeed;
varying vec3 vWorld;
void main(){
  float s = fract(vSeed * 7.13);
  float s2 = fract(vSeed * 3.71);
  // day: dark roots, straw / rust / sage stems, glowing back-lit tips
  vec3 base = mix(vec3(0.09, 0.055, 0.025), vec3(0.15, 0.09, 0.04), s);
  vec3 straw = vec3(0.70, 0.49, 0.22);
  vec3 rust = vec3(0.62, 0.31, 0.13);
  vec3 sage = vec3(0.52, 0.48, 0.27);
  vec3 stem = s2 < 0.55 ? straw : (s2 < 0.82 ? rust : sage);
  stem *= 0.85 + s * 0.3;
  vec2 ndc = (gl_FragCoord.xy / uRes) * 2.0 - 1.0;
  float aspect = uRes.x / uRes.y;
  float sunX = 0.22 / (tan(uFov * 0.5) * aspect);
  float back = exp(-pow((ndc.x - sunX) * 1.35, 2.0));
  vec3 c = mix(base, stem, smoothstep(0.0, 0.75, vT));
  c += vec3(1.0, 0.72, 0.38) * pow(vT, 2.6) * (0.25 + back * 0.95);
  // night: near-black stems, moonlit tips, a campfire glowing in the grass
  vec3 nc = mix(vec3(0.012, 0.012, 0.016), vec3(0.15, 0.16, 0.21), pow(vT, 1.8));
  vec3 fire = vec3(-1.0, 0.2, -3.6);
  float fd = length(vWorld - fire);
  nc += vec3(1.0, 0.42, 0.1) * (1.15 / (1.0 + fd * fd * 1.8)) * (0.88 + 0.12 * sin(uTime * 11.0 + vSeed * 4.0)) * (0.35 + vT * 0.65);
  c = mix(c, nc, uNight);
  float fog = smoothstep(3.0, 70.0, vDist);
  c = mix(c, hazeCol() * mix(0.95, 0.55, uNight), fog * 0.92);
  gl_FragColor = vec4(c, 1.0);
}`;

// ── tiny math ───────────────────────────────────────────────────────────────────
const persp = (fovy: number, aspect: number, near: number, far: number) => {
  const f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far), m = new Float32Array(16);
  m[0] = f / aspect; m[5] = f; m[10] = (far + near) * nf; m[11] = -1; m[14] = 2 * far * near * nf;
  return m;
};
/**
 * View matrix for a camera at (0, y, 0) that looks down -z, turned by `yaw`
 * and tilted by `pitch` (positive = up). World→camera rotation is
 * R = Rx(-pitch) · Ry(-yaw); output is column-major.
 */
const viewMat = (y: number, pitch: number, yaw: number) => {
  const cp = Math.cos(pitch), sp = Math.sin(pitch), cy = Math.cos(yaw), sy = Math.sin(yaw);
  const R = [
    [cy, 0, -sy],
    [sp * sy, cp, sp * cy],
    [cp * sy, -sp, cp * cy],
  ];
  const m = new Float32Array(16);
  for (let row = 0; row < 3; row++) for (let col = 0; col < 3; col++) m[col * 4 + row] = R[row][col];
  // translation = -R · eye, eye = (0, y, 0)
  m[12] = -R[0][1] * y;
  m[13] = -R[1][1] * y;
  m[14] = -R[2][1] * y;
  m[15] = 1;
  return m;
};

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn("[SavannahCanvas]", gl.getShaderInfoLog(s));
    return null;
  }
  return s;
}
function program(gl: WebGLRenderingContext, vs: string, fs: string) {
  const v = compile(gl, gl.VERTEX_SHADER, vs), f = compile(gl, gl.FRAGMENT_SHADER, fs);
  if (!v || !f) return null;
  const p = gl.createProgram()!;
  gl.attachShader(p, v);
  gl.attachShader(p, f);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    console.warn("[SavannahCanvas]", gl.getProgramInfoLog(p));
    return null;
  }
  return p;
}

// deterministic random so the field is the same on every load
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

export default function SavannahCanvas({ rise, night = false, fallback, className, priority }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: true, alpha: false, powerPreference: "high-performance" });
    if (!gl) return setFailed(true);
    const sky = program(gl, SKY_VERT, SKY_FRAG);
    const grass = program(gl, GRASS_VERT, GRASS_FRAG);
    if (!sky || !grass) return setFailed(true);

    // sky quad
    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    // grass field
    const small = window.innerWidth < 768;
    const COUNT = small ? 16000 : 42000;
    const r = rng(1234567);
    const root = new Float32Array(COUNT * 3 * 2);
    const info = new Float32Array(COUNT * 3 * 4);
    const corner = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const rz = r();
      const z = -(0.9 + 75 * rz * rz);
      const spread = 1.2 + Math.abs(z) * 0.95;
      const x = (r() * 2 - 1) * spread;
      const near = Math.min(1, Math.abs(z) / 4); // 0 at the lens → 1 beyond 4 m
      const h = (0.24 + r() * 0.4) * (1 + Math.abs(z) * 0.022) * (0.45 + near * 0.55);
      const w = (0.018 + r() * 0.02) * (1 + Math.abs(z) * 0.035);
      const ph = r() * Math.PI * 2;
      const yaw = (r() - 0.5) * 1.6;
      for (let k = 0; k < 3; k++) {
        const j = i * 3 + k;
        root[j * 2] = x;
        root[j * 2 + 1] = z;
        info[j * 4] = h;
        info[j * 4 + 1] = w;
        info[j * 4 + 2] = ph;
        info[j * 4 + 3] = yaw;
        corner[j] = k;
      }
    }
    const mk = (data: Float32Array) => {
      const b = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      return b;
    };
    const bRoot = mk(root), bInfo = mk(info), bCorner = mk(corner);

    const U = (p: WebGLProgram, names: string[]) => Object.fromEntries(names.map((n) => [n, gl.getUniformLocation(p, n)]));
    const shared = ["uRes", "uTime", "uNight", "uCamY", "uPitch", "uFov", "uMouse"];
    const uSky = U(sky, shared);
    const uGrass = U(grass, [...shared, "uProj", "uView"]);
    const aSky = gl.getAttribLocation(sky, "p");
    const aRoot = gl.getAttribLocation(grass, "aRoot");
    const aInfo = gl.getAttribLocation(grass, "aInfo");
    const aCorner = gl.getAttribLocation(grass, "aCorner");

    let W = 1, H = 1, dirty = true;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75);
      const b = canvas.getBoundingClientRect();
      W = Math.max(1, Math.round(b.width * dpr));
      H = Math.max(1, Math.round(b.height * dpr));
      canvas.width = W;
      canvas.height = H;
      gl.viewport(0, 0, W, H);
      dirty = true;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });
    io.observe(canvas);
    const unsub = rise?.on("change", () => (dirty = true));

    const nightV = night ? 1 : 0;
    let time = 4;
    let raf = 0;
    let last = performance.now();

    const draw = () => {
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      const p = Math.min(1, Math.max(0, rise?.get() ?? 0));
      const e = p * p * (3 - 2 * p);
      const camY = night ? 0.7 : 0.62 + e * 2.2;
      const pitch = (night ? 0.07 : 0.06 - e * 0.12) - mouse.y * 0.015;
      const fov = (small ? 62 : 46) * (Math.PI / 180);
      const yaw = mouse.x * 0.03;
      const aspect = W / H;

      const setShared = (u: Record<string, WebGLUniformLocation | null>) => {
        gl.uniform2f(u.uRes, W, H);
        gl.uniform1f(u.uTime, time);
        gl.uniform1f(u.uNight, nightV);
        gl.uniform1f(u.uCamY, camY);
        gl.uniform1f(u.uPitch, pitch);
        gl.uniform1f(u.uFov, fov);
        gl.uniform2f(u.uMouse, yaw, 0);
      };

      // sky
      gl.disable(gl.DEPTH_TEST);
      gl.useProgram(sky);
      setShared(uSky);
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(aSky);
      gl.vertexAttribPointer(aSky, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.disableVertexAttribArray(aSky);

      // grass
      gl.enable(gl.DEPTH_TEST);
      gl.clear(gl.DEPTH_BUFFER_BIT);
      gl.useProgram(grass);
      setShared(uGrass);
      gl.uniformMatrix4fv(uGrass.uProj, false, persp(fov, aspect, 0.05, 200));
      gl.uniformMatrix4fv(uGrass.uView, false, viewMat(camY, pitch, yaw));
      gl.bindBuffer(gl.ARRAY_BUFFER, bRoot);
      gl.enableVertexAttribArray(aRoot);
      gl.vertexAttribPointer(aRoot, 2, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, bInfo);
      gl.enableVertexAttribArray(aInfo);
      gl.vertexAttribPointer(aInfo, 4, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, bCorner);
      gl.enableVertexAttribArray(aCorner);
      gl.vertexAttribPointer(aCorner, 1, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, COUNT * 3);
      gl.disableVertexAttribArray(aRoot);
      gl.disableVertexAttribArray(aInfo);
      gl.disableVertexAttribArray(aCorner);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      last = performance.now();
      const tick = (now: number) => {
        if (!visible || document.hidden) return;
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        if (!reduce) {
          time += dt;
          draw();
        } else if (dirty) {
          draw();
          dirty = false;
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    start();
    const onVis = () => !document.hidden && visible && start();
    document.addEventListener("visibilitychange", onVis);
    const onLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(raf);
      setFailed(true);
    };
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      unsub?.();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("webglcontextlost", onLost);
      [quad, bRoot, bInfo, bCorner].forEach((b) => gl.deleteBuffer(b));
      gl.deleteProgram(sky);
      gl.deleteProgram(grass);
    };
  }, [rise, night, reduce]);

  if (failed) {
    return (
      <div className={className}>
        <Image src={fallback} alt="" fill sizes="100vw" className="object-cover" priority={priority} placeholder="blur" />
      </div>
    );
  }
  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
