"use client";
import { useEffect, useRef, useState } from "react";

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Cursor follow
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    let x = 0, y = 0, cx = 0, cy = 0;
    const handleMouse = (e: MouseEvent) => { x = e.clientX; y = e.clientY; };
    const animate = () => {
      cx += (x - cx) * 0.08;
      cy += (y - cy) * 0.08;
      cursor.style.left = cx + "px";
      cursor.style.top = cy + "px";
      requestAnimationFrame(animate);
    };
    document.addEventListener("mousemove", handleMouse);
    animate();
    return () => document.removeEventListener("mousemove", handleMouse);
  }, [mounted]);

  // Minimal particle system
  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; alphaDir: number }[] = [];

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();

    // Create subtle floating particles
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -Math.random() * 0.1 - 0.02,
        size: Math.random() * 1.2 + 0.3,
        alpha: Math.random() * 0.3,
        alphaDir: Math.random() > 0.5 ? 1 : -1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += 0.003 * p.alphaDir;
        if (p.alpha > 0.4) p.alphaDir = -1;
        if (p.alpha < 0.05) p.alphaDir = 1;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.3})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(animationId); window.removeEventListener("resize", resize); };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <>
      {/* Smooth cursor light */}
      <div ref={cursorRef} className="cursor-light hidden lg:block" />

      {/* Very subtle ambient blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/3 -left-1/4 w-[800px] h-[800px] rounded-full bg-primary/[0.015] blur-[180px] animate-blob" />
        <div className="absolute -bottom-1/4 -right-1/3 w-[600px] h-[600px] rounded-full bg-red-900/[0.01] blur-[150px] animate-blob animation-delay-2000" />
      </div>

      {/* Particle canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-60" />

      {/* Film grain */}
      <div className="film-grain" />

      {/* Cinematic vignette */}
      <div className="cinematic-vignette" />
    </>
  );
}
