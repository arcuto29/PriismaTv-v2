"use client";
import { useEffect, useRef } from "react";

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (cursor) {
      const handleMouse = (e: MouseEvent) => {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
      };
      document.addEventListener("mousemove", handleMouse);
      return () => document.removeEventListener("mousemove", handleMouse);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const STAR_COUNT = 200;
    let stars: {
      x: number;
      y: number;
      radius: number;
      alpha: number;
      alphaSpeed: number;
      alphaDir: number;
    }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createStars = () => {
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.3,
          alpha: Math.random() * 0.8 + 0.2,
          alphaSpeed: Math.random() * 0.008 + 0.003,
          alphaDir: Math.random() > 0.5 ? 1 : -1,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        star.alpha += star.alphaSpeed * star.alphaDir;
        if (star.alpha >= 1) { star.alpha = 1; star.alphaDir = -1; }
        if (star.alpha <= 0.1) { star.alpha = 0.1; star.alphaDir = 1; }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${star.alpha * 0.4})`;
        ctx.fill();
      });
      animationId = requestAnimationFrame(animate);
    };

    resize();
    createStars();
    animate();
    window.addEventListener("resize", () => { resize(); createStars(); });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      {/* Cursor glow light */}
      <div ref={cursorRef} className="cursor-light hidden lg:block" />

      {/* Jin-Woo Video Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-[0.18]"
        >
          <source src="/jinwoo-bg.mp4" type="video/mp4" />
        </video>
        {/* Fog/mist overlay on video */}
        <div className="absolute inset-0 fog-layer bg-gradient-to-br from-primary/5 via-transparent to-purple-900/5" />
      </div>

      {/* Animated stars on top */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ opacity: 0.5 }}
      />

      {/* Dark gradient overlay for readability */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-background/70 via-background/60 to-background/90" />
    </>
  );
}
