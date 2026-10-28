"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/lib/theme";

type Dot = { x: number; y: number; vx: number; vy: number; r: number; warm: boolean };

/** Partículas azules flotando detrás de todo el sitio mientras está activo el modo azul. */
export function NightParticles() {
  const night = useTheme() === "night";
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    if (!night || !el) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: -9999, y: -9999 };
    let width = 0;
    let height = 0;
    let dots: Dot[] = [];
    let frame = 0;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      el.width = width * ratio;
      el.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.min(95, Math.round((width * height) / 15000));
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1 + Math.random() * 2.2,
        warm: Math.random() < 0.12,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < dots.length; i++) {
        const a = dots[i];
        if (!still) {
          const dx = a.x - pointer.x;
          const dy = a.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 14000) {
            const f = (1 - d2 / 14000) * 0.6;
            a.vx += (dx / Math.sqrt(d2 + 1)) * f * 0.12;
            a.vy += (dy / Math.sqrt(d2 + 1)) * f * 0.12;
          }
          a.vx *= 0.995;
          a.vy *= 0.995;
          a.x += a.vx;
          a.y += a.vy;
          if (a.x < -10) a.x = width + 10;
          if (a.x > width + 10) a.x = -10;
          if (a.y < -10) a.y = height + 10;
          if (a.y > height + 10) a.y = -10;
        }
        ctx.fillStyle = a.warm ? "rgba(255,170,60,0.9)" : "rgba(170,210,255,0.85)";
        ctx.shadowColor = a.warm ? "rgba(255,145,0,0.8)" : "rgba(110,170,255,0.9)";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      if (!still) frame = requestAnimationFrame(draw);
    };

    const move = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };
    const visibility = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden) draw();
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [night]);

  if (!night) return null;
  return <canvas ref={canvas} aria-hidden className="night-particles pointer-events-none fixed inset-0 -z-10 size-full" />;
}
