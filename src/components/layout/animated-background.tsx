"use client";
import { useEffect, useRef, useState } from "react";
import { useMood } from "@/hooks/use-mood";

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const { currentMood } = useMood();

  useEffect(() => {
    setMounted(true);
  }, []);

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

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const STAR_COUNT = 150;
    const PARTICLE_COUNT = 30;

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
          radius: Math.random() * 1.5 + 0.3,
          alpha: Math.random() * 0.8 + 0.2,
          alphaSpeed: Math.random() * 0.008 + 0.003,
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
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.2 - 0.1,
          radius: Math.random() * 2 + 1,
          alpha: Math.random() * 0.4 + 0.1,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Stars — color from mood
      stars.forEach((star) => {
        star.alpha += star.alphaSpeed * star.alphaDir;
        if (star.alpha >= 1) { star.alpha = 1; star.alphaDir = -1; }
        if (star.alpha <= 0.1) { star.alpha = 0.1; star.alphaDir = 1; }
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${currentMood.starColor} ${star.alpha * 0.35})`;
        ctx.fill();
      });

      // Floating particles — color from mood
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${currentMood.particleColor}${p.alpha})`;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = `${currentMood.particleColor}${p.alpha * 0.2})`;
        ctx.fill();
      });

      // Connecting lines — color from mood
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `${currentMood.lineColor} ${0.08 * (1 - dist / 150)})`;
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
  }, [mounted, currentMood]);

  if (!mounted) return null;

  return (
    <>
      {/* Cursor glow */}
      <div ref={cursorRef} className="cursor-light hidden lg:block" />

      {/* Background gradient — changes with mood */}
      <div className={`fixed inset-0 z-0 pointer-events-none bg-gradient-to-b ${currentMood.bgGradient}`} />

      {/* GIF Background (from mood selection — only when no video bg) */}
      {currentMood.preview && !currentMood.videoSrc && (
        <img
          src={currentMood.preview}
          alt=""
          className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-30 blur-[2px] scale-110"
        />
      )}

      {/* Morphing gradient blobs — colors from mood */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className={`absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full ${currentMood.blobColors[0]} blur-[120px] animate-blob`} />
        <div className={`absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full ${currentMood.blobColors[1]} blur-[120px] animate-blob animation-delay-2000`} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full ${currentMood.blobColors[2]} blur-[100px] animate-blob animation-delay-4000`} />
      </div>

      {/* Video Background (only for themes that have one) */}
      {currentMood.videoSrc && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className={`fixed inset-0 w-full h-full object-cover z-0 pointer-events-none ${currentMood.videoOpacity || "opacity-20"}`}
        >
          <source src={currentMood.videoSrc} type="video/mp4" />
        </video>
      )}

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
      />

      {/* Overlay — opacity from mood */}
      <div className={`fixed inset-0 z-0 pointer-events-none bg-gradient-to-b ${currentMood.overlayOpacity}`} />
    </>
  );
}
