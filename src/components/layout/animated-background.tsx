"use client";
import { useEffect, useRef, useState } from "react";

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cursor follow
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
  }, [mounted]);

  // Particle canvas - subtle and premium
  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const STAR_COUNT = 80;
    const PARTICLE_COUNT = 15;

    interface Star {
      x: number; y: number; radius: number;
      alpha: number; alphaSpeed: number; alphaDir: number;
    }
    interface Particle {
      x: number; y: number; vx: number; vy: number;
      radius: number; alpha: number;
    }

    let stars: Star[] = [];
    let particles: Particle[] = [];

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
          radius: Math.random() * 1 + 0.2,
          alpha: Math.random() * 0.5 + 0.1,
          alphaSpeed: Math.random() * 0.005 + 0.002,
          alphaDir: Math.random() > 0.5 ? 1 : -1,
        });
      }
    };

    const createParticles = () => {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.1 - 0.05,
          radius: Math.random() * 1.5 + 0.5,
          alpha: Math.random() * 0.2 + 0.05,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Stars - warm gold tint
      stars.forEach((star) => {
        star.alpha += star.alphaSpeed * star.alphaDir;
        if (star.alpha >= 0.6) { star.alpha = 0.6; star.alphaDir = -1; }
        if (star.alpha <= 0.05) { star.alpha = 0.05; star.alphaDir = 1; }
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 180, 104, ${star.alpha * 0.2})`;
        ctx.fill();
      });

      // Floating particles - warm tones
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 180, 104, ${p.alpha})`;
        ctx.fill();

        // Soft glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 180, 104, ${p.alpha * 0.1})`;
        ctx.fill();
      });

      // Very subtle connecting lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(232, 180, 104, ${0.03 * (1 - dist / 200)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    resize();
    createStars();
    createParticles();
    animate();

    const handleResize = () => { resize(); createStars(); createParticles(); };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <>
      {/* Cursor glow - warm gold */}
      <div ref={cursorRef} className="cursor-light hidden lg:block" />

      {/* Subtle ambient blobs - warm tones */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-[700px] h-[700px] rounded-full bg-primary/[0.02] blur-[150px] animate-blob" />
        <div className="absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-primary/[0.015] blur-[130px] animate-blob animation-delay-2000" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-primary/[0.01] blur-[100px] animate-blob animation-delay-4000" />
      </div>

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
      />

      {/* Film grain texture overlay */}
      <div className="film-grain" />

      {/* Cinematic vignette */}
      <div className="cinematic-vignette" />

      {/* Base overlay for content readability */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-[#06060a]/40 via-transparent to-[#06060a]/60" />
    </>
  );
}
