"use client";

import "./Fluorescent.css";

import { useEffect, useRef } from "react";

// fullscreen raymarch fragment shader for the hero glow
const VERTEX_SHADER = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_trail0;
  uniform vec2 u_trail1;
  uniform vec2 u_trail2;
  uniform vec2 u_trail3;
  uniform vec4 u_trailPower;

  float tanh_f(float x) {
    float e2x = exp(2.0 * x);
    return (e2x - 1.0) / (e2x + 1.0);
  }

  vec4 tanh_v4(vec4 x) {
    return vec4(tanh_f(x.x), tanh_f(x.y), tanh_f(x.z), tanh_f(x.w));
  }

  vec2 wake_distort(vec2 pixel, vec2 trail, float power, vec2 resolution) {
    vec2 fragUv = pixel / resolution;
    vec2 trailUv = trail * 0.5 + 0.5;
    vec2 delta = fragUv - trailUv;
    delta.x *= resolution.x / resolution.y;

    float d = length(delta);
    float core = exp(-d * d * 24.0) * power;
    float ripple = sin(d * 46.0 - u_time * 6.5) * exp(-d * 5.6) * power;
    vec2 dir = normalize(delta + vec2(0.0001));
    vec2 tangent = vec2(-dir.y, dir.x);

    return (dir * core * 0.085 + tangent * ripple * 0.034) * min(resolution.x, resolution.y);
  }

  void main() {
    vec4 O = vec4(0.0);

    float aspect = u_resolution.x / u_resolution.y;

    // On portrait, flip Y so the bright core sits at the bottom of the screen
    vec2 I = aspect < 1.0
      ? vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y)
      : gl_FragCoord.xy;

    float t = u_time;
    float z = 0.0;
    float b = 0.0;
    float l = 0.0;

    float yOffset = aspect < 1.0 ? (1.0 - aspect) * 1.75 : 0.0;
    vec2 shifted = vec2(I.x, I.y - yOffset * u_resolution.y);
    shifted += wake_distort(I, u_trail0, u_trailPower.x, u_resolution);
    shifted += wake_distort(I, u_trail1, u_trailPower.y, u_resolution);
    shifted += wake_distort(I, u_trail2, u_trailPower.z, u_resolution);
    shifted += wake_distort(I, u_trail3, u_trailPower.w, u_resolution);
    float mn = min(u_resolution.x, u_resolution.y);

    for(int j = 0; j < 40; j++) {
      vec2 uv = (2.0 * shifted - u_resolution) / mn;
      uv *= 0.28;
      uv.y -= 0.7;

      vec3 rayDir = normalize(vec3(uv, -1.0));

      vec3 p = z * rayDir;
      p.yz *= 0.1 * mat2(8.0, -6.0, 6.0, 8.0);
      p.z += 80.0;
      l = length(p) * 0.1;
      z += 1.0 + abs(l - 1.2);
      l += 1.0;
      b = dot(cos(p / l - t), sin(p / l * 2.5 + t).yzx);

      O += (1.0 + cos(tanh_f(l - 7.0) * 6.0 - vec4(3.5, 3.0, 4.2, 0.0)))
           * b * b * b * b / z;
    }

    O = tanh_v4(O / 2.0);

    float luminance = dot(O.rgb, vec3(0.299, 0.587, 0.114));
    float bright = luminance * 1.4;
    O.rgb = vec3(bright * 0.95, bright * 0.04, bright * 0.10);

    float gray = dot(O.rgb, vec3(0.299, 0.587, 0.114));
    O.rgb = mix(vec3(gray * 0.1), O.rgb, 0.7);

    gl_FragColor = vec4(O.rgb, 1.0);
  } 
