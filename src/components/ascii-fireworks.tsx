"use client";

import { useEffect, useRef } from "react";

const SPARKS = ["*", "+", ".", "x", "o", "'", "`", ","];
const PARTICLE_COUNT_MIN = 10;
const PARTICLE_COUNT_VAR = 8;
const SPAWN_INTERVAL_MIN = 90;
const SPAWN_INTERVAL_VAR = 60;
const GRAVITY = 0.008;
const DRAG = 0.995;
const FADE_MULTIPLIER = 0.6;
const BRIGHT_PHASE = 0.3;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  char: string;
}

const randomSpark = () => SPARKS[Math.floor(Math.random() * SPARKS.length)];

export function AsciiFireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let fg = "";
    let muted = "";
    const bursts: Particle[][] = [];

    const readColors = () => {
      const style = getComputedStyle(document.documentElement);
      fg = style.getPropertyValue("--fg").trim() || "#e5e5e5";
      muted = style.getPropertyValue("--muted").trim() || "#737373";
    };

    const resizeObserver = new ResizeObserver(() => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      const w = parent.offsetWidth;
      const h = parent.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    });
    resizeObserver.observe(canvas.parentElement!);

    const themeObserver = new MutationObserver(readColors);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const spawnBurst = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.offsetWidth;
      const h = parent.offsetHeight;
      const cx = Math.random() * w;
      const cy = Math.random() * h * 0.6;
      const count =
        PARTICLE_COUNT_MIN + Math.floor(Math.random() * PARTICLE_COUNT_VAR);
      const particles: Particle[] = [];

      for (let i = 0; i < count; i++) {
        const angle =
          (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
        const speed = 0.4 + Math.random() * 0.8;
        const maxLife = 60 + Math.floor(Math.random() * 40);
        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: maxLife,
          maxLife,
          char: randomSpark(),
        });
      }

      bursts.push(particles);
    };

    let ticksSinceSpawn = 0;
    let spawnInterval =
      SPAWN_INTERVAL_MIN + Math.floor(Math.random() * SPAWN_INTERVAL_VAR);

    readColors();

    const draw = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.offsetWidth;
      const h = parent.offsetHeight;

      ctx.clearRect(0, 0, w, h);
      ctx.font = `14px "Space Mono", monospace`;
      ctx.textAlign = "center";

      ticksSinceSpawn++;
      if (ticksSinceSpawn > spawnInterval) {
        spawnBurst();
        ticksSinceSpawn = 0;
        spawnInterval =
          SPAWN_INTERVAL_MIN + Math.floor(Math.random() * SPAWN_INTERVAL_VAR);
      }

      for (let b = bursts.length - 1; b >= 0; b--) {
        const particles = bursts[b];
        let alive = false;

        for (const p of particles) {
          if (p.life <= 0) continue;
          alive = true;

          const progress = 1 - p.life / p.maxLife;
          const alpha = progress < 0.1 ? progress * 10 : p.life / p.maxLife;

          ctx.globalAlpha = alpha * FADE_MULTIPLIER;
          ctx.fillStyle = progress < BRIGHT_PHASE ? fg : muted;
          ctx.fillText(p.char, p.x, p.y);

          p.x += p.vx;
          p.y += p.vy;
          p.vy += GRAVITY;
          p.vx *= DRAG;
          p.life--;
        }

        if (!alive) bursts.splice(b, 1);
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      themeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
    />
  );
}
