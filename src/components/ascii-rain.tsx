"use client";

import { useEffect, useRef } from "react";

const COL_GAP = 20;
const BASE_SPEED = 0.3;
const SPEED_VARIANCE = 0.4;
const TRAIL_LENGTH = 14;
const SPAWN_CHANCE = 0.004;
const SEED_DENSITY = 0.3;
const CHAR_SIZE = 13;
const LINE_HEIGHT = 15;
const FADE_INTENSITY = 0.09;
const BIT_FLIP_CHANCE = 0.04;

interface Drop {
  x: number;
  y: number;
  speed: number;
  chars: string[];
}

const randomBit = () => (Math.random() < 0.5 ? "0" : "1");

const createDrop = (x: number, y?: number): Drop => ({
  x,
  y: y ?? -TRAIL_LENGTH * LINE_HEIGHT,
  speed: BASE_SPEED + Math.random() * SPEED_VARIANCE,
  chars: Array.from({ length: TRAIL_LENGTH }, randomBit),
});

export function AsciiRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number;
    let drops: Drop[] = [];
    let w = 0;
    let h = 0;
    let color = "";

    const readColor = () => {
      color =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--fg")
          .trim() || "#e5e5e5";
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      readColor();
    };

    const seed = () => {
      const cols = Math.floor(w / COL_GAP);
      for (let c = 0; c < cols; c++) {
        if (Math.random() < SEED_DENSITY) {
          const x = c * COL_GAP + COL_GAP / 2;
          const y = Math.random() * (h + TRAIL_LENGTH * LINE_HEIGHT);
          drops.push(createDrop(x, y));
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.font = `${CHAR_SIZE}px "Space Mono", monospace`;
      ctx.textAlign = "center";
      ctx.fillStyle = color;

      const cols = Math.floor(w / COL_GAP);
      for (let c = 0; c < cols; c++) {
        if (Math.random() < SPAWN_CHANCE) {
          drops.push(createDrop(c * COL_GAP + COL_GAP / 2));
        }
      }

      drops = drops.filter((d) => d.y - TRAIL_LENGTH * LINE_HEIGHT < h);

      for (const drop of drops) {
        for (let i = 0; i < drop.chars.length; i++) {
          const charY = drop.y - i * LINE_HEIGHT;
          if (charY < -LINE_HEIGHT || charY > h + LINE_HEIGHT) continue;

          const fade = 1 - i / drop.chars.length;
          ctx.globalAlpha = fade * fade * FADE_INTENSITY;
          ctx.fillText(drop.chars[i], drop.x, charY);
        }

        drop.y += drop.speed;

        if (Math.random() < BIT_FLIP_CHANCE) {
          drop.chars[Math.floor(Math.random() * drop.chars.length)] =
            randomBit();
        }
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };

    const onThemeChange = () => readColor();
    const observer = new MutationObserver(onThemeChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    resize();
    seed();
    window.addEventListener("resize", resize);
    animId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