`; 

const FLUORESCENT_RES_SCALE = 0.35;
const FLUORESCENT_MAX_DPR = 2;

function fluorescent_getDpr() {
  return Math.min(window.devicePixelRatio || 1, FLUORESCENT_MAX_DPR);
}

function fluorescent_clamp(min, max, value) {
  return Math.max(min, Math.min(max, value));
}

function fluorescent_createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Fluorescent shader error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function fluorescent_createProgram(gl, vs, fs) {
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Fluorescent program error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

export default function Fluorescent({ className = "" }) {
  const fluorescent_canvasRef = useRef(null);
  const fluorescent_rafRef = useRef(null);
  const fluorescent_startTimeRef = useRef(null);
  const fluorescent_pausedRef = useRef(false);
  const fluorescent_pauseTimeRef = useRef(0);
  const fluorescent_pauseOffsetRef = useRef(0);
  const fluorescent_mouseTargetRef = useRef({ x: 0, y: 0, active: 0 });
  const fluorescent_trailRef = useRef(
    Array.from({ length: 4 }, () => ({ x: 0, y: 0, power: 0 })),
  );

  // init webgl canvas, render loop, and pause when menu opens
  useEffect(() => {
    const canvas = fluorescent_canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      powerPreference: "low-power",
    });

    if (!gl) {
      console.error("Fluorescent: WebGL not supported");
      return;
    }

    const vs = fluorescent_createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = fluorescent_createShader(
      gl,
      gl.FRAGMENT_SHADER,
      FRAGMENT_SHADER,
    );
    if (!vs || !fs) return;

    const program = fluorescent_createProgram(gl, vs, fs);
    if (!program) return;

    const fluorescent_positionLocation = gl.getAttribLocation(
      program,
      "a_position",
    );
    const fluorescent_resolutionLocation = gl.getUniformLocation(
      program,
      "u_resolution",
    );
    const fluorescent_timeLocation = gl.getUniformLocation(program, "u_time");
    const fluorescent_trailLocations = [
      gl.getUniformLocation(program, "u_trail0"),
      gl.getUniformLocation(program, "u_trail1"),
      gl.getUniformLocation(program, "u_trail2"),
      gl.getUniformLocation(program, "u_trail3"),
    ];
    const fluorescent_trailPowerLocation = gl.getUniformLocation(
      program,
      "u_trailPower",
    );

    const fluorescent_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, fluorescent_buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    // match canvas size to its rendered css dimensions
    function fluorescent_resize() {
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;

      const dpr = fluorescent_getDpr();
      const w = Math.max(
        1,
        Math.round(rect.width * dpr * FLUORESCENT_RES_SCALE),
      );
      const h = Math.max(
        1,
        Math.round(rect.height * dpr * FLUORESCENT_RES_SCALE),
      );

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    let fluorescent_resizeRaf = 0;
    function fluorescent_scheduleResize() {
      cancelAnimationFrame(fluorescent_resizeRaf);
      fluorescent_resizeRaf = requestAnimationFrame(fluorescent_resize);
    }

    function fluorescent_onOrientationChange() {
      fluorescent_scheduleResize();
      window.setTimeout(fluorescent_scheduleResize, 150);
      window.setTimeout(fluorescent_scheduleResize, 400);
    }

    const fluorescent_resizeObserver = new ResizeObserver(
      fluorescent_scheduleResize,
    );
    fluorescent_resizeObserver.observe(canvas);

    window.addEventListener("resize", fluorescent_scheduleResize);
    window.addEventListener(
      "orientationchange",
      fluorescent_onOrientationChange,
    );
    window.visualViewport?.addEventListener(
      "resize",
      fluorescent_scheduleResize,
    );
    window.addEventListener("pageshow", fluorescent_scheduleResize);

    function fluorescent_handlePointerMove(event) {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * -2;

      fluorescent_mouseTargetRef.current.x = fluorescent_clamp(-1, 1, x);
      fluorescent_mouseTargetRef.current.y = fluorescent_clamp(-1, 1, y);
      fluorescent_mouseTargetRef.current.active = 1;
    }

    function fluorescent_handlePointerLeave() {
      fluorescent_mouseTargetRef.current.active = 0;
    }

    window.addEventListener("pointermove", fluorescent_handlePointerMove, {
      passive: true,
    });
    window.addEventListener("pointerleave", fluorescent_handlePointerLeave);

    fluorescent_resize();
    fluorescent_startTimeRef.current = performance.now() / 1000;

    const fluorescent_overlay = document.querySelector(".nav-overlay");
    const fluorescent_observer = fluorescent_overlay
      ? new MutationObserver(() => {
          const style = fluorescent_overlay.style;
          const isVisible =
            style.visibility !== "hidden" && parseFloat(style.opacity) > 0;

          if (isVisible && !fluorescent_pausedRef.current) {
            fluorescent_pausedRef.current = true;
            fluorescent_pauseTimeRef.current = performance.now() / 1000;
            if (fluorescent_rafRef.current) {
              cancelAnimationFrame(fluorescent_rafRef.current);
              fluorescent_rafRef.current = null;
            }
          } else if (!isVisible && fluorescent_pausedRef.current) {
            fluorescent_pausedRef.current = false;
            fluorescent_pauseOffsetRef.current +=
              performance.now() / 1000 - fluorescent_pauseTimeRef.current;
            fluorescent_rafRef.current =
              requestAnimationFrame(fluorescent_render);
          }
        })
      : null;

    if (fluorescent_observer && fluorescent_overlay) {
      fluorescent_observer.observe(fluorescent_overlay, {
        attributes: true,
        attributeFilter: ["style"],
      });
    }

    function fluorescent_render() {
      if (fluorescent_pausedRef.current) return;

      fluorescent_resize();

      const currentTime =
        performance.now() / 1000 -
        fluorescent_startTimeRef.current -
        fluorescent_pauseOffsetRef.current;
      const target = fluorescent_mouseTargetRef.current;
      const trail = fluorescent_trailRef.current;
      trail.forEach((point, index) => {
        const ease = 0.16 - index * 0.026;
        const source = index === 0 ? target : trail[index - 1];
        point.x += (source.x - point.x) * ease;
        point.y += (source.y - point.y) * ease;
        point.power += (target.active - point.power) * (0.075 - index * 0.009);
      });

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);

      gl.enableVertexAttribArray(fluorescent_positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, fluorescent_buffer);
      gl.vertexAttribPointer(
        fluorescent_positionLocation,
        2,
        gl.FLOAT,
        false,
        0,
        0,
      );

      gl.uniform2f(fluorescent_resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(fluorescent_timeLocation, currentTime);
      fluorescent_trailLocations.forEach((location, index) => {
        const point = trail[index];
        gl.uniform2f(location, point.x, point.y);
      });
      gl.uniform4f(
        fluorescent_trailPowerLocation,
        trail[0].power,
        trail[1].power * 0.88,
        trail[2].power * 0.68,
        trail[3].power * 0.5,
      );

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      fluorescent_rafRef.current = requestAnimationFrame(fluorescent_render);
    }

    fluorescent_rafRef.current = requestAnimationFrame(fluorescent_render);

    return () => {
      if (fluorescent_rafRef.current)
        cancelAnimationFrame(fluorescent_rafRef.current);
      if (fluorescent_observer) fluorescent_observer.disconnect();
      cancelAnimationFrame(fluorescent_resizeRaf);
      fluorescent_resizeObserver.disconnect();
      window.removeEventListener("resize", fluorescent_scheduleResize);
      window.removeEventListener(
        "orientationchange",
        fluorescent_onOrientationChange,
      );
      window.visualViewport?.removeEventListener(
        "resize",
        fluorescent_scheduleResize,
      );
      window.removeEventListener("pageshow", fluorescent_scheduleResize);
      window.removeEventListener("pointermove", fluorescent_handlePointerMove);
      window.removeEventListener("pointerleave", fluorescent_handlePointerLeave);
      gl.deleteBuffer(fluorescent_buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <canvas
      ref={fluorescent_canvasRef}
      className={`fluorescent ${className}`}
    />
  );
}
