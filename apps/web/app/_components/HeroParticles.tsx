"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  phase: number;
  phaseSpeed: number;
};

const COUNT = 55;

function startParticles(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
): () => void {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0;
  let h = 0;
  let rafId = 0;
  let mx = -9999;
  let my = -9999;
  const particles: Particle[] = [];

  function resize() {
    const parent = canvas.parentElement;
    if (!parent) return;
    w = parent.offsetWidth;
    h = parent.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (particles.length === 0) {
      for (let i = 0; i < COUNT; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          r: 0.7 + Math.random() * 1.6,
          phase: Math.random() * Math.PI * 2,
          phaseSpeed: 0.006 + Math.random() * 0.009,
        });
      }
    }
  }

  function onMouseMove(e: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    mx = e.clientX - rect.left;
    my = e.clientY - rect.top;
  }
  function onMouseLeave() { mx = -9999; my = -9999; }

  const LINK_DIST = 100;
  const LINK_DIST_SQ = LINK_DIST * LINK_DIST;

  function frame() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // Advance each particle
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -8) p.x = w + 8;
      else if (p.x > w + 8) p.x = -8;
      if (p.y < -8) p.y = h + 8;
      else if (p.y > h + 8) p.y = -8;

      // Soft mouse repulsion within 90px
      const dx = p.x - mx;
      const dy = p.y - my;
      const d2 = dx * dx + dy * dy;
      if (d2 < 8100 && d2 > 0) {
        const dist = Math.sqrt(d2);
        const force = ((90 - dist) / 90) * 0.06;
        p.x += (dx / dist) * force;
        p.y += (dy / dist) * force;
      }

      p.phase += p.phaseSpeed;
    }

    // Draw connection lines between nearby pairs
    ctx.lineWidth = 0.6;
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const ddx = a.x - b.x;
        const ddy = a.y - b.y;
        const d2 = ddx * ddx + ddy * ddy;
        if (d2 < LINK_DIST_SQ) {
          const t = 1 - Math.sqrt(d2) / LINK_DIST;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(124,58,237,${(t * 0.08).toFixed(3)})`;
          ctx.stroke();
        }
      }
    }

    // Draw particles
    for (const p of particles) {
      const opacity = 0.05 + (Math.sin(p.phase) * 0.5 + 0.5) * 0.13;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(124,58,237,${opacity.toFixed(3)})`;
      ctx.fill();
    }

    rafId = requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("mousemove", onMouseMove, { passive: true });
  document.addEventListener("mouseleave", onMouseLeave);
  rafId = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener("resize", resize);
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseleave", onMouseLeave);
  };
}

/**
 * Canvas-based drifting particle field rendered behind the hero content.
 * Particles breathe opacity, drift gently, and softly repel on mouse proximity.
 * All animation runs outside React's render cycle via requestAnimationFrame.
 * Returns null under prefers-reduced-motion.
 */
export function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    return startParticles(canvas, ctx);
  }, [reduce]);

  if (reduce) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
